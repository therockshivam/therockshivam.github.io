// Initialize password storage (if empty, set an empty array)
let passwords = [];

// Admin password and credentials (for demo purposes)
const adminPassword = "admin123";
const loginCredentials = { username: "shivam", password: "shivam" };

// Show login form initially
document.getElementById("password-section").style.display = "none";

// Login validation
function login() {
  const username = document.getElementById('username').value;
  const loginPassword = document.getElementById('login-password').value;

  if (username === loginCredentials.username && loginPassword === loginCredentials.password) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("password-section").style.display = "block";
    displayPasswords();
  } else {
    alert("Invalid credentials! Please try again.");
  }
}

// Encrypt password using a Caesar Cipher with a dynamic key
function encryptPassword(password, key) {
  let encrypted = '';
  for (let i = 0; i < password.length; i++) {
    encrypted += String.fromCharCode(password.charCodeAt(i) + key); // Simple Caesar Cipher
  }
  return encrypted;
}

// Decrypt password
function decryptPassword(encrypted, key) {
  let decrypted = '';
  for (let i = 0; i < encrypted.length; i++) {
    decrypted += String.fromCharCode(encrypted.charCodeAt(i) - key);
  }
  return decrypted;
}

// Add new password (personal or site password)
function addPassword() {
  const passwordName = document.getElementById('password-name').value;
  const password = document.getElementById('password').value;
  const encryptionKey = parseInt(document.getElementById('encryption-key').value); // Get the encryption key

  if (passwordName && password && !isNaN(encryptionKey)) {
    const encryptedPassword = encryptPassword(password, encryptionKey);
    passwords.push({ passwordName, encryptedPassword });
    displayPasswords();
    document.getElementById('password-name').value = '';
    document.getElementById('password').value = '';
    document.getElementById('encryption-key').value = '';
  } else {
    alert("Please enter a valid name, password, and encryption key.");
  }
}

// Display all saved passwords (decrypted)
function displayPasswords() {
  const passwordList = document.getElementById('password-list');
  passwordList.innerHTML = ''; // Clear current list

  passwords.forEach((item, index) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <span id="password-span-${index}">${item.passwordName}: ***</span>
      <span class="show-password" onclick="promptForPasswordToShow(${index})">Show</span>
    `;
    passwordList.appendChild(listItem);
  });
}

// Show the custom modal for entering the view password
function promptForPasswordToShow(index) {
  document.getElementById('view-password-modal').style.display = 'block';
  document.getElementById('view-password-input').setAttribute('data-index', index); // Store index
}

// Submit the view password entered by the user
function submitViewPassword() {
  const enteredViewPassword = document.getElementById('view-password-input').value;
  const index = document.getElementById('view-password-input').getAttribute('data-index');
  const encryptionKey = parseInt(document.getElementById('encryption-key').value);

  if (enteredViewPassword === adminPassword) {
    const decryptedPassword = decryptPassword(passwords[index].encryptedPassword, encryptionKey);
    alert(`Password: ${decryptedPassword}`);
  } else {
    alert("Incorrect view password! You cannot view the password.");
  }

  closeModal();
}

// Close the modal
function closeModal() {
  document.getElementById('view-password-modal').style.display = 'none';
}

// Clear all saved passwords
function clearPasswords() {
  if (confirm("Are you sure you want to clear all passwords?")) {
    passwords = [];
    displayPasswords();
  }
}

// Download password file in encrypted format
function downloadPasswordFile() {
  const encryptionKey = parseInt(document.getElementById('encryption-key').value);

  if (isNaN(encryptionKey)) {
    alert("Please enter a valid encryption key to save the passwords.");
    return;
  }

  let fileContent = '';
  passwords.forEach(item => {
    fileContent += `${item.passwordName}:${item.encryptedPassword}\n`;
  });

  const blob = new Blob([fileContent], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'password-manager-db.txt';
  link.click();
}
