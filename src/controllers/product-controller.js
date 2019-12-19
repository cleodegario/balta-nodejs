'use strict';

const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositores/product-repository');

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

exports.getBySlug = async (req, res, next) => {
    try {
        var data = await repository
            .getBySlug(req.params.slug)
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha na requisição'
        });
    }
}

exports.getByTag = async (req, res, next) => {
    try {
        var data = await repository.getByTag(req.params.tag)
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha na requisição'
        });
    }
}

exports.getById = async (req, res, next) => {
    try {
        var data = await repository.getById(req.params.id)
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha na requisição'
        });
    }
}

exports.post = async (req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 3, 'O título deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.slug, 3, 'O título deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.description, 3, 'O título deve conter pelo menos 3 caracteres');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }
    try {
        await repository.create(req.body);
        res.status(200).send({
            message: 'success'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha na requisição'
        });
    }

};

exports.put = async (req, res, next) => {
    await repository.update(req.params.id, req.body);
    try {
        await repository.create(req.body);
        res.status(200).send({
            message: 'success'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha na requisição'
        });
    }

};

exports.delete = async (req, res, next) => {
    await repository.delete(req.body.id);
    try {
        await repository.create(req.body);
        res.status(200).send({
            message: 'success'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha na requisição'
        });
    }

};