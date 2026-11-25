
"use strict";

// ============================================
// SOHAIL CHANNA PORTFOLIO
// CONTACT FORM - UPGRADED VERSION
// Existing design preserved
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    const contactForm = document.getElementById("contactForm");

    if (!contactForm) return;

    const submitButton = contactForm.querySelector(
        'button[type="submit"]'
    );

    if (!submitButton) return;

    const originalButtonText = submitButton.innerHTML;

    // IMPORTANT:
    // Local backend URL
    // Change this when deploying online.
    const API_URL = "/api/contact";

    let isSubmitting = false;

    // ============================================
    // FORM SUBMISSION
    // ============================================

    contactForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        if (isSubmitting) return;

        // Browser native validation
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        // ========================================
        // COLLECT FORM DATA
        // ========================================

        const contactData = {
            name: getValue("name"),
            email: getValue("email"),
            phone: getValue("phone"),
            service: getValue("service"),
            subject: getValue("subject"),
            message: getValue("message")
        };

        // ========================================
        // VALIDATION
        // ========================================

        if (
            !contactData.name ||
            !contactData.email ||
            !contactData.subject ||
            !contactData.message
        ) {
            showError("Please fill in all required fields.");
            return;
        }

        if (contactData.name.length > 100) {
            showError("Name must not exceed 100 characters.");
            return;
        }

        if (contactData.subject.length > 150) {
            showError("Subject must not exceed 150 characters.");
            return;
        }

        if (contactData.message.length > 5000) {
            showError("Message must not exceed 5000 characters.");
            return;
        }

        // ========================================
        // START LOADING
        // ========================================

        isSubmitting = true;

        submitButton.disabled = true;
        submitButton.innerHTML = "Sending Message...";

        submitButton.classList.add("loading");

        contactForm.setAttribute("aria-busy", "true");

        try {

            // ====================================
            // SEND REQUEST TO BACKEND
            // ====================================

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

                body: JSON.stringify(contactData)

            });

            // ====================================
            // READ SERVER RESPONSE
            // ====================================

            const contentType =
                response.headers.get("content-type") || "";

            if (!contentType.includes("application/json")) {

                const responseText = await response.text();

                console.error(
                    "Unexpected server response:",
                    response.status,
                    responseText
                );

                throw new Error(
                    "Server response error. Please check your backend connection."
                );
            }

            const result = await response.json();

            // ====================================
            // HANDLE SERVER ERRORS
            // ====================================

            if (!response.ok || !result.success) {

                throw new Error(
                    result.message ||
                    `Request failed. Status: ${response.status}`
                );

            }

            // ====================================
            // SUCCESS
            // ====================================

            showThankYouPage(contactData);

        } catch (error) {

            console.error("CONTACT FORM ERROR:", error);

            if (error instanceof TypeError) {

                showError(
                    "Unable to connect to the server. Please check that your backend is running."
                );

            } else {

                showError(
                    error.message ||
                    "Something went wrong. Please try again."
                );

            }

            // ====================================
            // RESTORE BUTTON
            // ====================================

            isSubmitting = false;

            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;

            submitButton.classList.remove("loading");

            contactForm.removeAttribute("aria-busy");

        }

    });

    // ============================================
    // HELPER: GET INPUT VALUE
    // ============================================

    function getValue(id) {

        const element = document.getElementById(id);

        return element
            ? element.value.trim()
            : "";

    }

    // ============================================
    // HELPER: ERROR MESSAGE
    // ============================================

    function showError(message) {

        let errorBox = document.getElementById(
            "contactErrorMessage"
        );

        if (!errorBox) {

            errorBox = document.createElement("div");

            errorBox.id = "contactErrorMessage";

            errorBox.setAttribute("role", "alert");

            errorBox.style.cssText = `
                margin-top: 15px;
                padding: 14px 16px;
                border-radius: 10px;
                border: 1px solid rgba(255, 90, 90, .35);
                background: rgba(255, 60, 60, .09);
                color: #ff9999;
                font-size: 13px;
                line-height: 1.6;
            `;

            contactForm.appendChild(errorBox);

        }

        errorBox.textContent = message;

        errorBox.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    }

    // ============================================
    // REMOVE OLD ERROR ON INPUT
    // ============================================

    contactForm.addEventListener("input", () => {

        const errorBox = document.getElementById(
            "contactErrorMessage"
        );

        if (errorBox) {
            errorBox.remove();
        }

    });

});


// ============================================
// THANK YOU PAGE
// ORIGINAL DESIGN PRESERVED
// ============================================

function showThankYouPage(data) {

    const main = document.querySelector("main");

    if (!main) {
        alert("Your message was sent successfully!");
        return;
    }

    main.innerHTML = `

        <section class="thankyou-section">

            <div class="thankyou-card">

                <div class="success-icon">✓</div>

                <span class="section-kicker">
                    MESSAGE SUBMITTED
                </span>

                <h1>
                    Thank <span class="gradient-text">You!</span>
                </h1>

                <p>
                    Your message has been successfully submitted.
                    Thank you for contacting me. I will get back
                    to you as soon as possible.
                </p>

                <div class="message-details">

                    <h3>Your Submitted Information</h3>

                    <div class="detail-row">
                        <span class="detail-label">Name</span>
                        <span class="detail-value">${escapeHTML(data.name)}</span>
                    </div>

                    <div class="detail-row">
                        <span class="detail-label">Email</span>
                        <span class="detail-value">${escapeHTML(data.email)}</span>
                    </div>

                    <div class="detail-row">
                        <span class="detail-label">Phone</span>
                        <span class="detail-value">${escapeHTML(data.phone || "Not provided")}</span>
                    </div>

                    <div class="detail-row">
                        <span class="detail-label">Service</span>
                        <span class="detail-value">${escapeHTML(data.service || "Not selected")}</span>
                    </div>

                    <div class="detail-row">
                        <span class="detail-label">Subject</span>
                        <span class="detail-value">${escapeHTML(data.subject)}</span>
                    </div>

                    <div class="detail-row">
                        <span class="detail-label">Message</span>
                        <span class="detail-value message-text">${escapeHTML(data.message)}</span>
                    </div>

                </div>

                <div class="thankyou-actions">

                    <a href="index.html" class="nav-button">
                        Back to Home
                    </a>

                    <a href="contact.html" class="secondary-button">
                        Send Another Message
                    </a>

                </div>

            </div>

        </section>

    `;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ============================================
// HTML SECURITY
// ============================================

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {

        const entities = {

            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"

        };

        return entities[character];

    });

}
