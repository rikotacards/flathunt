import { Box, Skeleton } from '@mui/material';
import React from 'react';

export const ListingTileSkeleton: React.FC = () => {
    return (
        <Box sx={{display: 'flex', flexDirection:'column', alignItem: 'center'}}>
            <Skeleton sx={{borderRadius: 5}} height={'400px'} width={'100%'} variant='rectangular'/>
        </Box>
    )
}