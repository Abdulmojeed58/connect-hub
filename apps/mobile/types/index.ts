export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  fullName: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  photoUrl: string | null;
  isPremium: boolean;
  user: User;
  experiences: Experience[];
  educations: Education[];
}

export interface Experience {
  id: string;
  profileId: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
  createdAt: string;
}

export interface Education {
  id: string;
  profileId: string;
  school: string;
  degree: string;
  field: string;
  year: number;
  createdAt: string;
}

export type ConnectionStatus = 'pending' | 'accepted' | 'declined';

export interface PublicUser {
  id: string;
  email: string;
  createdAt: string;
  profile: {
    id: string;
    fullName: string;
    headline: string | null;
    bio: string | null;
    location: string | null;
    photoUrl: string | null;
    isPremium: boolean;
  } | null;
}

export interface Connection {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: ConnectionStatus;
  createdAt: string;
  updatedAt: string;
  requester: PublicUser;
  addressee: PublicUser;
}

export type NotificationType =
  | 'CONNECTION_REQUEST'
  | 'CONNECTION_ACCEPTED'
  | 'CONNECTION_DECLINED';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PaginatedUsers {
  users: PublicUser[];
  total: number;
  page: number;
  limit: number;
}
