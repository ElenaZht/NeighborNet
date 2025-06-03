export const REPORT_TYPES = new Set([
  'give_away',
  'issue_report', 
  'help_request',
  'offer_help'
]);

export const isValidReportType = (type) => REPORT_TYPES.has(type);