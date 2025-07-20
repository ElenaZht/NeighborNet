// Common types for edit forms

export interface Location {
  lat: string;
  lng: string;
}

export interface AddressResult {
  address: string;
  city: string;
  location: { lat: number; lng: number };
}

// Edit Offer Help Form Types
export interface EditOfferHelpFormProps {
  reportData: {
    id: string;
    title?: string;
    description?: string;
    img_url?: string;
    address?: string;
    city?: string;
    location?: Location;
    barter_options?: string[];
  };
  onSuccess?: (updatedReport: any) => void;
  onError?: (errorMessage: string) => void;
}

export interface OfferHelpFormData {
  title: string;
  description: string;
  img_url: string;
  address: string;
  city: string;
  location: Location;
  barter_options: string[];
}

// Edit Give Away Form Types
export interface EditGiveAwayFormProps {
  reportData: {
    id: string;
    title?: string;
    description?: string;
    address?: string;
    img_url?: string;
    is_free?: boolean;
    swap_options?: string;
    city?: string;
    location?: Location;
  };
  onSuccess?: () => void;
  onError?: (errorMessage: string) => void;
}

export interface GiveAwayFormData {
  title: string;
  description: string;
  address: string;
  img_url: string;
  is_free: boolean;
  swap_options: string;
  city: string;
  location: Location;
}

export interface GiveAwayChangedFields {
  [key: string]: any;
}

// Edit Help Request Form Types
export interface EditHelpRequestFormProps {
  reportData: {
    id: string;
    title?: string;
    description?: string;
    address?: string;
    img_url?: string;
    category?: string;
    urgency?: string;
    city?: string;
    location?: Location;
  };
  onSuccess?: () => void;
  onError?: (errorMessage: string) => void;
}

export interface HelpRequestFormData {
  title: string;
  description: string;
  address: string;
  img_url: string;
  category: string;
  urgency: string;
  city: string;
  location: Location;
}

export interface HelpRequestChangedFields {
  [key: string]: any;
}

// Edit Issue Report Form Types
export interface EditIssueReportFormProps {
  reportData: {
    id: string;
    title?: string;
    description?: string;
    address?: string;
    img_url?: string;
    city?: string;
    location?: Location;
  };
  onSuccess?: () => void;
  onError?: (errorMessage: string) => void;
}

export interface IssueReportFormData {
  title: string;
  description: string;
  address: string;
  img_url: string;
  city: string;
  location: Location;
}

export interface EditIssueReportData {
  title?: string;
  description?: string;
  address?: string;
  img_url?: string;
  city?: string;
  location?: {
    lat: number;
    lng: number;
  };
}
