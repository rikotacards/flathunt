import { Timestamp } from "firebase/firestore";

export interface IListing {
    agentId: string;
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
    rentBuy: 'buy' | 'rent'
    status?: 'live' | 'draft'
    dateAdded: Timestamp;
    //@desc 1, rental, 2, commercial, 3, eventspace
    propertyType: string; 
    realEstateCompany: string;
    licenseNumber?: string;
    listingSpecificContact?: string;
    listingSpecificRealEstateCompany?: string;
    otherFeatures?: string[]
}

export interface IFilters {

    minPrice?: number;
    maxPrice?: number;
    bedrooms?: string;
    bathrooms?: number;
    minNetArea?: number;
    maxNetArea?: number;
    location?: string;
    status?: 'live' | 'draft';
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