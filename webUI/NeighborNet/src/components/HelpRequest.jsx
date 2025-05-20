import React, { useState } from 'react'
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaEllipsisV, FaBell, FaChevronDown, FaChevronUp, FaThumbsUp } from 'react-icons/fa'

export default function HelpRequest() {
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
                  src="https://i.pinimg.com/736x/a3/67/cf/a367cf426a47d9f74043af539305c1ed.jpg" 
                  alt="Cat shelter with blankets" 
                  className="h-full w-full object-cover"
                />
              </figure>
              
              {/* Content on the right - adjusted width */}
              <div className="card-body w-3/5 p-4 text-left">
                <div className="flex justify-between items-start">
                  <h2 className="card-title text-left">Help Request</h2>
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
                  <span>Requested by: Emma Thompson</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaCalendarAlt className="text-primary min-w-4" />
                  <span>Posted: May 17, 2025</span>
                </div>
                
                {/* Topic and request description */}
                <div className="mt-1 space-y-1">
                  <p className="text-sm"><strong>Topic:</strong> Collection blankets for cat shelter</p>
                  <p className="text-sm"><strong>Request Description:</strong> Our local Paws & Whiskers Cat Shelter is facing a shortage of warm blankets as winter approaches. We're collecting gently used or new blankets of any size, preferably made of fleece or soft cotton. The shelter currently houses 37 cats, many of them seniors or recovering from illness, who desperately need warmth. If you have spare blankets you no longer need, they would make a tremendous difference. I can collect from your home or meet at a convenient location. The shelter also welcomes pet beds, towels, and sheets. Your donation will help these cats stay warm and comfortable until they find their forever homes.</p>
                </div>
                
                {/* Geotag */}
                <div className="flex items-center gap-2 mt-2 text-sm bg-base-200 p-1.5 rounded-lg">
                  <FaMapMarkerAlt className="text-error min-w-4" />
                  <span className="font-semibold">Location:</span>
                  <span>Sahlav Street, 42</span>
                </div>
              </div>
            </div>

            {/* "I can help" button at the bottom */}
            <div className="p-4 border-t border-gray-200">
              <button 
                className="btn btn-secondary w-full flex items-center justify-center gap-2"
                onClick={toggleForm}
              >
                I can help
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
                    <span className="label-text font-medium">Message to requester</span>
                  </label>
                  <textarea 
                    className="textarea textarea-bordered w-full" 
                    placeholder="Hi, I have some blankets I'd like to donate..."
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
                <button className="btn btn-primary w-full mt-2">Submit Offer</button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Sidebar - follow and upvote buttons */}
        <div className={`bg-base-200 shadow-lg flex flex-col items-center py-4 gap-4 transition-all duration-300 ${showActions ? 'w-24 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
          <button className="btn btn-circle btn-md btn-info" title="Follow">
            <FaBell />
          </button>
          <button className="btn btn-circle btn-md btn-primary" title="Upvote">
            <FaThumbsUp />
          </button>
        </div>
      </div>
    </div>
  )
}