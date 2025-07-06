export const areaFilters = ['COUNTRY', 'CITY', 'NBR'] as const;
export const categoryFilters = ['GIVEAWAY', 'OFFERHELP', 'HELPREQUEST', 'ISSUEREPORT'] as const;
export const orderOptions = ['DATE', 'DISTANCE'] as const;
export const allOwnFollowed = ['ALL', 'OWN', 'FOLLOWED'] as const;

export type AreaFilter = typeof areaFilters[number];
export type CategoryFilter = typeof categoryFilters[number];
export type OrderOption = typeof orderOptions[number];
export type AllOwnFollowed = typeof allOwnFollowed[number];
