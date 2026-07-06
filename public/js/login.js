const form = document.getElementById("loginForm");
const message = document.getElementById("message");
const loginBtn = document.querySelector(".login-btn");

let pendingUserId = null;

// Show / Hide Password
document.getElementById("togglePassword").addEventListener("click", () => {

    const password = document.getElementById("password");

    password.type = password.type === "password" ? "text" : "password";

});

// Login Form
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    message.innerHTML = "";

    loginBtn.disabled = true;

    loginBtn.innerHTML = pendingUserId ? "Verifying..." : "Logging in...";

    try {

        // ===========================
        // VERIFY OTP
        // ===========================

        if (pendingUserId) {

            const otp = document.getElementById("otp").value;

            const response = await fetch("/api/2fa/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    userId: pendingUserId,

                    token: otp

                })

            });

            const data = await response.json();

            if (data.success) {

                message.style.color = "#90EE90";

                message.innerHTML = "✅ Login Successful";

                setTimeout(() => {

                    window.location = "/dashboard";

                }, 1000);

            } else {

                message.style.color = "#ff6666";

                message.innerHTML = data.message;

            }

        }

        // ===========================
        // NORMAL LOGIN
        // ===========================

        else {

            const email = document.getElementById("email").value;

            const password = document.getElementById("password").value;

            const response = await fetch("/api/auth/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    email,

                    password

                })

            });

            const data = await response.json();

            if (!data.success) {

                message.style.color = "#ff6666";

                message.innerHTML = data.message;

            }

            else if (data.requires2FA) {

                pendingUserId = data.userId;

                document.getElementById("otpSection").style.display = "block";

                document.getElementById("email").disabled = true;

                document.getElementById("password").disabled = true;

                document.getElementById("rememberMe").disabled = true;

                message.style.color = "#ffd966";

                message.innerHTML = "Enter the 6-digit code from Google Authenticator.";

                loginBtn.innerHTML = "Verify OTP";

            }

            else {

                message.style.color = "#90EE90";

                message.innerHTML = "✅ Login Successful";

                setTimeout(() => {

                    window.location = "/dashboard";

                }, 1000);

            }

        }

    }

    catch (err) {

        console.error(err);

        message.style.color = "#ff6666";

        message.innerHTML = "Server Error";

    }

    loginBtn.disabled = false;

    loginBtn.innerHTML = pendingUserId ? "Verify OTP" : "Login";

});

const verifyModal = document.getElementById("verifyModal");

document.getElementById("resendVerification").onclick = (e) => {

    e.preventDefault();

    verifyModal.style.display = "flex";

};

document.getElementById("closeVerifyModal").onclick = () => {

    verifyModal.style.display = "none";

};

document.getElementById("sendVerificationBtn").addEventListener("click", async () => {

    const email = document.getElementById("verifyEmail").value;

    const response = await fetch("/api/auth/resend-verification", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({ email })

    });

    const data = await response.json();

    const msg = document.getElementById("verifyMessage");

    msg.innerHTML = data.message;

    msg.style.color = data.success ? "green" : "red";

});
window.addEventListener("pageshow", () => {

    document.getElementById("loginForm").reset();

});
const forgotModal=document.getElementById("forgotModal");

document.getElementById("forgotPasswordLink").onclick=(e)=>{

    e.preventDefault();

    forgotModal.style.display="flex";

    document.getElementById("forgotEmail").value=
        document.getElementById("email").value;

};

document.getElementById("closeForgotModal").onclick=()=>{

    forgotModal.style.display="none";

};

document.getElementById("sendResetBtn").addEventListener("click",async()=>{

    const email=document.getElementById("forgotEmail").value;

    const response=await fetch("/api/password/forgot",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({email})

    });

    const data=await response.json();

    document.getElementById("forgotMessage").innerHTML=data.message;

    document.getElementById("forgotMessage").style.color=
        data.success?"green":"red";

});