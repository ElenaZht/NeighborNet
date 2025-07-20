import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getComments } from '../../../features/reports/comments/getCommentsThunk';
import { addComment } from '../../../features/reports/comments/addCommentThunk';
import placeholderAvatar from '../../../assets/Profile_avatar_placeholder_large.png';
import { CommentsProps, Comment } from './types';
import { RootState } from '../../../store/store';

export const Comments = ({ reportId, reportType, isVisible }: CommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingComment, setAddingComment] = useState(false);
  const [hasLoadedComments, setHasLoadedComments] = useState(false);
  
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state: RootState) => state.user.currentUser);

  // Fetch comments only when section becomes visible and hasn't been loaded yet
  useEffect(() => {
    if (isVisible && !hasLoadedComments && reportId && reportType) {
      fetchCommentsForReport();
    }
  }, [isVisible, hasLoadedComments, reportId, reportType]);

  const fetchCommentsForReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await dispatch(getComments({ reportType, reportId })).unwrap();
      setComments(result || []);
      setHasLoadedComments(true); // Mark as loaded
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments');
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    setAddingComment(true);
    setError(null);

    try {
      const result = await dispatch(addComment({
        reportId,
        reportType,
        content: newComment
      })).unwrap();
      
      // Add the new comment to the beginning of the list
      setComments(prevComments => [result.comment, ...prevComments]);
      setNewComment('');
      
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment');
    } finally {
      setAddingComment(false);
    }
  };

  return (
    <div className="w-full mt-6">
      {currentUser ? (
        <form onSubmit={handleSubmitComment} className="space-y-2">
          <textarea
            className="textarea textarea-bordered w-full min-h-[80px]"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={addingComment}
          ></textarea>
          <div className="flex justify-end">
            <button 
              type="submit" 
              className="btn btn-primary btn-sm"
              disabled={!newComment.trim() || addingComment}
            >
              {addingComment ? (
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
        {loading ? (
          <div className="flex justify-center p-4">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : !hasLoadedComments ? (
          <p className="text-sm text-gray-500">
            Comments will load when expanded...
          </p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-500">
            No comments yet. Be the first to comment!
          </p>
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
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          const imgElement = e.target as HTMLImageElement;
                          imgElement.onerror = null;
                          imgElement.src = placeholderAvatar;
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm">{comment.username}</span>
                      <span className="text-xs text-gray-500">
                        {comment.datetime ? new Date(comment.datetime).toLocaleDateString() : ''}
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