import { Box, TextField, Typography } from '@mui/material'
import React from 'react'
interface AddListingPriceProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>void;
    price?: number;
    rentBuy?: 'rent' | 'sale';
}
export const AddListingPrice: React.FC<AddListingPriceProps> = ({
    onChange,
    price,
    rentBuy
}) => {

    return (
        <Box sx={{p:2}}>
            <Typography variant='h6'>Price</Typography>
            {rentBuy === 'sale' ? <Typography variant='body2'>Purchase Price</Typography>: <Typography variant='body2'>Monthly rental price (HKD)</Typography>}
            <TextField
            autoFocus

                required
                size="small"
                fullWidth
                name="price"
                type="tel"
                placeholder="80000"
                onChange={onChange}
                value={price}
              />
        </Box>
    )
}