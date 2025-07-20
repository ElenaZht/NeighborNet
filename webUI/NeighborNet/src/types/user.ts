// User types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  location: {
    lat: string;
    lng: string;
  };
  city: string;
  neighborhood_id: number | null;
  profile_picture?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Neighborhood {
  id: number;
  name: string;
}

export interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  address: string;
  location: {
    lat: string;
    lng: string;
  };
  city: string;
  neighborhood_id: number | null;
  neighborhood: Neighborhood | null;
  neighborhoodLoading?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  location?: {
    lat: number;
    lng: number;
  };
  city?: string;
  neighborhood_id?: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
