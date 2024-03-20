import {
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateEmail,
  updateProfile,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { getDatabase, ref, set, get, remove } from "firebase/database";
import { auth } from "../../firebase/config";

const database = getDatabase();

const authService = {
  getCurrentUserId: () => {
    return auth.currentUser ? auth.currentUser.uid : null;
  },

  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  },

  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  getUserData: async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const userRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("No user data found");
    }
  },

  signup: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);

      const userProfileRef = ref(database, `users/${user.uid}`);
      await set(userProfileRef, { email: email });

      return { success: true, user: user };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: error.message };
    }
  },

  sendVerification: async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await sendEmailVerification(user);
        console.log("Verification email sent.");
      } catch (error) {
        console.error("Error sending email verification", error);
        throw error;
      }
    }
  },

  searchUserByEmail: async (email) => {
    const usersRef = ref(database, "users/");
    let targetUserUID = null;

    const snapshot = await get(usersRef);
    snapshot.forEach((childSnapshot) => {
      const user = childSnapshot.val();
      if (user.email === email) {
        targetUserUID = childSnapshot.key;
      }
    });
    if (!targetUserUID) {
      return null;
    }
    return targetUserUID;
  },

  sendFriendRequest: async (targetEmail) => {
    const currentUserUid = this.getCurrentUserId();
    if (!currentUserUid) {
      return { success: false, message: "User not authenticated" };
    }

    const targetUserUID = await this.searchUserByEmail(targetEmail);
    if (!targetUserUID) {
      return { success: false, message: "User not found" };
    }

    if (targetUserUID === currentUserUid) {
      return { success: false, message: "Cannot send a request to yourself." };
    }

    const requestRef = ref(
      database,
      `friendRequests/${targetUserUID}/${currentUserUid}`
    );
    const reverseRequestRef = ref(
      database,
      `friendRequests/${currentUserUid}/${targetUserUID}`
    );

    const [existingRequestSnapshot, reverseRequestSnapshot] = await Promise.all(
      [get(requestRef), get(reverseRequestRef)]
    );

    if (existingRequestSnapshot.exists() || reverseRequestSnapshot.exists()) {
      return {
        success: false,
        message: "Friend request already sent or received.",
      };
    }

    await set(requestRef, {
      senderId: currentUserUid,
      recipientId: targetUserUID,
      status: "pending",
      timestamp: Date.now(),
    });

    return { success: true, message: "Friend request sent successfully." };
  },

  fetchFriendRequests: async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return [];

    const requestRef = ref(database, `friendRequests/${currentUser.uid}`);
    const snapshot = await get(requestRef);
    if (!snapshot.exists()) return [];

    const requests = [];
    snapshot.forEach((childSnapshot) => {
      requests.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });
    return requests;
  },

  respondToFriendRequest: async (requestId, accept) => {
    const currentUser = auth.currentUser;
    if (!currentUser)
      return { success: false, message: "User not authenticated" };

    const requestRef = ref(
      database,
      `friendRequests/${currentUser.uid}/${requestId}`
    );
    if (accept) {
      // Add to friends list if accepted
      const friendRefCurrentUser = ref(
        database,
        `users/${currentUser.uid}/friends/${requestId}`
      );
      const friendRefRequester = ref(
        database,
        `users/${requestId}/friends/${currentUser.uid}`
      );
      await set(friendRefCurrentUser, true);
      await set(friendRefRequester, true);
    }
    // Remove friend request after response
    await remove(requestRef);

    return {
      success: true,
      message: accept ? "Friend request accepted" : "Friend request declined",
    };
  },

  fetchFriends: async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No current user for fetchFriends.");
      return [];
    }

    const friendsRef = ref(database, `users/${user.uid}/friends`);
    try {
      const snapshot = await get(friendsRef);
      if (snapshot.exists()) {
        console.log("Friends data found");
        const friendsIds = Object.keys(snapshot.val());
        const friendsDetails = [];

        for (const friendId of friendsIds) {
          const friendDetailRef = ref(database, `users/${friendId}`);
          const friendSnapshot = await get(friendDetailRef);
          if (friendSnapshot.exists()) {
            friendsDetails.push({
              id: friendId,
              ...friendSnapshot.val(),
            });
          }
        }
        console.log(friendsDetails);
        return friendsDetails;
      } else {
        console.log("No friends data available");
        return [];
      }
    } catch (error) {
      console.error("Error fetching friends data:", error);
      return [];
    }
  },

  updateEmail: async (newEmail) => {
    const currentUser = auth.currentUser;
    if (!currentUser)
      return { success: false, message: "User not authenticated" };

    try {
      await updateEmail(currentUser, newEmail);
      await sendEmailVerification(currentUser);
      return {
        success: true,
        message: "Email updated and verification email sent",
      };
    } catch (error) {
      console.error("Error updating email:", error);
      return { success: false, error: error.message };
    }
  },

  updateProfile: async (name) => {
    const currentUser = auth.currentUser;
    if (!currentUser)
      return { success: false, message: "User not authenticated" };

    try {
      await updateProfile(currentUser, { displayName: name });
      return { success: true, message: "Profile updated successfully" };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: error.message };
    }
  },

  updateProfileName: async (userId, newName) => {
    const userProfileRef = ref(database, `users/${userId}`);
    await update(userProfileRef, { name: newName });
  },

  signOutUser: async () => {
    try {
      await signOut(auth);
      return { success: true, message: "User signed out successfully" };
    } catch (error) {
      console.error("Error signing out:", error);
      return { success: false, error: error.message };
    }
  },
};

export default authService;
