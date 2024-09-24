import { Box, Chip, TextField, Typography } from '@mui/material';
import React from 'react';
import { IListing } from '../firebase/types';
const bedroomsOptions = [0,1,2,3,4,5]
const bathroomsOptions = [0,1,2,3,4]
interface AddListingPropertySpecificsProps {
    onClick: (fieldName: keyof IListing, value: number | boolean | string) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    bedrooms?: number;
    bathrooms?: number;
    netArea?: number;
    grossArea?: number;
}
export const AddListingPropertySpecifics: React.FC<AddListingPropertySpecificsProps> = (props) => {
    const {onClick, onChange, bedrooms, bathrooms, netArea, grossArea} = props; 
    return (
        <Box sx={{p:2}}>
            <Typography sx={{mb:1}} variant='h6'>Share some basics about your place</Typography>
             <Typography sx={{mb:1}}>Bedrooms</Typography>
             <Box sx={{mb:2, display: "flex", justifyContent: "space-between" }}>
                {bedroomsOptions.map((br, i) => (
                  <Chip
                    onClick={() => onClick("bedrooms", br)}
                    label={br === 0 ? "Studio" : br}
                    sx={{
                      mb: 0,
                      ml: i == 0 ? 0 : 0,
                      mr: 1,
                      width: "100%",
                      textTransform: "capitalize",
                    //   fontWeight: form["bedrooms"] === br ? "bold" : undefined,
                    }}
                    variant={bedrooms === br ? "filled" : "outlined"}
                  />
                ))}
              </Box>
              <Typography sx={{mb:1}}>Bathrooms</Typography>
              <Box sx={{ mb:2, display: "flex", justifyContent: "space-between" }}>
                {bathroomsOptions.map((br, i) => (
                  <Chip
                    sx={{ mb: 0, ml: i == 0 ? 0 : 1, width: "100%" }}
                    onClick={() => onClick('bathrooms', br)}
                    variant={bathrooms === br ? "filled" : "outlined"}
                    label={br}
                  />
                ))}
              </Box>
              <Box>

              <TextField
                size="small"
                fullWidth
                name="netArea"
                value={netArea}
                type="tel"
                placeholder="Net Area (sqft)"
                label="Net Area (sqft)"
                onChange={onChange}
                sx={{mb:2}}
              />
              <TextField
                value={grossArea}
                name="grossArea"
                size="small"
                fullWidth
                type="tel"
                placeholder="Gross Area (sqft)"
                label="Gross Area"
                onChange={onChange}
              />
              </Box>

        </Box>
    )
}