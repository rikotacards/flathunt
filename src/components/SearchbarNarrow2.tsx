import {

  HolidayVillageRounded,
  KeyboardArrowDown,
} from "@mui/icons-material";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import {

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
interface SearchbarNarrow2Props {
  disableRedirect?: boolean;
}
export const SearchbarNarrow2: React.FC<SearchbarNarrow2Props> = ({
  disableRedirect,
}) => {
  const urlLocation = useLocation();
  const nav = useNavigate();
  const goHome = () => nav("/");
  const { filters, setFilters } = useFilterContext();

  const isProfilePage = urlLocation.pathname === "/profile";
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
  const onMoreFiltersDone = (filters: IFilters) => {
    setFilters((p) => ({
      ...p,
      minNetArea: priceRange[0],
      maxPrice: priceRange[1],
    }));
    onCloseDrawer();
    !disableRedirect && nav("/search-results");
  };
  const priceLabel = getRangeLabel(filters.minPrice, filters.maxPrice, "HKD");
  const location = (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography
        fontWeight={500}
        // color="textSecondary"
        sx={{ textTransform: "capitalize" }}
        variant="body2"
      >
        {filters.location || "Location"}
      </Typography>
      {filters.location ? null : (
        <KeyboardArrowDown fontSize="small" color="action" />
      )}
    </Box>
  );
  const price = (
    <Box sx={{ display: "flex", alignItems: "center",ml:0.5}}>
      <Typography fontWeight={500} color="textPrimary" variant="body2">
        {priceLabel}
      </Typography>
      {filters.maxPrice ? null : (
        <KeyboardArrowDown fontSize="small" color="action" />
      )}
    </Box>
  );
  const profilePage = (
    <>
    <Box sx={{ display: "flex", alignItems: "center",ml:0.5}}>
    <IconButton onClick={goHome}>
          <HolidayVillageRounded />
        </IconButton>
        <Typography fontWeight={"bold"}>Profile</Typography>
      </Box>
    </>
  );
  const searchPage = (
    <>
      {filters.location && (
        <IconButton onClick={() => onFilterClick(2)}>
          <TuneRoundedIcon />
        </IconButton>
      )}

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
            sx={{ mr: 1}}
            variant="filled"
            label={location}
          />
        </Zoom>
        <Zoom in>
          <Chip
            onClick={() => onFilterClick(1)}
            variant="filled"
            sx={{ mr: 1}}

            label={price}
          />
        </Zoom>
      </Box>
    </>
  );
  return (
    <Box sx={{pb:0}}>
    
      <Box sx={{ display: "flex", alignItems: 'center',  }}>
        {(isHomePage || isSearchResults || isAgentListings) && searchPage}
      </Box>
      <Drawer
        PaperProps={{
          style: {
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
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
          {filterIndex === 2 && <MoreFilter onClose={onCloseDrawer} />}
        </Box>
      </Drawer>
    </Box>
  );
};
