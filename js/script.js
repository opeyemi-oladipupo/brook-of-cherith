/* =========================================================
   Brook of Cherith, site script
   Vanilla JS, no framework, no build step.
   ========================================================= */

/* ---------- Property configuration (single source of truth) ---------- */
const PROPERTY_CONFIG = {
  name: "Brook of Cherith",
  location: "OGD Estate, Olokuta, Abeokuta, Ogun State, Nigeria",
  whatsapp: "2349063627628",
  phone: "+2349063627628",
  email: "oladipupoope@gmail.com"
};

/* ---------- EmailJS configuration ----------
   Enter the real values from the EmailJS dashboard here.
   See README.md for exactly where these come from.
------------------------------------------------------------ */
const EMAILJS_CONFIG = {
  publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
  serviceId: "YOUR_EMAILJS_SERVICE_ID",
  templateId: "YOUR_EMAILJS_TEMPLATE_ID"
};

(function initEmailJS() {
  if (window.emailjs && EMAILJS_CONFIG.publicKey && !EMAILJS_CONFIG.publicKey.startsWith("YOUR_")) {
    emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
  }
})();

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* =========================================================
   Header scroll state (purely cosmetic, cheap to compute)
   ========================================================= */
(function headerScroll() {
  const header = document.getElementById("site-header");
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
      ticking = false;
    });
  });
})();

/* =========================================================
   Mobile menu
   Root-cause fixes applied here:
   - panel width is capped (CSS), never 100vw
   - body scroll lock uses position:fixed + stored scrollY,
     which prevents iOS rubber-band scrolling of the background
     and avoids any layout reflow that could look like "zooming"
   - overlay and panel are closed on: close button, overlay
     click, Escape key, and clicking any nav link
   ========================================================= */
(function mobileMenu() {
  const hamburger = document.getElementById("hamburger-btn");
  const closeBtn = document.getElementById("menu-close-btn");
  const menu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("menu-overlay");
  const links = menu.querySelectorAll("a");

  let scrollY = 0;

  function lockScroll() {
    scrollY = window.scrollY;
    document.body.style.top = `-${scrollY}px`;
    document.body.classList.add("menu-locked");
  }

  function unlockScroll() {
    document.body.classList.remove("menu-locked");
    document.body.style.top = "";
    window.scrollTo(0, scrollY);
  }

  function openMenu() {
    overlay.hidden = false;
    // next frame so the transition can run
    requestAnimationFrame(() => {
      overlay.classList.add("is-open");
      menu.classList.add("is-open");
    });
    menu.setAttribute("aria-hidden", "false");
    hamburger.setAttribute("aria-expanded", "true");
    hamburger.setAttribute("aria-label", "Close menu");
    lockScroll();
    closeBtn.focus();
  }

  function closeMenu() {
    overlay.classList.remove("is-open");
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Open menu");
    unlockScroll();
    setTimeout(() => { overlay.hidden = true; }, 200);
    hamburger.focus();
  }

  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  });

  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

  links.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) closeMenu();
  });
})();

/* =========================================================
   Gallery + lightbox
   ========================================================= */
(function gallery() {
  const items = Array.from(document.querySelectorAll(".gallery-item"));
  if (!items.length) return;

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const counter = document.getElementById("lightbox-counter");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  const images = items.map((btn) => {
    const img = btn.querySelector("img");
    return { src: img.src, alt: img.alt };
  });

  let currentIndex = 0;
  let lastFocused = null;

  function show(index) {
    currentIndex = (index + images.length) % images.length;
    const img = images[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    counter.textContent = `${currentIndex + 1} / ${images.length}`;
  }

  function open(index) {
    lastFocused = document.activeElement;
    show(index);
    lightbox.hidden = false;
    document.body.classList.add("menu-locked");
    closeBtn.focus();
  }

  function close() {
    lightbox.hidden = true;
    document.body.classList.remove("menu-locked");
    if (lastFocused) lastFocused.focus();
  }

  items.forEach((btn, i) => btn.addEventListener("click", () => open(i)));
  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => show(currentIndex - 1));
  nextBtn.addEventListener("click", () => show(currentIndex + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(currentIndex - 1);
    if (e.key === "ArrowRight") show(currentIndex + 1);
  });

  /* basic touch swipe support */
  let touchStartX = 0;
  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) dx > 0 ? show(currentIndex - 1) : show(currentIndex + 1);
  }, { passive: true });
})();

/* =========================================================
   Video: hide gracefully if the source file is missing
   ========================================================= */
(function video() {
  const video = document.getElementById("tour-video");
  const fallback = document.getElementById("video-fallback");
  if (!video) return;
  video.addEventListener("error", showFallback, true);
  const source = video.querySelector("source");
  if (source) source.addEventListener("error", showFallback);

  function showFallback() {
    video.hidden = true;
    fallback.hidden = false;
  }
})();

/* =========================================================
   FAQ accordion
   ========================================================= */
(function accordion() {
  const triggers = document.querySelectorAll(".accordion-trigger");
  triggers.forEach((trigger) => {
    const panel = trigger.closest(".accordion-item").querySelector(".accordion-panel");
    panel.style.maxHeight = "0px";
    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      triggers.forEach((t) => {
        t.setAttribute("aria-expanded", "false");
        t.closest(".accordion-item").querySelector(".accordion-panel").style.maxHeight = "0px";
      });
      if (!isOpen) {
        trigger.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
})();

/* =========================================================
   Booking form
   ========================================================= */
(function bookingForm() {
  const form = document.getElementById("booking-form");
  if (!form) return;

  const apartmentSelect = document.getElementById("apartment");
  const priceDisplay = document.getElementById("apartment-price");
  const checkin = document.getElementById("checkin");
  const checkout = document.getElementById("checkout");
  const dateError = document.getElementById("date-error");
  const formError = document.getElementById("form-error");
  const formStatus = document.getElementById("form-status");

  /* Pre-fill apartment from an apartment card CTA */
  document.querySelectorAll("[data-apartment]").forEach((link) => {
    link.addEventListener("click", () => {
      const value = link.getAttribute("data-apartment");
      window.__prefillApartment = value;
    });
  });
  if (window.__prefillApartment) apartmentSelect.value = window.__prefillApartment;

  apartmentSelect.addEventListener("change", () => {
    const option = apartmentSelect.selectedOptions[0];
    priceDisplay.textContent = option && option.dataset.price ? option.dataset.price : "";
  });

  const today = new Date().toISOString().split("T")[0];
  checkin.min = today;

  checkin.addEventListener("change", () => { checkout.min = checkin.value; });

  function validate() {
    formError.textContent = "";
    dateError.textContent = "";

    if (!form.fullName.value.trim() || !form.phone.value.trim() || !form.apartment.value ||
        !form.checkin.value || !form.checkout.value || !form.guests.value) {
      formError.textContent = "Please fill in all required fields.";
      return false;
    }

    if (new Date(form.checkout.value) <= new Date(form.checkin.value)) {
      dateError.textContent = "Check-out date must be after check-in date.";
      return false;
    }

    return true;
  }

  function buildMessage() {
    return [
      `Hello, I would like to make a booking enquiry at ${PROPERTY_CONFIG.name}.`,
      "",
      `Name: ${form.fullName.value.trim()}`,
      `Phone: ${form.phone.value.trim()}`,
      `Apartment: ${form.apartment.value}`,
      `Check-in: ${form.checkin.value}`,
      `Check-out: ${form.checkout.value}`,
      `Guests: ${form.guests.value}`,
      "",
      "Message:",
      form.message.value.trim() || "(none)",
      "",
      "Please let me know the availability and booking details."
    ].join("\n");
  }

  function sendViaWhatsApp() {
    const message = buildMessage();
    const url = `https://wa.me/${PROPERTY_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener");
    formStatus.textContent = "Opening WhatsApp with your enquiry. This does not confirm a booking yet.";
  }

  function sendViaEmail() {
    if (!window.emailjs || !EMAILJS_CONFIG.publicKey || EMAILJS_CONFIG.publicKey.startsWith("YOUR_")) {
      formError.textContent = "Email sending is not configured yet. Please use WhatsApp or call us directly.";
      return;
    }

    formStatus.textContent = "Sending your enquiry...";

    const templateParams = {
      property_name: PROPERTY_CONFIG.name,
      to_email: PROPERTY_CONFIG.email,
      guest_name: form.fullName.value.trim(),
      guest_phone: form.phone.value.trim(),
      apartment: form.apartment.value,
      checkin: form.checkin.value,
      checkout: form.checkout.value,
      guests: form.guests.value,
      message: form.message.value.trim() || "(none)"
    };

    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams)
      .then(() => {
        formStatus.textContent = "Your enquiry has been sent by email. We will get back to you shortly.";
        form.reset();
        priceDisplay.textContent = "";
      })
      .catch(() => {
        formStatus.textContent = "";
        formError.textContent = "Something went wrong sending the email. Please try WhatsApp instead.";
      });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    formStatus.textContent = "";
    if (!validate()) return;

    const action = e.submitter ? e.submitter.dataset.action : "whatsapp";
    if (action === "email") {
      sendViaEmail();
    } else {
      sendViaWhatsApp();
    }
  });
})();
