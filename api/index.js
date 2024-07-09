const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

let cards = [];
let mvps = [];
try {
    const cardsPath = path.join(process.cwd(), 'cards.json');
    const mvpsPath = path.join(process.cwd(), 'mvps.json');
    
    cards = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));
    mvps = JSON.parse(fs.readFileSync(mvpsPath, 'utf8'));
} catch (e) {
    console.error('Erro ao ler os arquivos JSON:', e);
    console.log('Pasta atual:', process.cwd());
    try {
        const files = fs.readdirSync(process.cwd());
        console.log('Arquivos no diretório atual:', files);
    } catch (err) {
        console.error('Erro ao listar arquivos do diretório:', err);
    }
}

function determineAvailableFilters(data) {
    const filterKeys = new Set();
    data.forEach(item => {
        Object.keys(item).forEach(key => filterKeys.add(key));
    });
    return Array.from(filterKeys);
}

function filterByQuery(data, query) {
    return data.filter(item => {
        return Object.keys(query).every(key => {
            return item[key] && item[key].toString().toLowerCase() === query[key].toString().toLowerCase();
        });
    });
}

app.get('/', (req, res) => {
    res.json({
        ok: true,
        version: package.version
    });
});

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

module.exports = app;
