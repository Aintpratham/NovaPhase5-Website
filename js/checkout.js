/* ============================================================
   CHECKOUT PAGE LOGIC
   ============================================================ */

(function () {
  "use strict";

  // ==========================
  // CHANGE THIS IF NEEDED
  // ==========================
  const RAILWAY_URL = "https://web-production-b87f.up.railway.app/";

  const PLANS = {
    base: {
      id: "base",
      name: "Base",
      price: "$499 CAD",
      duration: "60 Days",
      devices: "1"
    },
    standard: {
      id: "standard",
      name: "Standard",
      price: "$799 CAD",
      duration: "120 Days",
      devices: "2"
    },
    premium: {
      id: "premium",
      name: "Premium",
      price: "$999 CAD",
      duration: "180 Days",
      devices: "4"
    }
  };

  const DEFAULT_PLAN = "standard";

  function getPlanKey() {
    const params = new URLSearchParams(window.location.search);
    const key = (params.get("plan") || "").toLowerCase();
    return PLANS[key] ? key : DEFAULT_PLAN;
  }

  const planKey = getPlanKey();
  const plan = PLANS[planKey];

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  setText("s-plan-name", plan.name);
  setText("s-plan-tag", `${plan.name} Plan`);
  setText("s-price", plan.price);
  setText("s-duration", plan.duration);
  setText("s-devices", plan.devices);

  const planField = document.getElementById("selected-plan");
  if (planField) planField.value = plan.id;

  const form = document.getElementById("checkout-form");
  const errorEl = document.getElementById("form-error");
  const statusEl = document.getElementById("pay-status");
  const payBtn = document.getElementById("pay-btn");

  function isEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    errorEl.textContent = "";
    statusEl.textContent = "";

    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!firstName || !lastName) {
      errorEl.textContent = "Please enter your first and last name.";
      return;
    }

    if (!isEmail(email)) {
      errorEl.textContent = "Please enter a valid email address.";
      return;
    }

    const payload = {
      plan: plan.id,
      first_name: firstName,
      last_name: lastName,
      email: email
    };

    payBtn.disabled = true;
    payBtn.textContent = "Connecting...";

    statusEl.textContent = "Redirecting to secure Stripe checkout...";

    try {

      const response = await fetch(
        `${RAILWAY_URL}/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create checkout session.");
      }

      if (!data.url) {
        throw new Error("Stripe checkout URL was not returned.");
      }

      window.location.href = data.url;

    } catch (err) {

      console.error(err);

      payBtn.disabled = false;
      payBtn.textContent = "Proceed to Secure Payment";

      statusEl.textContent = "";

      errorEl.textContent =
        err.message || "Unable to connect to secure payment.";

    }
  }

  if (form) {
    form.addEventListener("submit", handleSubmit);
  }

})();
