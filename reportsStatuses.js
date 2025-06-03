export const ReportStatus = Object.freeze({
    // Creation statuses
    DRAFT: 'DRAFT',           // User started but hasn't submitted
    PENDING: 'PENDING',       // Submitted but awaiting approval/verification

    // Active statuses
    ACTIVE: 'ACTIVE',         // Approved and currently visible
    IN_PROGRESS: 'IN_PROGRESS', // Someone is working on it

    // Resolution statuses
    FULFILLED: 'FULFILLED',   // Need was met (for help requests, giveaways)
    RESOLVED: 'RESOLVED',     // Issue was fixed (for issue reports)

    // End statuses (future)
    CLOSED: 'CLOSED',         // Manually ended by creator
    EXPIRED: 'EXPIRED',       // Time-based expiration
    REJECTED: 'REJECTED',     // Didn't meet community guidelines
    ARCHIVED: 'ARCHIVED'      // Historical record
})

export const validateStatus = (status) => {
    return Object.values(ReportStatus).includes(status)
}
export const getStatusColorClass = (status) => {
  switch(status) {
    case ReportStatus.DRAFT: return 'bg-gray-200 text-gray-700 badge';
    case ReportStatus.PENDING: return 'bg-yellow-500 text-white badge';
    case ReportStatus.ACTIVE: return 'bg-blue-600 text-white badge';
    case ReportStatus.IN_PROGRESS: return 'bg-purple-500 text-white badge';
    case ReportStatus.FULFILLED: return 'bg-green-600 text-white badge';
    case ReportStatus.RESOLVED: return 'bg-green-600 text-white badge';
    case ReportStatus.CLOSED: return 'bg-gray-600 text-white badge';
    case ReportStatus.EXPIRED: return 'bg-orange-500 text-white badge';
    case ReportStatus.REJECTED: return 'bg-red-600 text-white badge';
    case ReportStatus.ARCHIVED: return 'bg-gray-400 text-white badge';
    default: return 'bg-gray-500 text-white badge';
  }
};
