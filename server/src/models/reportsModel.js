import { db } from "../config/db.js";
import { categoryFilters } from "../../../filters.js";


export const getAllReportsFromDB = async (city, neighborhoodId, location, limit, offset, filters) => {

    const queryFilters = {};
    switch (filters.areaFilter) {
        case 'COUNTRY':
            break;
        case 'CITY':
            queryFilters.city = city;
            break;
        case 'NBR':
            queryFilters.neighborhood_id = neighborhoodId;
            break;
        default:
            throw new Error("Invalid area filter");
    }

    if (!filters.categoryFilter || filters.categoryFilter.length === 0) {
        throw new Error("At least one category filter must be selected");
    }

    // Determine if we need distance calculation
    const orderByDistance = filters.order === 'DISTANCE';
    const userLocation = location ? `ST_Point(${location.coordinates[0]}, ${location.coordinates[1]})::GEOGRAPHY` : null;

    try {
        let allReportsQuery = null;

        for (const category of filters.categoryFilter) {
            if (!categoryFilters.includes(category)) {
                throw new Error(`Invalid category filter: ${category}`);
            }

            let categoryQuery = null;

            if (category === 'ISSUEREPORT') {
                categoryQuery = db
                .select(
                  'id', 'created_at', 'userid', 'username', 'img_url', 'title', 'description',
                  'location', 'address', 'upvotes', 'followers', 'verifies',
                  db.raw('NULL::boolean AS is_free'), db.raw('NULL::text AS swap_options'), 
                  db.raw('NULL::text AS barter_options'), db.raw('NULL::text AS category'),
                  db.raw('NULL::text AS urgency'), 'neighborhood_id', 'city',
                  db.raw("'issue_report' AS record_type"),
                  orderByDistance && userLocation ? 
                    db.raw(`ST_Distance(location, ${userLocation}) AS distance`) : 
                    db.raw('NULL::numeric AS distance')
                )
                .from('issue_reports')
                .where(queryFilters);
              }
            else if (category === 'GIVEAWAY') {
                categoryQuery = db
                    .select(
                      'id', 'created_at', 'userid', 'username', 'img_url', 'title', 'description',
                      'location', 'address', db.raw('NULL::integer AS upvotes'), db.raw('NULL::integer AS followers'), 
                      db.raw('NULL::integer AS verifies'), 'is_free', 'swap_options',
                      db.raw('NULL::text AS barter_options'), db.raw('NULL::text AS category'),
                      db.raw('NULL::text AS urgency'), 'neighborhood_id', 'city',
                      db.raw("'give_away' AS record_type"),
                      orderByDistance && userLocation ? 
                        db.raw(`ST_Distance(location, ${userLocation}) AS distance`) : 
                        db.raw('NULL::numeric AS distance')
                    )
                  .from('give_aways')
                  .where(queryFilters);
            }
            else if (category === 'OFFERHELP') {
                categoryQuery = db
                    .select(
                      'id', 'created_at', 'userid', 'username', 'img_url', 'title', 'description',
                      'location', 'address', db.raw('NULL::integer AS upvotes'), 'followers', 
                      db.raw('NULL::integer AS verifies'), db.raw('NULL::boolean AS is_free'), 
                      db.raw('NULL::text AS swap_options'), 'barter_options', db.raw('NULL::text AS category'),
                      db.raw('NULL::text AS urgency'), 'neighborhood_id', 'city',
                      db.raw("'offer_help' AS record_type"),
                      orderByDistance && userLocation ? 
                        db.raw(`ST_Distance(location, ${userLocation}) AS distance`) : 
                        db.raw('NULL::numeric AS distance')
                    )
                    .from('offer_help')
                    .where(queryFilters);
            }
            else if (category === 'HELPREQUEST') {
                categoryQuery = db
                    .select(
                      'id', 'created_at', 'userid', 'username', 'img_url', 'title', 'description',
                      'location', 'address', db.raw('NULL::integer AS upvotes'), 'followers', 
                      db.raw('NULL::integer AS verifies'), db.raw('NULL::boolean AS is_free'), 
                      db.raw('NULL::text AS swap_options'), db.raw('NULL::text AS barter_options'), 
                      'category', 'urgency', 'neighborhood_id', 'city',
                      db.raw("'help_request' AS record_type"),
                      orderByDistance && userLocation ? 
                        db.raw(`ST_Distance(location, ${userLocation}) AS distance`) : 
                        db.raw('NULL::numeric AS distance')
                    )
                    .from('help_requests')
                    .where(queryFilters);
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

        // Apply limit and offset
        const allReports = await orderedQuery
            .limit(limit)
            .offset(offset);
        
        return allReports;

    } catch (error) {
        console.error('Error fetching reports:', error);
        throw new Error('Failed to fetch reports: ' + error.message);
    }
}