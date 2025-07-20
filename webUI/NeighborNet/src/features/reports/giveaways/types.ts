// Types for give-away report features

// Type for report IDs
export type GiveAwayId = string;

export interface GiveAwayLocation {
  lat: number | string;
  lng: number | string;
}

export interface GiveAwayData {
  title: string;
  description: string;
  address: string;
  img_url: string;
  is_free: boolean;
  swap_options: string;
  city: string;
  location: GiveAwayLocation;
}

// For edits, we only need to send fields that have changed
export type EditGiveAwayData = Partial<GiveAwayData>;

export interface EditGiveAwayParams {
  reportId: string;
  giveAwayData: EditGiveAwayData;
}

export type AddGiveAwayData = GiveAwayData;

export interface UpdateGiveAwayStatusParams {
  reportId: string;
  newStatus: string;
}

export interface GiveAwayReport {
  id: number;
  title: string;
  description: string;
  address: string;
  img_url?: string;
  is_free: boolean;
  swap_options?: string;
  city: string;
  username: string;
  created_at: string;
  status: string;
  isAuthor: boolean;
  isFollowed: boolean;
  followers?: number;
  location?: GiveAwayLocation;
}

export interface GiveAwayResponse {
  giveAway: GiveAwayReport;
  message?: string;
}

export interface UpdateGiveAwayStatusResponse {
  reportId: string;
  newStatus: string;
  updatedReport: GiveAwayReport;
}
