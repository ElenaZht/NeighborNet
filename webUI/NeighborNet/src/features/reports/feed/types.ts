// Types for feed functionality

export interface FollowReportParams {
    reportType: string;
    reportId: string;
}

export interface UnfollowReportParams {
    reportType: string;
    reportId: string;
}

export interface GetAllReportsParams {
    offset?: number;
    limit?: number;
    neighborhood_id?: number | null;
    city?: string | null;
    loc?: { lat: string; lng: string } | null;
    filters?: {
        areaFilter?: string;
        categoryFilter?: string[];
        order?: string;
        allOwnFollowed?: string;
    };
}

export interface FeedItem {
    id: number;
    record_type: string;
    status?: string;
    isFollowed?: boolean;
    followers?: number;
    title?: string;
    description?: string;
    address?: string;
    city?: string;
    img_url?: string;
    datetime?: string;
    user_id?: number;
    username?: string;
    location?: {
        lat: string;
        lng: string;
    };
}

export interface Neighborhood {
    id: number;
    name: string;
}

export interface Filters {
    areaFilter: string;
    categoryFilter: string[];
    order: string;
    allOwnFollowed: string;
}

export interface Pagination {
    limit: number;
    offset: number;
    hasMore: boolean;
}

export interface FeedState {
    feedItems: FeedItem[];
    loading: boolean;
    error: string | null;
    status: string;
    neighborhood: Neighborhood | null;
    neighborhoodLoading: boolean;
    pagination: Pagination;
    filters: Filters;
}
