// // 1. Select DOM Elements from your HTML
// const unitsDropdown = document.querySelector(".icon-dropdown");
// const daysDropdown = document.querySelector(".dropdown-days");
// const dropdownUnits = document.querySelector(".unit-dropdown");
// const dropdownDays = document.querySelector(".days-dropdown");
// const inputSearch = document.querySelector(".input-search");
// const searchIcon = document.querySelector(".icon-search");
// const dropdownSearch = document.querySelector(".search-dropdown");
// const unitsText = document.querySelector(".units-1 p");

// const searchBtn = document.querySelector(".button-search");
// const loadingOverlay = document.getElementById("loading-overlay");
// const forecastContainer = document.querySelector(".daily-forecast-1");
// const hourlyContainer = document.querySelector(".timing");
// const errorContent = document.querySelector(".error-content");
// const wholeContent = document.querySelector(".whole-content");
// const secondWholeContent = document.querySelector(".whole-content-1");
// const searchError = document.querySelector(".search-error");

// // 2. Icon Mapping (Using your asset naming convention)
// function getWeatherIcon(code) {
//   if (code === 0) return "./assets/images/icon-sunny.webp";
//   if (code <= 3) return "./assets/images/icon-partly-cloudy.webp";
//   if (code >= 45 && code <= 48) return "./assets/images/icon-fog.webp";
//   if (code >= 51 && code <= 57) return "./assets/images/icon-drizzle.webp";
//   if (code >= 61 && code <= 67) return "./assets/images/icon-rain.webp";
//   if (code >= 71 && code <= 77) return "./assets/images/icon-snow.webp";
//   if (code >= 95) return "./assets/images/icon-storm.webp";
//   return "./assets/images/icon-overcast.webp";
// }

// let globalWeatherData = null;

// // 3. The Main Fetch Function
// async function getWeatherData(city = "Abuja") {
//   // Show Loading
//   loadingOverlay.style.display = "flex";
//   errorContent.classList.remove("show");
//   searchError.classList.remove("show"); // Hide error from previous searches

//   wholeContent.style.display = "block";

//   // TARGET: Replace stats (Feels Like, Humidity, etc.) with '-'
//   const stats = document.querySelectorAll(".card-forecast p");
//   stats.forEach((p) => {
//     p.innerText = "-";
//   });

//   //   const units = document.querySelector(".units-1 p");
//   //   units.innerText = "";

//   //FOR THE DAILY FORECAST CARD
//   forecastContainer.innerHTML = "";
//   for (let i = 0; i < 7; i++) {
//     // We inject empty divs with your card class to keep the background visible
//     forecastContainer.innerHTML += `<div class="card-forecast-1" style="height: 150px; "></div>`;
//   }

//   //FOR THE TIMING / HOURLY FORECAST CARD
//   hourlyContainer.innerHTML = "";
//   Array.from({ length: 8 }).forEach(() => {
//     hourlyContainer.innerHTML += `<div class="timing-forecast" style="height: 55px;"></div>`;
//   });

//   try {
//     // Step A: Convert city name to Coordinates (Geocoding)
//     const geoRes = await fetch(
//       `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
//     );
//     const geoData = await geoRes.json();

//     // 2. CHECK IF RESULTS EXIST
//     if (!geoData.results || geoData.results.length === 0) {
//       searchError.classList.add("show"); // Show the "No search result found!" div
//       loadingOverlay.style.display = "none";
//       secondWholeContent.style.display = "none"; // Hide the weather dashboard
//       return; // Stop the function here
//     }

//     const { latitude, longitude, name, country } = geoData.results[0];

//     // Step B: Fetch Weather Data
//     const weatherRes = await fetch(
//       `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&timezone=auto`
//     );
//     const data = await weatherRes.json();
//     globalWeatherData = data; // Save for the dropdown to use
//     updateUI(data, name, country);
//   } catch (err) {
//     console.error(err);
//     errorContent.classList.add("show");
//     wholeContent.style.display = "none";
//   } finally {
//     // Hide Loading
//     loadingOverlay.style.display = "none";
//   }
// }

// // 4. Update the UI Elements
// function updateUI(data, cityName, countryName) {
//   wholeContent.style.display = "block";

//   // Update Header/Current
//   document.querySelector(".img-text-1 h3").innerText =
//     `${cityName}, ${countryName}`;
//   document.querySelector(".img-text-2 h1").innerHTML =
//     `${Math.round(data.current.temperature_2m)}&deg;`;
//   document.querySelector(".img-text-2 img").src = getWeatherIcon(
//     data.current.weather_code
//   );

//   // This will display: Tuesday, Feb 10, 2026 (based on today's date)
//   document.querySelector(".img-text-1 p").innerText =
//     new Date().toLocaleDateString("en-US", {
//       weekday: "long",
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });

//   // Update Stats
//   const stats = document.querySelectorAll(".card-forecast p");
//   stats[0].innerHTML = `${Math.round(data.current.apparent_temperature)}&deg;`;
//   stats[1].innerText = `${data.current.relative_humidity_2m}%`;
//   stats[2].innerText = `${Math.round(data.current.wind_speed_10m)} km/h`;
//   stats[3].innerText = `${data.current.precipitation} mm`;

//   // Update Daily Forecast (Looping through 7 days)
//   forecastContainer.innerHTML = "";
//   data.daily.time.forEach((date, i) => {
//     const day = new Date(date).toLocaleDateString("en-US", {
//       weekday: "short",
//     });
//     forecastContainer.innerHTML += `
//             <div class="card-forecast-1">
//                 <div class="daily">
//                     <h4>${day}</h4>
//                     <img src="${getWeatherIcon(data.daily.weather_code[i])}" alt="weather">
//                 </div>
//                 <div class="daily-1">
//                     <p>${Math.round(data.daily.temperature_2m_max[i])}&deg;</p>
//                     <p style="opacity:0.5">${Math.round(data.daily.temperature_2m_min[i])}&deg;</p>
//                 </div>
//             </div>`;
//   });

//   // Update Hourly Forecast (Showing next 8 hours)

//   // Function to render 8 hours based on a starting index (0 = Day 1, 24 = Day 2, etc.)

//   function renderHourly(startIndex = 0) {
//     if (!globalWeatherData) return;

//     hourlyContainer.innerHTML = "";

//     // We loop 8 times, but start from the 'startIndex'
//     for (let i = startIndex; i < startIndex + 8; i++) {
//       const hourData = globalWeatherData.hourly.time[i];
//       const hour = new Date(hourData).getHours();
//       const ampm = hour >= 12 ? "PM" : "AM";
//       const displayHour = hour % 12 || 12;

//       hourlyContainer.innerHTML += `
//             <div class="timing-forecast">
//                 <div class="icon-forecast">
//                     <img src="${getWeatherIcon(globalWeatherData.hourly.weather_code[i])}" alt="weather">
//                     <h4>${displayHour} ${ampm}</h4>
//                 </div>
//                 <p>${Math.round(globalWeatherData.hourly.temperature_2m[i])}&deg;</p>
//             </div>`;
//     }
//   }

//   document.querySelectorAll(".days-dropdown a").forEach((link, index) => {
//     link.addEventListener("click", (e) => {
//       e.preventDefault();

//       // 1. Update the display text to the clicked day
//       document.querySelector(".units-1 p").innerText = e.target.innerText;

//       // 2. Hide the dropdown
//       document.querySelector(".days-dropdown").classList.remove("show");

//       // 3. Update the hourly forecast (Day 0 starts at index 0, Day 1 at 24, etc.)
//       const startIndex = index * 24;
//       renderHourly(startIndex);
//     });
//   });

//   // Inside updateUI...
//   renderHourly(0); // Default to today when first loading
// }

// // 5. Event Listeners

// unitsDropdown.addEventListener("click", () => {
//   dropdownUnits.classList.toggle("show");

//   if (dropdownUnits.classList.contains("show")) {
//     dropdownUnits.style.display = "block";
//     // dropdownUnits.style.zindex = ''
//   } else {
//     dropdownUnits.style.display = "none";
//   }
// });

// daysDropdown.addEventListener("click", () => {
//   dropdownDays.classList.toggle("show");

//   if (dropdownDays.classList.contains("show")) {
//     dropdownDays.style.display = "block";
//   } else {
//     dropdownDays.style.display = "none";
//   }
// });

// const openDropdown = (e) => {
//   // Stop propagation so the document click listener doesn't immediately close it
//   e.stopPropagation();
//   dropdownSearch.style.display = "block";
// };

// inputSearch.addEventListener("click", openDropdown);

// searchIcon.addEventListener("click", (e) => {
//   openDropdown(e);
//   inputSearch.focus();
// });

// if (!dropdownSearch.dataset.hasListener) {
//   dropdownSearch.addEventListener("click", (e) => {
//     const item = e.target.closest("a") || e.target;
//     if (!item || item === dropdownSearch) return;

//     // Set input text
//     inputSearch.value = item.textContent.trim();

//     // Close dropdown
//     dropdownSearch.style.display = "none";
//     inputSearch.focus();
//   });

//   dropdownSearch.dataset.hasListener = "1";

//   // Close when clicking anywhere else
//   document.addEventListener("click", (e) => {
//     if (!e.target.closest("label")) {
//       dropdownSearch.style.display = "none";
//     }
//   });
// }

// searchBtn.addEventListener("click", () => {
//   const city = inputSearch.value.trim();
//   if (city) {
//     searchError.classList.remove("show"); // Reset error UI
//     getWeatherData(city);
//   } else {
//     // Show error if they click search with nothing typed
//     searchError.classList.add("show");
//     // wholeContent.style.display = "none";
//   }
// });

// inputSearch.addEventListener("keypress", (e) => {
//   if (e.key === "Enter") {
//     const city = inputSearch.value.trim();
//     if (city) {
//       searchError.classList.remove("show"); // Reset error UI
//       getWeatherData(city);
//     }
//   }
// });

// // Initial Load
// getWeatherData();

// ==========================================
// 1. CONFIGURATION & DOM ELEMENTS
// ==========================================
const DOM = {
  // Search & Navigation
  inputSearch: document.querySelector(".input-search"),
  searchBtn: document.querySelector(".button-search"),
  searchIcon: document.querySelector(".icon-search"),
  dropdownSearch: document.querySelector(".search-dropdown"),
  searchLoading: document.querySelector(".search-loading"),
  retryButton: document.querySelector(".retry-button"),
  retryIcon: document.querySelector(".icon-retry"),

  // Dropdowns
  unitsDropdown: document.querySelector(".icon-dropdown"),
  daysDropdownIcon: document.querySelector(".dropdown-days"),
  dropdownUnits: document.querySelector(".unit-dropdown"),
  dropdownDays: document.querySelector(".days-dropdown"),
  unitsText: document.querySelector(".units-1 p"),
  dayLinks: document.querySelectorAll(".days-dropdown a"),

  // Imperial & Metric Toggles (For future use)
  imperialSwitch: document.querySelector("#imperial"),
  metricChecked: document.querySelectorAll(".unit-checked"),
  imperialChecked: document.querySelectorAll(".imperial-type"),
  imperialToggle: document.querySelectorAll(".imperial-img"),
  defaultToggle: document.querySelectorAll(".default-img"),

  // Containers & UI States
  loadingOverlay: document.getElementById("loading-overlay"),
  forecastContainer: document.querySelector(".daily-forecast-1"),
  hourlyContainer: document.querySelector(".timing"),
  errorContent: document.querySelector(".error-content"),
  searchError: document.querySelector(".search-error"),
  wholeContent: document.querySelector(".whole-content"),
  secondWholeContent: document.querySelector(".whole-content-1"),
};

let globalWeatherData = null;

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

/** Maps Open-Meteo codes to local assets */
function getWeatherIcon(code) {
  if (code === 0) return "./assets/images/icon-sunny.webp";
  if (code <= 3) return "./assets/images/icon-partly-cloudy.webp";
  if (code >= 45 && code <= 48) return "./assets/images/icon-fog.webp";
  if (code >= 51 && code <= 57) return "./assets/images/icon-drizzle.webp";
  if (code >= 61 && code <= 67) return "./assets/images/icon-rain.webp";
  if (code >= 71 && code <= 77) return "./assets/images/icon-snow.webp";
  if (code >= 95) return "./assets/images/icon-storm.webp";
  return "./assets/images/icon-overcast.webp";
}

/** Resets UI to a "Skeleton" loading state */
function setSkeletonState() {
  DOM.loadingOverlay.style.display = "flex";
  DOM.errorContent.classList.remove("show");
  DOM.searchError.classList.remove("show");
  DOM.wholeContent.style.display = "block";

  // Reset Stats to '-'
  document
    .querySelectorAll(".card-forecast p")
    .forEach((p) => (p.innerText = "-"));
  document.querySelector(".img-text-2 h1").innerHTML = "--&deg;";

  // Daily & Hourly Skeletons
  DOM.forecastContainer.innerHTML = Array(7)
    .fill('<div class="card-forecast-1" style="height: 150px;"></div>')
    .join("");
  DOM.hourlyContainer.innerHTML = Array(8)
    .fill('<div class="timing-forecast" style="height: 55px;"></div>')
    .join("");
}

// --- Search History Logic ---

function saveSearchHistory(city) {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  history = history.filter((item) => item.toLowerCase() !== city.toLowerCase());
  history.unshift(city);
  history = history.slice(0, 4);
  localStorage.setItem("weatherHistory", JSON.stringify(history));
  renderSearchHistory();
}

function renderSearchHistory() {
  const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

  if (history.length === 0) {
    DOM.dropdownSearch.innerHTML =
      "<p style='padding:10px; color:white; opacity:0.5; font-size: 0.8rem;'>No recent searches</p>";
    return;
  }

  const historyHTML = history
    .map((city) => `<a href="#" class="history-item">${city}</a>`)
    .join("");

  DOM.dropdownSearch.innerHTML = historyHTML;
  //  `
  // //   <hr style="opacity: 0.1; margin: 5px 0;">
  // //   <button id="clear-history" style="width:100%; background:none; border:none; color:#ff4d4d; padding:10px; cursor:pointer; font-size:0.8rem; font-weight:bold;">
  // //     Clear Recent Searches
  // //   </button>
  // // `;
}

// ==========================================
// 3. CORE LOGIC & API
// ==========================================

let isInitialLoad = true;

async function getWeatherData(city = "Abuja", unitSystem = "metric") {
  // Define variables based on the system
  const tempUnit = unitSystem === "imperial" ? "fahrenheit" : "celsius";
  const windUnit = unitSystem === "imperial" ? "mph" : "kmh";
  const precipUnit = unitSystem === "imperial" ? "inch" : "mm";

  if (DOM.searchLoading && !isInitialLoad) {
    DOM.searchLoading.classList.add("show"); // or .style.display = "flex"
  }
  setSkeletonState();

  try {
    // Step A: Geocoding
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      DOM.searchError.classList.add("show");
      DOM.loadingOverlay.style.display = "none";
      DOM.secondWholeContent.style.display = "none";

      if (DOM.searchLoading) DOM.searchLoading.classList.remove("show");
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];
    saveSearchHistory(name);

    // Step B: Weather Data
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&timezone=auto&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}&precipitation_unit=${precipUnit}`
    );
    const data = await weatherRes.json();

    globalWeatherData = data;
    updateUI(data, name, country);
  } catch (err) {
    console.error(err);
    DOM.errorContent.classList.add("show");
    DOM.wholeContent.style.display = "none";
  } finally {
    if (DOM.searchLoading) DOM.searchLoading.classList.remove("show"); // or .style.display = "none"
    DOM.loadingOverlay.style.display = "none";
    isInitialLoad = false;
  }
}

// ==========================================
// 4. UI UPDATES
// ==========================================

function renderHourly(startIndex = 0) {
  if (!globalWeatherData) return;
  DOM.hourlyContainer.innerHTML = "";

  for (let i = startIndex; i < startIndex + 8; i++) {
    const date = new Date(globalWeatherData.hourly.time[i]);
    let ampm;
    if (date.getHours() >= 12) {
      ampm = "PM";
    } else {
      ampm = "AM";
    }
    const displayHour = date.getHours() % 12 || 12;

    DOM.hourlyContainer.innerHTML += `
      <div class="timing-forecast">
        <div class="icon-forecast">
          <img src="${getWeatherIcon(globalWeatherData.hourly.weather_code[i])}" alt="weather">
          <h4>${displayHour} ${ampm}</h4>
        </div>
        <p>${Math.round(globalWeatherData.hourly.temperature_2m[i])}&deg;</p>
      </div>`;
  }
}

// For the metric and imperial units
let currentUnits = {
  temperature: "C&deg;",
  wind: "km/h",
  precipitation: "mm",
};

function updateUI(data, cityName, countryName) {
  DOM.wholeContent.style.display = "block";

  // Current Info
  document.querySelector(".img-text-1 h3").innerText =
    `${cityName}, ${countryName}`;
  document.querySelector(".img-text-2 h1").innerHTML =
    `${Math.round(data.current.temperature_2m)}&deg;`;
  document.querySelector(".img-text-2 img").src = getWeatherIcon(
    data.current.weather_code
  );
  document.querySelector(".img-text-1 p").innerText =
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  // Update Stats

  const stats = document.querySelectorAll(".card-forecast p");

  // Feels like Apparent temperature
  stats[0].innerHTML = `${Math.round(data.current.apparent_temperature)} ${currentUnits.temperature}`;

  // Humidity always stay %
  stats[1].innerText = `${data.current.relative_humidity_2m}%`;

  // Wind speed
  stats[2].innerText = `${Math.round(data.current.wind_speed_10m)} ${currentUnits.wind}`;

  // Precipittation
  stats[3].innerText = `${data.current.precipitation} ${currentUnits.precipitation}`;

  // Daily Forecast
  DOM.forecastContainer.innerHTML = "";
  data.daily.time.forEach((date, i) => {
    const dayName = new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
    });
    DOM.forecastContainer.innerHTML += `
      <div class="card-forecast-1">
        <div class="daily">
          <h4>${dayName}</h4>
          <img src="${getWeatherIcon(data.daily.weather_code[i])}" alt="weather">
        </div>
        <div class="daily-1">
          <p>${Math.round(data.daily.temperature_2m_max[i])}&deg;</p>
          <p style="opacity:0.5">${Math.round(data.daily.temperature_2m_min[i])}&deg;</p>
        </div>
      </div>`;
  });

  renderHourly(0);
}

// ==========================================
// 5. EVENT LISTENERS
// ==========================================

// Search Logic
const handleSearch = () => {
  const city = DOM.inputSearch.value.trim();
  if (city) {
    getWeatherData(city);
    DOM.dropdownSearch.style.display = "none";
  } else {
    // Show validation message but keep the main UI visible so a subsequent valid search will load
    DOM.searchError.classList.add("show");
    // DOM.secondWholeContent.style.display = "none";
    DOM.inputSearch.focus();
  }
};

DOM.searchBtn.addEventListener("click", handleSearch);
DOM.inputSearch.addEventListener(
  "keypress",
  (e) => e.key === "Enter" && handleSearch()
);

// Dropdown Toggles
DOM.unitsDropdown.addEventListener("click", () => {
  const isShow = DOM.dropdownUnits.classList.toggle("show");
  DOM.dropdownUnits.style.display = isShow ? "block" : "none";
});

DOM.daysDropdownIcon.addEventListener("click", () => {
  const isShow = DOM.dropdownDays.classList.toggle("show");
  DOM.dropdownDays.style.display = isShow ? "block" : "none";
});

// Imperial Toggling
DOM.imperialSwitch.addEventListener("click", (e) => {
  e.preventDefault();

  DOM.defaultToggle.forEach((el) => (el.style.display = "none"));
  DOM.imperialToggle.forEach((el) => (el.style.display = "block"));

  // To clear the background and remove the active class from Metric
  DOM.metricChecked.forEach((el) => {
    el.style.backgroundColor = "transparent"; // Fix: Removed .body and used "transparent"
  });

  // To add the background/class to Imperial
  DOM.imperialChecked.forEach((el) => {
    el.classList.add("active-unit");
  });

  const isSwitchToImperial = DOM.imperialSwitch.innerText.includes("Imperial");

  if (isSwitchToImperial) {
    currentUnits = { temperature: "F&deg;", wind: "mph", precipitation: "in" };
    getWeatherData(currentCity, "imperial");
  } else {
    currentUnits = { temperature: "C&deg;", wind: "Km/h", precipitation: "mm" };
    getWeatherData(currentCity, "metric");
  }
});

// Hourly Selection Listener
DOM.dayLinks.forEach((link, index) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    DOM.unitsText.innerText = e.target.innerText;
    DOM.dropdownDays.classList.remove("show");
    DOM.dropdownDays.style.display = "none";
    renderHourly(index * 24);
  });
});

// Search Dropdown & History Clicks
DOM.inputSearch.addEventListener("click", (e) => {
  e.stopPropagation();
  renderSearchHistory();
  DOM.dropdownSearch.style.display = "block";
});

DOM.searchIcon.addEventListener("click", (e) => {
  e.stopPropagation();

  // Get the value of whatever the user typed
  const query = DOM.inputSearch.value.trim();

  if (query === "") {
    // CASE A: Input is empty -> Show the recent searches
    renderSearchHistory();
    DOM.dropdownSearch.style.display = "block";
  } else {
    // CASE B: Input has text -> Hide history and start searching
    DOM.dropdownSearch.style.display = "none";
    handleSearch();
  }
});

DOM.dropdownSearch.addEventListener("click", (e) => {
  if (e.target.id === "clear-history") {
    localStorage.removeItem("weatherHistory");
    renderSearchHistory();
    return;
  }
  const item = e.target.closest(".history-item");
  if (item) {
    DOM.inputSearch.value = item.textContent;
    handleSearch();
  }
});

// FOR the retry button in case of an error. It will trigger a short animation
// and then call getWeatherData again to attempt to reload the weather data.

DOM.retryButton.addEventListener("click", () => {
  DOM.errorContent.classList.remove("show");
  DOM.searchLoading.style.display = "none "; // Hide search loading if it was visible

  // add a short spinning animation to the retry button, then call getWeatherData

  DOM.retryIcon.classList.add("animate-retry", "spin");

  if (DOM.retryIcon.classList.contains("animate-retry")) {
    DOM.retryIcon.style.animation = "spin 1.2s linear infinite";

    const handleAnimEnd = () => {
      DOM.retryIcon.classList.remove("animate-retry", "spin");
      DOM.retryIcon.removeEventListener("animationend", handleAnimEnd);
      DOM.retryIcon.removeEventListener("webkitAnimationEnd", handleAnimEnd);
    };
    DOM.retryIcon.addEventListener("animationend", handleAnimEnd);
    DOM.retryIcon.addEventListener("webkitAnimationEnd", handleAnimEnd);
  }

  // small delay so the animation is visible before reloading
  setTimeout(() => {
    getWeatherData();
  }, 300);
});

// Close dropdowns on outside click
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-container"))
    DOM.dropdownSearch.style.display = "none";
});

// Initial Load
renderSearchHistory();
getWeatherData();
