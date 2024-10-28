import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase.js";
import router from '/src/router/index.js'
import { ref } from 'vue'
// import { useProjects } from '../modules/useProjects'

export const useUsers = () => {
    const user = ref(null);
    const error = ref(null);  // Add a ref to track errors
    const isLoggedIn =ref(false);

    // Login function with error handling
    const login = async (email, password) => {
        error.value = null;  // Clear any previous error
        try {
            await signInWithEmailAndPassword(auth, email, password);
            isLoggedIn.value = true;
            router.push('/');  // Redirect to home or another route after login
        } catch (err) {
            // Set the error message based on Firebase error
            if (err.code === 'auth/wrong-password') {
                error.value = 'Incorrect password. Please try again.';
            } else if (err.code === 'auth/user-not-found') {
                error.value = 'No user found with this email.';
            } else if (err.code === 'auth/invalid-email') {
                error.value = 'Invalid email address.';
            } else {
                error.value = 'Login failed. Please try again later.';
            }
            console.log(err.code);  // Log the error for debugging purposes
        }
    }

    // Logout function
    const logout = async () => {
        try {
            await signOut(auth);
            isLoggedIn.value = false;
            // user.value = null;
            router.push('/');  // Redirect to home after logout
        } catch (err) {
            console.log(err.message);  // Log any logout errors
        }
    }

    // Admin login function
// const handleLogin = async () => {
//     await login('admin@admin.com', 'admin1')
//     isLoggedIn.value = true
//     if (user.value) {
//         useProjects()  // Fetch projects after login
//     }
// }

    // Track authentication state changes
    onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser;
        isLoggedIn.value = !!currentUser;
    })

    return {
        user,
        error,
        isLoggedIn,
        login,
        logout
    }
}
