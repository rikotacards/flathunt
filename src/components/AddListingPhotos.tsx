import { Box, Typography } from '@mui/material';
import React from 'react';
interface AddListingPhotosProps {
    children: React.ReactNode;
}
export const AddListingPhotos: React.FC<AddListingPhotosProps> = ({children}) => {
    return (
        <Box sx={{p:2, display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
            <Typography>Add photos</Typography>
            {children}
        </Box>
    )
}