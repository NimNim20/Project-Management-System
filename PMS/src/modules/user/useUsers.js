import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../fbfile/firebase.js";
import router from '/src/router/index.js'
import { ref, computed } from 'vue'




export const useUsers = () => {
    const user = ref(null);
    const error = ref(null);
    const isLoggedIn = ref(false);

    const isAdmin = computed(() => user.value && user.value.email === 'admin@admin.com');

    const userEmail = computed(() => user.value ? user.value.email : 'Guest');

    // Login function with error handling
    const login = async (email, password) => {
        error.value = null;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            isLoggedIn.value = true;
            router.push('/');
        } catch (err) {
            if (err.code === 'auth/wrong-password') {
                error.value = 'Incorrect password. Please try again.';
            } else if (err.code === 'auth/user-not-found') {
                error.value = 'No user found with this email.';
            } else if (err.code === 'auth/invalid-email') {
                error.value = 'Invalid email address.';
            } else {
                error.value = 'Login failed. Please try again later.';
            }
            console.log(err.code);
        }
    }

    // Logout function
    const logout = async () => {
        try {
            await signOut(auth);
            isLoggedIn.value = false;
            router.push('/');
        } catch (err) {
            console.log(err.message);
        }
    }

    // Track authentication state changes
    onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser;
        isLoggedIn.value = !!currentUser;
    });

    return {
        user,
        error,
        isLoggedIn,
        login,
        logout,
        isAdmin,
        userEmail
    };
}
