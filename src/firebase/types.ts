import { Timestamp } from "firebase/firestore";

export interface IListing {
  userId: string;
  address: string;
  netArea: number;
  price: number;
  images: string[];
  grossArea?: number;
  listingId: string;
  bedrooms: number;
  bathrooms: number;
  location: string;
  desc?: string;
  rentBuy: "sale" | "rent";
  status?: "live" | "draft";
  dateAdded: Timestamp;
  //@desc 1, rental, 2, commercial, 3, eventspace
  propertyType: "commercial" | "residential";
  realEstateCompany: string;
  licenseNumber?: string;
  listingSpecificContact?: string;
  listingSpecificRealEstateCompany?: string;
  listingSpecificLicenseNumber?: string;
  personalLicenseNumber?: string;
  listingSpecificPersonalLicenseNumber?: string;
  otherFeatures?: string[];
  hasWalkup?: boolean;
  hasRooftop?: boolean;
  hasBalcony?: boolean;
  hasPetFriendly?: boolean;
  hasGarden: boolean;
  hasElevator?: boolean;
  hasGym?: boolean;
  isSaved?: boolean;
  savedDocId?: string;
  isDirectListing?: boolean;
  hasPool?: boolean;
  hasParking?: boolean;
  hasClubhouse?: boolean;
  hasOven?: boolean;
  hasBathtub?: boolean;
  hasOceanView?: boolean;
  hasSecurity?: boolean;
  imageUrls?: string[]
}

export interface IFilters {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: string;
  minBedrooms?: number;
  maxBedrooms?: number;
  bathrooms?: number;
  minNetArea?: number;
  maxNetArea?: number;
  location?: string;
  status?: "live" | "draft";
  hasWalkup?: boolean;
  hasRooftop?: boolean;
  hasBalcony?: boolean;
  hasPetFriendly?: boolean;
  hasGarden: boolean;
  hasElevator?: boolean;
  hasGym?: boolean;
  isDirectListing?: boolean;
  hasPool?: boolean;
  hasParking?: boolean;
  hasClubhouse?: boolean;
  hasOven?: boolean;
  hasBathtub?: boolean;
  hasOceanView?: boolean;
  hasSecurity?: boolean;
}

export interface FiltersPopoverInterface {
  setFilter: (value: React.SetStateAction<IFilters>) => void;
  filters: IFilters;
  onClose: () => void;
}

export interface ILocation {
  name: string;
  children?: { name: string }[];
}

export interface IRequest {
  sendingUserId: string;
  receivingUserId: string;
  listingId: string;
  message?: string;
  contactNumber: string;
  requestId?: string;
}

export type IRequests = { [key: string]: IRequest[] };

export interface MoreUserInfo {
  contactNumber?: string;
  realEstateCompany?: string;
  licenseNumber?: string;
}
export interface FilterField {
  name: keyof IFilters;
  label: string;
}
export interface IAdditionalFeatures {
  outdoors: {
    name: keyof IFilters;
    label: string;
    icon?: React.ReactNode;
    value?: string;
  }[];
  indoors: {
    name: keyof IFilters;
    label: string;
    icon?: React.ReactNode;
    value?: string;
  }[];
  building: {
    name: keyof IFilters;
    label: string;
    icon?: React.ReactNode;
    value?: string;
  }[];
}
