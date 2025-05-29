import { getReport } from "../models/modelsUtils.js";

export const isAccountOwner = (req, res, next) => {
    // req.user is populated by the authenticate middleware
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    const requestedUserId = req.params.user_id;
    const authenticatedUserId = req.user.id;

    // Check if authenticated user matches the requested user ID
    if (authenticatedUserId != requestedUserId) {
        return res.status(403).json({ 
            message: 'Forbidden: You can only perform this action on your own account' 
        });
    }

    next();
};

export const isReportOwner = async (req, res, next) => {
    // req.user is populated by the authenticate middleware
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    const requestedReportId = req.params.reportId
    const authenticatedUserId = req.user.id

    const report = await getReport(requestedReportId)
    if (report){
        if (report.user_id == authenticatedUserId){
            return next()
        } else {
            return res.status(403).json({ 
            message: 'Forbidden: You can only perform this action on your own report' 
            });
        }
    } else {
        return res.status(404).json({ message: 'Report not found' });
    }
    
}