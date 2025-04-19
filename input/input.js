document.addEventListener("DOMContentLoaded", () => {
    const inputList = document.getElementById("input-list");

    const name = sessionStorage.getItem("name");

    if (!name || !name.trim()) {
        window.location.href = "../login/login.html"; // Replace with your actual login page filename
        return;
    }
    document.getElementById("welcome").textContent = `Welcome, ${name}!`;

    let lastAddedInput = null;

    addNameInput();

    function addNameInput() {
        const inputWrapper = document.createElement("div");
        inputWrapper.className = "input-wrapper";

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Enter a name";
        input.className = "name-input";

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

document.getElementById("finish-btn").addEventListener("click", () => {
    alert("Finish clicked!");
});
