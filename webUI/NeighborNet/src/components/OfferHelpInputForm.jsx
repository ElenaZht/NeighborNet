import React, { useState } from 'react'
import { FaMapMarkerAlt, FaInfoCircle, FaUtensils, FaLeaf, FaFootballBall, FaTools, FaBook, FaCar, FaBaby, FaLaptop, FaPaintBrush, FaMusic, FaDog, FaTshirt } from 'react-icons/fa'

export default function OfferHelpInputForm() {
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    location: '',
    image: null,
    imagePreview: null,
    barterOptions: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showBarterDropdown, setShowBarterDropdown] = useState(false);

  const barterChoices = [
    { id: 'food', label: 'Food', icon: <FaUtensils className="text-warning" /> },
    { id: 'plants', label: 'Plants & Flowers', icon: <FaLeaf className="text-success" /> },
    { id: 'sports', label: 'Sport Equipment', icon: <FaFootballBall className="text-info" /> },
    { id: 'tools', label: 'Tools', icon: <FaTools className="text-error" /> },
    { id: 'books', label: 'Books', icon: <FaBook className="text-primary" /> },
    { id: 'transportation', label: 'Transportation', icon: <FaCar className="text-neutral" /> },
    { id: 'childcare', label: 'Childcare', icon: <FaBaby className="text-pink-400" /> },
    { id: 'tech', label: 'Tech Support', icon: <FaLaptop className="text-slate-600" /> },
    { id: 'art', label: 'Art Supplies', icon: <FaPaintBrush className="text-purple-500" /> },
    { id: 'music', label: 'Music Lessons', icon: <FaMusic className="text-blue-400" /> },
    { id: 'petcare', label: 'Pet Sitting', icon: <FaDog className="text-amber-700" /> },
    { id: 'clothing', label: 'Clothing', icon: <FaTshirt className="text-teal-500" /> }
  ];

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
      setError("Please upload an image related to your service");
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
      // const response = await submitOfferHelp(formData);
      
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
        imagePreview: null,
        barterOptions: []
      });
      
    } catch (err) {
      setError("Failed to submit help offer. Please try again.");
      console.error("Error submitting help offer:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto m-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-left text-2xl mb-4">Offer Your Skills or Services</h2>
          
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
              {/* Left Column - Image Upload */}
              <div className="flex flex-col gap-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Service Image</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-64">
                    {formData.imagePreview ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={formData.imagePreview} 
                          alt="Service preview" 
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
                        <p className="text-gray-500 mb-2">Upload a photo related to your service</p>
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
                
                {/* Barter Options Dropdown */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Accepted as Barter (Optional)</span>
                  </label>
                  <div className="relative">
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
                  <label className="label">
                    <span className="label-text font-medium">Your Location</span>
                  </label>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-error mr-2" />
                    <input 
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="input input-bordered w-full" 
                      placeholder="Your address or nearest neighborhood"
                    />
                  </div>
                </div>
                
                <div className="form-control mt-4">
                  <button 
                    type="submit" 
                    className={`btn btn-primary w-full ${isSubmitting ? 'loading' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Posting...' : 'Post Help Offer'}
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