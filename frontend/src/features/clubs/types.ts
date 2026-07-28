export interface Course {
  id: string;
  name: string;
  description: string;
  courseNumber: number;
  holesCount: number;
  date: string;
  price: number;
  image: string;
  availableTimes: string[];
}

export interface Club {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string | null;
  email: string | null;
  description: string | null;
  logoURL: string | null;
  coverURL: string | null;
  ddNSNumber: number;
  ddEWNumber: number;
  status: string;
  ownerId: string;
}

export interface SearchFilters {
  city: string;
  date: string;
  timeFrom: string;
  timeTo: string;
  players: number;
}

export interface CreateClub {
  name: string;
  address: string;
  city: string;
  ddNSNumber: number;
  ddEWNumber: number;
  ownerId: string
}

export interface UpdateClub {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  description: string;
  logoURL: string;
  coverURL: string;
  galleryURL: string;
  ddNSNumber: string;
  ddEWNumber: string;
}