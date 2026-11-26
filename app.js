// Cycle Space prototype interactions. No bookings or requests leave this device.
(function () {
  "use strict";

  const storage = {
    get: function (key, fallback) {
      try {
        const saved = localStorage.getItem(key);
        return saved === null ? fallback : JSON.parse(saved);
      } catch (error) {
        return fallback;
      }
    },
    set: function (key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        // Saving is optional; the prototype remains usable if storage is unavailable.
      }
    }
  };

  let savedIds = storage.get("savedIds", []);
  if (!Array.isArray(savedIds)) {
    savedIds = [];
  }
  savedIds = savedIds.filter(function (id) {
    return LISTINGS.some(function (item) { return item.id === id; });
  });

  document.title = STARTUP.name + " — make room for what’s next";
  document.getElementById("pitch").textContent = STARTUP.pitch;

  function showView() {
    const requested = (window.location.hash || "#home").slice(1);
    const views = document.querySelectorAll("[data-view]");
    const exists = Array.prototype.some.call(views, function (view) {
      return view.id === requested;
    });
    const current = exists ? requested : "home";

    views.forEach(function (view) {
      view.hidden = view.id !== current;
    });

    document.querySelectorAll("nav a").forEach(function (link) {
      if (link.getAttribute("href") === "#" + current) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", showView);

  const grid = document.getElementById("listing-grid");
  const searchBox = document.getElementById("search-box");
  const categoryFilter = document.getElementById("category-filter");
  const emptyMessage = document.getElementById("empty-message");
  const resultsCount = document.getElementById("results-count");
  const bookingDialog = document.getElementById("booking-dialog");
  const bookingForm = document.getElementById("booking-form");
  const bookingFormView = document.getElementById("booking-form-view");
  const bookingSuccess = document.getElementById("booking-success");
  const bookingDate = document.getElementById("booking-date");
  const bookingDateLabel = document.getElementById("booking-date-label");
  const bookingRateLabel = document.getElementById("booking-rate-label");
  const bookingRateSelect = document.getElementById("booking-rate-option");
  const bookingEndDateField = document.getElementById("booking-end-date-field");
  const bookingEndDate = document.getElementById("booking-end-date");
  const bookingStartTime = document.getElementById("booking-start-time");
  const bookingEndTime = document.getElementById("booking-end-time");
  const dialogSpaceName = document.getElementById("dialog-space-name");
  const listSpaceForm = document.getElementById("list-space-form");
  const listingConfirmation = document.getElementById("listing-confirmation");
  const listingConfirmationMessage = document.getElementById("listing-confirmation-message");
  let activeBookingOptions = [];

  function addCategoryOption(category) {
    const alreadyExists = Array.prototype.some.call(categoryFilter.options, function (option) {
      return option.value === category;
    });
    if (!alreadyExists) {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    }
  }

  Array.from(new Set(LISTINGS.map(function (item) { return item.category; })))
    .sort()
    .forEach(addCategoryOption);

  function createTextElement(tagName, className, text) {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = text;
    return element;
  }

  function makeCard(item) {
    const card = document.createElement("article");
    card.className = "listing-card";

    const cardTop = document.createElement("div");
    cardTop.className = "listing-top";
    cardTop.appendChild(createTextElement("span", "tag", item.category));

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "save-button";
    const isSaved = savedIds.indexOf(item.id) !== -1;
    saveButton.textContent = isSaved ? "♥" : "♡";
    saveButton.setAttribute("aria-pressed", isSaved ? "true" : "false");
    saveButton.setAttribute("aria-label", (isSaved ? "Remove saved space: " : "Save space: ") + item.name);
    saveButton.addEventListener("click", function () {
      toggleSaved(item.id);
    });
    cardTop.appendChild(saveButton);

    const location = createTextElement("p", "listing-location", "⌖  " + item.location);
    const title = createTextElement("h2", "", item.name);
    const description = createTextElement("p", "listing-description", item.description);
    const details = createTextElement("p", "listing-details", item.details);

    const footer = document.createElement("div");
    footer.className = "listing-footer";
    const priceAndAvailability = document.createElement("div");
    priceAndAvailability.appendChild(createTextElement("strong", "listing-rate", item.rate));
    priceAndAvailability.appendChild(createTextElement("span", "listing-availability", item.availability));
    const requestButton = document.createElement("button");
    requestButton.type = "button";
    requestButton.className = "button button-card";
    requestButton.textContent = "Request";
    requestButton.addEventListener("click", function () {
      openBookingDialog(item);
    });
    footer.append(priceAndAvailability, requestButton);

    card.append(cardTop, location, title, description, details, footer);
    return card;
  }

  function toggleSaved(id) {
    if (savedIds.indexOf(id) === -1) {
      savedIds.push(id);
    } else {
      savedIds = savedIds.filter(function (savedId) { return savedId !== id; });
    }
    storage.set("savedIds", savedIds);
    renderListings();
  }

  function renderListings() {
    const query = searchBox.value.trim().toLowerCase();
    const category = categoryFilter.value;
    const matches = LISTINGS.filter(function (item) {
      const searchableText = [
        item.name, item.category, item.location, item.description,
        item.details, item.availability
      ].join(" ").toLowerCase();
      return searchableText.indexOf(query) !== -1 &&
        (!category || item.category === category);
    });

    grid.replaceChildren.apply(grid, matches.map(makeCard));
    emptyMessage.hidden = matches.length > 0;
    const savedSummary = savedIds.length + (savedIds.length === 1 ? " favorite" : " favorites");
    resultsCount.textContent = matches.length + (matches.length === 1 ? " space" : " spaces") +
      " found · " + savedSummary + " saved on this device";
  }

  function openBookingDialog(item) {
    dialogSpaceName.textContent = item.name + " · " + item.location;
    bookingForm.reset();
    bookingFormView.hidden = false;
    bookingSuccess.hidden = true;
    activeBookingOptions = Array.isArray(item.bookingOptions) && item.bookingOptions.length > 0
      ? item.bookingOptions
      : [{ unit: "hour" }];
    bookingRateSelect.replaceChildren.apply(bookingRateSelect, activeBookingOptions.map(function (rate, index) {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = rate.amount === undefined ? rate.unit : "$" + rate.amount + " / " + rate.unit;
      return option;
    }));
    const hasRateChoice = activeBookingOptions.length > 1;
    bookingRateLabel.hidden = !hasRateChoice;
    bookingRateSelect.hidden = !hasRateChoice;
    bookingRateSelect.disabled = !hasRateChoice;
    bookingRateSelect.required = hasRateChoice;
    bookingRateSelect.value = "0";

    const today = new Date();
    const minimumDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");
    bookingDate.min = minimumDate;
    bookingEndDate.min = minimumDate;
    updateBookingDateFields();
    bookingDialog.showModal();
  }

  function updateBookingDateFields() {
    const selectedRate = activeBookingOptions[Number(bookingRateSelect.value)] || activeBookingOptions[0];
    const usesDateRange = selectedRate.unit === "day" || selectedRate.unit === "week";
    bookingDateLabel.textContent = usesDateRange ? "First day" : "When would you like to use it?";
    bookingEndDateField.hidden = !usesDateRange;
    bookingEndDate.disabled = !usesDateRange;
    bookingEndDate.required = usesDateRange;
    if (!usesDateRange) {
      bookingEndDate.value = "";
    } else if (bookingDate.value) {
      bookingEndDate.min = bookingDate.value;
    }
    updateBookingTimeConstraints();
  }

  function updateBookingTimeConstraints() {
    const isSingleDay = bookingEndDate.disabled || bookingDate.value === bookingEndDate.value;
    if (isSingleDay && bookingStartTime.value) {
      bookingEndTime.min = bookingStartTime.value;
    } else {
      bookingEndTime.removeAttribute("min");
    }
    const invalidTimeRange = isSingleDay && bookingStartTime.value && bookingEndTime.value &&
      bookingEndTime.value <= bookingStartTime.value;
    bookingEndTime.setCustomValidity(invalidTimeRange ? "End time must be after start time." : "");
  }

  searchBox.addEventListener("input", renderListings);
  categoryFilter.addEventListener("change", renderListings);
  bookingRateSelect.addEventListener("change", updateBookingDateFields);
  bookingDate.addEventListener("change", function () {
    if (!bookingEndDate.disabled) {
      bookingEndDate.min = bookingDate.value || bookingDate.min;
      if (bookingEndDate.value && bookingEndDate.value < bookingDate.value) {
        bookingEndDate.value = bookingDate.value;
      }
    }
    updateBookingTimeConstraints();
  });
  bookingEndDate.addEventListener("change", updateBookingTimeConstraints);
  bookingStartTime.addEventListener("input", updateBookingTimeConstraints);
  bookingEndTime.addEventListener("input", updateBookingTimeConstraints);
  bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    bookingFormView.hidden = true;
    bookingSuccess.hidden = false;
  });
  listSpaceForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(listSpaceForm);
    const category = formData.get("category");
    const capacity = formData.get("capacity").trim();
    const amenities = formData.get("amenities").trim();
    const details = [capacity, amenities].filter(Boolean).join(" · ") || "Details to be confirmed";
    const listing = {
      id: LISTINGS.reduce(function (highestId, item) {
        return Math.max(highestId, item.id);
      }, 0) + 1,
      name: formData.get("spaceName").trim(),
      category: category,
      location: formData.get("location").trim(),
      description: formData.get("description").trim(),
      details: details,
      rate: "$" + Number(formData.get("rate")) + " / " + formData.get("rateUnit"),
      bookingOptions: [{
        amount: Number(formData.get("rate")),
        unit: formData.get("rateUnit")
      }],
      availability: formData.get("availability").trim()
    };

    LISTINGS.push(listing);
    addCategoryOption(category);
    searchBox.value = "";
    categoryFilter.value = "";
    renderListings();

    const contactName = formData.get("contactName").trim();
    listingConfirmationMessage.textContent = "Thanks, " + contactName +
      ". The demo listing appears in Explore on this device until you refresh. " +
      "No real listing was published, and your contact details were not saved or sent.";
    listSpaceForm.reset();
    listSpaceForm.hidden = true;
    listingConfirmation.hidden = false;
  });
  document.getElementById("add-another-space").addEventListener("click", function () {
    listingConfirmation.hidden = true;
    listSpaceForm.hidden = false;
    listSpaceForm.reset();
    document.getElementById("space-name").focus();
  });
  document.getElementById("dialog-close").addEventListener("click", function () {
    bookingDialog.close();
  });
  document.getElementById("dialog-done").addEventListener("click", function () {
    bookingDialog.close();
  });

  renderListings();
  showView();
})();
