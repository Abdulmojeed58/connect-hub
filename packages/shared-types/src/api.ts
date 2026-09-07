// ---------------------------------------------------------------------------
// API request and response shapes.
// Keeps frontend and backend in sync without sharing runtime code.
// ---------------------------------------------------------------------------

import type {
  Connection,
  FullProfile,
  Notification,
  Profile,
  User,
} from './models.js';

// --- Generic envelope ---

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  details?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// --- Auth ---

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends AuthTokens {
  user: User;
}

export interface MeResponse {
  user: User;
  profile: Profile;
}

// --- Profiles ---

export interface UpdateProfileRequest {
  fullName?: string;
  headline?: string;
  bio?: string;
  location?: string;
  photoUrl?: string;
}

export interface AddExperienceRequest {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export type UpdateExperienceRequest = AddExperienceRequest;

export interface AddEducationRequest {
  school: string;
  degree: string;
  field: string;
  year: number;
}

export type UpdateEducationRequest = AddEducationRequest;

// --- Users ---

export interface PaginatedUsersResponse {
  users: (User & { profile: Profile | null })[];
  total: number;
  page: number;
  limit: number;
}

// --- Connections ---

export interface ConnectionWithProfiles extends Connection {
  requester: User & { profile: Profile | null };
  addressee: User & { profile: Profile | null };
}

export interface ConnectionsListResponse {
  connections: ConnectionWithProfiles[];
}

export interface PendingRequestsResponse {
  requests: ConnectionWithProfiles[];
}

// --- Notifications ---

export interface NotificationsListResponse {
  notifications: Notification[];
}

// --- Profile ---

export type ProfileResponse = FullProfile;
