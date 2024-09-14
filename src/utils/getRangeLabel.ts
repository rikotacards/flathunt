export const getRangeLabel = (minPrice?: number, maxPrice?: number, units?: string) => {
    if (maxPrice && !minPrice) {
        return `<= ${maxPrice} ${units || ''}`
    }
    if (minPrice && !maxPrice) {
        return `>= ${minPrice} ${units || ''}`
    }
    if (!maxPrice && !minPrice) {
        return 'Price'
    }
    return `${minPrice}${units}-${maxPrice}${units}`
}