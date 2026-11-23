# G7 Scooters

Prévia do link na bio da loja em Cedral, SP. Projeto Vite com React e TypeScript.

```sh
npm ci
npm run dev
npm run build
```

Edite `src/config.ts` para alterar o catálogo, os contatos, os dados da loja e as mídias. Preencha `workshop` com a URL oficial da oficina quando confirmada. O campo vazio direciona consultas de conserto ao WhatsApp com uma mensagem própria.

O mapa inicial usa dados do OpenStreetMap, com o pin sobre a coordenada da ficha oficial da loja. A ficha, a rota e o mapa interativo apontam para a mesma unidade. Uma imagem verificada da fachada pode ser definida em `store.facade`.

Adicione cada depoimento autorizado a `testimonials` com `title`, `poster`, `video` e, quando houver, `captions` no formato WebVTT. Com a lista vazia, a seção exibe a indisponibilidade de vídeos.

O escudo e as fotos de scooters vêm do catálogo da G7. A arte de ferramenta e a de conversa são ilustrações. Os metadados de compartilhamento e o favicon estão em `index.html`.

## Referências da revisão

| Dobra | Aplicação |
| --- | --- |
| Abertura | Arco e título sobreposto a partir da referência Julian David, com recorte e luz próprios da G7. |
| Cortina | Motion Footer, com profundidade e revelação vinculadas à rolagem nativa via CSS. |
| Cards | Contraste e ilustração em profundidade inspirados em Art Centerpiece, com inclinação e pressão. |
| Passagem ao mapa | Smooth Scroll, com deslocamento curto da luz conforme a seção entra na tela. |
| Localização | Expanded Map, com vista compacta e expandida, molas de perspectiva no desktop e pin da loja. |
| Faixa | Brand Scoller, com duas sequências idênticas de escudos para um loop contínuo. |
| Depoimentos | Glass Folder Cards e Stories Carousel, com três camadas, capas em leque e player por item. |

A fachada verificada, o link oficial da oficina e os vídeos autorizados continuam pendentes. A lista de depoimentos permanece vazia.
