import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { getAllReports } from '../features/reports/feed/getAllReportsThunk'
import { nextOffset, clearFeed } from '../features/reports/feed/feedSlice'
import IssueReport from './reports/report-components/issueReport'
import HelpRequest from './reports/report-components/helpRequest'
import OfferHelp from './reports/report-components/offerHelp'
import GiveAway from './reports/report-components/giveAways'

export default function Feed() {
  const dispatch = useAppDispatch();
  const { feedItems, loading, error, pagination } = useAppSelector(state => state.feed);
  const { currentUser } = useAppSelector(state => state.user);
  const { filters } = useAppSelector(state => state.feed);
  const neighborhood = useAppSelector(state => state.user.neighborhood);
  const [title, setTitle] = useState('Local Area');

  useEffect(() => {
    if (currentUser) {
      if (feedItems.length > 0) {
        dispatch(clearFeed());
      }
      dispatch(getAllReports({ 
        offset: 0, 
        limit: 10, 
        neighborhood_id: currentUser.neighborhood_id,
        city: currentUser.city,
        loc: currentUser.location ? { lat: String(currentUser.location.lat), lng: String(currentUser.location.lng) } : undefined,
        filters
      }));
    }
  }, [dispatch, currentUser, filters]);

  useEffect(() => {
    const generateTitle = () => {
      let newTitle = 'Local Area';

      if (filters && currentUser) {
        if (filters.areaFilter === 'NBR') {
          if (neighborhood) {
            newTitle = neighborhood.nbr_name_en || neighborhood.nbr_name || 'Local Area';
          } else {
            newTitle = currentUser.city || 'Local Area';
          }
        } else if (filters.areaFilter === 'CITY') {
          newTitle = currentUser.city || 'Local Area';
        } else if (filters.areaFilter === 'COUNTRY') {
          newTitle = 'Israel';
        }
      }

      if (title !== newTitle) {
        setTitle(newTitle);
      }
    };

    generateTitle();
  }, [neighborhood, filters, currentUser])

  const handleLoadMore = () => {
    if (!loading && pagination.hasMore && currentUser) {
      dispatch(nextOffset());

      dispatch(getAllReports({ 
        offset: pagination.offset + pagination.limit, 
        limit: pagination.limit, 
        neighborhood_id: currentUser.neighborhood_id,
        city: currentUser.city,
        loc: currentUser.location ? { lat: String(currentUser.location.lat), lng: String(currentUser.location.lng) } : undefined,
        filters
      }));
      
    }
  };

  const renderReport = (report: { id: number; record_type: string; [key: string]: any }) => {
    const baseReport = {
      ...report,
      username: report.username || '',
      img_url: report.img_url || '',
      isAuthor: report.isAuthor || false,
      isFollowed: report.isFollowed || false,
      followers: report.followers || 0,
      user_id: report.user_id || 0,
      title: report.title || '',
      description: report.description || '',
      category: report.category || '',
      status: report.status || 'UNKNOWN',
      address: report.address || '',
      is_free: report.is_free || false,
      barter_options: report.barter_options || [],
      urgency: report.urgency || '',
      city: report.city || '',
      created_at: report.created_at || new Date().toISOString(),
    };

    switch (report.record_type) {
      case 'issue_report':
        return <IssueReport key={`issue-${report.id}`} report={baseReport} />;
      case 'help_request':
        return <HelpRequest key={`help-${report.id}`} report={baseReport} />;
      case 'offer_help':
        return <OfferHelp key={`offer-${report.id}`} report={baseReport} />;
      case 'give_away':
        return <GiveAway key={`give-${report.id}`} report={baseReport} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const savedFilters = localStorage.getItem('feedFilters');
    if (savedFilters) {
      dispatch({ type: 'feed/reloadFiltersFromLocalStorage' });
    }
  }, [dispatch]);

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