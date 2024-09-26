import React from "react";
import { IListing } from "../firebase/types";
import { features } from "./OtherFeatures";
import { Box, Divider, Paper, Typography } from "@mui/material";
import {
  DirectionsSubwayFilledOutlined,
  MonetizationOnRounded,
  PlaceOutlined,
  ShowerOutlined,
} from "@mui/icons-material";
import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined";
import SquareFootOutlinedIcon from "@mui/icons-material/SquareFootOutlined";
import { Timestamp } from "firebase/firestore";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import StoreIcon from "@mui/icons-material/Store";
const info: {
  label: string;
  name: keyof IListing;
  icon?: React.ReactNode;
  units?: string;
}[] = [
  {
    label: "price",
    name: "price",
    icon: <MonetizationOnRounded />,
    units: "HKD/month",
  },
  {
    label: "location",
    name: "location",
    icon: <DirectionsSubwayFilledOutlined />,
  },
  { label: "address", name: "address", icon: <PlaceOutlined /> },
  {
    label: "bedrooms",
    name: "bedrooms",
    icon: <HotelOutlinedIcon />,
    units: "bedrooms",
  },
  {
    label: "bathrooms",
    name: "bathrooms",
    icon: <ShowerOutlined />,
    units: "bathrooms",
  },
  {
    label: "netArea",
    name: "netArea",
    icon: <SquareFootOutlinedIcon />,
    units: "sqft (net)",
  },
  { label: "Agency fee required", name: "isDirectListing" },
];

const customValue = (
  name: string,
  value: boolean | string | number | undefined | string[] | Timestamp
) => {
  if (name === "isDirectListing") {
    return value === true ? "No agency fee" : "Agency fee required";
  }
  return value;
};

const customIcon = (
  name: string,
  value: boolean | string | number | undefined | string[] | Timestamp,
  icon?: React.ReactNode
) => {
  if (name === "isDirectListing") {
    return value === true ? <MoneyOffIcon /> : <MonetizationOnRounded />;
  }
  return icon;
};
const others = [...features.outdoors, ...features.indoors, ...features.building];
export const ListingVerticalInfo: React.FC<IListing> = (props) => {

  const rows = info.map((row, i) => {
    if (props[row.name] === undefined || props[row.name] === false) {
      return null;
    }
    return (
      <>
        <Box sx={{ display: "flex", alignItems: "center", pt: 2, pb: 2 }}>
          {customIcon(row.name, props[row.name], row.icon)}
          <Typography  variant="body2" sx={{ ml: 1, fontWeight: 500, textTransform: 'capitalize' }}>
            <>
              {customValue(row.name, props[row.name])} {row.units}
            </>
          </Typography>
        </Box>
        {i !== info.length - 1 && <Divider />}
      </>
    );
  });
  !props.isDirectListing &&
    rows.push(
      <Box sx={{ display: "flex", alignItems: "flex-start", pt: 2, pb: 2 }}>
        <StoreIcon />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {props.listingSpecificRealEstateCompany?.toLowerCase() !== 'false' && (!!props.realEstateCompany ||
            !!props.listingSpecificRealEstateCompany) && (
            <>
              <Typography variant="body2" sx={{textTransform: 'capitalize', ml: 1, fontWeight: 500 }}>
                <>Real estate company</>
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
                sx={{ ml: 1, fontWeight: 500, textTransform: 'capitalize' }}
              >
                <>
                  {props.listingSpecificRealEstateCompany ||
                    props.realEstateCompany}
                </>
              </Typography>
            </>
          )}
          {props.listingSpecificLicenseNumber?.toLowerCase() !=='false' && (props.listingSpecificLicenseNumber || props.licenseNumber) && (
            <>
              <Typography variant="body2" sx={{textTransform: 'capitalize', ml: 1, fontWeight: 500 }}>
                <>Company License</>
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
                sx={{ ml: 1, fontWeight: 500, textTransform: 'capitalize', }}
              >
                <>{props.listingSpecificLicenseNumber || props.licenseNumber}</>
              </Typography>
            </>
          )}
          {props.listingSpecificPersonalLicenseNumber?.toLowerCase() !== 'false' && (props.personalLicenseNumber ||
            props.listingSpecificPersonalLicenseNumber) && 
              <>
                <Typography variant="body2" sx={{ textTransform: 'capitalize',ml: 1, fontWeight: 500 }}>
                  <>Individual License</>
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="body2"
                  sx={{ ml: 1, fontWeight: 500, textTransform: 'capitalize', }}
                >
                  <>
                    {props.listingSpecificPersonalLicenseNumber ||
                      props.personalLicenseNumber}
                  </>
                </Typography>
              </>
            }
        </Box>
      </Box>
    );
  const otherRows = others.map((row, i) => {
    if (props[row.name] === undefined || props[row.name] === false) {
      return null;
    }
    return (
      <>
        <Box sx={{ display: "flex", alignItems: "center", pt: 2, pb: 2 }}>
          {customIcon(row.name, props[row.name], row.icon)}
          <Typography  variant="body2" sx={{textTransform: 'capitalize', ml: 1, fontWeight: 500 }}>
            <>{row.value || customValue(row.name, props[row.name])}</>
          </Typography>
        </Box>
        {i !== others.length - 1 && <Divider />}
      </>
    );
  });
  return (
    <>
      <Box
        component={Paper}
        sx={{
          p: 2,
          pt: 1,
          pb: 0,
          borderRadius: 3,
          textAlign: "left",
          m: 0,
          mt: 1,

          boxShadow:
            "0 3px 12px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.08)",
        }}
        elevation={0}
      >
        {otherRows}
      </Box>
      <Box
        component={Paper}
        sx={{
          p: 2,
          pt: 1,
          borderRadius: 3,
          textAlign: "left",
          m: 0,
          mt: 1,

          boxShadow:
            "0 3px 12px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.08)",
        }}
        elevation={0}
      >
        {rows}
      </Box>
    </>
  );
};
