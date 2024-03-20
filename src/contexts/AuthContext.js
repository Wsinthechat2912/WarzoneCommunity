import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { getDatabase, ref, get } from "firebase/database";
import { Text, View, ActivityIndicator } from "react-native";

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // This fetches additional user data from the database
        const database = getDatabase();
        const userRef = ref(database, `users/${user.uid}`);
        get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              setUserData(snapshot.val());
            } else {
              console.log("No user data available");
            }
            setLoading(false);
          })
          .catch((error) => {
            console.error(error);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user: currentUser, userData }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
