import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReports } from '../features/reports/feed/getAllReportsThunk';
import { setStoreFilters, resetOffset, clearFeed} from '../features/reports/feed/feedSlice'
import { areaFilters, categoryFilters, orderOptions } from '../../../../filters';


export default function FeedFilter() {
  const dispatch = useDispatch();
  const { filters: currentFilters, pagination, loading } = useSelector(state => state.feed);
  const currentUser = useSelector(state => state.user.currentUser) || null
  
  // Filter state
  const [filters, setFilters] = useState({
    areaFilter: currentFilters?.areaFilter || areaFilters[2],
    categoryFilter: currentFilters?.categoryFilter || [...categoryFilters],
    order: currentFilters?.order || orderOptions[0],
  });

  // Filter options to labels
  const areaFilterOptions = [
    { key: 'COUNTRY', label: 'Country' },
    { key: 'CITY', label: 'City' },
    { key: 'NBR', label: 'Neighborhood' }
  ];

  const categoryFilterOptions = [
    { key: 'GIVEAWAY', label: 'Give Away' },
    { key: 'ISSUEREPORT', label: 'Issue Report' },
    { key: 'OFFERHELP', label: 'Offer Help' },
    { key: 'HELPREQUEST', label: 'Help Request' }
  ];

  const orderFilterOptions = [
    { key: 'DATE', label: 'Date' },
    { key: 'DISTANCE', label: 'Distance' }
  ];

  // Handle area filter change
  const handleAreaFilterChange = (areaFilter) => {
    setFilters(prev => ({ ...prev, areaFilter }));
  };

  // Handle category filter toggle
  const handleCategoryToggle = (category) => {
    setFilters(prev => {
      const currentCategories = prev.categoryFilter;
      const isSelected = currentCategories.includes(category);
      
      if (isSelected) {
        return {
          ...prev,
          categoryFilter: currentCategories.filter(cat => cat !== category)
        };
      } else {
        return {
          ...prev,
          categoryFilter: [...currentCategories, category]
        };
      }
    });
  };

  // Handle order change
  const handleOrderChange = (order) => {
    setFilters(prev => ({ ...prev, order }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      areaFilter: areaFilters[2],
      categoryFilter: [...categoryFilters],
      order: orderOptions[0],
    });
  };

  // Apply filters
  const applyFilters = () => {
    const filterParams = {
      areaFilter: filters.areaFilter,
      categoryFilter: filters.categoryFilter,
      order: filters.order
    };

    if (currentUser) {
      dispatch(setStoreFilters(filterParams));
      dispatch(resetOffset())
      dispatch(clearFeed())
      dispatch(getAllReports({ 
                offset: 0, 
                limit: pagination.limit, 
                neighborhood_id: currentUser.neighborhood_id,
                city: currentUser.city,
                loc: currentUser.location,
                filters
            }));
    }
  
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
              left: `${(areaFilterOptions.findIndex(opt => opt.key === filters.areaFilter) * 100) / areaFilterOptions.length}%`
            }}
          />
          <div className="relative flex">
            {areaFilterOptions.map(option => (
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
      </div>

      {/* Category Filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
        <div className="space-y-1">
          {categoryFilterOptions.map(option => (
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
              left: `${(orderFilterOptions.findIndex(opt => opt.key === filters.order) * 100) / orderFilterOptions.length}%`
            }}
          />
          <div className="relative flex">
            {orderFilterOptions.map(option => (
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