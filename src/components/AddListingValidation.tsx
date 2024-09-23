import { Box, LinearProgress } from '@mui/material';
import React from 'react';

interface AddListingValidationProps {
    requiredSteps: boolean[]
}
export const AddListingValidation: React.FC<AddListingValidationProps> = ({requiredSteps}) => {
    const total = requiredSteps.length;
    const completed = requiredSteps.filter((step) => step == true).length
    const ratio = (completed/total) * 100
    return (
        <Box>
            <LinearProgress sx={{width:'100%'}} variant='determinate' value={ratio}/>
            
        </Box>
    )
}