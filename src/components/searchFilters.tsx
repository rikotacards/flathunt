import { CloseOutlined } from "@mui/icons-material";
import { Box, Button, Chip } from "@mui/material";
import React from "react";

import { useFilterContext } from "../Providers/contextHooks";
import { useLocation, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LocationFilterNew2 } from "./LocationFilterNew2";
import { PriceFilterNew2 } from "./PriceFilterNew2";

interface SearchFiltersProps {
  onClose: () => void;
  disableAPICalls: boolean;
  filterToOpen?: number;
}
export const SearchFilters: React.FC<SearchFiltersProps> = ({
  onClose,
  disableAPICalls,
  filterToOpen,
}) => {
  const location = useLocation();
  const queryClient = useQueryClient();

  const [priceRange, setPriceRange] = React.useState([0, 0]);
  const { filters, setFilters } = useFilterContext();
  const isHomePage = location.pathname === "/";
  const nav = useNavigate();
  const onLocationClick = (location: string) => {
    console.log("ON LOCATION CLICK", location);

    setFilters((p) => ({ ...p, location: location || undefined }));

    if (isHomePage) {
      nav("/search-results");
    }
    onClose();
  };

  const [index, setIndex] = React.useState(filterToOpen || filters.location ? 2 : 1 || 1);
  console.log("iiii", filterToOpen);
  const onTabClick = (i: number) => {
    setIndex(i);
  };
  const onPriceDone = () => {
    setFilters((p) => ({
      ...p,
      maxPrice: priceRange[1],
      minPrice: priceRange[0],
    }));
    if (!disableAPICalls) {
      queryClient.invalidateQueries({
        exact: true,
        queryKey: ["getAllListingsWithResult"],
      });
    }

    if (isHomePage) {
      nav("/search-results");
    }
    onClose();
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          textAlign: "left",
        }}
      >
        <Chip
          component={Button}
          sx={{
            mr: 1,
          }}
          color="primary"
          onClick={() => onTabClick(1)}
          variant={index === 1 ? "filled" : "outlined"}
          label="Location"
        />
        <Chip
          variant={index === 2 ? "filled" : "outlined"}
          sx={{
            mr: 1,
            zIndex: 2,
          }}
          color="primary"
          component={Button}
          onClick={() => onTabClick(2)}
          label="price"
        />
      </Box>

      <Box
        sx={{
          p: 1,
          zIndex: 2,
        }}
      >
        {index === 1 && <LocationFilterNew2 
        onClose={onClose}
        onClick={onLocationClick} />}
        {index == 2 && (
          <PriceFilterNew2
            setPriceRange={setPriceRange}
            onClose={onPriceDone}
            onCancel={onClose}
          />
        )}
      </Box>
    </Box>
  );
};
