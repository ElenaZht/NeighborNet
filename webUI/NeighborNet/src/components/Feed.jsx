import React, { useEffect, useState } from 'react';
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
    filters,
    neighborhood,
    neighborhoodLoading
  } = useSelector(state => state.feed);
  const currentUser = useSelector(state => state.user.currentUser) || null
  const [title, setTitle] = useState('')
  useEffect(() => {
    if (currentUser) {

      dispatch(getAllReports({ 
          offset: 0, 
          limit: pagination.limit, 
          neighborhood_id: currentUser.neighborhood_id,
          city: currentUser.city,
          loc: currentUser.location,
          filters
      }));
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    const generateTitile = async() => {
      if (neighborhood && filters.areaFilter == 'NBR'){
        setTitle(neighborhood.nbr_name_en)
        return
      }
      if(!neighborhood && filters.areaFilter == 'NBR' || neighborhood && filters.areaFilter == 'CITY'){
        setTitle(currentUser.city)
        return
      }
      if (filters.areaFilter == 'COUNTRY'){
        setTitle('Israel')
        return
      }
    }

    generateTitile()
  }, [neighborhood, filters])

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



  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold">Feed</h1>
        {title && !neighborhoodLoading && <h2 className="text-2xl font-semibold mt-2">for: {title}</h2>}
      </div>

      {/* Reports List */}
      <div className="space-y-6 max-w-2xl mx-auto">
        {feedItems.length === 0 ? (
          <div className="alert alert-info mx-auto max-w-2xl">
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