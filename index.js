const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

// Leitura do arquivo JSON contendo as cartas e MVPs
const cards = JSON.parse(fs.readFileSync('cards.json', 'utf8'));
const mvps = JSON.parse(fs.readFileSync('mvps.json', 'utf8'));

// Função para determinar os filtros possíveis com base nas chaves dos objetos
function determineAvailableFilters(data) {
    const filterKeys = new Set();
    data.forEach(item => {
        Object.keys(item).forEach(key => filterKeys.add(key));
    });
    return Array.from(filterKeys);
}

// Função genérica de filtragem
function filterByQuery(data, query) {
    return data.filter(item => {
        return Object.keys(query).every(key => {
            // Considera a filtragem apenas se a chave existe no objeto
            return item[key] && item[key].toString().toLowerCase() === query[key].toString().toLowerCase();
        });
    });
}

app.get('/cards/filters', (req, res) => {
    res.json(determineAvailableFilters(cards));
});

app.get('/mvps/filters', (req, res) => {
    res.json(determineAvailableFilters(mvps));
});

app.get('/cards', (req, res) => {
    res.json(filterByQuery(cards, req.query));
});

app.get('/mvps', (req, res) => {
    res.json(filterByQuery(mvps, req.query));
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
