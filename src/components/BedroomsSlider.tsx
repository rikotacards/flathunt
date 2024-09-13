import { Box, Paper, Slider, Typography } from "@mui/material";
import React from "react";
import { useIsNarrow } from "../utils/useIsNarrow";
const MIN = 0;
const MAX = 5;

interface PriceFilterNarrowProps {
  setPriceRange: React.Dispatch<React.SetStateAction<number[]>>;
}
export const BedroomSlider: React.FC<PriceFilterNarrowProps> = ({
  setPriceRange,
}) => {
  const isNarrow = useIsNarrow();

  const [range, setRange] = React.useState([MIN, MAX]);
  const onChange = (event, newValue) => {
    // setFilters((p) => ({ ...p, minPrice: newValue[0], maxPrice: newValue[1] }))
    setRange(newValue);
    if (setPriceRange) {
      setPriceRange(newValue);
    }
  };

  return (
    <Box
      component={Paper}
      elevation={0}
      sx={{
        p: 1,
        m: 1,
        width: isNarrow ? undefined : "500px",
      }}
    >
      <Box sx={{ mt: 2 }}>
        <Slider
          min={MIN}
          max={MAX}
          valueLabelDisplay="on"
          step={1}
          onChange={onChange}
          value={range}
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="caption">Min</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="caption">Max</Typography>
        </Box>
      </Box>
    </Box>
  );
};
