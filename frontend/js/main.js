// =========================================
// CONTACT FORM
// =========================================

// Find the contact form on the page
const contactForm = document.querySelector('#contact-form');

// main.js loads on every page, but only the Contact page has this form.
// So we only run this code if the form actually exists.
if (contactForm) {

  // Run this function when the user clicks "Send Message"
  contactForm.addEventListener('submit', function (event) {

    // Stop the browser's default action (reloading the page)
    event.preventDefault();

    // Show a thank-you message
    const status = document.querySelector('#form-status');
    status.textContent = 'Thank you! Your message has been received. (Demo: messages are not sent yet.)';

    // Clear all the fields
    contactForm.reset();
  });
}