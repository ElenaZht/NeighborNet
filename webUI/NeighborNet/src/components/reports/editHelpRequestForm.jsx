import React, { useState, useEffect, useRef } from 'react'
import { FaInfoCircle, FaImage, FaTimes } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux';
import { editHelpRequest } from '../../features/reports/helpRequests/editHelpRequestThunk.js';
import AddressInputForm from '../AddressInputForm.jsx'
import { categories } from '../../utils/requestCategories.jsx';

export default function EditHelpRequestForm({ reportData, onSuccess, onError }) {
  const dispatch = useDispatch();
  const addressInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    img_url: '',
    category: '',
    urgency: 'normal',
    city: '',
    location: { lat: '', lng: '' }
  });
  
  const [originalData, setOriginalData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Initialize form data when reportData changes
  useEffect(() => {
    if (reportData) {
      const initialData = {
        title: reportData.title || '',
        description: reportData.description || '',
        address: reportData.address || '',
        img_url: reportData.img_url || '',
        category: reportData.category || '',
        urgency: reportData.urgency || 'normal',
        city: reportData.city || '',
        location: reportData.location || { lat: '', lng: '' }
      };
      
      setFormData(initialData);
      setOriginalData(initialData); // Store original data for comparison
    }
  }, [reportData]);

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

  const handleAddressChange = (addressResult) => {
    setFormData(prev => ({
      ...prev,
      address: addressResult.address,
      city: addressResult.city,
      location: addressResult.location
    }));
  };

  const handleCategorySelect = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      category: categoryId
    }));
    setShowCategoryDropdown(false);
  };

  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
  };

  const getSelectedCategory = () => {
    return categories.find(cat => cat.id === formData.category);
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
    if (!formData.category) {
      setError("Please select a category");
      return false;
    }
    if (!formData.urgency) {
      setError("Urgency level is required");
      return false;
    }
    return true;
  };

  // Function to get only changed fields
  const getChangedFields = () => {
    const changes = {};
    
    // Compare each field with original data
    Object.keys(formData).forEach(key => {
      if (key === 'location') {
        // Special handling for location object
        const originalLoc = originalData.location || {};
        const currentLoc = formData.location || {};
        
        if (originalLoc.lat !== currentLoc.lat || originalLoc.lng !== currentLoc.lng) {
          if (currentLoc.lat && currentLoc.lng) {
            changes.location = {
              lat: parseFloat(currentLoc.lat),
              lng: parseFloat(currentLoc.lng)
            };
          }
        }
      } else {
        // For other fields, compare values
        if (formData[key] !== originalData[key]) {
          changes[key] = formData[key];
        }
      }
    });
    
    return changes;
  };

  // Check if there are any changes
  const hasChanges = () => {
    const changedFields = getChangedFields();
    return Object.keys(changedFields).length > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    const changedFields = getChangedFields();
    
    // If no changes were made, show message and don't submit
    if (Object.keys(changedFields).length === 0) {
      setError("No changes were made to update");
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(editHelpRequest({
        reportId: reportData.id,
        helpRequestData: changedFields // Only send changed fields
      })).unwrap();

      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      const errorMessage = error.message || 'Failed to update help request';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="alert alert-error mb-4">
          <FaInfoCircle />
          <span>{error}</span>
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              ></textarea>
            </div>
            
            <div className="form-control w-full">
              <AddressInputForm 
                onAddressSelect={handleAddressChange}
                initialAddress={formData.address}
                ref={addressInputRef}
              />
            </div>
            
            <div className="flex gap-3 mt-4">
              <button 
                type="submit" 
                className={`btn btn-primary flex-1 ${isSubmitting ? 'loading' : ''} ${!hasChanges() ? 'btn-disabled' : ''}`}
                disabled={isSubmitting || !hasChanges()}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    <span>Updating...</span>
                  </span>
                ) : hasChanges() ? 'Update Help Request' : 'No Changes to Save'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}