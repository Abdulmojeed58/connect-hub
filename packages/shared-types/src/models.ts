// ---------------------------------------------------------------------------
// Core domain models — mirror the Prisma schema exactly.
// No runtime code; safe to copy into the mobile repo as-is.
// ---------------------------------------------------------------------------

export type ConnectionStatus = 'pending' | 'accepted' | 'declined';

export type NotificationType =
  | 'CONNECTION_REQUEST'
  | 'CONNECTION_ACCEPTED'
  | 'CONNECTION_DECLINED';

export interface User {
  id: string;
  email: string;
  createdAt: string; // ISO-8601
}

export interface Profile {
  id: string;
  fullName: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  photoUrl: string | null;
  isPremium: boolean;
}

export interface Experience {
  id: string;
  profileId: string;
  company: string;
  title: string;
  startDate: string; // ISO-8601 date string
  endDate: string | null;
  description: string | null;
}

export interface Education {
  id: string;
  profileId: string;
  school: string;
  degree: string;
  field: string;
  year: number;
}

export interface Connection {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: ConnectionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
}

/** Profile with nested experience, education, and the owning user. */
export interface FullProfile extends Profile {
  user: User;
  experiences: Experience[];
  educations: Education[];
}
