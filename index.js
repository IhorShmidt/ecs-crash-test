'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const badRequest = function(status, error) {

    return {
        http_code: 400,
        status: status,
        error: error || status
    };
};


app.use((req, res, next) => {
    console.log('req.url: ', req.url);
    next();
})

app.get('/value', (req, res, next) => {
    const value = req.query.value;
    console.log(`returning value: ${value}`);
    res.send({value});
});

app.post('/value', (req, res, next) => {
    console.log('post');
    const value = req.body.value;
    console.log(`returning value: ${value}`);
    res.send({value});
});
app.post('/error', (req, res, next) => {
    console.log('post');
    const value = req.body.value;
    console.log(`returning value: ${value}`);
    try {
        throw badRequest('invalid_data');
    } catch (error) {
        next(error)
    }
});

app.get('/hc', (req, res) => res.status(200).json({status: 'ok'}));

app.get('/crash', (req, res, next) => {
    console.log('crushing the server');
    process.exit()
})
app.get('/of', (req, res, next) => {
    const {a} = process.env.NOT_EXISTS;
    res.send({a});
})


app.use((err, req, res, next) => {
    console.log('err: ', err);

    res.status(err.http_code || err.statusCode || err.status || 500).json(err);
})

app.use(function(req, res) {
    return res.status(404).send({message: 'Requested route not found.'});
});


(async () => {
    await delay();
    const port = 80;
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    })
})()


function delay(ms = 3000) {
    return new Promise(resolve => setTimeout(resolve, ms));
}





