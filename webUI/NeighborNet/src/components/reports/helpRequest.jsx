import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as FaIcons from 'react-icons/fa';
import { Comments } from '../reports/comments'
import { getHelpRequest } from '../../features/reports/helpRequests/getHelpRequestThunk'
import { format, parseISO } from 'date-fns'
import { ReportStatus, getStatusColorClass } from '../../../../../reportsStatuses.js'
import placeholderImage from '../../assets/help_request_placeholder.jpeg';


export default function HelpRequest({report}) {
  const dispatch = useDispatch()
  const [showMap, setShowMap] = useState(false);
  const [showActions, setShowActions] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  
  const toggleActionBar = () => {
    setShowActions(!showActions)
  }
  
  const toggleForm = () => {
    setShowForm(!showForm)
  }
  
  const toggleComments = () => {
    setShowComments(!showComments)
  }

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down 400px
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  if (!report) {
    return (
      <div className="alert alert-info max-w-4xl mx-auto m-4">
        <span>No help request found. It might have been deleted or doesn't exist.</span>
      </div>
    )
  }

  // Format the date
  const formattedDate = report.created_at 
    ? format(parseISO(report.created_at), 'MMM d, yyyy')
    : 'Unknown date'

  return (
    <div className="relative max-w-4xl mx-auto m-4">
      <div className="flex">
        <div className="card card-side bg-base-100 shadow-xl w-[800px]">
          <div className="flex flex-col w-full">
            <div className="flex">
              <figure className="w-2/5">
                <img 
                  src={report.img_url || placeholderImage} 
                  alt={report.title || "Help request"} 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = placeholderImage
                  }}
                />
              </figure>
              
              <div className="card-body w-3/5 p-4 text-left">
                <div className="flex justify-between items-start">
                  <h2 className={`card-title text-left ${
                    report.urgency?.toLowerCase() === 'high' ? 'text-error' :
                    report.urgency?.toLowerCase() === 'medium' ? 'text-warning' :
                    ''
                  }`}>
                    Help Request
                    {report.urgency?.toLowerCase() === 'high' && (
                      <FaIcons.FaExclamationTriangle className="text-error ml-2" />
                    )}
                  </h2>
                  <div className={`badge ${getStatusColorClass('FULFILLED')} mt-1`}>
                    {report.status || 'No status'}
                  </div>
                  <button 
                    onClick={toggleActionBar}
                    className="btn btn-sm btn-square"
                    aria-label={showActions ? "Close actions" : "Open actions"}
                  >
                    <FaIcons.FaEllipsisV />
                  </button>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <FaIcons.FaUser className="text-primary min-w-4" />
                  <span>Requested by: {report.username}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaIcons.FaCalendarAlt className="text-primary min-w-4" />
                  <span>Posted: {formattedDate}</span>
                </div>
                
                <div className="mt-1 space-y-1">
                  {report.category && (
                    <p className="text-sm">
                      <strong>Category:</strong> {report.category}
                    </p>
                  )}
                  {report.urgency && (
                    <div className="flex items-center gap-2 text-sm">
                      <strong>Urgency:</strong>
                      <span className={`badge ${
                        report.urgency.toLowerCase() === 'high' ? 'badge-error' :
                        report.urgency.toLowerCase() === 'medium' ? 'badge-warning' :
                        'badge-success'
                      }`}>
                        {report.urgency}
                      </span>
                    </div>
                  )}
                  <p className="text-sm">
                    <strong>Title:{report.title}</strong>
                  </p>
                  <p className="text-sm">
                    <strong>Request Description:</strong> {report.description}
                  </p>
                </div>
                
                <div onClick={toggleMap} className="flex items-center gap-2 mt-2 text-sm bg-base-200 p-1.5 rounded-lg">
                  <FaIcons.FaMapMarkerAlt className="text-error min-w-4" />
                  <span className="font-semibold">Location:</span>
                  <span>{report.address}</span>
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
                    <FaIcons.FaTimes className="text-error" />
                        </button>
                        <div className="w-full h-48">
                          <iframe 
                            title="Location Map"
                            className="w-full h-full"
                            frameBorder="0"
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(report.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                  )}
              </div>
            </div>

            {/* "I can help" button*/}
            <div className="p-4 border-t border-gray-200">
              <button 
                className="btn btn-secondary w-full flex items-center justify-center gap-2"
                onClick={toggleForm}
              >
                I can help
                {showForm ? <FaIcons.FaChevronUp /> : <FaIcons.FaChevronDown />}
              </button>
            </div>

            {/* Dropdown form*/}
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
                    placeholder={`Hi, I'd like to help with ${report.title}...`}
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
                <button className="btn btn-primary w-full mt-2" onClick={() => {

                  setShowForm(false);
                }}>Submit Offer</button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className={`bg-base-200 shadow-lg flex flex-col items-center py-4 gap-4 transition-all duration-300 ${showActions ? 'w-24 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
          <button className="btn btn-circle btn-md btn-info" title="Follow">
            <FaIcons.FaBell />
          </button>
          <button className="btn btn-circle btn-md btn-primary" title="Upvote">
            <FaIcons.FaThumbsUp />
          </button>
        </div>
      </div>
      
      {/* Comments Section */}
      <div className="w-[800px] mt-4">
        <button 
          className="btn btn-outline w-full flex items-center justify-center gap-2"
          onClick={toggleComments}
        >
          {showComments ? 'Hide Comments' : 'Show Comments'}
          <FaIcons.FaComment />
          {showComments ? <FaIcons.FaChevronUp /> : <FaIcons.FaChevronDown />}
        </button>
      </div>
      
      <div className={`w-[800px] overflow-hidden transition-all duration-300 ${
        showComments ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
      }`}>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <Comments reportId={report.id} reportType="help_request" />
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 btn btn-circle btn-primary shadow-lg transition-all duration-300 z-20 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        title="Back to top"
      >
        <FaIcons.FaChevronUp className="text-lg" />
      </button>
    </div>
  )
}