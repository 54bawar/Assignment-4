var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var authenticate    = require('../authenticate'); 
var Favorites = require('../models/favorites');

var favoriteRouter = express.Router();

favoriteRouter.route('/')
.get( authenticate.verifyOrdinaryUser, function (req, res, next) {
    Favorites.find({"user": req.user._id})  
    .populate('user')
    .populate('dishes')
    .then((favs)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favs);
    },(err)=>{  next(err); })
    .catch((err)=>{ next(err) });
})


.post( authenticate.verifyOrdinaryUser, function (req, res, next) {
    Favorites.findOne({"user":req.user._id }, function (err, favs) { 
        if(!favs){
            Favorites.create(null,function (err, favs) {
                if (err) 
                    throw err;
                    
                favs.user = req.user._id; 
                for(var i=0;i<req.body.length;i++)
                {
                    favs.dishes.push(req.body[i]._id);
                }
        
                favs.save()
                .then((fav)=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(fav);
                },(err) => next(err) )
                .catch((err)=>next(err));    
            }); 

        }
        else{
            for(var i=0;i<req.body.length;i++)
            {
                var index = favs.dishes.indexOf(req.body[i]._id);
            
                if(index > -1)
                    continue;
            
                favs.dishes.push(req.body[i]._id);
            }
            favs.save()
            .then((fav)=>{
                res.statusCode=200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favs);
            },(err)=>  next(err) )
            .catch((err)=>next(err));        
        }
    });  
})

.delete(authenticate.verifyOrdinaryUser, function (req, res, next) {
    Favorites.remove({"user":req.user._id})
    .then((fav)=>{
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.end("Deleted Favorite List!");
    },(err)=>  next(err) )
    .catch((err)=>next(err)); 

});


favoriteRouter.route('/:favsId')

.post( authenticate.verifyOrdinaryUser, function (req, res, next) {
    Favorites.findOne({"user":req.user._id }, function (err, favs) { 
        if(!favs){
            Favorites.create(null,function (err, favs) {
                if (err) 
                    throw err;
                favs.user = req.user._id; 
                favs.dishes.push(req.params.favsId);
                favs.save(function (err, favs) {
                    if (err) 
                        throw err;
                    res.json(favs);
                }); 
            }); 

        }
        else{
            var index = favs.dishes.indexOf(req.params.favsId);
            if(index > -1){
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: 'Dish already in Favorite\'s List'});
            }
            else{
                favs.dishes.push(req.params.favsId);
                favs.save(function (err, favs) {
                    if (err) 
                        throw err;
                    res.json(favs);
                });
            }
        } 
    });  
})





.delete(authenticate.verifyOrdinaryUser, function(req, res, next){
    Favorites.findOne({user: req.user._id}, function (err, favs) {
        if (err) throw err;
        if (favs) {
            var index = favs.dishes.indexOf(req.params.favsId);
            if (index > -1) {
                favs.dishes.splice(index, 1);
            }
            favs.save(function (err, favorite) {
                if (err) 
                    throw err;
                res.json(favorite);
            });
        } 
        else {
            var err = new Error('This Dish is not in the Favorite\'s List');
            err.status = 401;
            return next(err);
        }
    });
});



module.exports = favoriteRouter;