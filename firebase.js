import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
    getFirestore,
    collection,
    getDocs,
    getDoc,
    doc,
    setDoc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseApp = initializeApp({
    apiKey: "AIzaSyDDRY7A7yFWZ_3tBp4OuJU73Cr9fG3GesY",
    authDomain: "fordavid-b344e.firebaseapp.com",
    projectId: "fordavid-b344e",
    storageBucket: "fordavid-b344e.firebasestorage.app",
    messagingSenderId: "672592466405",
    appId: "1:672592466405:web:db62bbad1b882820c11f0c"
});

const db = getFirestore(firebaseApp);

export async function getAllUsers() {
    try {
        const colRef = collection(db, "users");
        const querySnapshot = await getDocs(colRef);
        const names = [];

        querySnapshot.forEach(doc => names.push(doc.id));

        return names;
    } catch (error) {
        console.error("Error fetching document names:", error);
        return [];
    }
}

export async function getUserData(loginName) {
    try {
        const docRef = doc(db, "users", loginName);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("User Data:", data);
            return data.names || [];
        } else {
            console.log("No such document!");
            return [];
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return [];
    }
}
export async function saveUserData(loginName, names) {
    try {
        await setDoc(doc(db, "users", loginName), {
            names: names
        });
        console.log("User data saved successfully!");
        return true;
    } catch (error) {
        console.error("Error saving user data: ", error);
        return false;
    }
}