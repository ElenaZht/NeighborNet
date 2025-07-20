import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { FaInfoCircle, FaImage, FaTimes } from 'react-icons/fa';
import { editOfferHelp } from '../../../features/reports/offerhelp/editOfferHelpThunk';
import AddressInputForm from '../../AddressInputForm';
import { barterChoices } from '../../../utils/barterChoises';
import { useClickAway } from '../../../utils/useClickAway';
import { EditOfferHelpFormProps, OfferHelpFormData, AddressResult } from './types';

export default function EditOfferHelpForm({ reportData, onSuccess, onError }: EditOfferHelpFormProps) {
  const dispatch = useAppDispatch();
  const addressInputRef = useRef<{ clearAddress: () => void }>(null);
  
  const [formData, setFormData] = useState<OfferHelpFormData>({
    title: reportData?.title || '',
    description: reportData?.description || '',
    img_url: reportData?.img_url || '',
    address: reportData?.address || '',
    city: reportData?.city || '',
    location: reportData?.location || { lat: '', lng: '' },
    barter_options: reportData?.barter_options || []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [showBarterDropdown, setShowBarterDropdown] = useState(false);

  // Reset image error when URL changes
  useEffect(() => {
    setImageError(false);
  }, [formData.img_url]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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

  const handleBarterOptionChange = (id: string) => {
    setFormData(prev => {
      const options = Array.isArray(prev.barter_options) ? [...prev.barter_options] : [];
      if (options.includes(id)) {
        return { ...prev, barter_options: options.filter(item => item !== id) };
      } else {
        return { ...prev, barter_options: [...options, id] };
      }
    });
    setShowBarterDropdown(false);
  };

  const toggleBarterDropdown = () => {
    setShowBarterDropdown(!showBarterDropdown);
  };

  const handleAddressInputFormChange = (addressResult: AddressResult) => {
    setFormData(prev => ({
      ...prev,
      address: addressResult.address,
      city: addressResult.city,
      location: {
        lat: addressResult.location.lat.toString(),
        lng: addressResult.location.lng.toString()
      }
    }));
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
      const resultAction = await dispatch(editOfferHelp({
        reportId: reportData.id,
        offerHelpData: formData
      } as any));

      if (editOfferHelp.fulfilled.match(resultAction)) {
        // Success
        if (onSuccess) {
          onSuccess(resultAction.payload.updatedReport);
        }
      } else {
        // Extract error message properly
        let errorMessage = 'Failed to update offer help';
        
        if (resultAction.payload) {
          // If it's a string, use it directly
          if (typeof resultAction.payload === 'string') {
            errorMessage = resultAction.payload;
          }
          // If it's an object with message property
          else if (resultAction.payload && typeof resultAction.payload === 'object' && 'message' in resultAction.payload) {
            errorMessage = (resultAction.payload as any).message;
          }
          // If it's an object with error property
          else if (resultAction.payload && typeof resultAction.payload === 'object' && 'error' in resultAction.payload) {
            errorMessage = (resultAction.payload as any).error;
          }
        }
        
        throw new Error(errorMessage);
      }

    } catch (err) {
      let errorMessage = "Failed to update offer help. Please try again.";
      
      // Extract error message from different possible formats
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
      console.error("Error updating offer help:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close dropdown if clicked outside
  const barterDropdownRef = useClickAway(() => {
    setShowBarterDropdown(false);
  });

  return (
    <div className="max-w-4xl mx-auto">
      {error && (
        <div className="alert alert-error mb-4">
          <FaInfoCircle />
          <span>{error}</span>
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
                  placeholder="../../assets/offer_help_placeholder.jpg"
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
                  alt="Service preview" 
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

            {/* Barter Options Dropdown */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Accepted as Barter (Optional)</span>
              </label>
              <div className="relative" ref={barterDropdownRef}>
                <div 
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer"
                  onClick={toggleBarterDropdown}
                >
                  <div className="flex flex-wrap gap-2">
                    {(!Array.isArray(formData.barter_options) || formData.barter_options.length === 0) ? (
                      <span className="text-gray-500">Select what you'd accept in exchange</span>
                    ) : (
                      formData.barter_options.map(id => {
                        const option = barterChoices.find(choice => choice.id === id);
                        return option ? (
                          <div key={id} className="badge badge-primary gap-2">
                            {option.icon}
                            {option.label}
                          </div>
                        ) : null;
                      })
                    )}
                  </div>
                  <span className="text-gray-500">▼</span>
                </div>
                
                {showBarterDropdown && (
                  <div className="absolute left-0 right-0 mt-1 bg-base-100 border rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                    {barterChoices.map(option => (
                      <div 
                        key={option.id}
                        className={`flex items-center gap-2 p-3 hover:bg-base-200 cursor-pointer ${
                          Array.isArray(formData.barter_options) && formData.barter_options.includes(option.id) 
                            ? 'bg-primary/10' 
                            : ''
                        }`}
                        onClick={() => handleBarterOptionChange(option.id)}
                      >
                        <input 
                          type="checkbox" 
                          className="checkbox checkbox-primary checkbox-sm"
                          checked={Array.isArray(formData.barter_options) && formData.barter_options.includes(option.id)}
                          onChange={() => {}} // Handled by the div click
                          onClick={e => e.stopPropagation()}
                        />
                        {option.icon}
                        <span>{option.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {Array.isArray(formData.barter_options) && formData.barter_options.length > 0 && (
                <div className="mt-2">
                  <button
                    type="button"
                    className="btn btn-xs btn-ghost"
                    onClick={() => setFormData({...formData, barter_options: []})}
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Title:</span>
              </label>
              <input 
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input input-bordered w-full" 
                placeholder="E.g., Fridge Repair, Gardening, Tutoring"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Service Description</span>
              </label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="textarea textarea-bordered w-full" 
                rows={5}
                placeholder="Describe your service - your experience, what you can help with, when you're available, etc."
                disabled={isSubmitting}
              ></textarea>
            </div>
            
            <div className="form-control w-full">
              <AddressInputForm 
                onAddressSelect={handleAddressInputFormChange}
                ref={addressInputRef}
                initialAddress={formData.address}
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
                    <span>Updating...</span>
                  </span>
                ) : 'Update Offer Help'}                  
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}