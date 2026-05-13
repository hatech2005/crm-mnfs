import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export const setupRootUser = async () => {
  try {
    const email = "root@minhnhat.com";
    const password = "ha123456";
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      role: "admin",
      displayName: "Root Admin",
      createdAt: new Date().toISOString()
    });

    console.log("Root user created successfully!");
    return true;
  } catch (error) {
    console.error("Error creating root user:", error);
    return false;
  }
};
