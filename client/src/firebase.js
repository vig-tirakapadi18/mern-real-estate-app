import { initializeApp } from "firebase/app";

const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: "mern-7e1e5.firebaseapp.com",
        projectId: "mern-7e1e5",
        storageBucket: "mern-7e1e5.appspot.com",
        messagingSenderId: "10074105228",
        appId: "1:10074105228:web:ab4e88e7325b8f407522a9"
};

export const app = initializeApp(firebaseConfig);