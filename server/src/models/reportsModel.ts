import { db } from "../config/db.js";
import { categoryFilters, allOwnFollowed, CategoryFilter, AllOwnFollowed } from "../shared/filters.js";

interface Location {
    coordinates: [number, number];
}

interface ReportFilters {
    areaFilter: 'COUNTRY' | 'CITY' | 'NBR';
    categoryFilter: CategoryFilter[];
    allOwnFollowed?: AllOwnFollowed;
    order?: string;
}

interface QueryFilters {
    city?: string;
    neighborhood_id?: number;
    user_id?: number;
}

interface ReportResult {
    id: number;
    created_at: Date;
    user_id: number;
    username: string;
    img_url?: string;
    title: string;
    description: string;
    location: any; // PostGIS geography type
    address: string;
    upvotes?: number;
    followers?: number;
    verifies?: number;
    status: string;
    is_free?: boolean;
    swap_options?: string;
    barter_options?: string;
    category?: string;
    urgency?: string;
    neighborhood_id: number;
    city: string;
    record_type: 'issue_report' | 'give_away' | 'offer_help' | 'help_request';
    distance?: number;
    isAuthor: boolean;
    isFollowed: boolean;
}

export const getAllReportsFromDB = async (
    city: string,
    neighborhoodId: number | null,
    location: Location | null,
    limit: number,
    offset: number,
    filters: ReportFilters,
    userId: number | null = null
): Promise<ReportResult[]> => {

    const queryFilters: QueryFilters = {};
    switch (filters.areaFilter) {
        case 'COUNTRY':
            break;
        case 'CITY':
            queryFilters.city = city;
            break;
        case 'NBR':
            if (neighborhoodId) {
                queryFilters.neighborhood_id = neighborhoodId;
            } else {
                // Fallback to city filter if no neighborhood is available
                queryFilters.city = city;
            }
            break;
        default:
            throw new Error("Invalid area filter");
    }
    

    if (!filters.categoryFilter || filters.categoryFilter.length === 0) {
        throw new Error("At least one category filter must be selected");
    }

    // Validate allOwnFollowed filter
    if (filters.allOwnFollowed && !allOwnFollowed.includes(filters.allOwnFollowed)) {
        throw new Error("Invalid allOwnFollowed filter");
    }

    // Add allOwnFollowed filter to queryFilters
    if (filters.allOwnFollowed === allOwnFollowed[1] && userId) {
        queryFilters.user_id = userId;
    } 
    
    // Determine if we need distance calculation
    const orderByDistance = filters.order === 'DISTANCE';
    const userLocation = location ? `ST_Point(${location.coordinates[0]}, ${location.coordinates[1]})::GEOGRAPHY` : null;

    try {
        let allReportsQuery: any = null;

        for (const category of filters.categoryFilter) {
            if (!categoryFilters.includes(category)) {
                throw new Error(`Invalid category filter: ${category}`);
            }

            let categoryQuery: any = null;

            if (category === 'ISSUEREPORT') {
                categoryQuery = db
                .select(
                  'issue_reports.id', 'issue_reports.created_at', 'issue_reports.user_id', 'issue_reports.username', 'issue_reports.img_url', 'issue_reports.title', 'issue_reports.description',
                  'issue_reports.location', 'issue_reports.address', 'issue_reports.upvotes', 'issue_reports.followers', 'issue_reports.verifies',
                  'issue_reports.status', 
                  db.raw('NULL::boolean AS is_free'), db.raw('NULL::text AS swap_options'), 
                  db.raw('NULL::text AS barter_options'), db.raw('NULL::text AS category'),
                  db.raw('NULL::text AS urgency'), 'issue_reports.neighborhood_id', 'issue_reports.city',
                  db.raw("'issue_report' AS record_type"),
                  orderByDistance && userLocation ? 
                    db.raw(`ST_Distance(issue_reports.location, ${userLocation}) AS distance`) : 
                    db.raw('NULL::numeric AS distance'),
                  userId ? db.raw(`CASE WHEN issue_reports.user_id = ? THEN true ELSE false END AS "isAuthor"`, [userId]) : db.raw('false AS "isAuthor"'),
                  userId ? db.raw(`CASE WHEN f.user_id IS NOT NULL THEN true ELSE false END AS "isFollowed"`) : db.raw('false AS "isFollowed"')
                )
                .from('issue_reports')
                .leftJoin('followers as f', function() {
                    this.on('f.report_id', '=', 'issue_reports.id')
                        .andOn('f.report_type', '=', db.raw("'issue_report'"))
                        .andOn('f.user_id', '=', db.raw('?', [userId || -1]));
                })
                .where(queryFilters);

                if (filters.allOwnFollowed === 'FOLLOWED' && userId) {
                    categoryQuery = categoryQuery.whereNotNull('f.user_id');
                }
              }
            else if (category === 'GIVEAWAY') {
                categoryQuery = db
                    .select(
                      'give_aways.id', 'give_aways.created_at', 'give_aways.user_id', 'give_aways.username', 'give_aways.img_url', 'give_aways.title', 'give_aways.description',
                      'give_aways.location', 'give_aways.address', db.raw('NULL::integer AS upvotes'), db.raw('NULL::integer AS followers'), 
                      db.raw('NULL::integer AS verifies'), 'give_aways.status',
                      'give_aways.is_free', 'give_aways.swap_options',
                      db.raw('NULL::text AS barter_options'), db.raw('NULL::text AS category'),
                      db.raw('NULL::text AS urgency'), 'give_aways.neighborhood_id', 'give_aways.city',
                      db.raw("'give_away' AS record_type"),
                      orderByDistance && userLocation ? 
                        db.raw(`ST_Distance(give_aways.location, ${userLocation}) AS distance`) : 
                        db.raw('NULL::numeric AS distance'),
                      userId ? db.raw(`CASE WHEN give_aways.user_id = ? THEN true ELSE false END AS "isAuthor"`, [userId]) : db.raw('false AS "isAuthor"'),
                      userId ? db.raw(`CASE WHEN f.user_id IS NOT NULL THEN true ELSE false END AS "isFollowed"`) : db.raw('false AS "isFollowed"')
                    )
                  .from('give_aways')
                  .leftJoin('followers as f', function() {
                      this.on('f.report_id', '=', 'give_aways.id')
                          .andOn('f.report_type', '=', db.raw("'give_away'"))
                          .andOn('f.user_id', '=', db.raw('?', [userId || -1]));
                  })
                  .where(queryFilters);

                if (filters.allOwnFollowed === 'FOLLOWED' && userId) {
                    categoryQuery = categoryQuery.whereNotNull('f.user_id');
                }
            }
            else if (category === 'OFFERHELP') {
                categoryQuery = db
                    .select(
                      'offer_help.id', 'offer_help.created_at', 'offer_help.user_id', 'offer_help.username', 'offer_help.img_url', 'offer_help.title', 'offer_help.description',
                      'offer_help.location', 'offer_help.address', db.raw('NULL::integer AS upvotes'), 'offer_help.followers', 
                      db.raw('NULL::integer AS verifies'), 'offer_help.status', 
                      db.raw('NULL::boolean AS is_free'), 
                      db.raw('NULL::text AS swap_options'), 'offer_help.barter_options', db.raw('NULL::text AS category'),
                      db.raw('NULL::text AS urgency'), 'offer_help.neighborhood_id', 'offer_help.city',
                      db.raw("'offer_help' AS record_type"),
                      orderByDistance && userLocation ? 
                        db.raw(`ST_Distance(offer_help.location, ${userLocation}) AS distance`) : 
                        db.raw('NULL::numeric AS distance'),
                      userId ? db.raw(`CASE WHEN offer_help.user_id = ? THEN true ELSE false END AS "isAuthor"`, [userId]) : db.raw('false AS "isAuthor"'),
                      userId ? db.raw(`CASE WHEN f.user_id IS NOT NULL THEN true ELSE false END AS "isFollowed"`) : db.raw('false AS "isFollowed"')
                    )
                    .from('offer_help')
                    .leftJoin('followers as f', function() {
                        this.on('f.report_id', '=', 'offer_help.id')
                            .andOn('f.report_type', '=', db.raw("'offer_help'"))
                            .andOn('f.user_id', '=', db.raw('?', [userId || -1]));
                    })
                    .where(queryFilters);

                // Handle FOLLOWED filter separately
                if (filters.allOwnFollowed === 'FOLLOWED' && userId) {
                    categoryQuery = categoryQuery.whereNotNull('f.user_id');
                }
            }
            else if (category === 'HELPREQUEST') {
                categoryQuery = db
                    .select(
                      'help_requests.id', 'help_requests.created_at', 'help_requests.user_id', 'help_requests.username', 'help_requests.img_url', 'help_requests.title', 'help_requests.description',
                      'help_requests.location', 'help_requests.address', db.raw('NULL::integer AS upvotes'), 'help_requests.followers', 
                      db.raw('NULL::integer AS verifies'), 'help_requests.status', 
                      db.raw('NULL::boolean AS is_free'), 
                      db.raw('NULL::text AS swap_options'), db.raw('NULL::text AS barter_options'), 
                      'help_requests.category', 'help_requests.urgency', 'help_requests.neighborhood_id', 'help_requests.city',
                      db.raw("'help_request' AS record_type"),
                      orderByDistance && userLocation ? 
                        db.raw(`ST_Distance(help_requests.location, ${userLocation}) AS distance`) : 
                        db.raw('NULL::numeric AS distance'),
                      userId ? db.raw(`CASE WHEN help_requests.user_id = ? THEN true ELSE false END AS "isAuthor"`, [userId]) : db.raw('false AS "isAuthor"'),
                      userId ? db.raw(`CASE WHEN f.user_id IS NOT NULL THEN true ELSE false END AS "isFollowed"`) : db.raw('false AS "isFollowed"')
                    )
                    .from('help_requests')
                    .leftJoin('followers as f', function() {
                        this.on('f.report_id', '=', 'help_requests.id')
                            .andOn('f.report_type', '=', db.raw("'help_request'"))
                            .andOn('f.user_id', '=', db.raw('?', [userId || -1]));
                    })
                    .where(queryFilters);

                if (filters.allOwnFollowed === 'FOLLOWED' && userId) {
                    categoryQuery = categoryQuery.whereNotNull('f.user_id');
                }
            }

            // Build the union query
            if (allReportsQuery === null) {
                allReportsQuery = categoryQuery;
            } else {
                allReportsQuery = allReportsQuery.unionAll(categoryQuery);
            }
        }

        // Apply ordering based on the orderBy filter
        let orderedQuery = allReportsQuery;
        if (orderByDistance && userLocation) {
            orderedQuery = orderedQuery.orderBy('distance', 'asc');
        } else {
            orderedQuery = orderedQuery.orderBy('created_at', 'desc');
        }

        const allReports = await orderedQuery
            .limit(limit)
            .offset(offset);
        
        return allReports as ReportResult[];

    } catch (error: any) {
        console.error('Error fetching reports:', error);
        throw new Error('Failed to fetch reports: ' + error.message);
    }
};
