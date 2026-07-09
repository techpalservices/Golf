export interface Course {
  id: string;
  name: string;
  location: string;
  description: string;
  courseNumber: number;
  holesCount: number;
  date: string;
  price: number;
  image: string;
  availableTimes: string[];
}

export interface SearchFilters {
  city: string;
  date: string;
  timeFrom: string;
  timeTo: string;
  players: number;
}