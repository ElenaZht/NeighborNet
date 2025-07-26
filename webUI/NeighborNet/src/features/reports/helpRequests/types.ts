// Type definitions for help requests

/**
 * Help request data structure
 */
export interface HelpRequest {
    id: number;
    user_id: number;
    title: string;
    description: string;
    category: string;
    status: string;
    created_at?: string;
    updated_at?: string;
    address?: string;
    location?: {
        lat: number;
        lng: number;
    };
    photo_url?: string;
    [key: string]: any; // For additional properties
}

/**
 * Help request creation payload
 */
export interface CreateHelpRequestPayload {
    title: string;
    description: string;
    category: string;
    address?: string;
    location?: {
        lat: number;
        lng: number;
    };
    photo_url?: string;
    [key: string]: any; // For additional properties
}

/**
 * Help request update payload
 */
export interface UpdateHelpRequestPayload {
    id: number;
    title?: string;
    description?: string;
    category?: string;
    status?: string;
    address?: string;
    location?: {
        lat: number;
        lng: number;
    };
    photo_url?: string;
    [key: string]: any; // For additional properties
}

/**
 * Help request API response
 */
export interface HelpRequestResponse {
    helpRequest: HelpRequest;
    message?: string;
}

/**
 * Status update payload
 */
export interface UpdateStatusPayload {
    reportId: number;
    newStatus: string;
}

/**
 * Status update response
 */
export interface UpdateStatusResponse {
    reportId: number;
    newStatus: string;
    updatedReport: HelpRequest;
}

/**
 * Help requests state for Redux store
 */
export interface HelpRequestsState {
    helpRequests: HelpRequest[];
    loading: boolean;
    error: string | null;
}
