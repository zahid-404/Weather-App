// variables
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAcessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessButton = document.querySelector("[data-grantAccess]");
const searchInput = document.querySelector("[data-searchInput]");

// API Key & Tab
let currentTab = userTab;
const API_KEY = "47fdfa8d81b164e6e8a570d98cbbd71f";
currentTab.classList.add("current-tab");
getFromSessionStorage();

// Function for tab switching
function switchTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    // moving from user to search tab
    if (!searchForm.classList.contains("active")) {
      userInfoContainer.classList.remove("active");
      grantAcessContainer.classList.remove("active");
      searchForm.classList.add("active");
    }

    // moving from search to user tab
    else {
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      // getting coordinates from local storage
      getFromSessionStorage();
    }
  }
}

// Function for checking coordinates are available in session storage
function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    grantAcessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

// Function for fetch user weather info
async function fetchUserWeatherInfo(coordinates) {
  const { lat, long } = coordinates;

  // make grant container invisible
  grantAcessContainer.classList.remove("active");

  // make loader invisble
  loadingScreen.classList.add("active");

  // API call
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (error) {
    loadingScreen.classList.remove("active");
    alert("not found");
  }
}

// Function for render weather info
function renderWeatherInfo(weatherInfo) {
  // fetching elements
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");

  // fetching info from weatherInfo object & put into UI elements
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = weatherInfo?.main?.temp;
  windspeed.innerText = weatherInfo?.wind?.speed;
  humidity.innerText = weatherInfo?.main?.humidity;
  cloudiness.innerText = weatherInfo?.clouds?.all;
}

// function to get current location of user
export function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("geolocation is not supported, Please try in different browser");
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    long: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

// function for searching weather by city
async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAcessContainer.classList.remove("active");
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    alert("check spellings of city");
  }
}

// tab switching
userTab.addEventListener("click", () => {
  switchTab(userTab);
});

// tab switching
searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

// get current user location
grantAccessButton.addEventListener("click", getLocation);

// search weather by city
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;
  if (searchInput.value === "") return;
  else fetchSearchWeatherInfo(cityName);
});
