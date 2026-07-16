/* ============================================================
   PROOF.JS — See Proof page only
   1. REVIEWS data (edit reviews and proof images HERE, in one
      place — including the optional "image" field per review)
   2. Review grid: renders all reviews as static cards
   3. Review modal: open on card tap, close on Escape / button /
      backdrop, focus is managed for accessibility
   4. Proof lightbox: tap-to-enlarge for real shift-proof images
      shown inside review cards
   ============================================================ */

(function () {
  "use strict";

  /* ----------------------------------------------------------
     1. REVIEWS — the single source of truth.
     To edit, add, or remove a review, change this array only.
     Every review renders with its own star rating and a
     Verified Customer label automatically.

     EACH REVIEW HAS:
       name    — abbreviated customer name shown on the card
       rating  — 1 to 5; filled stars render for the rating and
                 dimmed outline stars for the remainder
       title   — short headline
       body    — the written review (DRAFT wording; replace with
                 each customer's exact approved language later)
       image   — optional shift-proof path, or "" for none

     OPTIONAL SHIFT-PROOF IMAGE PER REVIEW:
     Set the "image" field to a real file path to show a framed
     "Verified shift proof" preview beneath that review. While
     image is "" (empty), NOTHING renders — no placeholder box.
     Images live in assets/proof/ and keep their baked-in
     "AWareNova.net" watermark; paths are relative to /pages,
     e.g. "../assets/proof/t-patel-hamilton-shift.png".
     ---------------------------------------------------------- */
  var REVIEWS = [
    {
      name: "T. Patel",
      rating: 5,
      title: "Got Hamilton shift",
      body: "I was trying for Hamilton warehouse from long time. During Fall intake Nova helped me catch the opening much faster than I was doing manually. Happy with the purchase.",
      image: "../assets/proof/t-patel-hamilton-shift.png"
    },
    {
      name: "H. Singh",
      rating: 5,
      title: "Finally got in Whitby",
      body: "I was refreshing Amazon warehouse site every day but couldn't get in manually. Nova helped me catch one shift in Whitby and after that everything was smooth. Setup was easy also and support replied fast when I had questions.",
      image: "../assets/proof/h-singh-whitby-opening.png"
    },
    {
      name: "R. Biju",
      rating: 5,
      title: "Worth buying",
      body: "Most of the openings near London were for St. Thomas and they disappeared very quickly. Nova helped me catch one without sitting on the page all day. Biggest difference was speed. Before I was refreshing many times every day. Nova was watching in background and I finally got St. Thomas shift.  ",
      image: "../assets/proof/r-biju-st-thomas-mobile.png"
    },
    {
      name: "S. Kaur",
      rating: 5,
      title: "Morning shift caught in time",
      body: "Morning shifts were usually gone before I could finish applying. Nova helped me respond faster during a busy St. Thomas intake, and the setup was easier than I expected.",
      image: "../assets/proof/s-kaur-st-thomas-morning.png"
    },
    {
      name: "P. Kaur",
      rating: 5,
      title: "Saved me lot of time",
      body: "I work during day so I cannot keep checking Amazon jobs. Nova made it much easier and I finally got evening shift.",
      image: "../assets/proof/p-kaur-st-thomas-evening.png"
    },
    {
      name: "D. Singh",
      rating: 4,
      title: "Good but need little patience",
      body: "Software is working good but in my area openings were not coming much. I got my shift after around one month. Still much better than checking manually every few minutes.",
      image: "../assets/proof/d-singh-st-thomas-shift.png"
    },
    {
      name: "F. Aydin",
      rating: 5,
      title: "Smooth purchase and setup",
      body: "The license arrived quickly and the setup instructions were clear. I had a question during installation and received direct help without waiting on a support ticket.",
      image: ""
    },
    {
      name: "A. Shah",
      rating: 4,
      title: "Good support and easy setup",
      body: "Setup was simple and everything worked fine. I only gave 4 stars because I needed little help during installation, but support replied quickly and after that Nova was running without any issue.",
      image: ""
    }
  ];

  /* Bronze stars as inline SVG (no images, no emojis).
     Filled stars for the rating, dimmed outline stars for the
     remainder — a 4-star review visibly shows four of five. */
  var STAR_PATH =
    '<path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.45 6.2 20.5l1.1-6.45-4.7-4.6 6.5-.95z"/>';

  function starsMarkup(rating) {
    var filled =
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + STAR_PATH + "</svg>";
    var empty =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.35" aria-hidden="true">' + STAR_PATH + "</svg>";
    var count = Math.max(0, Math.min(5, rating || 5));
    var out = "";
    for (var i = 0; i < 5; i++) out += i < count ? filled : empty;
    return out;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var grid = document.getElementById("reviews-grid");
    if (!grid) return;

    /* ----------------------------------------------------------
       2. RENDER THE REVIEW GRID
       Each card is an <article>. The written review is a single
       button that opens the modal. If (and only if) the review
       has an image path, a separate framed proof button renders
       beneath it and opens the lightbox.
       ---------------------------------------------------------- */
    function buildCard(review, index) {
      var card = document.createElement("article");
      card.className = "review-card reveal";
      if (index > 0) card.setAttribute("data-delay", String((index % 3) * 70));

      var open = document.createElement("button");
      open.type = "button";
      open.className = "review-open";
      open.innerHTML =
        '<span class="review-stars" aria-label="Rated ' + (review.rating || 5) + ' out of 5 stars">' + starsMarkup(review.rating) + "</span>" +
        '<span class="review-title">' + review.title + "</span>" +
        '<span class="review-preview">' + review.body + "</span>" +
        '<span class="review-foot">' +
        '<span class="review-name">' + review.name + "</span>" +
        '<span class="verified-pill">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>' +
        "Verified Customer</span></span>";
      open.addEventListener("click", function () {
        openModal(index, open);
      });
      card.appendChild(open);

      /* Optional shift-proof image — renders only when a real
         path is supplied in the REVIEWS array above. */
      if (review.image) {
        var proof = document.createElement("button");
        proof.type = "button";
        proof.className = "review-proof";
        proof.setAttribute("aria-label", "Enlarge verified shift proof from " + review.name);
        proof.innerHTML =
          '<img src="' + review.image + '" alt="Verified shift proof shared by ' + review.name + '" loading="lazy" />' +
          '<span class="proof-label">Verified shift proof</span>';
        proof.addEventListener("click", function () {
          openLightbox(
            proof.querySelector("img"),
            "Verified shift proof — " + review.name,
            proof
          );
        });
        card.appendChild(proof);
      }

      return card;
    }

    REVIEWS.forEach(function (review, i) {
      grid.appendChild(buildCard(review, i));
    });

    /* Newly rendered .reveal cards need observing; animations.js
       has already run by now, so reveal them directly with their
       stagger delay (global reduced-motion CSS zeroes this out). */
    grid.querySelectorAll(".reveal").forEach(function (el) {
      var delay = el.getAttribute("data-delay");
      if (delay) el.style.transitionDelay = delay + "ms";
      window.requestAnimationFrame(function () {
        el.classList.add("visible");
      });
    });

    /* ----------------------------------------------------------
       3. REVIEW MODAL
       ---------------------------------------------------------- */
    var modal = document.getElementById("review-modal");
    var modalStars = document.getElementById("review-modal-stars");
    var modalTitle = document.getElementById("review-modal-title");
    var modalBody = document.getElementById("review-modal-body");
    var modalName = document.getElementById("review-modal-name");
    var lastFocused = null;

    function openModal(index, trigger) {
      var review = REVIEWS[index];
      if (!review || !modal) return;
      lastFocused = trigger || document.activeElement;
      modalStars.innerHTML = starsMarkup(review.rating);
      modalTitle.textContent = review.title;
      modalBody.textContent = review.body;
      modalName.textContent = review.name;
      modal.hidden = false;
      document.body.classList.add("modal-open");
      modal.querySelector(".modal-close").focus();
    }

    function closeModal() {
      if (!modal || modal.hidden) return;
      modal.hidden = true;
      document.body.classList.remove("modal-open");
      if (lastFocused) lastFocused.focus();
    }

    modal.querySelectorAll("[data-close-modal]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });

    /* ----------------------------------------------------------
       4. PROOF LIGHTBOX
       ---------------------------------------------------------- */
    var lightbox = document.getElementById("lightbox");
    var lightboxImg = document.getElementById("lightbox-img");
    var lightboxCaption = document.getElementById("lightbox-caption");
    var lastProofFocused = null;

    function openLightbox(img, captionText, trigger) {
      if (!lightbox || !img) return;
      lastProofFocused = trigger || document.activeElement;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || "Enlarged proof image";
      lightboxCaption.textContent = captionText || "";
      lightbox.hidden = false;
      document.body.classList.add("modal-open");
      lightbox.querySelector(".modal-close").focus();
    }

    function closeLightbox() {
      if (!lightbox || lightbox.hidden) return;
      lightbox.hidden = true;
      lightboxImg.src = "";
      document.body.classList.remove("modal-open");
      if (lastProofFocused) lastProofFocused.focus();
    }

    if (lightbox) {
      lightbox.querySelectorAll("[data-close-lightbox]").forEach(function (el) {
        el.addEventListener("click", closeLightbox);
      });
    }

    /* Escape closes whichever overlay is open */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeModal();
        closeLightbox();
      }
    });
  });
})();
