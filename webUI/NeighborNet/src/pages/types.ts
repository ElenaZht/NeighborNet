import { UserData } from "../features/user/types";

/**
 * Account page form data interface
 */
export interface AccountFormData {
    username: string;
    email: string;
    address?: string;
    photo_url?: string;
    password: string;
    location: {
        lat: string | number;
        lng: string | number;
    };
    city: string;
}

/**
 * Address result from Google Maps autocomplete
 */
export interface AddressResult {
    address: string;
    city: string;
    location: { 
        lat: number; 
        lng: number 
    };
}

/**
 * Extended user interface for account page
 * Combines all possible user fields that might be used in the AccountPage
 */
export interface ExtendedUser extends UserData {
    profile_picture?: string;
    photo_url?: string;
    user_id?: number;
    userId?: number;
}
