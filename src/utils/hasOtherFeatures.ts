import { features } from "../components/OtherFeatures";
import { IFilters } from "../firebase/types";

export const hasOtherFeatures = (filters: IFilters) => {
  const hasAreaFilter = !!filters.minNetArea || !!filters.maxNetArea;

  const hasFilters = [
    ...features.building.map((f) => filters[f.name]),
    ...features.outdoors.map((f) => filters[f.name]),
    ...features.indoors.map((f) => filters[f.name]),
  ];
  hasFilters.push(filters.isDirectListing);
  hasFilters.push(hasAreaFilter);

  return hasFilters.filter((x) => x == true).length > 0;
};
