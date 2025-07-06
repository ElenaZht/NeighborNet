export const REPORT_TYPES = new Set([
  'give_away',
  'issue_report', 
  'help_request',
  'offer_help'
] as const);

export type ReportType = 'give_away' | 'issue_report' | 'help_request' | 'offer_help';

export const isValidReportType = (type: string): type is ReportType => {
  return REPORT_TYPES.has(type as ReportType);
};
