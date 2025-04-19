function login() {
    const username = document.getElementById('name').value;
    if (username.trim()) {
        sessionStorage.setItem("name", username.trim());
        window.location.href = "../input/input.html";
    } else {
        alert("Please enter a username.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById('name');

    input.addEventListener("beforeinput", (e) => {
        if (e.data && !/^[a-zA-Z\s]+$/.test(e.data)) {
            e.preventDefault();
        }
    });

    input?.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            login();
        }
    });
});


document.getElementById("finish-btn").addEventListener("click", () => {
    login()
});
