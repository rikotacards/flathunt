import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import React from 'react';
import { allHkLocations } from '../hongKongLocations';
import { IListing } from '../firebase/types';
interface AddListingLocationProps {
    onClick: (fieldName: keyof IListing, value: string) => void;
    location?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    address?: string
}
export const AddListingLocation: React.FC<AddListingLocationProps> = (props) => {
    const {onClick, location, onChange, address} = props;
    return (
        <Box sx={{p:2}}>
            <Typography sx={{mb:2}} variant='h6'>Where is the property located?</Typography>
            <Typography sx={{mb:1}}>Location</Typography>

            <Autocomplete
                autoHighlight
                fullWidth
                onChange={(e, newValue) =>newValue && onClick('location', newValue)}
                value={location}
               
                sx={{mb:2}}
                renderInput={(params) => (
                  <TextField
                    sx={{ textTransform: "capitalize" }}
                    placeholder="Select location"
                    {...params}
                  />
                )}
                options={allHkLocations}
              />
              <Typography sx={{mb:1}}>Building name or address</Typography>
              <TextField
                required
                name="address"
                type="text"
                fullWidth
                placeholder="Million City, 28 Elgin street"
                onChange={onChange}
                value={address}
              />
        </Box>
    )
}