// Type definitions for offer help

/**
 * Offer help data structure
 */
export interface OfferHelp {
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
 * Offer help creation payload
 */
export interface CreateOfferHelpPayload {
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
 * Offer help update payload
 */
export interface UpdateOfferHelpPayload {
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
 * Interface for the edit offer help arguments
 */
export interface EditOfferHelpArg {
    reportId: number;
    offerHelpData: Partial<UpdateOfferHelpPayload>;
}

/**
 * Interface for the edit offer help response
 */
export interface EditOfferHelpResponse {
    reportId: number;
    updatedReport: OfferHelp;
}

/**
 * Offer help API response
 */
export interface OfferHelpResponse {
    offerHelp: OfferHelp;
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
    updatedReport: OfferHelp;
}

/**
 * Offer help state for Redux store
 */
export interface OfferHelpState {
    offerHelp: OfferHelp[];
    loading: boolean;
    error: string | null;
}
