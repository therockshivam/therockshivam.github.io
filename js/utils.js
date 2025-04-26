export class Utils {

    // Load the header dynamically
    static getNavbar(location) {
      fetch(location)
        .then(response => response.text())
        .then(data => {
          document.getElementById('navbar').innerHTML = data;
        });
    }
  
    // Load the footer dynamically
    static getFooter(location) {
      fetch(location)
        .then(response => response.text())
        .then(data => {
          document.getElementById('footer').innerHTML = data;
        });
    }
  
}