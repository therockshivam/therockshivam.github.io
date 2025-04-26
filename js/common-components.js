    // Theme Toggle
    function toggleTheme() {
        document.body.classList.toggle("light");
        document.getElementById("theme-icon").textContent =
          document.body.classList.contains("light") ? "🌞" : "🌙";
      }
    
      // Hamburger Menu
      function toggleMenu() {
        document.getElementById("navLinks").classList.toggle("active");
      }
    