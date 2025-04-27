// On page load, apply saved theme
window.onload = function() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("theme-icon").textContent = "🌙";
  } else {
    document.body.classList.remove("dark-mode");
    document.getElementById("theme-icon").textContent = "🌞";
  }
}

// Theme Toggle
function toggleTheme() {
  document.body.classList.toggle("dark-mode");

  // Save theme to localStorage
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    document.getElementById("theme-icon").textContent = "🌙";
  } else {
    localStorage.setItem("theme", "light");
    document.getElementById("theme-icon").textContent = "🌞";
  }
}

    
      // Hamburger Menu
      function toggleMenu() {
        document.getElementById("navLinks").classList.toggle("active");
      }
    