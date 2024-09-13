import React from 'react';
import { getListing, SaveListingProps } from '../firebase/listings';
import { useQuery } from '@tanstack/react-query';
import { ListingTile } from './ListingTile';
import { Box, Typography } from '@mui/material';
interface SavedListingProps {
    docId: string;
    listingId: string;
}
export const SavedListing: React.FC<SavedListingProps> = ({ listingId, docId }) => {
    const { data, isLoading } = useQuery({ queryKey: ['getListing'], queryFn: () => getListing(listingId) })
    console.log('data', data)
    return (
        <Box sx={{m:2}}>
            <ListingTile {...data} />
        </Box>
    )
}