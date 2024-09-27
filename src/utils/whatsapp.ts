interface WhatsAppMessageArgs {
    price: number;
    location: string;
    bedrooms: number;
    listingId: string;
    userId: string;
    address: string;
}
export const getWhatsappMessage = (args: WhatsAppMessageArgs) => {
    const {address, price, location, bedrooms, listingId, userId} = args
    const br = bedrooms === 0 ? 'studio' : `${bedrooms} bedrooms`
    return `Hi, I'm interested in your flat: \n${br}, \naddress: ${address}, ${location}, \nasking: ${price} HKD \n https://flathunt.co/listing/${listingId}?utm_source=whatsapp&utm_medium=flathunt&id=${userId}&listing=${listingId}`
   ;
}

