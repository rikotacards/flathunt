import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();
export const onSignOut = (onComplete: () => void) => signOut(auth).then(() => {
  // Sign-out successful.
  onComplete()
}).catch((error) => {
  // An error happened.
});