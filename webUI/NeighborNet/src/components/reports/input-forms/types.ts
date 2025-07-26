// Common types for input forms

export interface Location {
  lat: string;
  lng: string;
}

export interface AddressResult {
  address: string;
  city: string;
  location: { lat: number; lng: number };
}

// Give Away Input Form Types
export interface GiveAwayInputFormData {
  title: string;
  description: string;
  address: string;
  img_url: string;
  is_free: boolean;
  swap_options: string;
  city: string;
  location: Location;
}

// Help Request Input Form Types
export interface HelpRequestInputFormData {
  title: string;
  description: string;
  address: string;
  img_url: string;
  category: string;
  urgency: string;
  city: string;
  location: Location;
}

// Issue Report Input Form Types
export interface IssueReportInputFormData {
  title: string;
  description: string;
  address: string;
  img_url: string;
  city: string;
  location: Location;
}

// Offer Help Input Form Types
export interface OfferHelpInputFormData {
  title: string;
  description: string;
  address: string;
  img_url: string;
  city: string;
  location: Location;
  barter_options: string[];
}
