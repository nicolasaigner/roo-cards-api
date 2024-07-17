# Roo Cards API

## Sobre o Projeto
A **Roo Cards API** é uma API pública e open-source que fornece informações detalhadas sobre as cartas do jogo **Ragnarok Origin**. Esta API está atualmente em desenvolvimento e foi projetada para ser um recurso fácil de usar para desenvolvedores que desejam integrar dados de cartas em suas aplicações.

**Aviso**: Esta API está em fase de desenvolvimento ativo e mais funcionalidades serão adicionadas continuamente.

## Recursos

- **Listar Todas as Cartas**: Retorna um array de cartas com detalhes completos.
- **Filtros Dinâmicos**: Permite filtrar cartas por qualquer atributo, como nome ou armamento.
- **Imagens das Cartas**: Fornece URLs para as imagens das cartas, facilitando a integração visual.

## Exemplo rodando no Vercel

https://roo-cards-api.vercel.app/cards

## Como Usar

Para começar a usar a Roo Cards API, você pode fazer requisições HTTP GET para os seguintes endpoints:

### Obter Todas as Cartas

```
GET /cards
```

Retorna todas as cartas disponíveis na base de dados.

### Filtrar Cartas por Nome

```
GET /cards?Nome=Strouf
```

Substitua `Strouf` pelo atributo desejado para filtrar cartas específicas. Ex.:

```
GET /cards?Nome=Abelha-Rainha%20(Ilusória)
```

### Obter Imagens das Cartas

```
GET /card/image/{armamento}/{nome_da_carta}.png
```

Troque o `armamento` por algum `path` desses nomes abaixo, dessa forma, a API irá buscar nas `Pastas` das imagens: 

| **Pasta**      |    **path**    |
|:--------------:|:--------------:|
|  acessorio      |   Acessório    |
|  armadura       |    Armadura    |
|  boca           |      Boca      |
|  calcado        |    Calçado     |
|  capa           |      Capa      |
|  chapeu         |     Chapéu     |
|  costas         |     Costas     |
|  face           |      Face      |
|  fantasia       |    Fantasia    |
|  mao_dominante  | Mão Dominante  |
|  mao_secundaria | Mão Secundária |

Por exemplo, a carta Abelha-Rainha Ilusória:


```json
{
    "Nome": "Abelha-Rainha (Ilusória)",
    "Armamento": "Chapéu",
    "Atributos Básicos": "Remove o custo de minério mágico|Consumo de PM +50.00% das habilidades",
    "Desperto": {
      "Nv. 5": "Dano M +0.50%",
      "Nv. 10": "Dano M +1%",
      "Nv. 15": "Dano M +1.50%"
    },
    "imageUrl": "http://localhost:3000/card/image/chapeu/Abelha-Rainha (Ilusória).png"
}
```

A rote fica dessa forma:

```
GET /card/image/chapeu/Abelha-Rainha (Ilusória).png
```

## Observações adicionais

Essa API é um projeto pessoal em que está em desenvolvimento, não é algo que estou totalmente focado a fazer no momento, mas as vezes estou atualizando e melhorando. No momento o código é para retornar as cartas, atributos, desperto e imagens das mesmas. 

## Contribuindo

Contribuições são o que fazem a comunidade open-source um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será **muito apreciada**.

Se você tem sugestões para melhorar esta API, por favor fork o repositório e crie um pull request. Você também pode simplesmente abrir uma issue com a tag "melhoria". Não esqueça de dar uma estrela ao projeto! Aqui estão alguns passos para começar:

1. Fork o Projeto
2. Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas Mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Distribuído sob a Licença MIT. Veja `LICENSE` para mais informações.

## Contato

Nícolas Aigner - [LinkedIn](https://www.linkedin.com/in/nicolasaigner/) - [GitHub](https://github.com/nicolasaigner)

Link do Projeto: [https://github.com/nicolasaigner/roo-cards-api](https://github.com/nicolasaigner/roo-cards-api)