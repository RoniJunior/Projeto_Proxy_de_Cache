#!/usr/bin/env node

const http = require("http");
const url = require("url");

// Armazenamento do cache em memória
const cache = new Map();

// Parâmetros CLI
const args = process.argv.slice(2);
const portIndex = args.indexOf("--port");
const originIndex = args.indexOf("--origin");
const clearCacheIndex = args.indexOf("--clear-cache");

if (clearCacheIndex !== -1) {
  console.log("Cache limpo!");
  cache.clear();
  process.exit(0);
}

if (portIndex === -1 || originIndex === -1 || args.length < 4) {
  console.error("Uso: caching-proxy --port <number> --origin <url>");
  process.exit(1);
}

const port = parseInt(args[portIndex + 1], 10);
const origin = args[originIndex + 1];

const proxyServer = http.createServer((req, res) => {
  const requestUrl = req.url;
  const cacheKey = `${req.method}:${requestUrl}`;

  // Verifica se a resposta está no cache
  if (cache.has(cacheKey)) {
    console.log(`Cache HIT: ${requestUrl}`);
    const cachedResponse = cache.get(cacheKey);

    // Adiciona cabeçalhos de cache e retorna a resposta
    res.writeHead(200, {
      ...cachedResponse.headers,
      "X-Cache": "HIT",
    });
    res.end(cachedResponse.body);
    return;
  }

  console.log(`Cache MISS: ${requestUrl}`);

  // Encaminha a solicitação para o servidor de origem
  const originUrl = new url.URL(origin + requestUrl);

  const options = {
    hostname: originUrl.hostname,
    port: originUrl.port || 80,
    path: originUrl.pathname + originUrl.search,
    method: req.method,
    headers: req.headers,
  };

  const originReq = http.request(options, (originRes) => {
    let data = "";

    // Lê os dados da resposta
    originRes.on("data", (chunk) => {
      data += chunk;
    });

    originRes.on("end", () => {
      // Armazena a resposta no cache
      cache.set(cacheKey, {
        headers: originRes.headers,
        body: data,
      });

      // Retorna a resposta ao cliente
      res.writeHead(originRes.statusCode, {
        ...originRes.headers,
        "X-Cache": "MISS",
      });
      res.end(data);
    });
  });

  originReq.on("error", (err) => {
    console.error(`Erro ao encaminhar solicitação: ${err.message}`);
    res.writeHead(500);
    res.end("Internal Server Error");
  });

  req.pipe(originReq); // Encaminha os dados da solicitação
});

proxyServer.listen(port, () => {
  console.log(`Servidor proxy de cache iniciado na porta ${port}.`);
  console.log(`Encaminhando solicitações para: ${origin}`);
});
