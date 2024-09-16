import React from 'react';
import { getListing, SaveListingProps } from '../firebase/listings';
import { useQuery } from '@tanstack/react-query';
import { ListingTile } from './ListingTile';
import { Box, IconButton, Typography } from '@mui/material';
import { useAppBarContext } from '../Providers/contextHooks';
import { ChevronLeft } from '@mui/icons-material';
interface SavedListingProps {
    docId: string;
    listingId: string;
}
const SavedListingAppBar: React.FC = () => {
    return (
        <Box sx={{display:'flex', alignItems: 'center'}}>
            <IconButton>
                <ChevronLeft/>
            </IconButton>
            <Typography color='textPrimary'>Saved listings</Typography>
        </Box>
    )
}
export const SavedListing: React.FC<SavedListingProps> = ({ listingId, docId }) => {
    const { data, isLoading } = useQuery({ queryKey: [`${listingId}`], queryFn: () => getListing(listingId) })
    const {setAppBarChildComponent} = useAppBarContext();
    React.useEffect(() => {
        setAppBarChildComponent(<SavedListingAppBar/>)
    },[])
    return (
        <Box sx={{m:2}}>
            <ListingTile {...data} />
        </Box>
    )
}