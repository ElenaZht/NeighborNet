import React, { useState, useEffect, useRef } from 'react'
import { FaInfoCircle, FaImage, FaTimes } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux';
import { addIssueReport } from '../../features/reports/issueReports/addIssueReportThunk';
import { Link } from 'react-router-dom';
import AddressInputForm from '../AddressInputForm'
import { refreshFeed } from '../../features/reports/feed/refreshFeedThunk';
import { useClickAway } from '../../utils/useClickAway';


// Form storage key for localStorage
const FORM_STORAGE_KEY = 'issue_report_draft';

export default function IssueReportInputForm() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    img_url: '',
    city: '',
    location: {lat: '', lng: ''}
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const addressInputRef = useRef(null);

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
    
    // Also save to localStorage as user types
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(updatedFormData));
    
    // Reset auth prompt when user starts entering data
    if (showAuthPrompt) {
      setShowAuthPrompt(false);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(addIssueReport(formData)).unwrap();
      setSuccess(true);

      // Reset form
      setFormData({
        title: '',
        description: '',
        address: '',
        img_url: '',
        city: '',
        location: {lat: '', lng: ''}
      });
      
      // Clear saved form data after successful submission
      localStorage.removeItem(FORM_STORAGE_KEY);

      // Clear address input
      if (addressInputRef.current) {
        addressInputRef.current.clearAddress();
      }
      
      // Refresh the feed to show the new report
      dispatch(refreshFeed());

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
      
    } catch (err) {
      setError(err.message || "Failed to submit report. Please try again.");
      console.error("Error submitting report:", err);
      
    } finally {
      setIsSubmitting(false);
    }
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
          <h2 className="card-title text-left text-2xl mb-4">Submit Issue Report</h2>
          
          {error && (
            <div className="alert alert-error mb-4">
              <FaInfoCircle />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="alert alert-success mb-4">
              <FaInfoCircle />
              <span>Report submitted successfully!</span>
            </div>
          )}
          
          {showAuthPrompt && (
            <div className="alert alert-info mb-4 py-3">
              <div className="flex flex-col items-start">
                <p>Please <Link to="/login" className="text-primary font-medium hover:underline">log in</Link> or <Link to="/signup" className="text-primary font-medium hover:underline">sign up</Link> to submit a report.</p>
                <p className="text-xs mt-1">Your form data will be saved.</p>
              </div>
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
                      placeholder="../../assets/issue_placeholder.jpg"
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
                      alt="Issue preview" 
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
                    placeholder="E.g., Broken Bench, Pothole, Fallen Tree"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Description</span>
                    <span className="label-text-alt">{formData.description.length}/500</span>
                  </label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full" 
                    rows="5"
                    maxLength={500}
                    placeholder="Describe the issue (max 500 characters)"
                    disabled={isSubmitting}
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
                    className="btn btn-primary w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="loading loading-spinner loading-sm"></span>
                        <span>Submitting...</span>
                      </span>
                    ) : 'Post Issue Report'}
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