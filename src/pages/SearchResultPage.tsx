import { Box, Card, Chip, Typography,} from '@mui/material';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ListingTile } from '../components/ListingTile';
import { getAllListings } from '../firebase/listings';
import Grid from '@mui/material/Grid2';
import { useFilterContext } from '../Providers/contextHooks';
import { SearchBarWide } from '../components/SearchBarWide';
import { useIsNarrow } from '../utils/useIsNarrow';
import { getRangeLabel } from '../utils/getRangeLabel';
export const SearchResultPage: React.FC = () => {
    const { filters } = useFilterContext();
    const { data, isLoading, isFetching, } = useQuery({
        queryKey: ['getAllListingsWithResult', 
            filters.location, 
            filters.maxPrice, 
            filters.minPrice, 
            filters.bedrooms
        ], 
            queryFn: () => getAllListings(filters),
    })

    const isNarrow = useIsNarrow()
   const priceLabel = getRangeLabel(filters.minPrice, filters.maxPrice)

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', p:2}}>
            {!isNarrow && <SearchBarWide showMore />}
           {!!data?.length && <Typography sx={{mb:2}} fontWeight={'bold'}>{data?.length} places</Typography>}

            {data?.length === 0 && !isFetching &&!isLoading &&<Card variant='outlined' sx={{p:2}}>
                Try to broaden your search</Card>}

            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {data?.map((l) => <Grid key={l.listingId} size={{ lg: 3, md: 4, xs: 4 }}><ListingTile {...l} /></Grid>)}
            </Grid>

        </Box>
    )
}