import React, { useState } from 'react'
import { FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa'

export default function ReportInputForm() {
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    location: '',
    image: null,
    imagePreview: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const validateForm = () => {
    if (!formData.topic.trim()) {
      setError("Topic is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (!formData.location.trim()) {
      setError("Location is required");
      return false;
    }
    if (!formData.image) {
      setError("Please upload an image of the issue");
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
      // Here you would typically send the data to your API
      // const response = await submitReport(formData);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setSuccess(true);
      
      // Reset form
      setFormData({
        topic: '',
        description: '',
        location: '',
        image: null,
        imagePreview: null
      });
      
      // Optional: redirect or other actions after successful submission
      
    } catch (err) {
      setError("Failed to submit report. Please try again.");
      console.error("Error submitting report:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto m-4">
      <div className="card bg-base-100 shadow-xl">
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
          
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Left Column - Image Upload */}
              <div className="flex flex-col gap-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Issue Image</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-64">
                    {formData.imagePreview ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={formData.imagePreview} 
                          alt="Issue preview" 
                          className="h-full w-full object-cover rounded-lg"
                        />
                        <button 
                          type="button" 
                          className="btn btn-circle btn-sm absolute top-2 right-2 bg-base-100"
                          onClick={() => setFormData({...formData, image: null, imagePreview: null})}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-500 mb-2">Upload a photo of the issue</p>
                        <input 
                          type="file" 
                          className="file-input file-input-bordered w-full max-w-xs" 
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Right Column - Form Fields */}
              <div className="flex flex-col gap-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Topic</span>
                  </label>
                  <input 
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className="input input-bordered w-full" 
                    placeholder="E.g., Broken Bench, Pothole, Fallen Tree"
                  />
                </div>
                
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Issue Description</span>
                  </label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full" 
                    rows="5"
                    placeholder="Provide details about the issue - what's wrong, how long it's been there, impact on residents, etc."
                  ></textarea>
                </div>
                
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Location</span>
                  </label>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-error mr-2" />
                    <input 
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="input input-bordered w-full" 
                      placeholder="Street name, landmark, or specific address"
                    />
                  </div>
                </div>
                
                <div className="form-control mt-4">
                  <button 
                    type="submit" 
                    className={`btn btn-primary w-full ${isSubmitting ? 'loading' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
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