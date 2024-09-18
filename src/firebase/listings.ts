import { addDoc, and, collection, deleteDoc, doc, getDoc, getDocs, or, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { deleteObject, getStorage, listAll, ref } from "firebase/storage";
import { IFilters, IListing } from "./types";




type NewListingProps = Omit<IListing, "listingId">

export const getAgentListings = async (userId: string) => {
    const q = query(collection(db, "listings"), where('userId', '==', userId), orderBy('dateAdded', 'desc'));
    const res: IListing[] = [];
    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            res.push({ ...doc.data(), listingId: doc.id } as IListing)
        });
        console.log(res)

        return res
    } catch (e) {
        console.error(e)
        alert(e)

        return res
    }
}

export const getAllListings = async (filters: IFilters) => {
    console.log('CALLING getAllListings called', filters)

    const priceConstraints = and(where('price', '<=', Number(filters.maxPrice || 999999)), where('price', '>=', Number(filters.minPrice || 0)))
    const locationConstraint = where('location', filters.location ? '==' : '!=', filters.location ? filters.location : '')
    const areaConstraints = and(where('netArea', '<=', Number(filters.maxNetArea || 999999)), where('netArea', '>=', Number(filters.minNetArea || 0)))
    const q = query(collection(db, "listings"), and(
        priceConstraints,
        locationConstraint,
        areaConstraints
    )


    );
    const res: IListing[] = [];
    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            res.push({ ...doc.data(), listingId: doc.id } as IListing)
        });
        return res
    } catch (e) {
        console.error(e)
        return res
    }
}
export const getAllListingsNoFilters = async () => {

    const q = query(collection(db, "listings"), orderBy('dateAdded', 'desc'))
    const res: IListing[] = [];
    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            res.push({ ...doc.data(), listingId: doc.id } as IListing)
        });
        console.log('res', res)
        return res
    } catch (e) {
        console.error(e)
        return res
    }
}

export const getListing = async (listingId: string) => {
    const docRef = doc(db, "listings", listingId)
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { ...docSnap.data(), listingId: docSnap.id } as IListing
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    } catch (e) {
        alert(e)
    }
}

export const addListing = async (args: NewListingProps) => {
    // deduct quota
    try {
        const docRef = await addDoc(collection(db, "listings"), {
            ...args,
            dateAdded: serverTimestamp()
        });
        return docRef
    } catch (e) {
        alert(e)
    }
}
interface AddContactRequestProps {
    sendingUserId: string,
    receivingUserId: string,
    listingId: string,
    message?: string,
    contactNumber: string,
    requestId?: string
}
export const addContactRequest = async (args: AddContactRequestProps) => {
    try {
        console.log("adding")
        const docRef = await addDoc(
            collection(db, "requests"), {
            ...args,
            dateAdded: serverTimestamp()
        });
        return docRef
    } catch (e) {
        alert(e)
    }
}
export const getRequests = async (userId:string) => {
    try {
        const q = query(collection(db,"requests"  ), where("receivingUserId", "==", userId))
        const res: AddContactRequestProps[] = [];
        try {
            const querySnapshot = await getDocs(q);
         
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                res.push({ ...doc.data(), requestId: doc.id} as AddContactRequestProps)
            });
            console.log('res', res)
            return res
        } catch (e) {
            console.error(e)
            return res
        }
    } catch (e) {
        alert(e)
    }
}

interface UpdateListingProps {
    [key: string]: string | number;
}
export const updateListing = async (docId: string, updatedData: UpdateListingProps) => {
    const ref = doc(db, "listings", docId);
    try {
        await updateDoc(ref, updatedData)
    } catch (e) {
        alert(e)
    }
}

export const deleteListings = async (listingIds: string[], userId: string) => {
    const storage = getStorage();
    for (const listingId of listingIds) {
        const listRef = ref(storage, `${userId}/${listingId}`)
        listAll(listRef).then((res) => {
            res.items.forEach((item) => {
                const fileRef = ref(storage, `${userId}/${listingId}/${item.name}`)
                deleteObject(fileRef)
            })
        })
        await deleteDoc(doc(db, "listings", listingId))
    }
}

// post listing, is just update listing with status as "live"
// listing as draft is just upate listing with status as "draft"

export interface SaveListingProps {
    userId: string,
    listingId: string,
}

export const getSavedListings = async (userId: string) => {
    const q = query(collection(db, "users", userId || "max", "savedListings"));
    const res: { docId: string, listingId: string }[] = [];
    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            res.push({ listingId: doc.data().listingId, docId: doc.id })
        });
        return res
    } catch (e) {
        alert(e)
    }
}



export const saveListing = async (args: SaveListingProps) => {
    // users/userId/savedListings/listingId
    try {
        await addDoc(collection(db, "users", args.userId, "savedListings"), { listingId: args.listingId })
    } catch (e) {
        alert(e)
    }
}

interface RemoveListingProps {
    userId: string,
    docIds: string[]
}
export const removeSavedListings = async (args: RemoveListingProps) => {
    args.docIds.map(async (docId) => {
        await deleteDoc(doc(db, "users", args.userId, "savedListings", docId))
    })
}

