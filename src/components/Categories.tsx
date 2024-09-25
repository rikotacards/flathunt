import { Box, IconButton, Typography, Zoom } from '@mui/material'
import React from 'react'
import PetsIcon from '@mui/icons-material/Pets';
import RoofingIcon from '@mui/icons-material/Roofing';
import StairsIcon from '@mui/icons-material/Stairs';
import CabinIcon from '@mui/icons-material/Cabin';
import ChairIcon from '@mui/icons-material/Chair';
import { useFilterContext } from '../Providers/contextHooks';
import { IFilters } from '../firebase/types';
import DeckIcon from '@mui/icons-material/Deck';

import { MoneyOff } from '@mui/icons-material';
import { useNavigate } from 'react-router';
interface CategoryProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}

const categories: {label: string, fieldName: keyof IFilters, icon: React.ReactNode}[] = [
    {label:'pet friendly',
        fieldName: 'hasPetFriendly',
        icon: <PetsIcon/>

    },
    {
        label: 'Rooftops',
        fieldName: 'hasRooftop',
        icon: <RoofingIcon/>

    },
    {label: 'Walk ups',
        fieldName: 'hasWalkup',
        icon: <StairsIcon/>

    },
    {label: 'Balcony',
        fieldName: 'hasBalcony',
        icon: <DeckIcon/>

    },
    {

        label: 'Luxury',
        fieldName: 'hasLuxury',
        icon: <ChairIcon/>
    },
    {

        label: 'No Fees',
        fieldName: 'isDirectListing',
        icon: <MoneyOff/>
    }
    
]
const Category: React.FC<CategoryProps> = ({icon, label, onClick}) => {

  
    return (
        <Box sx={{
         
            mr: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Zoom in>

            <IconButton onClick={onClick}>

            {icon}
            </IconButton>
            </Zoom>
            <Typography sx={{whiteSpace: 'nowrap'}} variant='caption'>{label}</Typography>
        </Box>
    )
}

export const Categories: React. FC = () => {
    const {filters, setFilters} = useFilterContext();
    const nav = useNavigate();
    const onClick = (category: keyof IFilters) => {
        if(category === 'hasLuxury'){
            setFilters((p) => ({...p, minPrice : 60000}))
            nav('/search-results')
            return;

        }
        setFilters((p) => ({...p, [category] : true}))
        nav('/search-results')
    }

    return (
        <Box sx={{ alignItems: 'flex-start', display: 'flex', justifyContent: 'space-between',    overflowX: 'auto',}}>

        {categories.map((c) => <Category key={c.fieldName} onClick={() => onClick(c.fieldName)} {...c}/>)}
        </Box>
    )
}