import React, { useState } from 'react'
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaEllipsisV, FaCheck, FaBell, FaThumbsUp, FaCheckCircle } from 'react-icons/fa'

export default function IssueReport() {
  const [showActions, setShowActions] = useState(false);
  
  const toggleActionBar = () => {
    setShowActions(!showActions);
  };

  return (
    <div className="relative max-w-4xl mx-auto m-4">
      <div className="flex">
        <div className="card card-side bg-base-100 shadow-xl w-[800px]">
          <figure className="w-2/5">
            <img 
              src="https://t3.ftcdn.net/jpg/05/33/70/12/360_F_533701257_HCnr7lTTfKzOkxI2TsBl195qhwlWta7A.jpg" 
              alt="Report image" 
              className="h-full w-full object-cover"
            />
          </figure>
          
          <div className="card-body w-3/5 p-4 text-left">
            <div className="flex justify-between items-start">
              <h2 className="card-title text-left">Issue Report</h2>
              <button 
                onClick={toggleActionBar}
                className="btn btn-sm btn-square"
                aria-label={showActions ? "Close actions" : "Open actions"}
              >
                <FaEllipsisV />
              </button>
            </div>
            <div className="divider my-0.5"></div>
            
            <div className="flex items-center gap-2 text-sm">
              <FaUser className="text-primary min-w-4" />
              <span>Submitted by: Jane Doe</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FaCalendarAlt className="text-primary min-w-4" />
              <span>Date: May 20, 2025</span>
            </div>
            
            <div className="mt-1 space-y-1">
              <p className="text-sm"><strong>Topic:</strong> Broken Bench</p>
              <p className="text-sm"><strong>Issue Description:</strong> The wooden bench at the north end of Cedar Park has multiple broken slats and an unstable base, posing a safety hazard to residents. The damage appears to have occurred within the last two weeks. Several elderly community members regularly use this bench as a resting spot during their daily walks, and they've expressed concerns about its condition.</p>
            </div>
            
            <div className="flex items-center gap-2 mt-2 text-sm bg-base-200 p-1.5 rounded-lg">
              <FaMapMarkerAlt className="text-error min-w-4" />
              <span className="font-semibold">Location:</span>
              <span>st. sahlav</span>
            </div>

            <div className="flex justify-between mt-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <FaCheckCircle className="text-success" />
                <span>23 verified</span>
              </div>
              <div className="flex items-center gap-1">
                <FaBell className="text-info" />
                <span>12 follows</span>
              </div>
              <div className="flex items-center gap-1">
                <FaThumbsUp className="text-primary" />
                <span>25 upvotes</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`bg-base-200 shadow-lg flex flex-col items-center py-4 gap-4 transition-all duration-300 ${showActions ? 'w-24 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
          <button className="btn btn-circle btn-md btn-success" title="Approve">
            <FaCheck />
          </button>
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