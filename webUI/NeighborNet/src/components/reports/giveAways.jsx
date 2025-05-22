import React, { useState } from 'react'
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaEllipsisV, FaBell, FaChevronDown, FaChevronUp } from 'react-icons/fa'

export default function GiveAway() {
  const [showActions, setShowActions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const toggleActionBar = () => {
    setShowActions(!showActions);
  };
  
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="relative max-w-4xl mx-auto m-4">
      <div className="flex">
        {/* Main card - fixed width */}
        <div className="card card-side bg-base-100 shadow-xl w-[800px]">
          <div className="flex flex-col w-full">
            <div className="flex">
              {/* Image on the left - increased width */}
              <figure className="w-2/5">
                <img 
                  src="https://www.polkadotlane.co.uk/wp-content/uploads/2021/05/Polish-Pottery-White-Flower-on-Blue-Teapot-900ml.jpg" 
                  alt="Teapot image" 
                  className="h-full w-full object-cover"
                />
              </figure>
              
              {/* Content on the right - adjusted width */}
              <div className="card-body w-3/5 p-4 text-left">
                <div className="flex justify-between items-start">
                  <h2 className="card-title text-left">Give Away</h2>
                  <button 
                    onClick={toggleActionBar}
                    className="btn btn-sm btn-square"
                    aria-label={showActions ? "Close actions" : "Open actions"}
                  >
                    <FaEllipsisV />
                  </button>
                </div>
                <div className="divider my-0.5"></div>
                
                {/* Text rows */}
                <div className="flex items-center gap-2 text-sm">
                  <FaUser className="text-primary min-w-4" />
                  <span>Offered by: Sarah Johnson</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaCalendarAlt className="text-primary min-w-4" />
                  <span>Posted: May 19, 2025</span>
                </div>
                
                {/* Topic and item description */}
                <div className="mt-1 space-y-1">
                  <p className="text-sm"><strong>Topic:</strong> Like a new teapot</p>
                  <p className="text-sm"><strong>Item Description:</strong> Beautiful Polish pottery teapot with white flower pattern on blue background. 900ml capacity, perfect for serving tea for 4-6 people. Only used a handful of times and in excellent condition. No chips or cracks. I received it as a gift but I'm moving to a smaller place and downsizing my kitchen items. Available for pickup any evening this week.</p>
                </div>
                
                {/* Geotag */}
                <div className="flex items-center gap-2 mt-2 text-sm bg-base-200 p-1.5 rounded-lg">
                  <FaMapMarkerAlt className="text-error min-w-4" />
                  <span className="font-semibold">Location:</span>
                  <span>Sahlav Street, 34</span>
                </div>
              </div>
            </div>

            {/* "I want this" button at the bottom */}
            <div className="p-4 border-t border-gray-200">
              <button 
                className="btn btn-secondary w-full flex items-center justify-center gap-2"
                onClick={toggleForm}
              >
                I want this item
                {showForm ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>

            {/* Dropdown form - cleaned up and left-aligned */}
            <div className={`overflow-hidden transition-all duration-300 ${
              showForm ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="p-5 bg-base-200 text-left">
                <div className="form-control mb-4">
                  <label className="label justify-start p-0 pb-2">
                    <span className="label-text font-medium">Message to owner</span>
                  </label>
                  <textarea 
                    className="textarea textarea-bordered w-full" 
                    placeholder="Hi, I'm interested in your teapot..."
                    rows="3"
                  ></textarea>
                </div>
                <div className="form-control mb-4">
                  <label className="label justify-start p-0 pb-2">
                    <span className="label-text font-medium">Phone number</span>
                  </label>
                  <input 
                    type="tel" 
                    placeholder="Your contact number" 
                    className="input input-bordered w-full" 
                  />
                </div>
                <button className="btn btn-primary w-full mt-2">Submit Request</button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Sidebar - follow button only */}
        <div className={`bg-base-200 shadow-lg flex flex-col items-center py-4 gap-4 transition-all duration-300 ${showActions ? 'w-24 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
          <button className="btn btn-circle btn-md btn-info" title="Follow">
            <FaBell />
          </button>
        </div>
      </div>
    </div>
  )
}