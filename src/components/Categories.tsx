import { Box, IconButton, Typography, Zoom } from '@mui/material'
import React from 'react'
import PetsIcon from '@mui/icons-material/Pets';
import RoofingIcon from '@mui/icons-material/Roofing';
import StairsIcon from '@mui/icons-material/Stairs';
import CabinIcon from '@mui/icons-material/Cabin';
import ChairIcon from '@mui/icons-material/Chair';
interface CategoryProps {
    icon: React.ReactNode;
    label: string;
}

const categories = [
    {label:'pet friendly',
        icon: <PetsIcon/>

    },
    {
        label: 'Rooftops',
        icon: <RoofingIcon/>

    },
    {label: 'Walk ups',
        icon: <StairsIcon/>

    },
    {label: 'House', icon: <CabinIcon/>},
    {
        label: 'Luxury',
        icon: <ChairIcon/>
    }
    
]
const Category: React.FC<CategoryProps> = ({icon, label}) => {
    return (
        <Box sx={{mr: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Zoom in>

            <IconButton>

            {icon}
            </IconButton>
            </Zoom>
            <Typography variant='caption'>{label}</Typography>
        </Box>
    )
}

export const Categories: React. FC = () => {
    return (
        <Box sx={{display: 'flex', justifyContent: 'space-around'}}>

        {categories.map((c) => <Category {...c}/>)}
        </Box>
    )
}