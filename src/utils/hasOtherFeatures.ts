import { IFilters } from "../firebase/types";

export const hasOtherFeatures = (filters: IFilters) => {
  const hasOutdoorsFilter =
    filters.hasBalcony || filters.hasGarden || filters.hasRooftop;
  const hasAreaFilter = !!filters.minNetArea || !!filters.maxNetArea;
  const hasBuildingFilter =
    filters.hasPool ||
    filters.hasWalkup ||
    filters.hasElevator ||
    filters.hasParking ||
    filters.hasGym ||
    filters.hasClubhouse ||
    filters.hasPetfriendly;
  const hasFilters = hasOutdoorsFilter || hasAreaFilter || hasBuildingFilter;
  return hasFilters;
};
