import { ILocation } from "./firebase/types"

export const fields = [
    { name: 'address', type: 'text', placeholder: 'Building name or address', label: 'Building name or address' },
    { name: 'price', type: 'number', placeholder: 'Monthly rent (HKD)', label: 'Monthly rent (HKD)' },
    { name: 'netArea', type: 'number', placeholder: 'Net Area', label: 'Net Area' },


    { name: 'grossArea', type: 'number', placeholder: 'Gross Area', label: 'Gross Area' },
]
export const bedrooms = [0, 1, 2, 3, 4, 5]
export const bathrooms = [1, 2, 3, 4]
export const additionalFeatures = ['elevator', 'balcony', 'bathtub', 'Rooftop', 'Open kitchen', 'Closed Kitchen', 'Walk up', 'Pet friendly', 'fully furnished', 'no agency fee']

export const hkLocations = [
    {
        name: 'Hong Kong Island',
        children: [
            {
                name: 'central and western',
                children: [
                    {
                        name: 'aberdeen'
                    },
                    {
                        name: 'admiralty'
                    },
                    {
                        name: 'Ap lei chau'
                    },
                    {
                        name: 'Big wave bay'
                    },
                    {
                        name: 'Braemar hill'
                    },
                    {
                        name: 'Causeway Bay'
                    },
                    {
                        name: 'Central',
                    },
                    {

                        name: 'Chai Wan'
                    },
                    {
                        name: 'wanchai'
                    }


                ]
            }, 
            {
                name: 'Eastern', 
                children: []
            }, 
        ]
    },

    { 
        name: 'Kowloon', 
     },
     
    { 
        name: 'New Territories East', 
       
     }

]

