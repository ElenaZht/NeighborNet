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
    case ReportStatus.DRAFT: return 'badge-ghost';
    case ReportStatus.PENDING: return 'badge-warning';
    case ReportStatus.ACTIVE: return 'badge-primary';
    case ReportStatus.IN_PROGRESS: return 'badge-info';
    case ReportStatus.FULFILLED:
    case ReportStatus.RESOLVED: return 'badge-success';
    case ReportStatus.CLOSED: return 'badge-neutral';
    case ReportStatus.EXPIRED: return 'badge-secondary';
    case ReportStatus.REJECTED: return 'badge-error';
    case ReportStatus.ARCHIVED: return 'badge-outline';
    default: return 'badge-neutral';
  }
};
