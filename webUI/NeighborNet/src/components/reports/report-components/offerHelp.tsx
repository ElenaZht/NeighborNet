import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import * as FaIcons from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import { Comments } from './comments'
import { removeOfferHelp } from '../../../features/reports/offerhelp/removeOfferHelpThunk'
import { updateOfferHelpStatus } from '../../../features/reports/offerhelp/updateOfferHelpStatusThunk'
import { clearFeed } from '../../../features/reports/feed/feedSlice';
import { getAllReports } from '../../../features/reports/feed/getAllReportsThunk';
import { followReport } from '../../../features/reports/feed/followThunk';
import { unfollowReport } from '../../../features/reports/feed/unfollowThunk';
import { format, parseISO } from 'date-fns'
import { ReportStatus, getStatusColorClass, ReportStatusType } from '../../../../../../reportsStatuses'
import placeholderImage from "../../../assets/offer_help_placeholder.jpg"
import EditOfferHelpForm from '../edit-forms/editOfferHelpForm';
import { refreshFeed } from '../../../features/reports/feed/refreshFeedThunk';
import { useBodyScrollLock } from '../../../utils/useBodyScrollLock'
import { OfferHelpProps } from './types';
import { RootState } from '../../../store/store';
import { reloadFiltersFromLocalStorage } from '../../../features/reports/feed/feedSlice';

export default function OfferHelp({ report }: OfferHelpProps) {
  const dispatch = useAppDispatch();
  const [showMap, setShowMap] = useState<boolean>(false);
  const [showActions, setShowActions] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  // This state will be used in a future version for the help request form
  const [showForm] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [isFollowLoading, setIsFollowLoading] = useState<boolean>(false);
  const [isUnfollowLoading, setIsUnfollowLoading] = useState<boolean>(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const currentUser = useAppSelector((state: RootState) => state.user.currentUser);
  const feedFilters = useAppSelector((state: RootState) => state.feed.filters);

  // Replace the useEffect with the custom hook
  useBodyScrollLock(showEditDialog);

  useEffect(() => {
    dispatch(reloadFiltersFromLocalStorage());
  }, [dispatch]);
  
  const toggleActionBar = () => {
    setShowActions(!showActions);
  };
  
  const toggleComments = () => {
    setShowComments(!showComments);
  };
    
  const toggleMap = () => {
    setShowMap(!showMap);
  };

  const handleEditOfferHelp = () => {
    setShowEditDialog(true);
    setShowActions(false); // Close action bar
  };

  const handleCancelEdit = () => {
    setShowEditDialog(false);
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    
    dispatch(refreshFeed());
  };

  const handleEditError = (error: string) => {
    console.error('Edit error:', error);
  };

  const handleStatusUpdate = async (newStatus: ReportStatusType) => {
    if (!currentUser || !report.isAuthor) {
      alert('You can only update status of your own reports');
      return;
    }

    setIsUpdatingStatus(true);
    try {
      await dispatch(updateOfferHelpStatus({
        reportId: report.id,
        newStatus: newStatus
      })).unwrap();

      
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteRequest = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(removeOfferHelp(report.id)).unwrap();
      
      dispatch(clearFeed());
      await dispatch(getAllReports({
        offset: 0,
        limit: 10,
        neighborhood_id: currentUser?.neighborhood_id,
        city: currentUser?.city,
        loc: currentUser?.location ? {
          lat: String(currentUser.location.lat),
          lng: String(currentUser.location.lng)
        } : undefined,
        filters: feedFilters
      }));
      
    } catch (error) {
      console.error('Failed to delete offer help:', error);
      alert('Failed to delete offer help. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleFollow = async () => {
    if (!currentUser) {
      alert('Please log in to follow reports');
      return;
    }

    setIsFollowLoading(true);
    try {
      await dispatch(followReport({
        reportType: 'offer_help',
        reportId: String(report.id)
      })).unwrap();
    } catch (error) {
      console.error('Failed to follow:', error);
      alert('Failed to follow report. Please try again.');
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (!currentUser) {
      alert('Please log in to unfollow reports');
      return;
    }

    setIsUnfollowLoading(true);
    try {
      await dispatch(unfollowReport({
        reportType: 'offer_help',
        reportId: String(report.id)
      })).unwrap();
    } catch (error) {
      console.error('Failed to unfollow:', error);
      alert('Failed to unfollow report. Please try again.');
    } finally {
      setIsUnfollowLoading(false);
    }
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
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    const imgElement = e.target as HTMLImageElement;
                    imgElement.onerror = null;
                    imgElement.src = placeholderImage;
                  }}
                />
              </figure>
              
              <div className="card-body w-3/5 p-4 text-left">
                <div className="flex justify-between items-start">
                  <h2 className="card-title text-left">Offer Help Report</h2>
                  <div className="flex items-center gap-2">
                    {/* Follow indicator - Eye icon */}
                    {report.isFollowed && (
                      <div className="flex items-center gap-1 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                        <FaIcons.FaEye className="text-sm" />
                        <span>Following</span>
                      </div>
                    )}
                    <div className={`${getStatusColorClass(report.status as ReportStatusType)} mt-1`}>
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
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(report.address || '')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
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
                    rows={3}
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

        {/* Action Sidebar */}
        <div className={`bg-base-200 shadow-lg flex flex-col items-center py-4 gap-4 transition-all duration-300 ${showActions ? 'w-24 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
          
          {/* Status Update Buttons (only for authors) */}
          {report.isAuthor && (
            <>
              <div className="divider text-xs text-gray-500 m-0">Status</div>
              
              <button 
                className={`btn btn-circle btn-sm ${
                  report.status === ReportStatus.ACTIVE ? 'bg-blue-600 text-white border-blue-600' : 'btn-outline border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                }`}
                title="Mark as Active"
                onClick={() => handleStatusUpdate(ReportStatus.ACTIVE)}
                disabled={isUpdatingStatus || report.status === ReportStatus.ACTIVE}
              >
                {isUpdatingStatus && report.status !== ReportStatus.ACTIVE ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <FaIcons.FaCheck />
                )}
              </button>

              <button 
                className={`btn btn-circle btn-sm ${
                  report.status === ReportStatus.IN_PROGRESS ? 'bg-purple-500 text-white border-purple-500' : 'btn-outline border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white'
                }`}
                title="Mark as In Progress"
                onClick={() => handleStatusUpdate(ReportStatus.IN_PROGRESS)}
                disabled={isUpdatingStatus || report.status === ReportStatus.IN_PROGRESS}
              >
                {isUpdatingStatus && report.status !== ReportStatus.IN_PROGRESS ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <FaIcons.FaClock />
                )}
              </button>

              <button 
                className={`btn btn-circle btn-sm ${
                  report.status === ReportStatus.CLOSED ? 'bg-gray-600 text-white border-gray-600' : 'btn-outline border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white'
                }`}
                title="Mark as Closed"
                onClick={() => handleStatusUpdate(ReportStatus.CLOSED)}
                disabled={isUpdatingStatus || report.status === ReportStatus.CLOSED}
              >
                {isUpdatingStatus && report.status !== ReportStatus.CLOSED ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <FaIcons.FaTimes />
                )}
              </button>

              <div className="divider text-xs text-gray-500 m-0">Actions</div>
            </>
          )}

          {/* Follow/Unfollow Buttons */}
          {!report.isFollowed ? (
            <button 
              className="btn btn-circle btn-md btn-info"
              title="Follow this report"
              onClick={handleFollow}
              disabled={isFollowLoading || !currentUser}
            >
              {isFollowLoading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <FaIcons.FaBell />
              )}
            </button>
          ) : (
            <button 
              className="btn btn-circle btn-md btn-warning"
              title="Unfollow this report"
              onClick={handleUnfollow}
              disabled={isUnfollowLoading || !currentUser}
            >
              {isUnfollowLoading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <FaIcons.FaBellSlash />
              )}
            </button>
          )}

          {/* Edit Button (only for authors) */}
          {report.isAuthor && (
            <button 
              className="btn btn-circle btn-md btn-secondary" 
              title="Edit"
              onClick={handleEditOfferHelp}
            >
              <FaIcons.FaEdit />
            </button>
          )}

          {/* Delete Button (only for authors) */}
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
            <Comments reportId={report.id} reportType="offer_help" isVisible={showComments} />
          </div>
        </div>
      </div>

      {/* Edit Dialog Modal */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Edit Offer Help</h3>
              <button 
                onClick={handleCancelEdit}
                className="btn btn-sm btn-circle"
              >
                <FaTimes />
              </button>
            </div>

            <EditOfferHelpForm 
              reportData={{
                id: String(report.id),
                title: report.title,
                description: report.description,
                img_url: report.img_url,
                address: report.address,
                city: report.city,
                location: report.location ? {
                  lat: String(report.location.lat),
                  lng: String(report.location.lng)
                } : undefined,
                barter_options: report.barter_options
              }}
              onSuccess={handleEditSuccess}
              onError={handleEditError}
            />

            <div className="flex justify-start mt-4">
              <button 
                onClick={handleCancelEdit}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Delete "{report.title}"?</h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete this offer help report? This action cannot be undone and all associated comments will also be removed.
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