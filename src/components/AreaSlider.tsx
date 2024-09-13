import { Box, Paper, Slider, Typography } from "@mui/material";
import React from "react";
import { useIsNarrow } from "../utils/useIsNarrow";
const MIN = 200;
const MAX = 2000;

interface AreaSliderProps {
  setAreaRange: React.Dispatch<React.SetStateAction<number[]>>;
}
export const AreaSlider: React.FC<AreaSliderProps> = ({
  setAreaRange: setAreaRange,
}) => {
  const isNarrow = useIsNarrow();

  const [range, setRange] = React.useState([MIN, MAX]);
  const onChange = (event, newValue) => {
    // setFilters((p) => ({ ...p, minPrice: newValue[0], maxPrice: newValue[1] }))
    setRange(newValue);
    if (setAreaRange) {
      setAreaRange(newValue);
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
          step={50}
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
          <Typography variant="caption">Min area (sqft)</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="caption">Max area (sqft)</Typography>
        </Box>
      </Box>
    </Box>
  );
};
