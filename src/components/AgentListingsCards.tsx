import { Box, Button, Chip, CircularProgress, Dialog, Drawer, IconButton, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { deleteListings, getAgentListings } from '../firebase/listings';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import { USER_ID } from '../firebase/firebaseConfig';
import EditIcon from '@mui/icons-material/Edit';
import { EditListing } from './EditListing';
import { IFilters } from '../firebase/types';
import { CheckBox } from '@mui/icons-material';
import { ListingCard } from './ListingCard';
import { useIsNarrow } from '../utils/useIsNarrow';
import { copy } from '../utils/copy';

const getBedroomCondition = (bedrooms: number, bedroomsFilter?: string) => {
    if (bedroomsFilter === undefined) {
        return bedrooms >= 0
    }
    if (bedroomsFilter === 'studio') {
        return bedrooms === 0
    }
    if (bedroomsFilter === '1') {
        return bedrooms === 1
    }
    if (bedroomsFilter === '1+') {
        return bedrooms >= 1
    }
    if (bedroomsFilter === '2') {
        return bedrooms === 2
    }
    if (bedroomsFilter === '2+') {
        return bedrooms >= 2
    }
    if (bedroomsFilter === '3') {
        return bedrooms === 3
    }
    if (bedroomsFilter === '3+') {
        return bedrooms >= 3
    }
    return bedrooms >= 0
}

const getRangeCondition = (price: number, maxPrice?: number, minPrice?: number) => {
    return price <= (maxPrice || Infinity) && price >= (minPrice || -Infinity)
}


export const AgentListingsCards: React.FC<IFilters> = React.memo((props) => {
    const { maxPrice, minPrice, maxNetArea, minNetArea, bedrooms, location } = props;
    const isNarrow = useIsNarrow();

    const [open, setOpen] = React.useState(false);
    const [editingListingId, setEditingListingId] = React.useState('')
    const handleOpen = (listingId: string) => {
        setEditingListingId(listingId)
        setOpen(true);
    }
    const handleClose = () => setOpen(false);
    const { data, isLoading } = useQuery({ 
        queryKey:
         ['getAgentListings'], queryFn: () => getAgentListings(USER_ID) })
    const filteredData = data?.filter((d) =>
        (!location || (d.location?.toLocaleLowerCase() === location?.toLowerCase())) &&
        (!maxPrice && !minPrice || getRangeCondition(Number(d.price), maxPrice, minPrice)) &&
        (getRangeCondition(Number(d.netArea), maxNetArea || Infinity, minNetArea || -Infinity)) &&
        (!bedrooms || getBedroomCondition(d.bedrooms, bedrooms))
    )
    const text = data?.map((listing) => {
        const text = `Price: ${listing.price}, net area ${listing.netArea}, link: flathunt.co/listing/${listing.listingId}`
        return text
    }).join(', ')
    const onShareClick = () => {
        if(!text){
            return;
        }
        copy(text)
    }

    const rows = filteredData?.map((row, i) => <>

        <ListingCard key={i+row.listingId} {...row} handleOpen={handleOpen} />


    </>

    )
    return (
        <Box mb={1}>
            {isLoading ? <CircularProgress /> : null}
            <Chip sx={{alignSelf: 'flex-start', m:1}} label={`${rows?.length} listings`}/>
            <Button onClick={onShareClick} size='small'>Share</Button>
            {rows}
            {!isNarrow && <Dialog

                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <EditListing userId={USER_ID} onClose={handleClose} listingId={editingListingId} />

            </Dialog>}
            {isNarrow && <Drawer
                open={open}
                anchor='bottom'
                onClose={handleClose}
            >
                <EditListing userId={USER_ID} onClose={handleClose} listingId={editingListingId} />

            </Drawer>}
            
        </Box>
    )
})