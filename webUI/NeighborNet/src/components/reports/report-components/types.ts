import { HelpRequest as HelpRequestType } from '../../../features/reports/helpRequests/types';
import { GiveAwayReport as GiveAway } from '../../../features/reports/giveaways/types';
import { IssueReport } from '../../../features/reports/issueReports/types';
import { OfferHelp } from '../../../features/reports/offerhelp/types';

// Common types for report components
export interface BaseReportComponentProps {
  reportId: number;
  reportType: string;
  isVisible?: boolean;
}

// Help Request component props
export interface HelpRequestProps {
  report: HelpRequestType & {
    username?: string;
    img_url?: string;
    isAuthor?: boolean;
    isFollowed?: boolean;
    followers?: number;
    urgency?: string;
  };
}

// Give Away component props
export interface GiveAwayProps {
  report: GiveAway & {
    username?: string;
    img_url?: string;
    isAuthor?: boolean;
    isFollowed?: boolean;
    followers?: number;
  };
}

// Issue Report component props
export interface IssueReportProps {
  report: IssueReport & {
    username?: string;
    img_url?: string;
    isAuthor?: boolean;
    isFollowed?: boolean;
    followers?: number;
  };
}

// Offer Help component props
export interface OfferHelpProps {
  report: OfferHelp & {
    username?: string;
    img_url?: string;
    isAuthor?: boolean;
    isFollowed?: boolean;
    followers?: number;
    barter_options?: string[];
  };
}

// Comment type
export interface Comment {
  id: number;
  content: string;
  username: string;
  datetime: string;
  img_url?: string;
  user_id: number;
}

// Comments component props
export interface CommentsProps {
  reportId: number;
  reportType: string;
  isVisible?: boolean;
}
