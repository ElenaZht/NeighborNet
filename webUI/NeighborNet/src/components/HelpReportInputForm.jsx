import React, { useState } from 'react'
import { FaMapMarkerAlt, FaInfoCircle, FaTools, FaCar, FaBaby, FaDog, FaLaptop, FaDumbbell, FaLeaf, FaUtensils, FaShoppingBag, FaGraduationCap, FaMedkit, FaBroom, FaHome } from 'react-icons/fa'

export default function HelpReportInputForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    image: null,
    imagePreview: null,
    category: '',
    urgency: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const categories = [
    { id: 'repairs', label: 'Home Repairs', icon: <FaTools className="text-warning" /> },
    { id: 'transportation', label: 'Transportation', icon: <FaCar className="text-blue-500" /> },
    { id: 'childcare', label: 'Childcare', icon: <FaBaby className="text-pink-400" /> },
    { id: 'petcare', label: 'Pet Care', icon: <FaDog className="text-amber-700" /> },
    { id: 'technology', label: 'Tech Help', icon: <FaLaptop className="text-slate-600" /> },
    { id: 'moving', label: 'Moving/Heavy Lifting', icon: <FaDumbbell className="text-red-600" /> },
    { id: 'gardening', label: 'Gardening/Yard Work', icon: <FaLeaf className="text-green-500" /> },
    { id: 'cooking', label: 'Cooking/Meals', icon: <FaUtensils className="text-yellow-600" /> },
    { id: 'errands', label: 'Errands', icon: <FaShoppingBag className="text-indigo-500" /> },
    { id: 'tutoring', label: 'Academic/Tutoring', icon: <FaGraduationCap className="text-purple-500" /> },
    { id: 'health', label: 'Health Assistance', icon: <FaMedkit className="text-red-500" /> },
    { id: 'cleaning', label: 'Cleaning', icon: <FaBroom className="text-teal-500" /> },
    { id: 'other', label: 'Other', icon: <FaHome className="text-gray-500" /> }
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

  const handleCategorySelect = (categoryId) => {
    setFormData({
      ...formData,
      category: categoryId
    });
    setShowCategoryDropdown(false);
  };

  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
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
    if (!formData.location.trim()) {
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
      // Here you would typically send the data to your API
      // const response = await submitHelpRequest(formData);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        image: null,
        imagePreview: null,
        category: '',
        urgency: 'normal'
      });
      
    } catch (err) {
      setError("Failed to submit help request. Please try again.");
      console.error("Error submitting help request:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedCategory = () => {
    return categories.find(cat => cat.id === formData.category);
  };

  return (
    <div className="max-w-4xl mx-auto m-4">
      <div className="card bg-base-100 shadow-xl">
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
          
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Left Column - Category & Image */}
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
                
                {/* Image Upload */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Image (Optional)</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-52">
                    {formData.imagePreview ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={formData.imagePreview} 
                          alt="Request preview" 
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
                        <p className="text-gray-500 mb-2">Upload an image (optional)</p>
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
                    {isSubmitting ? 'Posting...' : 'Post Help Request'}
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