export const getBedroomsLabel = (minBedrooms?: number, maxBedrooms?: number, units?: string) => {
    if(minBedrooms !== undefined && maxBedrooms !== undefined){
        if(minBedrooms === maxBedrooms){
            if(minBedrooms === 0){
                return 'studio'
            }
            return minBedrooms
        }
       return `${minBedrooms}+ Br` 
    }
    return ''
}