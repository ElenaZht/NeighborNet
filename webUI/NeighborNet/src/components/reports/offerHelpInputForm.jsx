import React, { useState, useEffect, useRef } from 'react'
import { FaInfoCircle, FaImage, FaTimes } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addOfferHelp } from '../../features/reports/offerhelp/addOfferHeplThunk';
import { refreshFeed } from '../../features/reports/feed/refreshFeedThunk.js';
import { useClickAway } from '../../utils/useClickAway';

import AddressInputForm from '../AddressInputForm'
import { barterChoices } from '../../utils/barterChoises';

// Form storage key for localStorage
const FORM_STORAGE_KEY = 'offer_help_draft';

export default function OfferHelpInputForm() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const addressInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    img_url: '',
    barterOptions: [],
    city: '',
    address: '',
    location: {lat: '', lng: ''}
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showBarterDropdown, setShowBarterDropdown] = useState(false);

  const barterDropdownRef = useClickAway(() => {
    setShowBarterDropdown(false);
  });


  // Load saved form data on component mount
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

  // Save form changes to localStorage
  useEffect(() => {
    // Only save if user has started filling out the form
    if (formData.title || 
      formData.description || 
      formData.location || 
      formData.img_url || 
      formData.barterOptions.length > 0) {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
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

  const handleChange = (e) => {
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

  const handleBarterOptionChange = (id) => {
    setFormData(prev => {
      const options = [...prev.barterOptions];
      if (options.includes(id)) {
        return { ...prev, barterOptions: options.filter(item => item !== id) };
      } else {
        return { ...prev, barterOptions: [...options, id] };
      }
    });
    setShowBarterDropdown(false);
  };

  const toggleBarterDropdown = () => {
    setShowBarterDropdown(!showBarterDropdown);
  };

  const validateForm = () => {
    // First check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return false;
    }
    
    if (!formData.title.trim()) {
      setError("title is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (!formData.location) {
      setError("Location is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(addOfferHelp(formData)).unwrap();
      
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
        barterOptions: [],
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
      setError(error.message || "Failed to submit help offer. Please try again.");
      console.error("Error submitting help offer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddressInputFormChange = (addressResult) => {
    formData.address = addressResult.address
    formData.city = addressResult.city
    formData.location = addressResult.location
    setFormData(formData)
  }

  return (
    <div className="max-w-4xl mx-auto m-4">
      <div className="card bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-left text-2xl mb-4">Offer Your Skills or Services</h2>
          
          {showAuthPrompt && (
            <div className="alert alert-warning mb-4">
              <FaInfoCircle />
              <span>
                Please <Link to="/login" className="font-bold underline">log in</Link> or <Link to="/signup" className="font-bold underline">sign up</Link> to post a help offer
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
              <span>Help offer posted successfully!</span>
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
                        {formData.barterOptions.length === 0 ? (
                          <span className="text-gray-500">Select what you'd accept in exchange</span>
                        ) : (
                          formData.barterOptions.map(id => {
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
                              formData.barterOptions.includes(option.id) 
                                ? 'bg-primary/10' 
                                : ''
                            }`}
                            onClick={() => handleBarterOptionChange(option.id)}
                          >
                            <input 
                              type="checkbox" 
                              className="checkbox checkbox-primary checkbox-sm"
                              checked={formData.barterOptions.includes(option.id)}
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
                  {formData.barterOptions.length > 0 && (
                    <div className="mt-2">
                      <button
                        type="button"
                        className="btn btn-xs btn-ghost"
                        onClick={() => setFormData({...formData, barterOptions: []})}
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
                    rows="5"
                    placeholder="Describe your service - your experience, what you can help with, when you're available, etc."
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
                    ) : 'Post Offer Help Report'}                  
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