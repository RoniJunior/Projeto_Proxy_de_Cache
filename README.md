
[Proxy de cache] https://roadmap.sh/projects/caching-server

# _Proxy de cache_
### Crie um servidor de cache que armazene em cache as respostas de outros servidores.
---
Você deve criar uma ferramenta CLI que inicie um servidor proxy de cache, ela encaminhará solicitações para o servidor real e armazenará as respostas em cache. Se a mesma solicitação for feita novamente, ela retornará a resposta armazenada em cache em vez de encaminhar a solicitação para o servidor.

### Requisitos
O usuário deve ser capaz de iniciar o servidor proxy de cache executando um comando como o seguinte:

caching-proxy --port <number> --origin <url>

--port é a porta na qual o servidor proxy de cache será executado.
--origin é a URL do servidor para o qual as solicitações serão encaminhadas.

Por exemplo, se o usuário executar o seguinte comando:

caching-proxy --port 3000 --origin http://dummyjson.com
O servidor proxy de cache deve iniciar na porta 3000 e encaminhar solicitações para o .http://dummyjson.com

Tomando o exemplo acima, se o usuário fizer uma solicitação para , o servidor proxy de cache deve encaminhar a solicitação para , retornar a resposta junto com os cabeçalhos e armazenar a resposta em cache. Além disso, adicione os cabeçalhos à resposta que indicam se a resposta é do cache ou do servidor.http://localhost:3000/productshttp://dummyjson.com/products

# If the response is from the cache
X-Cache: HIT

# If the response is from the origin server
X-Cache: MISS
Se a mesma solicitação for feita novamente, o servidor proxy de cache deverá retornar a resposta armazenada em cache em vez de encaminhar a solicitação para o servidor.

## Você também deve fornecer uma maneira de limpar o cache executando um comando como o seguinte:

caching-proxy --clear-cache
---
Depois de criar o projeto acima, você deve ter uma boa compreensão de como o cache funciona e como você pode criar um servidor proxy de cache para armazenar em cache as respostas de outros servidores.
