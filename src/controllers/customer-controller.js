'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositores/customer-repository');
const md5 = require('md5');
const authService = require('../services/auth-service');

const emailService = require('../services/email-service');

exports.post = async (req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.name, 3, 'O Nome deve conter pelo menos 3 caracteres');
    contract.isEmail(req.body.email, 'Email Inválido');
    contract.hasMinLen(req.body.password, 6, 'a senha deve conter pelo menos 3 caracteres');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }
    try {
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY),
            roles: ["user"]
        });

        emailService.send(req.body.email, 'Bem vindo ao Node Store', global.EMAIL_TMPL.replace('{0}', req.body.name));

        res.status(200).send({
            message: 'success'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha na requisição'
        });
    }

};

exports.authenticate = async (req, res, next) => {

    try {
        console.log('Auth + ' + global.SALT_KEY);
        const customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });

        if (!customer) {
            res.status(404).send({
                message: 'Usuário ou senha inválidos'
            });
            return;
        }

        const token = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        })

        emailService.send(req.body.email, 'Bem vindo ao Node Store', global.EMAIL_TMPL.replace('{0}', req.body.name));

        res.status(200).send({
            token: token,
            data: {
                email: customer.email,
                name: customer.name
            }
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha na requisição'
        });
    }

};

exports.refreshToken = async (req, res, next) => {

    try {

        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        console.log('Auth + ' + global.SALT_KEY);
        const customer = await repository.getById(data.id);
        console.log(customer);
        if (!customer) {
            res.status(404).send({
                message: 'Não encontrado'
            });
            return;
        }

        const tokenData = await authService.generateToken({ id: customer._id, email: customer.email, name: customer.name })

        emailService.send(req.body.email, 'Bem vindo ao Node Store', global.EMAIL_TMPL.replace('{0}', req.body.name));

        res.status(200).send({
            token: tokenData,
            data: {
                id: customer._id,
                email: customer.email,
                name: customer.name
            }
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha na requisição'
        });
    }

};

