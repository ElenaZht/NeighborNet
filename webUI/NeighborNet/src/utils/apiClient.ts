import { refreshToken } from '../features/user/thunks/refreshTokenThunk';
import { Store, QueueItem, RequestOptions } from '../types/api';

let storeRef: Store | null = null;

export const setStoreRef = (store: Store): void => {
    storeRef = store;
};

// Track if already refreshing to prevent multiple refresh requests
let isRefreshing = false;
let failedRequestsQueue: QueueItem[] = [];

export const apiClient = async (url: string, options: RequestOptions = {}): Promise<any> => {
  // access token
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const requestConfig: RequestInit = {
    ...options,
    headers,
    credentials: 'include' as RequestCredentials, // include cookies
  };

  try {
    const response = await fetch(url, requestConfig);

    if (response.ok) {
      return await response.json();
    }

    // If 401 Unauthorized, try to refresh the token
    if (response.status === 401) {
      let newToken: string;

      // If not already refreshing, start the refresh process
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshResult = await storeRef!.dispatch(refreshToken()).unwrap();
          newToken = refreshResult.accessToken;

          // Process all queued requests with new token
          failedRequestsQueue.forEach(request => request.resolve(newToken));
          failedRequestsQueue = [];

        } catch (error) {
          // If refresh fails, reject all
          failedRequestsQueue.forEach(request => request.reject(error));
          failedRequestsQueue = [];
          throw error;

        } finally {
          isRefreshing = false;
        }
      } else {
        // If already refreshing, queue this request
        newToken = await new Promise<string>((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        });
      }

      // retry the original request
      const retryConfig: RequestInit = {
        ...requestConfig,
        headers: {
          ...requestConfig.headers,
          'Authorization': `Bearer ${newToken}`
        }
      };

      const retryResponse = await fetch(url, retryConfig);
      
      if (!retryResponse.ok) {
        // If still fails, parse error and throw
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
            status: response.status,
            message: parseError instanceof Error ? parseError.message : 'Unknown error'
        });
      throw {
        status: response.status,
        message: parseError instanceof Error ? parseError.message : 'Unknown error'
      };
    }

  } catch (error) {
    throw error;
  }
};

// Convenience methods for common HTTP methods
export const get = (url: string, options: RequestOptions = {}) => apiClient(url, { ...options, method: 'GET' });
export const post = (url: string, data: any, options: RequestOptions = {}) => apiClient(url, { 
  ...options, 
  method: 'POST', 
  body: JSON.stringify(data) 
});
export const patch = (url: string, data: any, options: RequestOptions = {}) => apiClient(url, { 
  ...options, 
  method: 'PATCH', 
  body: JSON.stringify(data) 
});
export const del = (url: string, options: RequestOptions = {}) => apiClient(url, { ...options, method: 'DELETE' });