import { Button, Card, MenuItem } from '@mui/material';
import React from 'react';
import { FiltersPopoverInterface } from '../firebase/types';
const rooms = ['studio', '1', '1+', '2', '2+', '3', '3+']

export const BedroomsFilter: React.FC<FiltersPopoverInterface> = ({ setFilter, onClose}) => {
    return (
        <Card sx={{p:1}}>
            {rooms.map((r) => <MenuItem key={r} onClick={() => {setFilter((p) =>({...p, bedrooms: r}));onClose()}}>{r}</MenuItem>)}
            <Button fullWidth onClick={() => {setFilter((p) =>({...p, bedrooms: ''})); onClose()}}>clear</Button>
        </Card>
    )
}