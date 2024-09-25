import { Box, Typography } from '@mui/material';
import React from 'react';
import { ListingVerticalLayout } from './ListingVerticalLayout';
import { IListing } from '../firebase/types';

export const AddListingReview: React.FC<IListing & {previewUrls?: string[]}> = (props) => {
    
    return (
        <Box sx={{ width:'100%'}}>
            <Typography sx={{ml:2}} variant='h6'>Preview</Typography>
            <ListingVerticalLayout  {...props} previewUrls={props.previewUrls}/>
            
        </Box>
    )
}