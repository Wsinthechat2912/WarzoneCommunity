import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";

const authService = {
  signIn: async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};

export default authService;
