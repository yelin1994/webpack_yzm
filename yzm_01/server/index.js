self = {};
const express = require('express');
const fs = require('fs');
const path =  require('path');
const {renderToString} = require('react-dom/server');
const SSR = require('../dist/app-server');
const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8');
const server = (port) => {
    const app = express();
    app.use(express.static('dist'));
    app.get('/search', (req, res) => {
        const html = renderMarkingUp(renderToString(SSR));
        res.status(200).send(html);
    });

    app.listen(port, () => {
        console.log('Server is running now');
    });

}

server(process.env.PORT || 3001);

const renderMarkingUp = (str) => {
    return template.replace('HTML_PLACEHODE', str);
}