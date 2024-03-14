import {
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase/config";

const authService = {
  // Login function
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Send email verification to the current user
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

  // Updates the user's email and sends a verification email to the new email
  updateEmail: async (newEmail) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateEmail(user, newEmail);
        await user.reload();
        await sendEmailVerification(auth.currentUser); // Send verification to the new email
        console.log("Verification email sent to the new email.");
      }
    } catch (error) {
      console.error("Error updating email:", error);
      throw error;
    }
  },

  // Updates the user's profile, for example, their display name
  updateProfile: async (name) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, { displayName: name });
        console.log("Profile updated successfully.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },
};

export default authService;
