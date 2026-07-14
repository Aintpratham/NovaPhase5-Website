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
     Every review renders with five stars and a Verified
     Customer label automatically.

     OPTIONAL SHIFT-PROOF IMAGE PER REVIEW:
     Set the "image" field to a real file path to show a framed
     "Verified shift proof" preview beneath that review. While
     image is "" (empty), NOTHING renders — no placeholder box.

     HOW TO ADD YOUR IMAGES LATER:
     1. Blur job IDs, names, and sensitive details, and add the
        large diagonal "AWareNova.net" watermark BEFORE upload.
     2. Place the files in assets/proof/ with these recommended
        names (matching the three prepared reviews below):
          assets/proof/t-patel-result.jpg
          assets/proof/h-singh-result.jpg
          assets/proof/r-biju-result.jpg
     3. Fill in the image field. Paths are relative to /pages,
        so use "../assets/proof/t-patel-result.jpg".
     ---------------------------------------------------------- */
  var REVIEWS = [
    {
      name: "T. Patel",
      title: "Finally stopped checking manually",
      body: "Nova helped me stay ready for new openings without refreshing the page all day. The setup was straightforward and the support was helpful.",
      /* When ready, set to: "../assets/proof/t-patel-result.jpg" */
      image: ""
    },
    {
      name: "H. Singh",
      title: "Fast setup and real support",
      body: "I received my license quickly and was guided through the setup. Nova made the entire process much easier than checking manually.",
      /* When ready, set to: "../assets/proof/h-singh-result.jpg" */
      image: ""
    },
    {
      name: "R. Biju",
      title: "Helped me respond much faster",
      body: "The biggest difference was speed. I no longer had to constantly watch the jobs page and could focus on other things.",
      /* When ready, set to: "../assets/proof/r-biju-result.jpg" */
      image: ""
    },
    {
      name: "S. Kaur",
      title: "Simple to use after setup",
      body: "I expected the setup to be complicated, but it was explained clearly. Once it was running, Nova quietly handled the monitoring.",
      image: ""
    },
    {
      name: "P. Kaur",
      title: "Worth it for the convenience",
      body: "Nova saved me a lot of time and stress from repeated refreshing. Everything from payment to receiving the license felt organized.",
      image: ""
    },
    {
      name: "D. Singh",
      title: "A much better way to monitor",
      body: "The continuous monitoring was the main reason I chose Nova. It helped me react to opportunities without being on the website all day.",
      image: ""
    },
    {
      name: "F. Aydin",
      title: "Professional and reliable experience",
      body: "The purchase, license delivery, and setup process were smooth. I also received direct help whenever I had a question.",
      image: ""
    },
    {
      name: "A. Shah",
      title: "Made the process less stressful",
      body: "Instead of worrying about when an opening might appear, I could let Nova monitor while I continued with my day.",
      image: ""
    }
  ];

  /* Five bronze stars as inline SVG (no images, no emojis). */
  function starsMarkup() {
    var star =
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.45 6.2 20.5l1.1-6.45-4.7-4.6 6.5-.95z"/></svg>';
    return star + star + star + star + star;
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
        '<span class="review-stars" aria-label="Rated 5 out of 5 stars">' + starsMarkup() + "</span>" +
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

    modalStars.innerHTML = starsMarkup();

    function openModal(index, trigger) {
      var review = REVIEWS[index];
      if (!review || !modal) return;
      lastFocused = trigger || document.activeElement;
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
