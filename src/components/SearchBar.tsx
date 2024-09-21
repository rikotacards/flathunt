import { HolidayVillageRounded, KeyboardArrowDown } from "@mui/icons-material";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import {
  Badge,
  Box,
  Chip,
  Drawer,
  IconButton,
  Typography,
  Zoom,
} from "@mui/material";
import React from "react";
import { LocationFilterNew2 } from "./LocationFilterNew2";
import { PriceFilterNew2 } from "./PriceFilterNew2";
import { useLocation, useNavigate } from "react-router";
import { useFilterContext } from "../Providers/contextHooks";
import { MoreFilter } from "./MoreFilters";
import { getRangeLabel } from "../utils/getRangeLabel";
import { IFilters } from "../firebase/types";
import { getBedroomsLabel } from "../utils/getBedroomsLabel";
import { FilterBedrooms } from "./FiltersBedrooms";
import { FiltersAll } from "./FiltersAll";
import { hasOtherFeatures } from "../utils/hasOtherFeatures";
interface SearchbarNarrow2Props {
  disableRedirect?: boolean;
}
export const SearchBar: React.FC<SearchbarNarrow2Props> = ({
  disableRedirect,
}) => {
  const urlLocation = useLocation();
  const nav = useNavigate();

  const { filters, setFilters } = useFilterContext();
  const [openMoreFilters, setOpenMoreFilters] = React.useState(false);

  const closeMore = () => {
    setOpenMoreFilters(false);
  };
  const isHomePage = urlLocation.pathname === "/";
  const isSearchResults = urlLocation.pathname === "/search-results";
  const isAgentListings = urlLocation.pathname === "/listings";
  const [isDrawerOpen, setDrawer] = React.useState(false);
  const [filterIndex, setFilterIndex] = React.useState(0);
  const onOpenDrawer = () => {
    setDrawer(true);
  };
  const onCloseDrawer = () => {
    setDrawer(false);
  };
  const onLocationClick = (location: string) => {
    setFilters((p) => ({ ...p, location }));
    onCloseDrawer();
    !disableRedirect && nav("/search-results");
  };
  const onFilterClick = (index: number) => {
    setFilterIndex(index);
    onOpenDrawer();
  };
  const [bedroomsRange, setBedroomsRange] = React.useState([0, 5]);

  const [priceRange, setPriceRange] = React.useState([5000, 90000]);
  const onPriceDone = () => {
    setFilters((p) => ({
      ...p,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    }));
    onCloseDrawer();
    !disableRedirect && nav("/search-results");
  };
  const onBedroomsDone = () => {
    setFilters((p) => ({
      ...p,
      minBedrooms: bedroomsRange[0],
      maxBedrooms: bedroomsRange[1],
    }));
    onCloseDrawer();
    !disableRedirect && nav("/search-results");
  };

  const priceLabel = getRangeLabel(filters.minPrice, filters.maxPrice, "HKD");
  const bedroomLabel = getBedroomsLabel(
    filters.minBedrooms,
    filters.maxBedrooms
  );
  const bedrooms = (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography
        fontWeight={500}
        // color="textSecondary"
        sx={{ textTransform: "capitalize" }}
        variant="body2"
      >
        {bedroomLabel || "Bedrooms"}
      </Typography>
    </Box>
  );
  const location = (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography
        fontWeight={filters.location? 'bold' : '500'}
        // color="textSecondary"
        sx={{ textTransform: "capitalize" }}
        variant="body2"
      >
        {filters.location || "Location"}
      </Typography>
    </Box>
  );
  const price = (
    <Box sx={{ display: "flex", alignItems: "center", ml: 0.5 }}>
      <Typography fontWeight={(filters.minPrice || filters.maxPrice) ? 'bold': '500'}
       color="textPrimary" variant="body2">
        {priceLabel}
      </Typography>
    </Box>
  );

  const hasFilters = hasOtherFeatures(filters);
  const searchPage = (
    <>
      <IconButton
        onClick={() => {
          setOpenMoreFilters(true);
        }}
      >
        <Badge color="secondary" variant="dot" invisible={!hasFilters}>
          <TuneRoundedIcon  />
        </Badge>
      </IconButton>

      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          pl: 0,
          pr: 2,
          borderRadius: 10,
        }}
      >
        <Zoom in={true}>
          <Chip
            onClick={() => onFilterClick(0)}
            sx={{ mr: 1,
            
         
             }}
            variant="filled"
            label={location}

          />
        </Zoom>
        <Zoom in>
          <Chip
            onClick={() => onFilterClick(1)}
            variant="filled"
            sx={{ mr: 1 }}
            label={price}
          />
        </Zoom>
        <Zoom in>
          <Chip
            onClick={() => onFilterClick(4)}
            variant="filled"
            sx={{ mr: 1 }}
            label={bedrooms}
          />
        </Zoom>
      </Box>
    </>
  );
  return (
    <Box sx={{ pb: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
        {(isHomePage || isSearchResults || isAgentListings) && searchPage}
      </Box>
      {
        <Drawer
          PaperProps={{
            style: {
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              display: "flex",
              width: "100%",
            },
          }}
          anchor={"bottom"}
          open={isDrawerOpen}
          onClose={onCloseDrawer}
        >
          <Box sx={{ m: 1 }}>
            {filterIndex === 0 && (
              <LocationFilterNew2
                onClick={onLocationClick}
                onClose={onCloseDrawer}
              />
            )}
            {filterIndex === 1 && (
              <PriceFilterNew2
                setPriceRange={setPriceRange}
                onCancel={onCloseDrawer}
                onClose={onPriceDone}
              />
            )}
            {filterIndex === 4 && (
              <FilterBedrooms
                setPriceRange={setBedroomsRange}
                onCancel={onCloseDrawer}
                onClose={onBedroomsDone}
              />
            )}
          </Box>
        </Drawer>
      }
      <Drawer
        anchor="bottom"
        open={openMoreFilters}
        onClose={closeMore}
        PaperProps={{
          style: {
            display: "flex",
            height: "100%",
          },
        }}
      >
        <FiltersAll onClose={closeMore} />
      </Drawer>
    </Box>
  );
};
