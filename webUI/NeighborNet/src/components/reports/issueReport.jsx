import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as FaIcons from 'react-icons/fa';
import { Comments } from '../reports/comments'
import { format, parseISO } from 'date-fns'
import { ReportStatus, getStatusColorClass } from '../../../../../reportsStatuses.js'
import placeholderImage from "../../assets/issue_placeholder.jpg"
import { removeIssueReport } from '../../features/reports/issueReports/removeIssueReportThunk.js';
import { clearFeed } from '../../features/reports/feed/feedSlice.js';
import { getAllReports } from '../../features/reports/feed/getAllReportsThunk.js';

export default function IssueReport({ report }) {
  const dispatch = useDispatch()
  const [showMap, setShowMap] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const currentUser = useSelector(state => state.user.currentUser);
  const feedFilters = useSelector(state => state.feed.filters);

  const toggleActionBar = () => {
    setShowActions(!showActions);
  };
  
  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  const handleDeleteRequest = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(removeIssueReport(report.id)).unwrap();
      
      // Refresh the feed after successful deletion
      dispatch(clearFeed());
      await dispatch(getAllReports({
        offset: 0,
        limit: 10,
        neighborhood_id: currentUser?.neighborhood_id,
        city: currentUser?.city,
        loc: currentUser?.location,
        filters: feedFilters
      }));
      
    } catch (error) {
      console.error('Failed to delete issue report:', error);
      alert('Failed to delete issue report. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  if (!report) {
    return (
      <div className="alert alert-info max-w-4xl mx-auto m-4">
        <span>No issue report found. It might have been deleted or doesn't exist.</span>
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
              <h2 className="card-title text-left">Issue Report</h2>
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
              <p className="text-sm"><strong>Issue Description:</strong> {report.description}</p>
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
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <FaIcons.FaCheckCircle className="text-gray-400" />
                  <span className="text-gray-400">{report.verifies || 0} verified</span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  <span>Next version</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <FaIcons.FaBell className="text-info" />
                <span>{report.followers || 0} follows</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <FaIcons.FaThumbsUp className="text-gray-400" />
                  <span className="text-gray-400">{report.upvotes || 0} upvotes</span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  <span>Next version</span>
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
          {report.isAuthor && (
            <button 
              className="btn btn-circle btn-md btn-error" 
              title="Delete"
              onClick={handleDeleteRequest}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <FaIcons.FaTrash />
              )}
            </button>
          )}
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
            <Comments reportId={report.id} reportType="issue_report" />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Delete "{report.title}"?</h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete this issue report? This action cannot be undone and all associated comments will also be removed.
            </p>
            
            <div className="flex flex-row gap-3 sm:flex-row sm:justify-between">
              <button 
                onClick={handleCancelDelete}
                className="btn btn-outline flex-1 order-2 sm:order-1"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                className={`btn bg-red-600 text-white hover:bg-red-700 flex-1 order-1 sm:order-2 ${isDeleting ? 'loading' : ''}`}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}