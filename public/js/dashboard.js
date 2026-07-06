async function loadDashboard() {

    try {

        const response = await fetch("/api/user/dashboard", {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();

        if (!data.success) {
            window.location = "/login";
            return;
        }

        document.getElementById("fullname").textContent = data.user.fullname;

        document.getElementById("email").textContent = data.user.email;

        document.getElementById("role").textContent = data.user.role;

        document.getElementById("roleCard").textContent =
            data.user.role.toUpperCase();

        document.getElementById("navUser").innerHTML =
            `<i class="fa-solid fa-user"></i> ${data.user.fullname}`;

        // ===== 2FA Status =====

        if (data.user.two_factor_enabled) {

            document.getElementById("twoFAStatus").innerHTML =
                "Enabled 🟢";

            document.getElementById("enable2FA").disabled = true;

            document.getElementById("enable2FA").innerHTML =
                '<i class="fa-solid fa-lock"></i> 2FA Enabled';

        } else {

            document.getElementById("twoFAStatus").innerHTML =
                "Disabled 🔴";

        }

    } catch (err) {

        console.error(err);

        window.location = "/login";

    }

}


async function loadLoginHistory() {

    const response = await fetch("/api/user/login-history", {

        credentials: "include"

    });

    const data = await response.json();

    if (!data.success) return;

    const container = document.getElementById("loginHistory");

    container.innerHTML = "";

    data.history.forEach(login => {

        container.innerHTML += `

        <div style="margin-bottom:15px;">

            <strong>${login.login_status}</strong><br>

            🌐 ${login.browser}<br>

            💻 ${login.os}<br>

            📍 ${login.ip_address}<br>

            🕒 ${new Date(login.login_time).toLocaleString()}

            <hr>

        </div>

        `;

    });

}
async function logout() {

    const response = await fetch("/api/auth/logout", {

        method: "POST",

        credentials: "include"

    });

    const data = await response.json();

    if (data.success) {

    // Clear dashboard data
    document.getElementById("fullname").textContent = "";
    document.getElementById("email").textContent = "";
    document.getElementById("role").textContent = "";
    document.getElementById("roleCard").textContent = "";
    document.getElementById("navUser").innerHTML = "";

    localStorage.clear();
    sessionStorage.clear();

    window.location.replace("/login");

} else {

        alert(data.message);

    }

}

// Temporary logout (we'll replace with backend logout next)

document.getElementById("logoutBtn").addEventListener("click", logout);

document.getElementById("logoutButton").addEventListener("click", logout);

document.getElementById("enable2FA").addEventListener("click", async () => {

    const response = await fetch("/api/2fa/setup", {

        method: "POST",

        credentials: "include"

    });

    const data = await response.json();

    if (!data.success) {

        alert(data.message);

        return;

    }

    document.getElementById("twoFactorBox").style.display = "block";

    document.getElementById("qrImage").src = data.qrCode;

    document.getElementById("secretKey").innerHTML = data.secret;

});

document.getElementById("changePassword").addEventListener("click", () => {

    document.getElementById("changePasswordModal").style.display = "flex";

});
document.getElementById("verify2FA").addEventListener("click", async () => {

    const token = document.getElementById("otpCode").value;

    const response = await fetch("/api/2fa/verify", {

        method: "POST",

        credentials: "include",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            token

        })

    });

    const data = await response.json();

    if (data.success) {

        alert("🎉 Two-Factor Authentication Enabled!");

        location.reload();

    } else {

        alert(data.message);

    }

});
const modal=document.getElementById("changePasswordModal");

document.getElementById("closeModal").onclick=()=>{

modal.style.display="none";

};

window.onclick=(e)=>{

if(e.target===modal){

modal.style.display="none";

}

};

document.getElementById("savePassword").addEventListener("click",async()=>{

const currentPassword=document.getElementById("currentPassword").value;

const newPassword=document.getElementById("newPassword").value;

const confirmPassword=document.getElementById("confirmPassword").value;

const response=await fetch("/api/auth/change-password",{

method:"POST",

credentials:"include",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

currentPassword,

newPassword,

confirmPassword

})

});

const data=await response.json();

const msg=document.getElementById("passwordMessage");

if(data.success){

msg.style.color="green";

msg.innerHTML=data.message;

setTimeout(()=>{

window.location="/login";

},2000);

}else{

msg.style.color="red";

msg.innerHTML=data.message;

}

});
document.getElementById("logoutAllDevices").addEventListener("click", async () => {

    if (!confirm("Logout from all devices?")) return;

    const response = await fetch("/api/auth/logout-all", {

        method: "POST",

        credentials: "include"

    });

    async function loadLoginHistory() {

    const response = await fetch("/api/user/login-history", {

        credentials: "include"

    });

    const data = await response.json();

    if (!data.success) return;

    const container = document.getElementById("loginHistory");

    container.innerHTML = "";

    data.history.forEach(login => {

        container.innerHTML += `

        <div style="margin-bottom:15px;">

            <strong>${login.login_status}</strong><br>

            🌐 ${login.browser}<br>

            💻 ${login.os}<br>

            📍 ${login.ip_address}<br>

            🕒 ${new Date(login.login_time).toLocaleString()}

            <hr>

        </div>

        `;

    });

}
async function logout() {

    const response = await fetch("/api/auth/logout", {

        method: "POST",

        credentials: "include"

    });

    const data = await response.json();

    if (data.success) {

    // Clear dashboard data
    document.getElementById("fullname").textContent = "";
    document.getElementById("email").textContent = "";
    document.getElementById("role").textContent = "";
    document.getElementById("roleCard").textContent = "";
    document.getElementById("navUser").innerHTML = "";

    localStorage.clear();
    sessionStorage.clear();

    window.location.replace("/login");

} else {

        alert(data.message);

    }

}

// Temporary logout (we'll replace with backend logout next)

document.getElementById("logoutBtn").addEventListener("click", logout);

document.getElementById("logoutButton").addEventListener("click", logout);

document.getElementById("enable2FA").addEventListener("click", async () => {

    const response = await fetch("/api/2fa/setup", {

        method: "POST",

        credentials: "include"

    });

    const data = await response.json();

    if (!data.success) {

        alert(data.message);

        return;

    }

    document.getElementById("twoFactorBox").style.display = "block";

    document.getElementById("qrImage").src = data.qrCode;

    document.getElementById("secretKey").innerHTML = data.secret;

});

document.getElementById("changePassword").addEventListener("click", () => {

    document.getElementById("changePasswordModal").style.display = "flex";

});
document.getElementById("verify2FA").addEventListener("click", async () => {

    const token = document.getElementById("otpCode").value;

    const response = await fetch("/api/2fa/verify", {

        method: "POST",

        credentials: "include",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            token

        })

    });

    const data = await response.json();

    if (data.success) {

        alert("🎉 Two-Factor Authentication Enabled!");

        location.reload();

    } else {

        alert(data.message);

    }

});
const modal=document.getElementById("changePasswordModal");

document.getElementById("closeModal").onclick=()=>{

modal.style.display="none";

};

window.onclick=(e)=>{

if(e.target===modal){

modal.style.display="none";

}

};

document.getElementById("savePassword").addEventListener("click",async()=>{

const currentPassword=document.getElementById("currentPassword").value;

const newPassword=document.getElementById("newPassword").value;

const confirmPassword=document.getElementById("confirmPassword").value;

const response=await fetch("/api/auth/change-password",{

method:"POST",

credentials:"include",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

currentPassword,

newPassword,

confirmPassword

})

});

const data=await response.json();

const msg=document.getElementById("passwordMessage");

if(data.success){

msg.style.color="green";

msg.innerHTML=data.message;

setTimeout(() => {

    localStorage.clear();
    sessionStorage.clear();

    window.location.replace("/login");

}, 2000);

}else{

msg.style.color="red";

msg.innerHTML=data.message;

}

});
document.getElementById("logoutAllDevices").addEventListener("click", async () => {

    if (!confirm("Logout from all devices?")) return;

    const response = await fetch("/api/auth/logout-all", {

        method: "POST",

        credentials: "include"

    });

    const data = await response.json();

    if (data.success) {
    alert(data.message);
    // Clear browser storage
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to login page
    window.location.replace("/login");

} else {

    alert(data.message);

}

});

});
loadDashboard();
loadLoginHistory();