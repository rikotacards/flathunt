export const getBedroomsLabel = (bedrooms?:string) => {
    if (bedrooms === 'studio') {
        return 'studio'
    }
    if (bedrooms === '' || bedrooms === undefined) {
        return 'bedrooms'
    }

    return `${bedrooms} bedrooms`
}