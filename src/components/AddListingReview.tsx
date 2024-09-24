import { Box, Typography } from '@mui/material';
import React from 'react';
import { ListingVerticalLayout } from './ListingVerticalLayout';
import { IListing } from '../firebase/types';

export const AddListingReview: React.FC<IListing & {previewUrls?: string[]}> = (props) => {
    console.log(props.previewUrls)
    return (
        <Box sx={{p:2, width:'100%'}}>
            <Typography variant='h6'>Preview</Typography>
            <ListingVerticalLayout  {...props} previewUrls={props.previewUrls}/>
            
        </Box>
    )
}