import { Box, Button, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useFilterContext } from "../Providers/contextHooks";
import { BedroomSlider } from "./BedroomsSlider";
import { AreaSlider } from "./AreaSlider";
import { useNavigate } from "react-router";
const MIN = 200;
const MAX = 2000;

interface MoreFilterProps {
  onClose: () => void;
}
export const MoreFilter: React.FC<MoreFilterProps> = ({ onClose }) => {
  const { filters, setFilters } = useFilterContext();
  const [bedrooms, setBedrooms] = React.useState(
    [filters.minBedrooms || 0,
    filters.maxBedrooms || 5]
  );
  const nav = useNavigate();
  const [areaRange, setAreaRange] = React.useState([
    filters.minNetArea || MIN,
    filters.maxNetArea || MAX,
  ]);

  const onDone = () => {
    setFilters((p) => ({
      ...p,
      minNetArea: areaRange[0],
      maxNetArea: areaRange[1],
      minBedrooms: bedrooms[0],
      maxBedrooms: bedrooms[1],
    }));
    onClose();
    nav("/search-results");
  };
  const onClear = () => {
    setFilters((p) => ({
      ...p,
      bedrooms: undefined,
      minNetArea: undefined,
      maxNetArea: undefined,
    }));
    onClose();
  };
  return (
    <Box>
      <Toolbar
        sx={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography fontWeight={"bold"}>Filters</Typography>
      </Toolbar>
      <Box sx={{ p: 2, mb: 1 }}>
        <Box>
          <Typography fontWeight={"bold"}>Area</Typography>
          <AreaSlider setAreaRange={setAreaRange} />
        </Box>
        <Typography fontWeight={"bold"}>Bedrooms</Typography>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <BedroomSlider setPriceRange={setBedrooms} />
        </Box>

        <Box sx={{ mt: 2, display: "flex", flexDirection: "column" }}>
          <Button
            onClick={onDone}
            sx={{ ml: 0, mb: 1, borderRadius: 5 }}
            variant="contained"
            fullWidth
          >
            Done
          </Button>
          <Button sx={{ borderRadius: 5 }} onClick={onClear} variant="outlined">
            Clear
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
