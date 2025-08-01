import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReports } from '../features/reports/feed/getAllReportsThunk';
import { clearFeed, setStoreFilters, resetOffset } from '../features/reports/feed/feedSlice';
import { areaFilters, categoryFilters, orderOptions, allOwnFollowed } from '../../../../filters';
import type { RootState } from '../store/store';
import type { GetAllReportsParams } from '../features/reports/feed/types';

export default function FeedFilter() {
  const dispatch = useDispatch();
  const { filters: currentFilters, pagination, loading } = useSelector((state: RootState) => state.feed);
  const currentUser = useSelector((state: RootState) => state.user.currentUser) || null;

  const hasNeighborhood = currentUser?.neighborhood_id;

  const [filters, setFilters] = useState(() => {
    // Initialize with current store filters or defaults
    return {
      areaFilter: currentFilters?.areaFilter || (hasNeighborhood ? areaFilters[2] : areaFilters[1]),
      categoryFilter: currentFilters?.categoryFilter || [...categoryFilters],
      order: currentFilters?.order || orderOptions[0],
      allOwnFollowed: currentFilters?.allOwnFollowed || allOwnFollowed[0],
    };
  });

  // Sync local state with store filters when they change
  useEffect(() => {
    if (currentFilters) {
      setFilters({
        areaFilter: currentFilters.areaFilter || (hasNeighborhood ? areaFilters[2] : areaFilters[1]),
        categoryFilter: currentFilters.categoryFilter || [...categoryFilters],
        order: currentFilters.order || orderOptions[0],
        allOwnFollowed: currentFilters.allOwnFollowed || allOwnFollowed[0],
      });
    }
  }, [currentFilters, hasNeighborhood]);

  const areaFilterOptions = hasNeighborhood
    ? [
        { key: 'COUNTRY', label: 'Country' },
        { key: 'CITY', label: 'City' },
        { key: 'NBR', label: 'Neighborhood' },
      ]
    : [
        { key: 'COUNTRY', label: 'Country' },
        { key: 'CITY', label: 'City' },
      ];

  const categoryFilterOptions = [
    { key: 'GIVEAWAY', label: 'Give Away' },
    { key: 'ISSUEREPORT', label: 'Issue Report' },
    { key: 'OFFERHELP', label: 'Offer Help' },
    { key: 'HELPREQUEST', label: 'Help Request' },
  ];

  const orderFilterOptions = [
    { key: 'DATE', label: 'Date' },
    { key: 'DISTANCE', label: 'Distance' },
  ];

  const allOwnFollowedOptions = [
    { key: 'ALL', label: 'All Reports' },
    { key: 'OWN', label: 'My Reports' },
    { key: 'FOLLOWED', label: 'Followed Reports' },
  ];

  const handleAreaFilterChange = (areaFilter: string) => {
    // Prevent selecting NBR if user has no neighborhood
    if (areaFilter === 'NBR' && !hasNeighborhood) {
      return;
    }
    setFilters((prevFilters) => ({ ...prevFilters, areaFilter }));
  };

  const handleCategoryToggle = (category: string) => {
    setFilters((prevFilters) => {
      const currentCategories = prevFilters.categoryFilter;
      return {
        ...prevFilters,
        categoryFilter: currentCategories.includes(category)
          ? currentCategories.filter((cat) => cat !== category)
          : [...currentCategories, category],
      };
    });
  };

  // Handle order change
  const handleOrderChange = (order: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, order }));
  };

  // Handle allOwnFollowed filter change
  const handleAllOwnFollowedChange = (allOwnFollowed: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, allOwnFollowed }));
  };

  // Clear all filters
  const clearFilters = () => {
    const defaultFilters = {
      areaFilter: hasNeighborhood ? areaFilters[2] : areaFilters[1], // Default to CITY if no neighborhood
      categoryFilter: [...categoryFilters],
      order: orderOptions[0],
      allOwnFollowed: allOwnFollowed[0],
    };
    
    setFilters(defaultFilters);
    
    // Also update the store with the cleared filters
    dispatch(setStoreFilters(defaultFilters));
  };

  // Apply filters
  const applyFilters = () => {
    // First, persist the filters to the store and localStorage
    dispatch(setStoreFilters(filters));
    
    // Clear the current feed and reset pagination
    dispatch(clearFeed());
    dispatch(resetOffset());
    
    const params: GetAllReportsParams = {
      offset: 0,
      limit: pagination.limit,
      neighborhood_id: currentUser?.neighborhood_id || null,
      city: currentUser?.city || null,
      loc: currentUser?.location
        ? { lat: String(currentUser.location.lat), lng: String(currentUser.location.lng) }
        : null,
      filters,
    };
    dispatch(getAllReports(params) as unknown as any);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
      </div>

      {/* Area Filter - Slider Style */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Area</h3>
        <div className="relative bg-gray-100 rounded-lg p-1">
          <div
            className="absolute top-1 bottom-1 bg-blue-500 rounded-md transition-all duration-200 ease-in-out"
            style={{
              width: `${100 / areaFilterOptions.length}%`,
              left: `${(areaFilterOptions.findIndex((opt) => opt.key === filters.areaFilter) * 100) / areaFilterOptions.length}%`,
            }}
          />
          <div className="relative flex">
            {areaFilterOptions.map((option) => (
              <button
                key={option.key}
                className={`flex-1 py-2 px-2 text-xs font-medium rounded-md transition-colors duration-200 relative z-10 ${
                  filters.areaFilter === option.key
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => handleAreaFilterChange(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        {!hasNeighborhood && (
          <p className="text-xs text-gray-500 mt-1">
            Neighborhood filter unavailable - your location is in a small area without defined neighborhoods
          </p>
        )}
      </div>

      {/* Show/Own/Followed Filter - Only show if user is logged in */}
      {currentUser && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Show</h3>
          <div className="relative bg-gray-100 rounded-lg p-1">
            <div
              className="absolute top-1 bottom-1 bg-green-500 rounded-md transition-all duration-200 ease-in-out"
              style={{
                width: `${100 / allOwnFollowedOptions.length}%`,
                left: `${(allOwnFollowedOptions.findIndex((opt) => opt.key === filters.allOwnFollowed) * 100) / allOwnFollowedOptions.length}%`,
              }}
            />
            <div className="relative flex">
              {allOwnFollowedOptions.map((option) => (
                <button
                  key={option.key}
                  className={`flex-1 py-2 px-1 text-xs font-medium rounded-md transition-colors duration-200 relative z-10 ${
                    filters.allOwnFollowed === option.key
                      ? 'text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => handleAllOwnFollowedChange(option.key)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
        <div className="space-y-1">
          {categoryFilterOptions.map((option) => (
            <button
              key={option.key}
              className={`w-full py-1.5 px-2 text-xs font-medium rounded-md border transition-colors duration-200 text-left ${
                filters.categoryFilter.includes(option.key)
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-blue-200 hover:border-blue-300'
              }`}
              onClick={() => handleCategoryToggle(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Order Filter - Slider Style */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Order By</h3>
        <div className="relative bg-gray-100 rounded-lg p-1">
          <div
            className="absolute top-1 bottom-1 bg-blue-500 rounded-md transition-all duration-200 ease-in-out"
            style={{
              width: `${100 / orderFilterOptions.length}%`,
              left: `${(orderFilterOptions.findIndex((opt) => opt.key === filters.order) * 100) / orderFilterOptions.length}%`,
            }}
          />
          <div className="relative flex">
            {orderFilterOptions.map((option) => (
              <button
                key={option.key}
                className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors duration-200 relative z-10 ${
                  filters.order === option.key
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => handleOrderChange(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4">
        <button
          className="flex-1 py-2 px-3 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          onClick={clearFilters}
          disabled={loading}
        >
          Clear All
        </button>
        <button
          className="flex-1 py-2 px-3 text-sm font-medium text-white bg-green-500 border border-green-500 rounded-lg hover:bg-green-600 transition-colors duration-200 disabled:opacity-50"
          onClick={applyFilters}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Apply'}
        </button>
      </div>
    </div>
  );
}