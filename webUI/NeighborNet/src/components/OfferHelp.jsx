import React, { useState } from 'react'
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaEllipsisV, FaBell, FaChevronDown, FaChevronUp, FaCheckCircle, FaUtensils, FaLeaf, FaFootballBall } from 'react-icons/fa'

export default function OfferHelp() {
  const [showActions, setShowActions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [barterOption, setBarterOption] = useState('');
  
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
                  src="https://masterfridgerepairs.com.au/wp-content/uploads/2024/06/refrigeration-mechanic-sydney-suburbs.webp" 
                  alt="Fridge repair specialist" 
                  className="h-full w-full object-cover"
                />
              </figure>
              
              {/* Content on the right - adjusted width */}
              <div className="card-body w-3/5 p-4 text-left">
                <div className="flex justify-between items-start">
                  <h2 className="card-title text-left">Help Offer</h2>
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
                  <span>Offered by: Michael Rodriguez</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaCalendarAlt className="text-primary min-w-4" />
                  <span>Posted: May 18, 2025</span>
                </div>
                
                {/* Topic and item description */}
                <div className="mt-1 space-y-1">
                  <p className="text-sm"><strong>Topic:</strong> Skilled Fridge Master</p>
                  <p className="text-sm"><strong>Service Description:</strong> Professional refrigerator and freezer repair with 15+ years of experience. Can fix most common issues including cooling problems, strange noises, water leaks, ice maker malfunctions, and electrical issues. Available evenings and weekends. Willing to help neighbors with quick diagnostics and minor repairs at no cost, or accept barter for more complex jobs.</p>
                </div>
                
                {/* Barter options */}
                <div className="mt-2 bg-base-200 p-2 rounded-lg">
                  <p className="text-sm font-medium mb-1">Accepted as barter:</p>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-1">
                      <FaUtensils className="text-warning" />
                      <span className="text-xs">Food</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaLeaf className="text-success" />
                      <span className="text-xs">Flowers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaFootballBall className="text-info" />
                      <span className="text-xs">Sport Equipment</span>
                    </div>
                  </div>
                </div>
                
                {/* Geotag */}
                <div className="flex items-center gap-2 mt-2 text-sm bg-base-200 p-1.5 rounded-lg">
                  <FaMapMarkerAlt className="text-error min-w-4" />
                  <span className="font-semibold">Location:</span>
                  <span>Sahlav Street, 127</span>
                </div>
              </div>
            </div>

            {/* "Request help" button at the bottom */}
            <div className="p-4 border-t border-gray-200">
              <button 
                className="btn btn-secondary w-full flex items-center justify-center gap-2"
                onClick={toggleForm}
              >
                Request this help
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
                    <span className="label-text font-medium">Message to helper</span>
                  </label>
                  <textarea 
                    className="textarea textarea-bordered w-full" 
                    placeholder="Hi, I need help with my refrigerator..."
                    rows="3"
                  ></textarea>
                </div>
                
                {/* Barter selection */}
                <div className="form-control mb-4">
                  <label className="label justify-start p-0 pb-2">
                    <span className="label-text font-medium">Barter offer (optional)</span>
                  </label>
                  <select 
                    className="select select-bordered w-full"
                    value={barterOption}
                    onChange={(e) => setBarterOption(e.target.value)}
                  >
                    <option value="">No barter (cash payment)</option>
                    <option value="food">Food</option>
                    <option value="flowers">Flowers</option>
                    <option value="sports">Sport Equipment</option>
                  </select>
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

        {/* Action Sidebar - follow and verify buttons */}
        <div className={`bg-base-200 shadow-lg flex flex-col items-center py-4 gap-4 transition-all duration-300 ${showActions ? 'w-24 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
          <button className="btn btn-circle btn-md btn-info" title="Follow">
            <FaBell />
          </button>
          <button className="btn btn-circle btn-md btn-success" title="Verify">
            <FaCheckCircle />
          </button>
        </div>
      </div>
    </div>
  )
}