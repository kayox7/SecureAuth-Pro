const form = document.getElementById("registerForm");

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const strength = document.getElementById("strength");

const message = document.getElementById("message");

const togglePassword = document.querySelector(".togglePassword");

togglePassword.addEventListener("click", () => {

    password.type =
        password.type === "password" ? "text" : "password";

});

password.addEventListener("input", () => {

    const value = password.value;

    let score = 0;

    const checks = {

        length: value.length >= 8,

        upper: /[A-Z]/.test(value),

        lower: /[a-z]/.test(value),

        number: /[0-9]/.test(value),

        special: /[!@#$%^&*(),.?":{}|<>]/.test(value)

    };

    for (let key in checks) {

        const item = document.getElementById(key);

        if (checks[key]) {

            score++;

            item.style.color = "#00ff88";

        } else {

            item.style.color = "#ff6b6b";

        }

    }

    strength.style.width = (score * 20) + "%";

    if (score <= 2) {

        strength.style.background = "#ef4444";

    }

    else if (score <= 4) {

        strength.style.background = "#f59e0b";

    }

    else {

        strength.style.background = "#22c55e";

    }

});

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    message.innerHTML = "";

    if (password.value !== confirmPassword.value) {

        message.style.color = "#ff6b6b";

        message.innerHTML = "Passwords do not match";

        return;

    }

    const fullname = document.getElementById("fullname").value;

    const email = document.getElementById("email").value;

    const response = await fetch("/api/auth/register", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            fullname,

            email,

            password: password.value

        })

    });

    const data = await response.json();

    if (response.ok) {

        message.style.color = "#22c55e";

        message.innerHTML = "✅ Registration Successful";

        setTimeout(() => {

            window.location = "/login";

        }, 2000);

    }

    else {

        message.style.color = "#ff6b6b";

        if (data.errors) {

            message.innerHTML = data.errors[0].msg;

        }

        else {

            message.innerHTML = data.message;

        }

    }

});