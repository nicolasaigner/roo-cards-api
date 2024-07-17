const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const { ImgurClient } = require('imgur');
// const client = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID });

let cards = [];
let mvps = [];
let packageJson = {};

try {
    const cardsPath = path.join(__dirname, 'cards.json');
    const mvpsPath = path.join(__dirname, 'mvps.json');
    const packagePath = path.join(__dirname, '../package.json');

    cards = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));
    mvps = JSON.parse(fs.readFileSync(mvpsPath, 'utf8'));
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
    return data.filter(item => {
        return Object.keys(query).every(key => {
            return item[key] && item[key].toString().toLowerCase() === query[key].toString().toLowerCase();
        });
    });
}

async function attachImagesToCards(cards) {
    const album = await client.getAlbum('TJAAMyH');
    const images = album.data.images;

    return cards.map(card => {
        const image = images.find(img => img.description === card.name);
        if (image) {
            card.imageUrl = image.link;
        }
        return card;
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

const normalizeName = (name) => {
    return name.replace(/ /g, '_').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};


app.get('/cards', async (req, res) => {
    const filteredCards = filterByQuery(cards, req.query);
    const baseUrl = `${req.protocol}://${req.get('host')}/card/image`;

    const cardsWithImages = filteredCards.map(card => {
        const folderName = armamentoToFolder[card.Armamento] || 'unknown';
        const imageName = normalizeName(card.Nome) + '.png';
        return {
            ...card,
            imageUrl: `${baseUrl}/${folderName}/${imageName}`
        };
    });

    res.json(cardsWithImages);
});

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

app.use('/card/image', express.static(path.join(__dirname, '../database/images/cartas')));

app.get('/mvps', (req, res) => {
    res.json(filterByQuery(mvps, req.query));
});

module.exports = app;
