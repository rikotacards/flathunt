import { Box, Typography, Chip } from '@mui/material';
import React from 'react';
import {  IListing } from '../firebase/types';
interface AddListingInfoProps {
    onClick: (fieldName: keyof IListing, value: string | number | boolean) => void;
    rentBuy?: 'rent' | 'sale';
    isDirectListing?: boolean;
    propertyType?: 'commercial' | 'residential'
   
}

export const AddListingInfo: React.FC<AddListingInfoProps> = ({propertyType, onClick, rentBuy, isDirectListing}) => {
    return (
      <Box sx={{p:2}}>
        <Typography variant='h6' sx={{mb:2}}>Tell people what you're offering</Typography>
        <Typography fontWeight={'bold'} sx={{mb:1}} color='textPrimary'>The property is</Typography>
        <Box sx={{mb:2, display: "flex", alignItems: "center" }}>
          <Chip
            onClick={() => onClick("rentBuy", "rent")}
            sx={{
              mr: 1,
            }}
            label="For Rent"
            variant={rentBuy === 'rent' ? 'filled': 'outlined'}
          />
  
          <Chip
            label="For Sale"
            onClick={() => onClick("rentBuy", "sale")}
            variant={rentBuy === 'sale' ? 'filled': 'outlined'}
          />
        </Box>
        <Typography fontWeight={'bold'} sx={{mb:1}} color='textPrimary'>Agency fee? </Typography>
        <Box sx={{mb:2,  display: "flex", alignItems: "center" }}>
          <Chip
                  onClick={() => onClick("isDirectListing", false)}
                  sx={{
              mr: 1,
            }}
            label="Yes"
            variant={isDirectListing === false ? 'filled' : 'outlined'}
            // variant={outlinedOrContained(form.rentBuy === "rent")}
          />
  
          <Chip
            label="No (Landlord listing)"
            onClick={() => onClick("isDirectListing", true)}
            variant={isDirectListing === true ? 'filled' : 'outlined'}
          />
        </Box>
        <Typography fontWeight={'bold'} sx={{mb:1}} color='textPrimary'>Property Type</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Chip
                  onClick={() => onClick("propertyType", "residential")}
                  sx={{
              mr: 1,
            }}
            label="Residential"
            variant={propertyType === 'residential' ? 'filled': 'outlined'}
          />
  
          <Chip
            label="Commercial"
            onClick={() => onClick("propertyType", "commercial")}
            variant={propertyType === 'commercial' ? 'filled': 'outlined'}
          />
        </Box>
        
      </Box>
    );
  };
  