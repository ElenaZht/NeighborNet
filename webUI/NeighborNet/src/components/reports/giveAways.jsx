import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaTimes, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaEllipsisV, FaBell, FaChevronDown, FaChevronUp, FaComment, FaInfoCircle } from 'react-icons/fa'
import { Comments } from '../reports/comments'
import { getGiveAway } from '../../features/reports/giveaways/getGiveAwayThunk'
import { format, parseISO } from 'date-fns'

export default function GiveAway({ reportId }) {
  const dispatch = useDispatch()
  const { currentGiveAway, loading, error } = useSelector(state => state.giveAways)
  const [showMap, setShowMap] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showComments, setShowComments] = useState(false);
  
  useEffect(() => {
    if (reportId) {
      dispatch(getGiveAway(reportId))
    }
  }, [dispatch, reportId])
  
  const toggleActionBar = () => {
    setShowActions(!showActions);
  };
  
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-4xl mx-auto m-4">
        <span>{error}</span>
      </div>
    )
  }

  if (!currentGiveAway) {
    return (
      <div className="alert alert-info max-w-4xl mx-auto m-4">
        <span>No giveaway found. It might have been deleted or doesn't exist.</span>
      </div>
    )
  }

  const formattedDate = currentGiveAway.created_at 
    ? format(parseISO(currentGiveAway.created_at), 'MMM d, yyyy')
    : 'Unknown date'

  return (
    <div className="relative max-w-4xl mx-auto m-4">
      <div className="flex">
        <div className="card card-side bg-base-100 shadow-xl w-[800px]">
          <div className="flex flex-col w-full">
            <div className="flex">
              <figure className="w-2/5">
                <img 
                  src={currentGiveAway.img_url || "https://placehold.co/400x300?text=No+Image"} 
                  alt={currentGiveAway.title || "Giveaway item"} 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "https://placehold.co/400x300?text=Image+Error"
                  }}
                />
              </figure>
              
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
                
                <div className="flex items-center gap-2 text-sm">
                  <FaUser className="text-primary min-w-4" />
                  <span>Offered by: {currentGiveAway.username}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaCalendarAlt className="text-primary min-w-4" />
                  <span>Posted: {formattedDate}</span>
                </div>
                
                <div className="mt-1 space-y-1">
                  <p className="text-sm"><strong>Topic:</strong> {currentGiveAway.title}</p>
                  <p className="text-sm">
                    <strong>Item Description:</strong> {currentGiveAway.description}
                  </p>
                </div>
                
                {!currentGiveAway.is_free && currentGiveAway.swap_options && (
                  <div className="mt-1">
                    <p className="text-sm"><strong>Will swap for:</strong> {currentGiveAway.swap_options}</p>
                  </div>
                )}
                
                <div onClick={toggleMap} className="flex items-center gap-2 mt-2 text-sm bg-base-200 p-1.5 rounded-lg">
                  <FaMapMarkerAlt className="text-error min-w-4" />
                  <span className="font-semibold">Location:</span>
                  <span>{currentGiveAway.address}</span>
                </div>
                {showMap && (
                <div className="relative mt-3 border rounded-lg overflow-hidden">
                  <button 
                    className="absolute top-2 right-2 bg-base-100 p-1 rounded-full shadow-md z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMap(false);
                  }}
                >
                  <FaTimes className="text-error" />
                </button>
                <div className="w-full h-48">
                  <iframe 
                    title="Location Map"
                    className="w-full h-full"
                    frameBorder="0"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(currentGiveAway.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <button 
                className="btn btn-secondary w-full flex items-center justify-center gap-2"
                onClick={toggleForm}
              >
                I want this item
                {showForm ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>

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
                    placeholder={`Hi, I'm interested in your ${currentGiveAway.title}...`}
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

        <div className={`bg-base-200 shadow-lg flex flex-col items-center py-4 gap-4 transition-all duration-300 ${showActions ? 'w-24 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
          <button className="btn btn-circle btn-md btn-info" title="Follow">
            <FaBell />
          </button>
        </div>
      </div>
      
      <div className="w-[800px] mt-4">
        <button 
          className="btn btn-outline w-full flex items-center justify-center gap-2"
          onClick={toggleComments}
        >
          {showComments ? 'Hide Comments' : 'Show Comments'}
          <FaComment />
          {showComments ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
      
      <div className={`w-[800px] overflow-hidden transition-all duration-300 ${
        showComments ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
      }`}>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <Comments reportId={reportId} reportType="give_away" />
          </div>
        </div>
      </div>
    </div>
  )
}