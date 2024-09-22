import React from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { getListing } from "../firebase/listings";

import {
  Box,
  IconButton,
  LinearProgress,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";

import { ListingVerticalLayout } from "../components/ListingVerticalLayout";
import { useAppBarContext } from "../Providers/contextHooks";
import {
  ChevronLeft,
  ForumOutlined,
  HolidayVillageRounded,
} from "@mui/icons-material";
import { ListingTileSkeleton } from "../components/ListingTileSkeleton";
interface ListingPageAppBarProps {
  price: number;
  netArea: number;
  location: string;
  address: string;
}
const ListingPageAppBar: React.FC<ListingPageAppBarProps> = (props) => {
  const { price, netArea, location, address } = props;
  const nav = useNavigate();
  const urlLocation = useLocation();
  const goBack = () => nav("/");
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        textAlign: "left",
        alignItems: "center",
      }}
    >
      <IconButton  size="large" onClick={goBack}>
        <ChevronLeft />
      </IconButton>
      <Box sx={{ display: "flex", flexDirection: "column", pb: 0 }}>
        <Typography variant="body2" fontWeight={"bold"} color="textPrimary">
          {price} HKD - {netArea} sqft
        </Typography>
        <Typography
        color="textSecondary"
        variant="caption">
          {location} / {address}
        </Typography>
      </Box>
    </Box>
  );
};
export const ListingPage: React.FC = () => {
  const params = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["getListing"],
    queryFn: () => getListing(params.listingId || ""),
  });

  const { setAppBarChildComponent } = useAppBarContext();
  React.useEffect(() => {
    !isLoading && setAppBarChildComponent(
      <ListingPageAppBar
        price={data?.price || 0}
        netArea={data?.netArea || 0}
        location={data?.location || ""}
        address={data?.address || ""}
      />
    );
  }, [isLoading]);
  if (isLoading || !data) {
   return <ListingTileSkeleton/>
  }
  return (
    <Box
      sx={{
        position: "relative",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",

      }}
    >
      <ListingVerticalLayout {...data} />
      <Toolbar/>
    </Box>
  );
};
