require('dotenv').config();

const express = require('express');
const session = require('express-session');
const proxy = require('express-http-proxy');

const app = express();

const resolveProxyHost = req => {
    const params = [
        req.session.branch
    ];

    return params.reduce((url, param, index) => url.replace(`{${index}}`, param), process.env.PROXY_URL);
};

app.use(session({saveUninitialized: true, resave: true, secret: 'sec'}));
app.use((req, res, next) => {
    if (!req.session.branch) {
        req.session.branch = 'master';
    }

    if (req.query.branch) {
        req.session.branch = req.query.branch;
    }

    next();
});
app.use(proxy(resolveProxyHost));

const PORT = process.env.PORT || 80;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});