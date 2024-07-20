const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: '*'
}));

let cards = [];
let mvps = [];
let recommendationsCards = {};
let packageJson = {};

const armamentoToFolder = {
    "Acessório": "acessorio",
    "Armadura": "armadura",
    "Boca": "boca",
    "Calçado": "calcado",
    "Capa": "capa",
    "Chapéu": "chapeu",
    "Costas": "costas",
    "Face": "face",
    "Fantasia": "fantasia",
    "Mão Dominante": "mao_dominante",
    "Mão Secundária": "mao_secundaria"
};

try {
    const cardsPath = path.join(__dirname, 'cards.json');
    const mvpsPath = path.join(__dirname, 'mvps.json');
    const recommendationsCardsPath = path.join(__dirname, 'recommendations_cards.json');
    const packagePath = path.join(__dirname, '../package.json');

    cards = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));
    mvps = JSON.parse(fs.readFileSync(mvpsPath, 'utf8'));
    recommendationsCards = JSON.parse(fs.readFileSync(recommendationsCardsPath, 'utf8'));
    packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
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
    const correctedQuery = {};
    Object.keys(query).forEach(key => {
        const correctedKey = key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ');
        correctedQuery[correctedKey] = query[key];
    });
    return data.filter(item => {
        return Object.keys(correctedQuery).every(key => {
            const itemKey = Object.keys(item).find(k => k.toLowerCase() === key.toLowerCase());
            if (!itemKey) return false;
            const itemValue = item[itemKey] ? item[itemKey].toString().toLowerCase() : '';
            const queryValue = correctedQuery[key] ? correctedQuery[key].toString().toLowerCase() : '';
            return itemValue === queryValue;
        });
    });
}

app.get('/', (req, res) => {
    res.json({
        ok: true,
        version: packageJson.version
    });
});

app.get('/cards/filters', (req, res) => {
    res.json(determineAvailableFilters(cards));
});

app.get('/mvps/filters', (req, res) => {
    res.json(determineAvailableFilters(mvps));
});

app.get('/cards', async (req, res) => {
    const filteredCards = filterByQuery(cards, req.query);
    const baseUrl = `${req.protocol}://${req.get('host')}/card/image`;

    const cardsWithImages = filteredCards.map(card => {
        const folderName = armamentoToFolder[card.Armamento] || 'unknown';
        const imageName = `${card.Nome}.png`;
        return {
            ...card,
            imageUrl: `${baseUrl}/${folderName}/${imageName}`
        };
    });

    res.json(cardsWithImages);
});

app.use('/card/image', express.static(path.join(__dirname, '../database/images/cartas')));

app.get('/mvps', async (req, res) => {
    const filteredMvps = filterByQuery(mvps, req.query);
    const baseUrl = `${req.protocol}://${req.get('host')}/mvp/image`;

    const mvpsWithImages = filteredMvps.map(mvp => {
        const imageName = `${mvp.name}.png`;
        let conversorArray = [];
        if (mvp.hasOwnProperty('recommended_elements')) {
            mvp.recommended_elements.forEach((item) => {
                conversorArray.push(`${req.protocol}://${req.get('host')}/conversor/image/${item}.png`);
            });
        }

        return {
            ...mvp,
            thumbnailUrl: `${baseUrl}/thumbnails/${imageName}`,
            imageUrl: `${baseUrl}/total/${imageName}`,
            conversorImageUrl: conversorArray,
        };
    });

    res.json(mvpsWithImages);
});

app.get('/recommendations', async (req, res) => {
    res.json(recommendationsCards);
});

app.use('/mvp/image', express.static(path.join(__dirname, '../database/images/monstros/mvp')));
app.use('/conversor/image', express.static(path.join(__dirname, '../database/images/conversores')));

module.exports = app;
