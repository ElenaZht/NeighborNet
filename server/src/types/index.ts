import { Request } from 'express';

export interface User {
  id?: number;
  user_id: number;
  username: string;
  email: string;
  password?: string;
  photo_url?: string;
  location?: {
    lat: number;
    lng: number;
  };
  city?: string;
  address?: string;
  neighborhood_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserSignUp {
  username: string;
  email: string;
  password: string;
  photo_url?: string;
  location?: {
    lat: number;
    lng: number;
  };
  city: string;
  address: string;
  neighborhood_id?: number;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface Neighborhood {
  neighborhood_id?: number;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  radius: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface Report {
  report_id?: number;
  user_id: number;
  neighborhood_id: number;
  title: string;
  description: string;
  photo_url?: string;
  category: string;
  status: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IssueReport extends Report {
  user_id: number;
  priority: 'low' | 'medium' | 'high';
}

export interface HelpRequest extends Report {
  urgency: 'low' | 'medium' | 'high';
}

export interface OfferHelp extends Report {
  availability: string;
}

export interface GiveAway extends Report {
  condition: string;
  pickup_location?: string;
}

export interface Comment {
  comment_id?: number;
  report_id: number;
  user_id: number;
  content: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Follower {
  follower_id?: number;
  user_id: number;
  followed_user_id: number;
  created_at?: Date;
}

export interface JwtPayload {
  user_id: number;
  username: string;
  email: string;
  city?: string;
  address?: string;
}

export interface AuthRequest extends Request {
  user?: {
    user_id: number; 
    username: string;
  };
  params: Record<string, string>;
  body: any;
  query: any;
}
