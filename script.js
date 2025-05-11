function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const isExpanded = navMenu.getAttribute('data-expanded') === 'true';
    navMenu.setAttribute('data-expanded', !isExpanded);
}

// Close the menu when clicking outside
document.addEventListener('click', (event) => {
    const menu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger-menu');

    // Check if the click is outside the menu and hamburger
    if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
        menu.setAttribute('data-expanded', 'false');
    }
});

// Fetch country data from an external API
async function populateCountryCodes() {
    const countryCodeDropdown = document.getElementById("country-code");

    try {
        // Fetch country data from a public API
        const response = await fetch("https://restcountries.com/v3.1/all");
        const countries = await response.json();

        // Sort countries alphabetically by name
        countries.sort((a, b) => a.name.common.localeCompare(b.name.common));

        // Populate the dropdown
        countries.forEach(country => {
            if (country.idd && country.idd.root) {
                const option = document.createElement("option");
                const countryCode = `${country.idd.root}${country.idd.suffixes ? country.idd.suffixes[0] : ""}`;
                option.value = countryCode;
                option.textContent = `${country.name.common} (${countryCode})`;
                countryCodeDropdown.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching country data:", error);
    }
}

// Call the function to populate the dropdown
populateCountryCodes();

// Initialize EmailJS
emailjs.init("ruEJ3NLHWHecmA3bV"); // Replace "YOUR_USER_ID" with your EmailJS user ID

// Add functionality to handle form submission
document.getElementById("contact-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get form data
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const message = document.getElementById("message").value;

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
        alert("Please fill in all required fields.");
        return;
    }

    // Prepare email parameters
    const emailParams = {
        to_email: "fxbeacon025@gmail.com", // Recipient email
        from_name: `${firstName} ${lastName}`,
        from_email: email,
        phone: phone || "Not provided", // Default if phone is empty
        message: message,
    };

    // Send email using EmailJS
    emailjs.send("service_u9n48qc", "template_2o3k1y8", emailParams)
        .then(() => {
            alert("Thank you! Your message has been sent successfully.");
            document.getElementById("contact-form").reset(); // Reset the form
        })
        .catch((error) => {
            console.error("Error sending email:", error);
            alert("Oops! Something went wrong. Please try again later.");
        });
});

// Add event listeners to required fields
document.querySelectorAll("#contact-form input[required], #contact-form textarea[required]").forEach((field) => {
    field.addEventListener("input", function () {
        let isValid = false;

        // Validation rules
        if (this.id === "email") {
            isValid = this.value.includes("@"); // Email must contain "@"
        } else if (this.id === "message") {
            isValid = this.value.trim().length >= 10; // Message must have at least 10 characters
        } else {
            isValid = this.value.trim().length >= 3; // Other fields must have at least 3 characters
        }

        // Update border color based on validation
        if (isValid) {
            this.classList.remove("invalid");
            this.classList.add("valid");
        } else {
            this.classList.remove("valid");
            this.classList.add("invalid");
        }
    });

    // Set initial border color to red for required fields
    field.classList.add("invalid");
});

