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
import { ChevronLeft, ForumOutlined } from "@mui/icons-material";
interface ListingPageAppBarProps {
  price: number;
  netArea: number;
  location: string;
  address: string;
}
const ListingPageAppBar: React.FC<ListingPageAppBarProps> = (props) => {
  const { price, netArea, location, address } = props;
  const nav = useNavigate();
  const goBack = () => nav(-1);
  return (
    <Box
      component={Paper}
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        textAlign: "left",
        alignItems: "center",
      }}
    >
      <IconButton onClick={goBack}>
        <ChevronLeft />
      </IconButton>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography fontWeight={"bold"} color="textPrimary">
          {price} HKD - {netArea} sqft
        </Typography>
        <Typography variant="body2">
          {location} / {address}
        </Typography>
      </Box>
      <IconButton size="large" sx={{ ml: "auto", mr: 1 }} color="primary">
        <ForumIcon />
      </IconButton>
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
    setAppBarChildComponent(
      <ListingPageAppBar
        price={data?.price || 0}
        netArea={data?.netArea || 0}
        location={data?.location || ""}
        address={data?.address || ""}
      />
    );
  }, [isLoading]);
  if (isLoading) {
    <LinearProgress />;
  }
  return (
    <Box sx={{ p: 2 }}>
      <ListingVerticalLayout {...data} />
    </Box>
  );
};
