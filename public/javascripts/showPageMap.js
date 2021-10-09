mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: place.geometry.coordinates, // starting position [lng, lat]
zoom: 10 // starting zoom
});


//setting point
// Set marker options.
const marker = new mapboxgl.Marker({
    color: "#000",
    // draggable: true
})
    .setLngLat(place.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:25})
        .setHTML(
            `<h3>${place.title}</h3><p>${place.location}</p>`
        )
    )
    .addTo(map);

marker()