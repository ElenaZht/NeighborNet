// API related types
export interface ApiError {
  status: number;
  message: string;
}

export interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

// Store reference type
export interface Store {
  dispatch: (action: any) => any;
  getState: () => any;
}

// Queue item for retry requests
export interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}
