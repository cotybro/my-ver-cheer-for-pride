import { locations } from "./data.js";
console.log(locations);

let map;
let markers = [];

async function initMap() {
  const position = { lat: 44.9770686631351, lng: -93.26604525646975 };
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    zoom: 11,
    center: position,
    mapId: "1cdc83735f861a9b",
    mapTypeControl: false,
  });
  setMarkers();
}

function setMarkers() {
  const shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: "poly",
  };

  let currentInfoWindow;

  // Clear existing markers
  markers.forEach((marker) => marker.setMap(null));
  markers = [];

  // Create markers for all locations
  for (let i = 0; i < locations.length; i++) {
    const location = locations[i];
    console.log(location.phone);
    const marker = new google.maps.Marker({
      position: { lat: location.position.lat, lng: location.position.lng },
      icon: {
        url: "./img/pin.png",
        scaledSize: new google.maps.Size(65, 65),
      },
      map,
      title: location.location,
      zIndex: i,
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div class="info-window">
            <p>${location.location}</p>
            <p>${location.address}</p>
            <p>Phone: <a href="tel:${location.phone}">${location.phone}</a></p>
            <a href="${location.website}" target="_blank">Website</a>
        </div>
      `,
    });

    marker.addListener("click", () => {
      if (currentInfoWindow) {
        currentInfoWindow.close();
      }
      infoWindow.open(map, marker);
      currentInfoWindow = infoWindow;
    });

    markers.push(marker);
  }
}

initMap();

const locationList = document.getElementById("location-list");
let locationListHTML = "";

locations.forEach((location) => {
  let hoursHtml = "<ul>";
  for (let day in location.hours) {
    hoursHtml += `<li>${day}: ${location.hours[day]}</li>`;
  }
  hoursHtml += "</ul>";

  locationListHTML += `
    <div class='location-card'>
      <div class='location-image'>
        <img src='${location.image}' alt='${location.location}' class='card-img'/>
      </div>
      <p class='location-text'>${location.location}</p>
      <div class='hours-wrapper'>
        ${hoursHtml}
      </div>
    </div>
  `;
});

locationList.innerHTML = locationListHTML;

const locationCards = document.querySelectorAll(".location-card");
locationCards.forEach((card) => {
  card.addEventListener("click", () => {
    const locationIndex = Array.from(locationCards).indexOf(card);
    const location = locations[locationIndex];
    const center = { lat: location.position.lat, lng: location.position.lng };
    map.setCenter(center);
    map.setZoom(15);
  });
});

const locationListContainer = document.getElementById(
  "location-list-container"
);
locationListContainer.addEventListener("wheel", (e) => {
  e.preventDefault();
  locationListContainer.scrollLeft += e.deltaY;
});
