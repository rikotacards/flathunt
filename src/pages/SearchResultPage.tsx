import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ListingTile } from "../components/ListingTile";
import { getAllListings } from "../firebase/listings";
import Grid from "@mui/material/Grid2";
import { useAppBarContext, useFilterContext } from "../Providers/contextHooks";
import { SearchBarWide } from "../components/SearchBarWide";
import { useIsNarrow } from "../utils/useIsNarrow";
import { useNavigate } from "react-router";
import { SearchbarNarrow2 } from "../components/SearchbarNarrow2";
import SwapVertIcon from "@mui/icons-material/SwapVert";
export const SearchResultPage: React.FC = () => {
  const { setFilters, filters } = useFilterContext();
  const nav = useNavigate();
  const { setAppBarChildComponent } = useAppBarContext();

  React.useEffect(() => {
    setAppBarChildComponent(<SearchbarNarrow2 />);
  }, []);
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "getAllListingsWithResult",
      filters.location,
      filters.maxPrice,
      filters.minPrice,
      filters.bedrooms,
      filters.minNetArea,
      filters.maxNetArea
    ],
    queryFn: () => getAllListings(filters),
  });
  const onClear = () => {
    setFilters({});
    nav("/");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
      {!!data?.length && (
        <Box
          component={Paper}
          variant="outlined"
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            alignItems: "center",
            flexDirection: "row",
            borderRadius: 10,
          }}
        >
          <Typography color="textSecondary" variant="body2" fontWeight={"bold"}>
            {data?.length} places
          </Typography>
          <Button onClick={onClear} sx={{ textTransform: "capitalize" }}>
            Clear filters
          </Button>
        </Box>
      )}

      {data?.length === 0 && !isFetching && !isLoading && (
        <Card variant="outlined" sx={{ p: 2 }}>
          Try to broaden your search or{" "}
          <Button onClick={onClear}>clear filters</Button>
        </Card>
      )}

      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {data?.map((l) => (
          <Grid key={l.listingId} size={{ lg: 3, md: 4, xs: 4 }}>
            <ListingTile {...l} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
