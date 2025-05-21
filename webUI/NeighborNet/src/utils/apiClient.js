import { refreshToken } from '../features/user/thunks/refreshTokenThunk';
let storeRef = null;
export const setStoreRef = (store) => {
    storeRef = store;
  };


// Track if we're already refreshing to prevent multiple refresh requests
let isRefreshing = false;
let failedRequestsQueue = [];

export const apiClient = async (url, options = {}) => {
  // Get access token
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const requestConfig = {
    ...options,
    headers,
    credentials: 'include', // include cookies
  };

  try {
    const response = await fetch(url, requestConfig);

    if (response.ok) {
      return await response.json();
    }

    // If we get a 401 Unauthorized, try to refresh the token
    if (response.status === 401) {
      let newToken;

      // If we're not already refreshing, start the refresh process
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshResult = await storeRef.dispatch(refreshToken()).unwrap();
          newToken = refreshResult.accessToken;

          // Process all queued requests with new token
          failedRequestsQueue.forEach(request => request.resolve(newToken));
          failedRequestsQueue = [];

        } catch (error) {
          // If refresh fails, reject all queued requests
          failedRequestsQueue.forEach(request => request.reject(error));
          failedRequestsQueue = [];
          throw error;

        } finally {
          isRefreshing = false;
        }
      } else {
        // If we're already refreshing, queue this request
        newToken = await new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        });
      }

      // retry the original request
      const retryConfig = {
        ...requestConfig,
        headers: {
          ...requestConfig.headers,
          'Authorization': `Bearer ${newToken}`
        }
      };

      const retryResponse = await fetch(url, retryConfig);
      
      if (!retryResponse.ok) {
        // If retry still fails, parse error and throw
        const errorData = await retryResponse.json();
        throw {
          status: retryResponse.status,
          message: errorData.message || 'Request failed after token refresh'
        };
      }
      
      return await retryResponse.json();
    }

    // For other errors, parse and throw
    try {
      const errorData = await response.json();
      console.error('API Error:', {
        url,
        status: response.status,
        data: errorData
      });
      throw {
        status: response.status,
        message: errorData.message || `Request failed with status ${response.status}`
      };
    } catch (parseError) {
        console.error('API Error (could not parse response):', {
            url,
            status: response.status
        });
      throw {
        status: response.status,
        message: `Request failed with status ${response.status}`
      };
    }

  } catch (error) {
    throw error;
  }
};

// Convenience methods for common HTTP methods
export const get = (url, options = {}) => apiClient(url, { ...options, method: 'GET' });
export const post = (url, data, options = {}) => apiClient(url, { 
  ...options, 
  method: 'POST', 
  body: JSON.stringify(data) 
});
export const patch = (url, data, options = {}) => apiClient(url, { 
  ...options, 
  method: 'PATCH', 
  body: JSON.stringify(data) 
});
export const del = (url, options = {}) => apiClient(url, { ...options, method: 'DELETE' });