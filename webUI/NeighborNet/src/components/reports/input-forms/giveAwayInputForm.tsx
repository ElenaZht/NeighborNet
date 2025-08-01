import { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react';
import { FaInfoCircle, FaImage, FaTimes } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addGiveAway } from '../../../features/reports/giveaways/addGiveAwayThunk';
import { Link } from 'react-router-dom';
import AddressInputForm from '../../AddressInputForm';
import { refreshFeed } from '../../../features/reports/feed/refreshFeedThunk';
import { GiveAwayInputFormData, AddressResult } from './types';

const FORM_STORAGE_KEY = 'give_away_draft';

export default function GiveAwayInputForm() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
  const addressInputRef = useRef<{ clearAddress: () => void }>(null);
  
  const [formData, setFormData] = useState<GiveAwayInputFormData>({
    title: '',
    description: '',
    address: '',
    img_url: '',
    is_free: true,
    swap_options: '',
    city: '',
    location: { lat: '', lng: '' }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Load draft from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(prevData => ({
          ...prevData,
          ...parsedData
        }));
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Only save if user has started filling out the form
    if (formData.title || formData.description || formData.address || formData.img_url) {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({
        title: formData.title,
        description: formData.description,
        address: formData.address,
        img_url: formData.img_url,
        is_free: formData.is_free,
        swap_options: formData.swap_options,
        city: '',
        location: {lat: '', lng: ''}
      }));
    }
  }, [formData]);

  // Check authentication status changes
  useEffect(() => {
    if (isAuthenticated && showAuthPrompt) {
      setShowAuthPrompt(false);
    }
  }, [isAuthenticated]);

  // Reset image error when URL changes
  useEffect(() => {
    setImageError(false);
  }, [formData.img_url]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const clearImage = () => {
    setFormData({
      ...formData,
      img_url: ''
    });
    setImageError(false);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (!formData.address.trim()) {
      setError("Address is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        location: {
          lat: parseFloat(formData.location.lat) || 0,
          lng: parseFloat(formData.location.lng) || 0
        }
      };
      
      await dispatch(addGiveAway(submitData)).unwrap();
      
      dispatch(refreshFeed());
      
      // Success - show message and reset form
      setSuccess(true);
      
      // Clear saved form data
      localStorage.removeItem(FORM_STORAGE_KEY);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        img_url: '',
        is_free: true,
        swap_options: '',
        city: '',
        address: '',
        location: {lat: '', lng: ''}
      });
      
      //Clear the address input
      if (addressInputRef.current) {
        addressInputRef.current.clearAddress();
      }
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to submit giveaway. Please try again.");
      console.error("Error submitting giveaway:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddressInputFormChange = (addressResult: AddressResult) => {
    setFormData({
      ...formData,
      address: addressResult.address,
      city: addressResult.city,
      location: {
        lat: addressResult.location.lat.toString(),
        lng: addressResult.location.lng.toString()
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto m-4">
      <div className="card bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-left text-2xl mb-4">Post a Giveaway Item</h2>
          
          {showAuthPrompt && (
            <div className="alert alert-warning mb-4">
              <FaInfoCircle />
              <span>
                Please <Link to="/login" className="font-bold underline">log in</Link> or <Link to="/signup" className="font-bold underline">sign up</Link> to post a giveaway
              </span>
            </div>
          )}
          
          {error && (
            <div className="alert alert-error mb-4">
              <FaInfoCircle />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="alert alert-success mb-4">
              <FaInfoCircle />
              <span>Giveaway posted successfully!</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Image URL</span>
                  </label>
                  <div className="flex items-center">
                    <input 
                      type="text"
                      name="img_url"
                      value={formData.img_url}
                      onChange={handleChange}
                      className={`input input-bordered w-full ${imageError ? 'input-error' : ''}`}
                      placeholder="../../assets/give_away_placeholder.jpeg"
                      disabled={isSubmitting}
                    />
                    {formData.img_url && (
                      <button 
                        type="button" 
                        onClick={clearImage} 
                        className="btn btn-sm btn-ghost ml-2"
                        disabled={isSubmitting}
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                  {imageError && (
                    <span className="text-error text-xs mt-1">Invalid image URL</span>
                  )}
                </div>
                
                {/* Image preview */}
                <div className={`border-2 ${formData.img_url ? 'border-solid' : 'border-dashed'} border-gray-200 rounded-md h-48 flex items-center justify-center overflow-hidden`}>
                  {formData.img_url ? (
                    <img 
                      src={formData.img_url}
                      alt="Item preview" 
                      className="h-full w-full object-contain"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <FaImage className="text-3xl mb-2" />
                      <p className="text-sm">Image preview will appear here</p>
                    </div>
                  )}
                </div>
                
                {/* Free or Swap */}
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text font-medium">This item is completely free</span> 
                    <input 
                      type="checkbox" 
                      name="is_free"
                      checked={formData.is_free}
                      onChange={handleChange}
                      className="checkbox checkbox-primary" 
                    />
                  </label>
                </div>
                
                {/* Swap Options (if not free) */}
                {!formData.is_free && (
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">Swap Options</span>
                    </label>
                    <textarea 
                      name="swap_options"
                      value={formData.swap_options}
                      onChange={handleChange}
                      className="textarea textarea-bordered w-full" 
                      rows={3}
                      placeholder="What would you accept in exchange? (e.g., kitchen items, plants, etc.)"
                    ></textarea>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Title</span>
                  </label>
                  <input 
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input input-bordered w-full" 
                    placeholder="E.g., Polish Pottery Teapot"
                  />
                </div>
                
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Item Description</span>
                  </label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full" 
                    rows={5}
                    placeholder="Describe the item - condition, size, age, why you're giving it away, etc."
                  ></textarea>
                </div>
                
                <div className="form-control w-full">
                  <AddressInputForm 
                    onAddressSelect={handleAddressInputFormChange}
                    ref={addressInputRef}
                  />
                </div>
                
                <div className="form-control mt-4">
                  <button 
                    type="submit" 
                    className={`btn btn-primary w-full ${isSubmitting ? 'loading' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="loading loading-spinner loading-sm"></span>
                        <span>Submitting...</span>
                      </span>
                    ) : 'Post GiveAway Report'}                  
                    </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}