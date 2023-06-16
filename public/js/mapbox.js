/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoic2FiaGFyaXNoMjAyMyIsImEiOiJjbGlyZ2UxMzIwNGp0M2dvNzY3NW8yZXllIn0.j85JRdmvI6fM5kLfZnnEpg';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/sabharish2023/clit2mip600b401qy8zmt0g7s',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  if (Array.isArray(locations)) {
    locations.forEach((loc) => {
      // Create marker
      const el = document.createElement('div');
      el.className = 'marker';

      // Add marker
      new mapboxgl.Marker({
        element: el,
        anchor: 'bottom',
      })
        .setLngLat(loc.coordinates)
        .addTo(map);

      // Add popup
      new mapboxgl.Popup({
        offset: 30,
      })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map);

      // Extend map bounds to include current location
      bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100,
      },
    });
  } else {
    console.error('Locations is not an array.');
  }
};
