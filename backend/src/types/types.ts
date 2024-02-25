export interface IUser {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface IImage {
  publicId: string;
  imageUrl: string;
}

export interface IHotel {
  _id: string;
  userId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  starRating: number;
  bookings: Array<IBook>;
  imgs: Array<IImage>;
}

export interface IBook {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: Date;
  checkOut: Date;
  totalCost: number;
  status: "pending" | "approved" | "cancelled";
}

export interface IHotelQueryOptions {
  name?: string;
  city?: string;
  country?: string;
  type?: string;
  adultCount?: number;
  childCount?: number;
  starRating?: number;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
  facilities?: string[];
  minPrice?: number;
  maxPrice?: number;
}
