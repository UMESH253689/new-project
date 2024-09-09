// Connect to the server via Socket.io
const socket = io();

// Initialize the Leaflet map
const map = L.map('map').setView([51.505, -0.09], 13);

// Load and display map tiles from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
}).addTo(map);

let userMarker;

// Function to handle success of Geolocation API
function success(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // If userMarker does not exist, create it
  if (!userMarker) {
    userMarker = L.marker([latitude, longitude]).addTo(map).bindPopup("You are here!");
  } else {
    // Update the marker position if it exists
    userMarker.setLatLng([latitude, longitude]);
  }

  // Center the map on the user's current location
  map.setView([latitude, longitude], 13);

  // Send the user's location to the server
  socket.emit('locationUpdate', { latitude, longitude });
}

// Handle errors from the Geolocation API
function error() {
  alert("Unable to retrieve your location.");
}

// Options for Geolocation
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

// Track the user's location in real-time
navigator.geolocation.watchPosition(success, error, options);

// Listen for other users' location updates from the server
socket.on('userLocation', (coords) => {
  const { latitude, longitude } = coords;

  // Add a marker for other users' locations
  L.marker([latitude, longitude]).addTo(map).bindPopup("Another user is here!");
});
