const API_URL = "https://script.google.com/macros/s/AKfycbxHeI-R-A4kboOvgkVp__eIcTHAz1cGVkivnKrIhV4C0QNVGGBkzUxPfhZ3V_gJTPFj/exec";

let selectedRole = ""; // used if you're using clickable cards

// ================= ROLE SELECTION (for card UI) =================
function selectRole(role, el) {
  selectedRole = role;

  document.querySelectorAll(".role-card").forEach(card => {
    card.classList.remove("active");
  });

  if (el) el.classList.add("active");
}

// ================= REAL-TIME VALIDATION =================

// EMAIL
const emailInput = document.getElementById("email");
emailInput?.addEventListener("input", function () {
  const val = this.value.trim();
  const err = document.getElementById("emailError");

  if (val.length === 0) {
    err.textContent = "";
    this.classList.remove("invalid");
  } else if (!val.includes("@")) {
    err.textContent = "Invalid email";
    this.classList.add("invalid");
  } else {
    err.textContent = "";
    this.classList.remove("invalid");
  }
});

// PHONE
const numberInput = document.getElementById("number");
numberInput?.addEventListener("input", function () {
  const val = this.value.trim();
  const err = document.getElementById("numberError");

  if (val.length === 0) {
    err.textContent = "";
    this.classList.remove("invalid");
  } else if (!/^\d*$/.test(val)) {
    err.textContent = "Digits only";
    this.classList.add("invalid");
  } else {
    err.textContent = "";
    this.classList.remove("invalid");
  }
});

// PASSWORD
const passwordInput = document.getElementById("password");
passwordInput?.addEventListener("input", function () {
  const val = this.value;
  const err = document.getElementById("passwordError");

  if (val.length === 0) {
    err.textContent = "";
    this.classList.remove("invalid");
  } else if (!/[A-Z]/.test(val)) {
    err.textContent = "Must include a capital letter";
    this.classList.add("invalid");
  } else {
    err.textContent = "";
    this.classList.remove("invalid");
  }
});

// ================= SIGNUP =================
function signup() {
  const name = document.getElementById("name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const number = document.getElementById("number")?.value.trim();
  const password = document.getElementById("password")?.value;

  const error = document.getElementById("signupError");

  // role (works for BOTH radio + card)
  const radioRole = document.querySelector('input[name="role"]:checked')?.value;
  const role = radioRole || selectedRole;

  error.textContent = "";

  let hasError = false;

  // EMAIL
  if (!email || !email.includes("@")) {
    document.getElementById("emailError").textContent = "Invalid email";
    hasError = true;
  }

  // PHONE
  if (!number || !/^\d+$/.test(number)) {
    document.getElementById("numberError").textContent = "Digits only";
    hasError = true;
  }

  // PASSWORD
  if (!password || !/[A-Z]/.test(password)) {
    document.getElementById("passwordError").textContent = "Must include a capital letter";
    hasError = true;
  }

  // ROLE
  if (!role) {
    error.textContent = "Please select a role";
    hasError = true;
  }

  if (hasError) return;

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "signup",
      name,
      email,
      number,
      password,
      role
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "exists") {
        error.textContent = "Email already exists";
      } else {
        window.location.href = "index.html";
      }
    })
    .catch(() => {
      error.textContent = "Network error";
    });
}

// ================= LOGIN =================
function login() {
  const email = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value;
  const error = document.getElementById("loginError");

  error.textContent = "";

  if (!email || !password) {
    error.textContent = "Enter email and password";
    return;
  }

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "login",
      email,
      password
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "not_found") {
        error.textContent = "Email not found";
      } else if (data.status === "wrong_password") {
        error.textContent = "Incorrect password";
      } else {
        localStorage.setItem("role", data.role);

        if (data.role === "artist") {
          window.location.href = "artist.html";
        } else {
          window.location.href = "reviewer.html";
        }
      }
    })
    .catch(() => {
      error.textContent = "Network error";
    });
}