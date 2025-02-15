import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

interface UpdateListingProps {
    [key: string]: string | number | undefined;
}
export const updateUser = async (uid: string, data: UpdateListingProps) => {
    const ref = doc(db, "users", uid);
    try {
        await updateDoc(ref, data)
    } catch (e) {
        throw(e)
        alert(e)
    }
}
interface NewUser {
    userId: string, 
    contactNumber?: string;
    realEstateCompany?: string;
    licenseNumber?: string;
    personalLicenseNumber?: string;
}
export const addUser = async (args: NewUser) => {
    try {
        const docRef = await setDoc(
            doc(db, "users", args.userId), {
            ...args,
            dateAdded: serverTimestamp()
        }, {merge: true});
        return docRef
    } catch (e) {
        alert(e)
    }
}


export const getUser = async (userId: string) => {
    const docRef = doc(db, "users", userId)
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { ...docSnap.data(), userId: docSnap.id } as NewUser
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
            return {realEstateCompany: undefined, licenseNumber: undefined, personalLicenseNumber: undefined}
        }
    } catch (e) {
        alert(e)
    }
}