import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as FaIcons from 'react-icons/fa';
import { Comments } from '../reports/comments'
import { getOfferHelp } from '../../features/reports/offerhelp/getOfferHelpThunk'
import { format, parseISO } from 'date-fns'
import { ReportStatus, getStatusColorClass } from '../../../../../reportsStatuses.js'
import placeholderImage from "../../assets/offer_help_placeholder.jpg"

export default function OfferHelp({ report }) {
  const dispatch = useDispatch()
  const [showMap, setShowMap] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const toggleActionBar = () => {
    setShowActions(!showActions);
  };
  
  const toggleComments = () => {
    setShowComments(!showComments);
  };
    
  const toggleMap = () => {
    setShowMap(!showMap);
  };
  
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  if (!report) {
    return (
      <div className="alert alert-info max-w-4xl mx-auto m-4">
        <span>No offer help report found. It might have been deleted or doesn't exist.</span>
      </div>
    )
  }

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
                  alt={report.title || "Issue report"} 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = placeholderImage
                  }}
                />
              </figure>
              
              <div className="card-body w-3/5 p-4 text-left">
                <div className="flex justify-between items-start">
                  <h2 className="card-title text-left">Offer Help Report</h2>
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
                <div className="divider my-0.5"></div>
                
                <div className="flex items-center gap-2 text-sm">
                  <FaIcons.FaUser className="text-primary min-w-4" />
                  <span>Submitted by: {report.username}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaIcons.FaCalendarAlt className="text-primary min-w-4" />
                  <span>Date: {formattedDate}</span>
                </div>
                
                <div className="mt-1 space-y-1">
                  <p className="text-sm"><strong>Title:</strong> {report.title}</p>
                  <p className="text-sm"><strong>Description:</strong> {report.description}</p>
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
                
                <div className="flex justify-between mt-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <FaIcons.FaBell className="text-info" />
                    <span>{report.followers || 0} follows</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <button 
                className="btn w-full flex items-center justify-center gap-2 bg-gray-400 text-gray-600 cursor-not-allowed"
                disabled={true}
              >
                I need your help
                <FaIcons.FaChevronDown />
              </button>
              <div className="text-sm text-gray-500 mt-2 text-center">
                <span>📝 This feature will be available in the next version</span>
              </div>
            </div>

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
                    placeholder={`Hi, I need your help with ${report.title}...`}
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
                <button className="btn w-full mt-2 bg-gray-400 text-gray-600 cursor-not-allowed" disabled={true}>
                  Submit Request
                </button>
                <div className="text-sm text-gray-500 mt-2 text-center">
                  <span>📝 This feature will be available in the next version</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`bg-base-200 shadow-lg flex flex-col items-center py-4 gap-4 transition-all duration-300 ${showActions ? 'w-24 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
          <div className="flex flex-col items-center">
            <button className="btn btn-circle btn-md bg-gray-400 text-gray-600 cursor-not-allowed" title="Approve" disabled={true}>
              <FaIcons.FaCheck />
            </button>
            <div className="text-xs text-gray-500 mt-1 text-center w-20">
              <span>Next version</span>
            </div>
          </div>
          <button className="btn btn-circle btn-md btn-info" title="Follow">
            <FaIcons.FaBell />
          </button>
          <div className="flex flex-col items-center">
            <button className="btn btn-circle btn-md bg-gray-400 text-gray-600 cursor-not-allowed" title="Upvote" disabled={true}>
              <FaIcons.FaThumbsUp />
            </button>
            <div className="text-xs text-gray-500 mt-1 text-center w-20">
              <span>Next version</span>
            </div>
          </div>
        </div>
      </div>

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
            <Comments reportId={report.id} reportType="offer_help" />
          </div>
        </div>
      </div>
    </div>
  )
}