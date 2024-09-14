import { onAuthStateChanged, User } from "firebase/auth";
import React from "react";
import { auth } from "../firebase/firebaseConfig";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "../firebase/user";
interface AuthContextProps {
  user: User | null;
  isUserLoading: boolean;
  contactNumber?: string;
}
export const AuthContext = React.createContext({} as AuthContextProps);
interface AuthProviderProps {
  children: React.ReactNode;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isUserLoading, setIsLoading] = React.useState(true);

  const [user, setUser] = React.useState<User | null>({} as User);
  const { data, isLoading } = useQuery({
    queryKey: ["getUser"],
    queryFn: () => getUser(user?.uid || ''),
  });
  const queryClient = useQueryClient();

  React.useEffect(() => {
    queryClient.invalidateQueries({queryKey:['getUser'], exact: true})
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Note: this logic should be added in your signin process and not here.
        setIsLoading(false);
        setUser(user);
      } else {
        console.log(data)
        setUser(null);

      }
    });
    return () => {
      unsubscribe();
    };
  }, [user?.uid]);
  const value = {
    user,
    isUserLoading,
    contactNumber: data?.contactNumber
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
