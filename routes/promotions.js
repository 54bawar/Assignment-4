const express=require('express');
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');
const Promotions = require('../models/promotions');
const promRouter = express.Router();

const authenticate = require('../authenticate');

promRouter.route('/')
.get((req, res, next) => {
    Promotions.find({})

    .then((promotion) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);

    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
})

.post(authenticate.verifyOrdinaryUser,authenticate.verifyAdmin, (req, res, next) => {
    Promotions.create(req.body)
    .then((promotion) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);

    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
})

.put(authenticate.verifyOrdinaryUser,authenticate.verifyAdmin, (req, res, next) => {
    
    res.statusCode=403;
    res.end('Put not supported on Promotions');

})

.delete(authenticate.verifyOrdinaryUser,authenticate.verifyAdmin, (req, res, next) => {
    Promotions.deleteMany({})
    .then((promotion) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);

    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
});

//routes within parameters promotionId
promRouter.route('/:promotionId')
.get((req, res, next) => {
    Promotions.findById(req.params.promotionId)
    .then((promotion) => {
        
        if(promotion==null)
        {
            err = new Error('Promotion ' + req.params.promotionId + ' not found');
            err.status=404;
            return next(err);
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);

    }, (err) => {

        err = new Error('Promotion ' + req.params.promotionId + ' not found');
        err.status =404;
        return next(err);

    })
    .catch((err) => {

        next(err);

    });
})

.post(authenticate.verifyOrdinaryUser,authenticate.verifyAdmin, (req, res, next) => {
    
    res.statusCode=403;
    res.end('Post not supported on Promotions/'+req.params.promotionID);

})

.put(authenticate.verifyOrdinaryUser,authenticate.verifyAdmin, (req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promotionId,{ $set: req.body }, { new: true })
    .then((promotion) => {

        if(promotion==null)
        {
            err = new Error('Promotion ' + req.params.promotionId + ' not found');
            err.status=404;
            return next(err);
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);

    }, (err) => {

        err = new Error('Promotion ' + req.params.promotionId + ' not found');
        err.status=404;
        return next(err);
    })
    .catch((err) => {

        next(err);

    });
})

.delete(authenticate.verifyOrdinaryUser,authenticate.verifyAdmin, (req, res, next) => {
    Promotions.findByIdAndDelete(req.params.promotionId)
    .then((promotion) => {
        
        if(promotion==null)
        {
            err = new Error('Promotion ' + req.params.promotionId + ' not found');
            err.status=404;
            return next(err);

        }
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);

    }, (err) =>{

        err = new Error('Promotion ' + req.params.promotionId + ' not found');
        err.status=404;
        return next(err);

    })
    .catch((err)=>{

        next(err);

    });
});


module.exports = promRouter;