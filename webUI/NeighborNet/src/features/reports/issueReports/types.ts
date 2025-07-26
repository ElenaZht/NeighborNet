// Type definitions for issue reports

/**
 * Issue report data structure
 */
export interface IssueReport {
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
 * Issue report creation payload
 */
export interface CreateIssueReportPayload {
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
 * Issue report update payload
 */
export interface UpdateIssueReportPayload {
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
 * Issue report API response
 */
export interface IssueReportResponse {
    report: IssueReport;
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
    updatedReport: IssueReport;
}

/**
 * Issue reports state for Redux store
 */
export interface IssueReportsState {
    reports: IssueReport[];
    loading: boolean;
    error: string | null;
}
