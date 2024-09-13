import { Box, CircularProgress,  Typography } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Listing } from './Listing';
import { getAgentListings } from '../firebase/listings';
import { USER_ID } from '../firebase/firebaseConfig';
import { ListingTile } from './ListingTile';
import Grid from '@mui/material/Grid2';


export const AgentListingsFullPreview: React.FC = () => {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({ queryKey: ['getAgentListings'], queryFn: () => getAgentListings(USER_ID) })
    console.log(data)
    const listings = data?.map((data) => <ListingTile key={data.listingId} {...data}/> )
    if(isLoading){
        return <CircularProgress/>
    }
    return (
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {data?.map((l) => {
            return <Grid key={l.listingId} size={{ lg: 3, md: 4, xs: 12 }}><ListingTile {...l} /></Grid>;
        })}
    </Grid>
    )
}