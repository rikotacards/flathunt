export const getRangeLabel = (minPrice?: number, maxPrice?: number, units?: string, fallbackValue?: string) => {
    if (maxPrice && !minPrice) {
        return `<= ${maxPrice} ${units || ''}`
    }
    if (minPrice && !maxPrice) {
        return `>= ${minPrice} ${units || ''}`
    }
    if (!maxPrice && !minPrice) {
        return fallbackValue || 'Price'
    }
    return `${minPrice}${units}-${maxPrice}${units}`
}