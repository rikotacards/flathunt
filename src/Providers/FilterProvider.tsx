
import React from 'react';
import { IFilters } from '../firebase/types';

interface FiltersContextProps {
    filters: IFilters, 
    setFilters: React.Dispatch<React.SetStateAction<IFilters>>;
}

export const FiltersContext = React.createContext({} as FiltersContextProps)
interface FiltersProviderProps {
    children: React.ReactNode;
}
export const FiltersProvider: React.FC<FiltersProviderProps> = ({children}) => {
    const [filters, setFilters] = React.useState({} as IFilters);
 
    const value = {
        filters, 
        setFilters,
    }
    return (
        <FiltersContext.Provider value={value}>
            {children}
        </FiltersContext.Provider>
    )
}