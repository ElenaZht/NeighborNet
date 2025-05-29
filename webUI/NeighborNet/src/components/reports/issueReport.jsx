import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as FaIcons from 'react-icons/fa';
import { Comments } from '../reports/comments'
import { getIssueReport } from '../../features/reports/issueReports/getIssueReportThunk'
import { format, parseISO } from 'date-fns'
import { ReportStatus, getStatusColorClass } from '../../../../../reportsStatuses.js'
import placeholderImage from "../../assets/issue_placeholder.jpg"

export default function IssueReport({ reportId }) {
  const dispatch = useDispatch()
  const { currentIssueReport, loading, error } = useSelector(state => state.issueReports)
  const [showMap, setShowMap] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (reportId) {
      dispatch(getIssueReport(reportId))
    }
  }, [dispatch, reportId])

  const toggleActionBar = () => {
    setShowActions(!showActions);
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

  if (!currentIssueReport) {
    return (
      <div className="alert alert-info max-w-4xl mx-auto m-4">
        <span>No issue report found. It might have been deleted or doesn't exist.</span>
      </div>
    )
  }

  const formattedDate = currentIssueReport.created_at 
    ? format(parseISO(currentIssueReport.created_at), 'MMM d, yyyy')
    : 'Unknown date'

  return (
    <div className="relative max-w-4xl mx-auto m-4">
      <div className="flex">
        <div className="card card-side bg-base-100 shadow-xl w-[800px]">
          <figure className="w-2/5">
            <img 
              src={currentIssueReport.img_url || placeholderImage} 
              alt={currentIssueReport.title || "Issue report"} 
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
                {currentIssueReport.status || 'No status'}
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
              <span>Submitted by: {currentIssueReport.username}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FaIcons.FaCalendarAlt className="text-primary min-w-4" />
              <span>Date: {formattedDate}</span>
            </div>
            
            <div className="mt-1 space-y-1">
              <p className="text-sm"><strong>Title:</strong> {currentIssueReport.title}</p>
              <p className="text-sm"><strong>Issue Description:</strong> {currentIssueReport.description}</p>
            </div>
            
            <div onClick={toggleMap} className="flex items-center gap-2 mt-2 text-sm bg-base-200 p-1.5 rounded-lg">
              <FaIcons.FaMapMarkerAlt className="text-error min-w-4" />
              <span className="font-semibold">Location:</span>
              <span>{currentIssueReport.address}</span>
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
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(currentIssueReport.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <FaIcons.FaCheckCircle className="text-success" />
                <span>{currentIssueReport.verifies || 0} verified</span>
              </div>
              <div className="flex items-center gap-1">
                <FaIcons.FaBell className="text-info" />
                <span>{currentIssueReport.followers || 0} follows</span>
              </div>
              <div className="flex items-center gap-1">
                <FaIcons.FaThumbsUp className="text-primary" />
                <span>{currentIssueReport.upvotes || 0} upvotes</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`bg-base-200 shadow-lg flex flex-col items-center py-4 gap-4 transition-all duration-300 ${showActions ? 'w-24 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
          <button className="btn btn-circle btn-md btn-success" title="Approve">
            <FaIcons.FaCheck />
          </button>
          <button className="btn btn-circle btn-md btn-info" title="Follow">
            <FaIcons.FaBell />
          </button>
          <button className="btn btn-circle btn-md btn-primary" title="Upvote">
            <FaIcons.FaThumbsUp />
          </button>
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
            <Comments reportId={reportId} reportType="issue_report" />
          </div>
        </div>
      </div>
    </div>
  )
}