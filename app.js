
/**
 * nome: Gabriel Cavalcante dos Santos
 */


// Inicializa o mapa no elemento com id="map"
const map = L.map('map').setView([0, 0], 2);

// Adiciona camada base (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

let markers = []; // guarda os marcadores ativos

// Função que busca e exibe voos
async function getFlights() {
  try {
    const url = "https://opensky-network.org/api/states/all";
    const res = await fetch(url);
    const data = await res.json();

    // Remove marcadores antigos antes de adicionar novos
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    // Mostra os primeiros 20 voos
    data.states.slice(0, 20).forEach(flight => {
      const lat = flight[6];
      const lon = flight[5];
      if (lat && lon) {
        const marker = L.marker([lat, lon]).addTo(map)
          .bindPopup(`
            <b>Voo:</b> ${flight[1] || "Desconhecido"}<br>
            <b>Origem:</b> ${flight[2] || "N/A"}<br>
            <b>Altitude:</b> ${flight[7] ? flight[7].toFixed(0) : "?"} m
          `);
        markers.push(marker);
      }
    });

  } catch (error) {
    console.error("Erro ao buscar dados da OpenSky:", error);
  }
}

// Chama a função e atualiza a cada 15 segundos
getFlights();
setInterval(getFlights, 15000);