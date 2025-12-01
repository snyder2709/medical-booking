export interface DoctorsRequest {
  doctors: Doctor[];
  pagination: Pagination;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  experience: number;
  avatar: string;
  education: string;
  description: string;
  achievements: string[];
  price: number;
  todaySlots: TodaySlot[];
}

export interface TodaySlot {
  id: string;
  startTime: string;
  endTime: string;
}

export interface ReviewQuery {
  reviews: Review[];
  pagination: Pagination;
}

export interface UserBody {
  email: string;
  password: string;
}

export interface Schedule {
  id: string;
  startTime: string;
  endTime: string;
}

export interface Review {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Specialiti {
  id: string;
  name: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Query {
  page: number;
  specialty: string;
  search: string;
  minRating: number;
  sortBy: "price" | "experience" | "rating" | "name" | "date" | "rating";
  sortOrder: "asc" | "desc";
}

export interface UserResponce {
  success: boolean;
  token: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  registrationDate: string;
}

type ID = string;
type DoctorDetailPath = `/api/doctors/${ID}`;
type DoctorSchedulePath = `/api/doctors/${ID}/schedule`;
type DoctorReviewsPath = `/api/doctors/${ID}/reviews`;

declare module "#app" {
  interface NuxtApp {
    $apiTypes: {
      "/api/doctors": {
        response: DoctorsRequest;
        query: DoctorsQuery;
      };
      "/api/specialties": {
        response: Specialiti[];
      };
      "/api/auth/login": {
        body: UserBody;
        response: UserResponce;
      };
      "/api/auth/me": {
        response: User;
      };
      "/api/appointments": {
        success: boolean;
        message: string;
        body: FormData;
      };
      [key: DoctorDetailPath]: {
        response: Doctor;
      };
      [key: DoctorSchedulePath]: {
        response: SchedulesRequest;
      };
      [key: DoctorReviewsPath]: {
        response: ReviewsRequest;
        query: ReviewsQuery;
      };
    };
  }
}
