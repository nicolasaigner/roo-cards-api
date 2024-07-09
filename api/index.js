const express = require('express');
const fs = require('fs');
const app = express();

const cards = JSON.parse(fs.readFileSync('cards.json', 'utf8'));
const mvps = JSON.parse(fs.readFileSync('mvps.json', 'utf8'));

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
    res.send('Hello from Express on Vercel!');
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
