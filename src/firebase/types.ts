import { Timestamp } from "firebase/firestore";

export interface IListing {
    userId: string;
    address: string;
    netArea: number;
    price: number;
    images: string[]
    grossArea?: number;
    listingId: string;
    bedrooms: number;
    bathrooms: number;
    location: string;
    desc?: string;
    rentBuy: 'sale' | 'rent'
    status?: 'live' | 'draft'
    dateAdded: Timestamp;
    //@desc 1, rental, 2, commercial, 3, eventspace
    propertyType: string; 
    realEstateCompany: string;
    licenseNumber?: string;
    listingSpecificContact?: string;
    listingSpecificRealEstateCompany?: string;
    listingSpecificLicenseNumber?: string;
    otherFeatures?: string[]
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
    status?: 'live' | 'draft';
    hasBalcony?: boolean;
    hasRooftop?: boolean;
    hasGarden?: boolean;
    hasWalkup?: boolean;
    hasElevator?: boolean;
    hasPool?: boolean;
    hasParking?: boolean;
    hasGym?: boolean;
    hasClubhouse?: boolean;
    hasPetFriendly?: boolean;
    isDirectListing?: boolean;
    isAgencyListing?: boolean;
    hasHouse?: boolean;
    hasLuxury?: boolean;
}

export interface FiltersPopoverInterface {
    setFilter:  (value: React.SetStateAction<IFilters>) => void
    filters: IFilters;
    onClose: () => void;
}

export interface ILocation {
    name: string, 
    children?: {name: string}[]
}

export interface IRequest {
    sendingUserId: string,
    receivingUserId: string,
    listingId: string,
    message?: string,
    contactNumber: string,
    requestId?: string
}

export type IRequests = {[key: string]: IRequest[]}


export interface MoreUserInfo {
    contactNumber?: string;
    realEstateCompany?: string;
    licenseNumber?: string;
}
export interface FilterField {
    name: keyof IFilters, 
    label: string
}
export interface IAdditionalFeatures {
    outdoors: 
        FilterField[]
    ,
    building: FilterField[]
}