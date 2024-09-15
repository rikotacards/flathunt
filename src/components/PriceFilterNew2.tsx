import {
  Box,
  Button,
  OutlinedInput,
  Paper,
  Slider,
  Typography,
} from "@mui/material";
import React from "react";
import { useFilterContext } from "../Providers/contextHooks";
import { useIsNarrow } from "../utils/useIsNarrow";
const MIN = 6000;
const MAX = 90000;

interface PriceFilterNarrowProps {
  onClose: () => void;
  setPriceRange: React.Dispatch<React.SetStateAction<number[]>>;
  onCancel: () => void;
}
export const PriceFilterNew2: React.FC<PriceFilterNarrowProps> = ({
  onClose,
  setPriceRange,
  onCancel,
}) => {
  const { filters, setFilters } = useFilterContext();
  const isNarrow = useIsNarrow();

  const [range, setRange] = React.useState([
    filters.minPrice || MIN,
    filters.maxPrice || MAX,
  ]);
  const onChange = (event, newValue) => {
    // setFilters((p) => ({ ...p, minPrice: newValue[0], maxPrice: newValue[1] }))
    setRange(newValue);
    if (setPriceRange) {
      setPriceRange(newValue);
    }
  };
  const handleMaxInputChange = (event) => {
    setRange((p) => [p[0], event.target.value]);
    // setFilters((p) => ({ ...p, maxPrice: event.target.value }))
  };
  const handleMinInputChange = (event) => {
    setRange((p) => [event.target.value, p[1]]);
    // setFilters((p) => ({ ...p, minPrice: event.target.value }))
  };
  const handleBlur = () => {
    if (range[0] < 0) {
      setRange((p) => [0, p[1]]);
    }
  };
  const onDone = () => {
    if (filters.maxPrice == range[1] && filters.minPrice == range[0]) {
      onClose?.();
      return;
    }
    setFilters((p) => ({ ...p, maxPrice: range[1], minPrice: range[0] }));
    onClose?.();
  };
  return (
    <Box
      component={Paper}
      elevation={0}
      sx={{
        p: 1,
        m: 0,
        width: isNarrow ? undefined : "500px",
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography sx={{alignSelf: 'center', display: 'flex'}} variant="h6" fontWeight={"bold"}>
        Price
      </Typography>
      <Box sx={{ mr: 4, ml: 4, mt: 4 }}>
        <Slider
          min={MIN}
          max={MAX}
          valueLabelDisplay="on"
          step={1000}
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
          <OutlinedInput
            value={range[0]}
            size="small"
            type="tel"
            onFocus={(e) => e?.target.select()}
            startAdornment={"$"}
            sx={{
              maxWidth: 90,
              borderRadius: 5,
              p: 1,
              textAlign: "center",
              alignItems: "center",
              display: "flex",
            }}
            onChange={handleMinInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 1000,
              min: range[0],

              style: {
                display: "flex",
                textAlign: "center",
                padding: 0,
                border: "0px",
              },
              "aria-labelledby": "input-slider",
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="caption">Max</Typography>

          <OutlinedInput
            onFocus={(e) => e?.target.select()}
            startAdornment={"$"}
            value={range[1]}
            size="small"
            sx={{
              maxWidth: 90,
              borderRadius: 5,
              p: 1,
              textAlign: "center",
              alignItems: "center",
              display: "flex",
            }}
            onChange={handleMaxInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 1000,
              min: range[0],

              style: {
                display: "flex",
                textAlign: "center",
                padding: 0,
              },
              type: "number",
              "aria-labelledby": "input-slider",
            }}
          />
        </Box>
      </Box>
      <Button onClick={onDone} sx={{ mt: 2 }} fullWidth variant="contained">
        done
      </Button>
      <Button onClick={onCancel} sx={{ mt: 1 }} fullWidth variant="outlined">
        Cancel
      </Button>
    </Box>
  );
};
