export interface Geolocation {
  lat: number;
  lon: number;
}

export interface Listing {
  type: "rent" | "sale";
  name: string;
  bedrooms: number;
  bathrooms: number;
  parking: boolean;
  furnished: boolean;
  location: string;
  offer: boolean;
  regularPrice: number;
  discountedPrice?: number;
  imgUrls: string[];
  geolocation: Geolocation;
  userRef: string;
  timestamp?: any;
}

export interface ListingWithId {
  id: string;
  data: Listing;
}

export interface ListingFormData {
  type: "rent" | "sale";
  name: string;
  bedrooms: number;
  bathrooms: number;
  parking: boolean;
  furnished: boolean;
  address: string;
  offer: boolean;
  regularPrice: number;
  discountedPrice: number;
  images: FileList | Record<string, never>;
  latitude: number;
  longitude: number;
  userRef?: string;
}

export interface Landlord {
  name: string;
  email: string;
  timestamp?: any;
}
