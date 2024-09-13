import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from "@mui/material";

export const useIsNarrow = () => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    return matches
}