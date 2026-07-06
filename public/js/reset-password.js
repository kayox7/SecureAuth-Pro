const form = document.getElementById("resetForm");
const message = document.getElementById("message");

// Read token from URL
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const password = document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {

        message.style.color = "red";

        message.innerHTML = "Passwords do not match.";

        return;

    }

    const response = await fetch("/api/password/reset", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            token,

            password

        })

    });

    const data = await response.json();

    if (data.success) {

        message.style.color = "green";

        message.innerHTML = "Password changed successfully.";

        setTimeout(() => {

            window.location = "/login";

        }, 2000);

    }

    else {

        message.style.color = "red";

        message.innerHTML = data.message;

    }

});