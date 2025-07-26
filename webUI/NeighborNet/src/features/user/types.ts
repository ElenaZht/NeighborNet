// Type definitions for user-related operations

/**
 * User data structure
 */
export interface UserData {
    id: number;
    user_id?: number;
    userId?: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    address?: string;
    photo_url?: string;
    profile_picture?: string;
    location?: {
        lat: string | number;
        lng: string | number;
    };
    city?: string;
    neighborhood_id?: number | null;
    created_at?: string;
    updated_at?: string;
    [key: string]: any;
}

/**
 * Neighborhood data structure
 */
export interface Neighborhood {
    id: number;
    name: string;
    [key: string]: any;
}

/**
 * Authentication tokens
 */
export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
    email: string;
    password: string;
}

/**
 * Registration data
 */
export interface RegistrationData {
    username: string;
    email: string;
    password: string;
}

/**
 * Response for account deletion
 */
export interface DeleteAccountResponse {
    success: boolean;
    message: string;
}

/**
 * Edit user payload
 */
export interface EditUserPayload {
    userId: number | string;
    userData: Partial<UserData>;
}

/**
 * Response for user edit
 */
export interface EditUserResponse {
    editedUser: UserData;
    user?: UserData; 
    message?: string;
}

/**
 * Response for user logout
 */
export interface LogoutResponse {
    success: boolean;
    message: string;
}

/**
 * Response for token refresh
 */
export interface RefreshTokenResponse {
    accessToken: string;
    user_id: number;
    message?: string;
}

/**
 * User state for Redux store
 */
export interface UserState {
    currentUser: UserData | null;
    isAuthenticated: boolean;
    accessToken: string | null;
    loading: boolean;
    loginError: string | null;
    signupError: string | null;
    address: string;
    location: {
        lat: string | number;
        lng: string | number;
    };
    city: string;
    neighborhood_id: number | null;
    neighborhood: Neighborhood | null;
    neighborhoodLoading?: boolean;
}
