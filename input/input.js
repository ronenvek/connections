import { saveUserData, getUserData } from '../firebase.js';


document.addEventListener("DOMContentLoaded", () => {
    const inputList = document.getElementById("input-list");

    const name = sessionStorage.getItem("name");

    if (!name || !name.trim()) {
        window.location.href = "../index.html";
        return;
    }
    document.getElementById("welcome").textContent = `Editing: ${name}`;


    let lastAddedInput = null;

    getUserData(name).then(names => {
        names.forEach(n => addNameInput(n));
        addNameInput();

        setTimeout(() => {
            const allInputs = document.querySelectorAll(".name-input");
            const lastInput = allInputs[allInputs.length - 1];
            if (lastInput) lastInput.focus();
        }, 0);
    });

    function addNameInput(text = "") {
        const inputWrapper = document.createElement("div");
        inputWrapper.className = "input-wrapper";

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Enter a name";
        input.className = "name-input";
        input.value = text;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.className = "delete-btn";
        deleteButton.tabIndex = -1;

        inputWrapper.appendChild(input);
        inputWrapper.appendChild(deleteButton);
        inputList.appendChild(inputWrapper);

        lastAddedInput = input;

        input.addEventListener("beforeinput", (e) => {
            if (e.data && !/^[a-zA-Z\s]+$/.test(e.data)) {
                e.preventDefault();
            }
        });

        input.addEventListener("input", () => {
            const allInputs = inputList.querySelectorAll(".name-input");
            const lastInput = allInputs[allInputs.length - 1];
            if (input === lastInput && input.value.trim() !== "") {
                addNameInput();
            }
        });

        input.addEventListener("blur", function () {
            if (!input.value.trim()) deleteInput();
        });

        input.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                save();
            }
        });

        deleteButton.addEventListener("click", () => {
            deleteInput();
        });

        function deleteInput() {
            if (input !== lastAddedInput) {
                inputList.removeChild(inputWrapper);
            }
            ensureAtLeastOneInput();
        }

    }

    function ensureAtLeastOneInput() {
        if (!inputList.querySelector(".name-input")) {
            addNameInput();
        }
    }

});

document.getElementById("back-btn").addEventListener("click", () => {
    window.location.href = "../login/login.html";
});

function save(){
    const loginName = sessionStorage.getItem("name");
    if (!loginName) {
        alert("Login name not found!");
        window.location.href = "../index.html";
        return;
    }

    const nameInputs = document.querySelectorAll(".name-input");
    const names = Array.from(nameInputs)
        .map(input => input.value.trim())
        .filter(name => name !== "");

    if (names.length === 0) {
        alert("Please enter at least one name.");
        return;
    }

    saveUserData(loginName, names).then(result => {
        if (result){
            window.location.href = "../index.html";
            alert("Saved");
        }
        else{
            alert("Error saving");
        }
    });
}

document.getElementById("finish-btn").addEventListener("click", () => {
    save();
});
