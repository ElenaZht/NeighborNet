import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { getComments } from '../../features/reports/comments/getCommentsThunk';
import { addComment } from '../../features/reports/comments/addCommentThunk';
import { setCurrentReport } from '../../features/reports/comments/commentsSlice';
import placeholderAvatar from '../../assets/Profile_avatar_placeholder_large.png';


export const Comments = ({ reportId, reportType = 'give_away' }) => {
  const [newComment, setNewComment] = useState('');
  const dispatch = useDispatch();
  
  const { comments, loading, error } = useSelector(state => state.comments);
  const currentUser = useSelector(state => state.user.currentUser);

  // Set current report and fetch comments when component mounts or reportId changes
  useEffect(() => {
    if (reportId && reportType) {
      // Set the current report in Redux store
      dispatch(setCurrentReport({ reportId, reportType }));
      
      // Fetch comments for this report
      dispatch(getComments({ reportId, reportType }));
    }
  }, [dispatch, reportId, reportType]);

  // Handle submitting a new comment
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await dispatch(addComment({
        reportId,
        reportType,
        content: newComment
      })).unwrap();
      
      // Clear the input after successful submission
      setNewComment('');
      
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="w-full mt-6">
              {/* Add comment form - only show if user is logged in */}
      {currentUser ? (
        <form onSubmit={handleSubmitComment} className="space-y-2">
          <textarea
            className="textarea textarea-bordered w-full min-h-[80px]"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <div className="flex justify-end">
            <button 
              type="submit" 
              className="btn btn-primary btn-sm"
              disabled={!newComment.trim() || loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="alert alert-info">
          <span>Please log in to add comments.</span>
        </div>
      )}
      <h2 className="text-xl font-medium mb-4">Comments</h2>

      {/* Error message */}
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-4 mb-6">
        {comments.length === 0 && !loading ? (
          <p className="text-sm text-gray-500">
            No comments yet. Be the first to comment!
          </p>
        ) : loading ? (
          <div className="flex justify-center p-4">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="card bg-base-100 shadow-sm">
              <div className="card-body p-4">
                <div className="flex items-start gap-3">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full">
                      <img 
                        src={comment.img_url || placeholderAvatar} 
                        alt={comment.username} 
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm">{comment.username}</span>
                      <span className="text-xs text-gray-500">
                        {}
                      </span>
                    </div>
                    <p className="text-sm text-left">{comment.content}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};