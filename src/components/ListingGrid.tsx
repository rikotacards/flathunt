import React from 'react';
import Grid from "@mui/material/Grid2";

import { ListingTileSkeleton } from './ListingTileSkeleton';
import { IListing } from '../firebase/types';
import { ListingTile } from './ListingTile';
interface ListingGridProps {
    isLoading: boolean;
    data?: IListing[];
    savedListingsTransformed?: {[key: string]: string}
}
export const ListingGrid: React.FC<ListingGridProps> = ({savedListingsTransformed, data, isLoading}) => {

  return (
        <Grid
        sx={{ mt: 1 }}
        container
        spacing={{ xs: 2, md: 3, lg: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {isLoading
          ? [1, 2, 3, 4, 5, 6].map((l) => (
              <Grid size={{ lg: 3, md: 4, xs: 4 }} key={l}>
                <ListingTileSkeleton />
              </Grid>
            ))
          : data?.map((l) => {
              const savedDocId = savedListingsTransformed[l.listingId]

              return (
                <Grid key={l.listingId} size={{ lg: 3, md: 4, xs: 4 }}>
                  <ListingTile savedDocId={savedDocId}
                   isSaved={!!savedDocId} {...l} />
                </Grid>
              );
            })}
      </Grid>
    )
}