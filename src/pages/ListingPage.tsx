import React from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import { useQuery } from "@tanstack/react-query";
import { getListing } from "../firebase/listings";

import { Box, IconButton, Toolbar, Typography } from "@mui/material";

import { ListingVerticalLayout } from "../components/ListingVerticalLayout";
import { useAppBarContext } from "../Providers/contextHooks";
import { ChevronLeft } from "@mui/icons-material";
import { ListingTileSkeleton } from "../components/ListingTileSkeleton";
import { NumericFormat } from "react-number-format";
import { Helmet } from "react-helmet-async";
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
      <IconButton size="large" onClick={goBack}>
        <ChevronLeft />
      </IconButton>
      <Box sx={{ display: "flex", flexDirection: "column", pb: 0 }}>
        <Typography variant="body2" fontWeight={"bold"} color="textPrimary">
          <NumericFormat
            displayType="text"
            thousandSeparator=","
            suffix=" HKD"
            value={price}
          />{" "}
          - {netArea} sqft
        </Typography>
        <Typography
          sx={{ textTransform: "capitalize" }}
          color="textSecondary"
          variant="caption"
        >
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
    !isLoading &&
      setAppBarChildComponent(
        <ListingPageAppBar
          price={data?.price || 0}
          netArea={data?.netArea || 0}
          location={data?.location || ""}
          address={data?.address || ""}
        />
      );
  }, [isLoading]);
  if (isLoading || !data) {
    return (
      <Box sx={{ p: 2 }}>
        <ListingTileSkeleton />
      </Box>
    );
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
      <Helmet>
        <title>{`${data.price} HKD / ${data.address}`}</title>
        <meta property="og:title" content={`${data.price} / ${data.address}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flathunt.co" />
        <meta property="og:site_name" content="Flathunt.co" />
        <meta
          property="og:image"
          content={data.imageUrls?.[0]}
        />
        <meta property="og:description" content="The best way to flat hunt" />
      </Helmet>

      <ListingVerticalLayout {...data} />
      <Toolbar />
    </Box>
  );
};
