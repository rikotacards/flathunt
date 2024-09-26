import { Box, Paper, Typography, OutlinedInput, TextField, Button } from '@mui/material';
import React from 'react';
import { useAuthContext } from '../Providers/contextHooks';
interface AddListingAdminProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    listingSpecificContact?: string;
    listingSpecificLicenseNumber?: string;
    listingSpecificPersonalLicenseNumber?: string;
    listingSpecificRealEstateCompany?: string;
}
export const AddListingAdmin: React.FC<AddListingAdminProps> = ({listingSpecificRealEstateCompany, listingSpecificContact, listingSpecificLicenseNumber, listingSpecificPersonalLicenseNumber, onChange}) => {
    const {user} = useAuthContext();
    return (
        <>
        {user?.uid === "uqox5IKaBVPE6YctRGXXKcYJQpR2" && (
            <>
            <Box
              component={Paper}
              elevation={0}
              color={"primary"}
            >
              <Typography variant="h5" fontWeight={"bold"}>
                Admin Options
              </Typography>
              <Typography variant="caption">
                Used for adding on behalf of agents.
              </Typography>
              <OutlinedInput
                name="listingSpecificContact"
                onChange={onChange}
                type="tel"
                sx={{ mb: 1 }}
                fullWidth
                value={listingSpecificContact}
                placeholder="Listing-specific Whatsapp contact"
              />
              <TextField
                name="listingSpecificRealEstateCompany"
                onChange={onChange}
                type="text"
                fullWidth
                sx={{ mb: 1 }}
                value={listingSpecificRealEstateCompany}
                placeholder="Listing-specific real estate company name"
              />
              <TextField
                name="listingSpecificLicenseNumber"
                onChange={onChange}
                type="text"
                fullWidth
                value={listingSpecificLicenseNumber}
                sx={{ mb: 1 }}
                placeholder="Listing-specific License Number"
              />
              <TextField
                name="listingSpecificPersonalLicenseNumber"
                onChange={onChange}
                type="text"
                fullWidth
                value={listingSpecificPersonalLicenseNumber}
                sx={{ mb: 1 }}
                placeholder="Listing-specific personal License Number"
              />
            </Box>
          </>
          )}
          </>
    )
}