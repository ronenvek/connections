function login() {
    const username = document.getElementById('name').value;
    if (username.trim()) {
        sessionStorage.setItem("name", username.trim());
        window.location.href = "../input/input.html";
    }
}

document.addEventListener("DOMContentLoaded", () => {



    const input = document.getElementById('name');

    const name = sessionStorage.getItem("name");

    if (name && name.trim())
        input.value = name;

    input.addEventListener("beforeinput", (e) => {
        if (e.data && !/^[a-zA-Z\s]+$/.test(e.data)) {
            e.preventDefault();
        }
    });

    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            login();
        }
    });

    setTimeout(() => {
        input.focus();
    }, 0);
});
document.getElementById("back-btn").addEventListener("click", () => {
    login()
    window.location.href = "../index.html";
});

document.getElementById("finish-btn").addEventListener("click", () => {
    login()
});
