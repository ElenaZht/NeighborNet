import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReports } from '../features/reports/feed/getAllReportsThunk';
import IssueReport from './reports/issueReport';
import HelpRequest from './reports/helpRequest';
import OfferHelp from './reports/offerHelp';
import GiveAway from './reports/giveAways';
import { nextOffset } from '../features/reports/feed/feedSlice';


export default function Feed() {
  const dispatch = useDispatch();
  const { 
    feedItems, 
    loading, 
    error, 
    pagination, 
    filters 
  } = useSelector(state => state.feed);

  const currentUser = useSelector(state => state.user.currentUser) || null

    useEffect(() => {
      if (currentUser) {
              console.log("Loading more reports with filters", filters)

            dispatch(getAllReports({ 
                offset: 0, 
                limit: pagination.limit, 
                neighborhood_id: currentUser.neighborhood_id,
                city: currentUser.city,
                loc: currentUser.location,
                filters
            }));
      }
    }, [currentUser]);

  const handleLoadMore = () => {
    if (!loading && pagination.hasMore && currentUser) {
      dispatch(nextOffset())
      dispatch(getAllReports({ 
        offset: pagination.offset+pagination.limit, 
        limit: pagination.limit, 
        neighborhood_id: currentUser.neighborhood_id,
        city: currentUser.city,
        loc: currentUser.location,
        filters
      }));
      
    }
  };

  // Render individual report based on type
  const renderReport = (report) => {
    switch (report.record_type) {
      case 'issue_report':
        return <IssueReport key={`issue-${report.id}`} report={report} />;
      case 'help_request':
        return <HelpRequest key={`help-${report.id}`} report={report} />;
      case 'offer_help':
        return <OfferHelp key={`offer-${report.id}`} report={report} />;
      case 'give_away':
        return <GiveAway key={`give-${report.id}`} report={report} />;
      default:
        return null;
    }
  };

  if (loading && feedItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
        <span className="ml-2">Loading reports...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-4xl mx-auto m-4">
        <span>Error loading reports: {error}</span>
        <button 
          className="btn btn-sm btn-outline"
          onClick={() => {
            if (currentUser) {
              handleLoadMore()
            }
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // Generate feed title based on filters
  const getFeedTitle = () => {
    if (currentUser?.city && currentUser?.neighborhood_id) {
      return `Feed for ${currentUser.neighborhood_id}, ${currentUser.city}`;
    } else if (currentUser?.city) {
      return `Feed for ${currentUser.city}`;
    } else if (currentUser?.neighborhood_id) {
      return `Feed for ${currentUser.neighborhood_id}`;
    }
    return 'All Reports';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {getFeedTitle()}
        </h1>
      </div>

      {/* Reports List */}
      <div className="space-y-6">
        {feedItems.length === 0 ? (
          <div className="alert alert-info">
            <span>No reports found for this area.</span>
          </div>
        ) : (
          feedItems.map(renderReport)
        )}
      </div>

      {/* Load More Button */}
      {pagination.hasMore && feedItems.length > 0 && (
        <div className="flex justify-center mt-8 mb-4">
          <button 
            className={`btn btn-primary btn-lg ${loading ? 'loading' : ''}`}
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading More...' : 'Load More Reports'}
          </button>
        </div>
      )}

      {/* End of feed indicator */}
      {!pagination.hasMore && feedItems.length > 0 && (
        <div className="text-center mt-8 mb-4 p-4 text-gray-500">
          <span>You've reached the end of the feed</span>
        </div>
      )}
    </div>
  );
}