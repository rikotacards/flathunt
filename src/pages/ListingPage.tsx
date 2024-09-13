import React from 'react';
import { useLocation, useParams } from 'react-router';
import { Listing } from '../components/Listing';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { getListing } from '../firebase/listings';
import { ListingNew } from '../components/ListingNew';
import { ScrollRestoration } from 'react-router-dom';
import { Box, LinearProgress } from '@mui/material';
import { useIsNarrow } from '../utils/useIsNarrow';
import { ListingVerticalLayout } from '../components/ListingVerticalLayout';
import { ListingWide } from '../components/ListingWide';

export const ListingPage: React.FC = () => {
    const location = useLocation();
    const params = useParams();
    const isNarrow = useIsNarrow();
    const { data, isLoading } = useQuery({ queryKey: ['getListing'], queryFn: () => getListing(params.listingId || '') })
    if(isLoading){
        <LinearProgress/>
    }
    return (
        <Box
        sx={{p:1}}
        >
        {isNarrow ? 
        <ListingVerticalLayout {...data}/>:


            <ListingWide {...data}/>

            }
        </Box>
        
    )
}