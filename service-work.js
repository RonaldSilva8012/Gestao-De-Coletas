const CACHE_NAME = 'gestao-coletas-v1';
// Lista de arquivos que o app precisa para funcionar offline
const urlsToCache = [
  '/',
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js' // Cache da biblioteca de gráficos
];

// Evento de Instalação: Salva os arquivos em cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de Fetch: Intercepta requisições
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Se encontrar no cache, retorna do cache (rápido, offline)
        if (response) {
          return response;
        }
        // Se não, busca na rede (online)
        return fetch(event.request);
      }
    )
  );
});