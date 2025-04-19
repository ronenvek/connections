import {getUserData, getAllUsers, saveUserData} from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
    const viewButton = document.getElementById("viewBtn");
    const inputButton = document.getElementById("inputBtn");




    viewButton.addEventListener("click", () => {
        window.location.href = "connections/connections.html";  // Navigate to the view page
    });

    inputButton.addEventListener("click", () => {
        window.location.href = "login/login.html";  // Navigate to the input page
    });

});

