import React, { useState, useEffect, useRef } from 'react'
import { FaInfoCircle, FaImage, FaTimes } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addHelpRequest } from '../../features/reports/helpRequests/addHelpRequestThunk.js'
import { refreshFeed } from '../../features/reports/feed/refreshFeedThunk.js';
import AddressInputForm from '../AddressInputForm'
import { categories } from '../../utils/requestCategories.jsx';
import { useClickAway } from '../../utils/useClickAway';

// Form storage key for localStorage
const FORM_STORAGE_KEY = 'help_request_draft';

export default function HelpRequestInputForm() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const addressInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    img_url: '',
    category: '',
    urgency: 'normal',
    city: '',
    location: {lat: '', lng: ''}
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Load saved form data on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedFormData) {
      try {
        setFormData(JSON.parse(savedFormData));
      } catch (e) {
        console.error("Error parsing saved form data", e);
      }
    }
  }, []);

  // Check if user just logged in and has saved data
  useEffect(() => {
    if (isAuthenticated && localStorage.getItem(FORM_STORAGE_KEY)) {
      setShowAuthPrompt(false);
    }
  }, [isAuthenticated]);

  // Reset image error when URL changes
  useEffect(() => {
    setImageError(false);
  }, [formData.img_url]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(updatedFormData);
    
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(updatedFormData));
    
    if (showAuthPrompt) {
      setShowAuthPrompt(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    const updatedFormData = {
      ...formData,
      category: categoryId
    };
    
    setFormData(updatedFormData);
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(updatedFormData));
    setShowCategoryDropdown(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const clearImage = () => {
    const updatedFormData = {
      ...formData,
      img_url: ''
    };
    
    setFormData(updatedFormData);
    setImageError(false);
    
    // Update localStorage
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(updatedFormData));
  };

  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
  };

  const validateForm = () => {
    // First check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return false;
    }
    
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.urgency.trim()) {
        setError("Urgency level is required");
        return false;
      }

    if (!formData.location) {
      setError("Location is required");
      return false;
    }
    if (!formData.category) {
      setError("Please select a category");
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
      await dispatch(addHelpRequest(formData)).unwrap();
      
      dispatch(refreshFeed());
      
      setSuccess(true);
      
      // Clear saved form data after successful submission
      localStorage.removeItem(FORM_STORAGE_KEY);
      
      // Reset form
      setFormData({
      title: '',
      description: '',
      address: '',
      img_url: '',
      category: '',
      urgency: 'normal',
      city: '',
      location: {lat: '', lng: ''}
      });
      
      // Clear address input
      if (addressInputRef.current) {
        addressInputRef.current.clearAddress();
      }
      
      // Hide success message after 5 seconds
      setTimeout(() => {
      setSuccess(false);
      }, 5000);
      
    } catch (error) {
      setError(error.message || "Failed to submit help request. Please try again.");
      console.error("Error submitting help request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedCategory = () => {
    return categories.find(cat => cat.id === formData.category);
  };

    const handleAddressInputFormChange = (addressResult) => {
    formData.address = addressResult.address
    formData.city = addressResult.city
    formData.location = addressResult.location
    setFormData(formData)
  }

  const dropdownRef = useClickAway(() => {
    setShowCategoryDropdown(false);
  });

  return (
    <div className="max-w-4xl mx-auto m-4">
      <div className="card bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-left text-2xl mb-4">Request Help from Neighbors</h2>
          
          {error && (
            <div className="alert alert-error mb-4">
              <FaInfoCircle />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="alert alert-success mb-4">
              <FaInfoCircle />
              <span>Help request posted successfully!</span>
            </div>
          )}
          
          {showAuthPrompt && (
            <div className="alert alert-info mb-4 py-3">
              <div className="flex flex-col items-start">
                <p>Please <Link to="/login" className="text-primary font-medium hover:underline">log in</Link> or <Link to="/signup" className="text-primary font-medium hover:underline">sign up</Link> to submit a help request.</p>
                <p className="text-xs mt-1">Your form data will be saved.</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                {/* Category Dropdown */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Category of Help Needed</span>
                  </label>
                  <div className="relative">
                    <div 
                      className="flex items-center justify-between p-3 border rounded-lg cursor-pointer"
                      onClick={toggleCategoryDropdown}
                    >
                      {formData.category ? (
                        <div className="flex items-center gap-2">
                          {getSelectedCategory()?.icon}
                          <span>{getSelectedCategory()?.label}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">Select a category</span>
                      )}
                      <span className="text-gray-500">▼</span>
                    </div>
                    
                    {showCategoryDropdown && (
                      <div className="absolute left-0 right-0 mt-1 bg-base-100 border rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                        {categories.map(category => (
                          <div 
                            key={category.id}
                            className={`flex items-center gap-2 p-3 hover:bg-base-200 cursor-pointer ${
                              formData.category === category.id 
                                ? 'bg-primary/10' 
                                : ''
                            }`}
                            onClick={() => handleCategorySelect(category.id)}
                          >
                            {category.icon}
                            <span>{category.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Urgency Selection */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Urgency Level</span>
                  </label>
                  <div className="flex gap-2">
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer ${formData.urgency === 'low' ? 'bg-success/20 border-success' : ''}`}>
                      <input 
                        type="radio" 
                        name="urgency" 
                        value="low" 
                        checked={formData.urgency === 'low'} 
                        onChange={handleChange}
                        className="radio radio-success radio-sm" 
                      />
                      <span>Low</span>
                    </label>
                    
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer ${formData.urgency === 'normal' ? 'bg-warning/20 border-warning' : ''}`}>
                      <input 
                        type="radio" 
                        name="urgency" 
                        value="normal" 
                        checked={formData.urgency === 'normal'} 
                        onChange={handleChange} 
                        className="radio radio-warning radio-sm"
                      />
                      <span>Normal</span>
                    </label>
                    
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer ${formData.urgency === 'high' ? 'bg-error/20 border-error' : ''}`}>
                      <input 
                        type="radio" 
                        name="urgency" 
                        value="high" 
                        checked={formData.urgency === 'high'} 
                        onChange={handleChange} 
                        className="radio radio-error radio-sm"
                      />
                      <span>High</span>
                    </label>
                  </div>
                </div>
                
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Image URL (Optional)</span>
                  </label>
                  <div className="flex items-center">
                    <input 
                      type="text"
                      name="img_url"
                      value={formData.img_url}
                      onChange={handleChange}
                      className={`input input-bordered w-full ${imageError ? 'input-error' : ''}`}
                      placeholder="../../assets/help_request_placeholder.jpeg"
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
                      alt="Request preview" 
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
                    placeholder="E.g., Need help fixing leaky faucet"
                  />
                </div>
                
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Description</span>
                  </label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full" 
                    rows="5"
                    placeholder="Describe what you need help with, when you need it, any specific requirements, etc."
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
                    ) : 'Post Help Request Report'}                 
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