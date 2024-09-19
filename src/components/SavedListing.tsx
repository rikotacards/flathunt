import React from 'react';
import { getListing} from '../firebase/listings';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ListingTile } from './ListingTile';
import { Box,  LinearProgress } from '@mui/material';

interface SavedListingProps {
    docId: string;
    listingId: string;
}

export const SavedListing: React.FC<SavedListingProps> = ({ listingId, docId, isSaved }) => {
    const { data, isLoading } = useQuery({ queryKey: [`${listingId}`], queryFn: () => getListing(listingId) })
   if(!data){
    return
   }
   if(isLoading){
    <LinearProgress sx={{width:'100%'}}/>
   }
    return (
        <Box sx={{m:2}}>
            <ListingTile isSaved={true} savedDocId={docId} {...data} />
        </Box>
    )
}