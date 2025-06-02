import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllReports } from '../features/reports/feed/getAllReportsThunk.js'
import { nextOffset, clearFeed } from '../features/reports/feed/feedSlice.js'
import IssueReport from './reports/issueReport.jsx'
import HelpRequest from './reports/helpRequest.jsx'
import OfferHelp from './reports/offerHelp.jsx'
import GiveAway from './reports/giveAways.jsx'

export default function Feed() {
  const dispatch = useDispatch()
  const { feedItems, loading, error, pagination } = useSelector(state => state.feed)
  const { currentUser } = useSelector(state => state.user)
  const { filters } = useSelector(state => state.feed)
  const neighborhood = useSelector(state => state.user.neighborhood)
  const [title, setTitle] = useState('')

  useEffect(() => {
    if (currentUser && feedItems.length === 0) {
      dispatch(getAllReports({ 
        offset: 0, 
        limit: 10, 
        neighborhood_id: currentUser.neighborhood_id,
        city: currentUser.city,
        loc: currentUser.location,
        filters
      }));
    }
  }, [dispatch, currentUser, filters, feedItems.length]);

  useEffect(() => {
    const generateTitile = () => {
      if (!filters) return
      
      if (filters.areaFilter == 'NEIGHBORHOOD' && neighborhood){
        setTitle(neighborhood.name)
        return
      }
      if (filters.areaFilter == 'CITY' && currentUser){
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

  const refreshFeed = () => {
    if (currentUser) {
      dispatch(clearFeed());
      dispatch(getAllReports({ 
        offset: 0, 
        limit: 10, 
        neighborhood_id: currentUser.neighborhood_id,
        city: currentUser.city,
        loc: currentUser.location,
        filters
      }));
    }
  };

  // Expose refresh function globally for input forms
  useEffect(() => {
    window.refreshFeed = refreshFeed;
    return () => {
      delete window.refreshFeed;
    };
  }, [currentUser, filters]);

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

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please log in to view the feed</h2>
          <p className="text-gray-600">You need to be logged in to see community reports</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Community Feed</h1>
        <p className="text-gray-600 mt-2">Latest updates from {title}</p>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Feed Items */}
      <div className="space-y-6">
        {feedItems.map(renderReport)}
      </div>

      {/* Load More Button */}
      {pagination.hasMore && (
        <div className="flex justify-center mt-8">
          <button 
            onClick={handleLoadMore}
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* No items message */}
      {feedItems.length === 0 && !loading && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No reports yet</h3>
          <p className="text-gray-500">Be the first to share something with your community!</p>
        </div>
      )}
    </div>
  );
}