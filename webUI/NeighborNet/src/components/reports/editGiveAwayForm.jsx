import React, { useState, useEffect, useRef } from 'react'
import { FaInfoCircle, FaImage, FaTimes } from 'react-icons/fa'
import { useDispatch } from 'react-redux';
import { editGiveAway } from '../../features/reports/giveaways/editGiveAwayThunk.js';
import AddressInputForm from '../AddressInputForm'

export default function EditGiveAwayForm({ reportData, onSuccess, onError }) {
  const dispatch = useDispatch();
  const addressInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    img_url: '',
    is_free: true,
    swap_options: '',
    city: '',
    location: { lat: '', lng: '' }
  });
  
  const [originalData, setOriginalData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Initialize form data when reportData changes
  useEffect(() => {
    if (reportData) {
      const initialData = {
        title: reportData.title || '',
        description: reportData.description || '',
        address: reportData.address || '',
        img_url: reportData.img_url || '',
        is_free: reportData.is_free !== undefined ? reportData.is_free : true,
        swap_options: reportData.swap_options || '',
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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
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

  const getChangedFields = () => {
    const changes = {};
    
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
      await dispatch(editGiveAway({
        reportId: reportData.id,
        giveAwayData: changedFields // Only send changed fields
      })).unwrap();

      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      const errorMessage = error.message || 'Failed to update giveaway';
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
                  disabled={isSubmitting}
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
                  rows="3"
                  placeholder="What would you accept in exchange? (e.g., kitchen items, plants, etc.)"
                  disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                rows="5"
                placeholder="Describe the item - condition, size, age, why you're giving it away, etc."
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
                ) : hasChanges() ? 'Update Giveaway' : 'No Changes to Save'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}