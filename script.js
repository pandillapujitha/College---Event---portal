// =========================================================
// CampusConnect – College Event Portal
// Simple JavaScript. Every section is explained with comments.
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

  // ---------- 1. Mobile menu (hamburger button) ----------
  const menuButton = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", isOpen);
      menuButton.textContent = isOpen ? "✕" : "☰";
    });
  }

  // ---------- 2. Navbar shadow when the page is scrolled ----------
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", function () {
    navbar.classList.toggle("scrolled", window.scrollY > 10);
  });

  // ---------- 3. Current year in the footer ----------
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // ---------- 4. Cards fade in when they scroll into view ----------
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(function (item) { observer.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add("visible"); });
  }

  // ---------- 5. Events page: filter buttons ----------
  const filterButtons = document.querySelectorAll(".filter-btn");
  const eventCards = document.querySelectorAll(".event-card");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      // highlight the clicked button
      filterButtons.forEach(function (b) { b.classList.remove("active"); });
      button.classList.add("active");

      // show only the cards that match
      const filter = button.dataset.filter;
      eventCards.forEach(function (card) {
        const match = filter === "all" || card.dataset.category === filter;
        card.style.display = match ? "flex" : "none";
      });
    });
  });

  // ---------- 6. Gallery page: click an image to open it big ----------
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lightboxImg = lightbox.querySelector("img");
    const lightboxText = lightbox.querySelector("p");

    document.querySelectorAll(".gallery-item").forEach(function (item) {
      item.addEventListener("click", function () {
        lightboxImg.src = item.querySelector("img").src;
        lightboxImg.alt = item.querySelector("img").alt;
        lightboxText.textContent = item.querySelector(".caption").textContent;
        lightbox.classList.add("open");
      });
    });

    // close when clicking the background / the X button / pressing Esc
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target.classList.contains("lightbox-close")) {
        lightbox.classList.remove("open");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") lightbox.classList.remove("open");
    });
  }

  // ---------- 7. Helper functions for the forms ----------
  // Marks a field as wrong (red border + message) or correct
  function setValid(field, isValid) {
    field.closest(".form-group").classList.toggle("invalid", !isValid);
    return isValid;
  }
  function isEmail(text) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
  }
  function isPhone(text) {
    return /^[0-9]{10}$/.test(text);
  }

  // ---------- 8. Registration form ----------
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    const successBox = document.getElementById("registerSuccess");

    // If we came from an event card (register.html?event=hackathon), pick that event
    const params = new URLSearchParams(window.location.search);
    const chosenEvent = params.get("event");
    if (chosenEvent) registerForm.elements["event"].value = chosenEvent;

    registerForm.addEventListener("submit", function (e) {
      e.preventDefault(); // stop the page from reloading

      const f = registerForm.elements;
      const checks = [
        setValid(f["name"], f["name"].value.trim().length >= 2),
        setValid(f["email"], isEmail(f["email"].value.trim())),
        setValid(f["phone"], isPhone(f["phone"].value.trim())),
        setValid(f["department"], f["department"].value !== ""),
        setValid(f["year"], f["year"].value !== ""),
        setValid(f["event"], f["event"].value !== "")
      ];

      // stop here if any field is wrong
      if (checks.includes(false)) return;

      // everything is fine: show the success message
      const eventName = f["event"].options[f["event"].selectedIndex].text;
      document.getElementById("successName").textContent = f["name"].value.trim();
      document.getElementById("successEvent").textContent = eventName;

      registerForm.style.display = "none";
      successBox.classList.add("show");
    });

    // "Register for another event" button
    document.getElementById("registerAgain").addEventListener("click", function () {
      registerForm.reset();
      registerForm.style.display = "block";
      successBox.classList.remove("show");
    });
  }

  // ---------- 9. Contact form ----------
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    const contactSuccess = document.getElementById("contactSuccess");

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const f = contactForm.elements;
      const checks = [
        setValid(f["name"], f["name"].value.trim().length >= 2),
        setValid(f["email"], isEmail(f["email"].value.trim())),
        setValid(f["message"], f["message"].value.trim().length >= 10)
      ];
      if (checks.includes(false)) return;

      contactForm.style.display = "none";
      contactSuccess.classList.add("show");
    });

    document.getElementById("contactAgain").addEventListener("click", function () {
      contactForm.reset();
      contactForm.style.display = "block";
      contactSuccess.classList.remove("show");
    });
  }

});
