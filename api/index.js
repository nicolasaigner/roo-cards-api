const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

let cards = [];
let mvps = [];
let package = {};

try {
    // Usando __dirname para garantir o caminho relativo correto
    const cardsPath = path.join(__dirname, 'cards.json');
    const mvpsPath = path.join(__dirname, 'mvps.json');
    const packagePath = path.join(__dirname, '../package.json');
    
    cards = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));
    mvps = JSON.parse(fs.readFileSync(mvpsPath, 'utf8'));
    package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
} catch (e) {
    console.error('Erro ao ler os arquivos JSON:', e);
    console.log('Diretório atual:', __dirname);
    try {
        const files = fs.readdirSync(__dirname);
        console.log('Arquivos no diretório:', files);
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
