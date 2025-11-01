/**
 * nome: Gabriel Cavalcante dos Santos
 * trabalho: API pública para treinamento e entrega de atividade
 * professor: Fernando Leonid
 * descrição: O meu projeto utiliza uma API pública de aviões em tempo real, com uma interface feita em HTML e CSS.
 * versão: 2.1 (melhoria de interação ao clicar em aviões)
 */

const map = L.map('map').setView([0, 0], 2);

// Adiciona camada base para o mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

let markers = []; // guarda os marcadores ativos

// Cria o container de informações (invisível por padrão)
const infoContainer = document.createElement('div');
infoContainer.className = 'info-container';
infoContainer.style.display = 'none';
document.body.appendChild(infoContainer);

// Fecha o container ao clicar fora
document.addEventListener('click', (event) => {
  if (!infoContainer.contains(event.target) && event.target.tagName !== 'IMG') {
    infoContainer.style.display = 'none';
  }
});

// Função que busca e exibe voos
async function getFlights() {
  try {
    const url = "https://opensky-network.org/api/states/all";
    const res = await fetch(url);
    const data = await res.json();

    // Remove marcadores antigos
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    // Mostra os primeiros voos
    data.states.slice(0, 150).forEach(flight => {
      const lat = flight[6];
      const lon = flight[5];

      if (lat && lon) {
        const marker = L.marker([lat, lon]).addTo(map);

        // Evento de clique no avião
        marker.on('click', (e) => {
          e.originalEvent.stopPropagation(); // impede que o clique feche o container

          const voo = flight[1] || "Desconhecido";
          const origem = flight[2] || "N/A";
          const altitude = flight[7] ? flight[7].toFixed(0) + " m" : "?";
          const velocidade = flight[9] ? (flight[9] * 3.6).toFixed(1) + " km/h" : "?";
          const pais = flight[2]?.slice(0, 2).toUpperCase() || "??";

          // Monta o conteúdo do container
          infoContainer.innerHTML = `
            <div class="info-header">
              <h2> Voo: ${voo}</h2>
              <button id="closeBtn">x</button>
            </div>
            <p><b>Origem:</b> ${origem}</p>
            <p><b>Altitude:</b> ${altitude}</p>
            <p><b>Velocidade:</b> ${velocidade}</p>
            <p><b>País:</b> ${pais}</p>
          `;

          // Exibe o container na tela
          infoContainer.style.display = 'block';

          // Botão de fechar manual
          document.getElementById('closeBtn').addEventListener('click', () => {
            infoContainer.style.display = 'none';
          });
        });

        markers.push(marker);
      }
    });

  } catch (error) {
    console.error("Erro ao buscar dados da OpenSky:", error);
  }
}

// Atualiza a cada 10 segundos
getFlights();
setInterval(getFlights, 10000);

// Chama as funções para atualizar os voos 
getFlights();
setInterval(getFlights, 5000); // aqui eu coloquei a cada 5s