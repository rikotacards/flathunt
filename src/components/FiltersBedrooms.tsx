import {
    Box,
    Button,
    OutlinedInput,
    Paper,
    Slider,
    Toolbar,
    Typography,
  } from "@mui/material";
  import React from "react";
  import { useFilterContext } from "../Providers/contextHooks";
  import { useIsNarrow } from "../utils/useIsNarrow";
  const MIN = 0;
  const MAX = 5;
  
  interface PriceFilterNarrowProps {
    onClose: () => void;
    setPriceRange: React.Dispatch<React.SetStateAction<number[]>>;
    onCancel: () => void;
  }
  export const FilterBedrooms: React.FC<PriceFilterNarrowProps> = ({
    onClose,
    setPriceRange,
    onCancel,
  }) => {
    const { filters, setFilters } = useFilterContext();
    const isNarrow = useIsNarrow();
    const disableInput = true;
    const [range, setRange] = React.useState([
      filters.minBedrooms || MIN,
      filters.maxBedrooms || MAX,
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
      if (filters.maxBedrooms == range[1] && filters.minBedrooms == range[0]) {
        onClose?.();
        return;
      }
      setFilters((p) => ({ ...p, maxBedrooms: range[1], minBedrooms: range[0] }));
      onClose?.();
    };
    return (
      <Box
        
    
        sx={{
          p: 1,
          m: 0,
          width: isNarrow ? undefined : "500px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          sx={{ alignSelf: "center", display: "flex" }}
          variant="h6"
          fontWeight={"bold"}
        >
          Bedrooms
        </Typography>
        <Typography sx={{alignSelf:'center'}} color='textSecondary'>Select the number of bedrooms</Typography>
        <Box sx={{ mr: 4, ml: 4, mt: 4 }}>
          <Toolbar/>
          <Slider
            min={MIN}
            max={MAX}
            valueLabelDisplay="on"
            step={1}
            onChange={onChange}
            value={range}
          />
        </Box>
        {!disableInput && <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
        </Box>}
        <Button
          onClick={onDone}
          sx={{ mt: 2, borderRadius: 5 }}
          fullWidth
          variant="contained"
          size='large'
        >
          done
        </Button>
      </Box>
    );
  };
  