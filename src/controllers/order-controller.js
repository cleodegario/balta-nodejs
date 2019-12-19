'use strict';

const repository = require('../repositores/order-repository');
const guid = require('guid');
const authService = require('../services/auth-service');

exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha na requisição'
        });
    }
}

exports.post = async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        await repository.create({
            customer: data.id,
            number: guid.raw().substring(0, 6),
            items: req.body.items
        });
        res.status(200).send({
            message: 'success'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha na requisição'
        });
    }

};
