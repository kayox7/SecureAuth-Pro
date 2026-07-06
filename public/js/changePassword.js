const form = document.getElementById("changePasswordForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const currentPassword =
        document.getElementById("currentPassword").value;

    const newPassword =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const response = await fetch("/api/auth/change-password", {

        method: "POST",

        credentials: "include",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            currentPassword,
            newPassword,
            confirmPassword

        })

    });

    const data = await response.json();

    if (data.success) {

        message.style.color = "green";

        message.innerHTML = data.message;

        setTimeout(() => {

            window.location = "/login";

        }, 2000);

    } else {

        message.style.color = "red";

        message.innerHTML = data.message;

    }

});