var express = require('express');
var router = express.Router(); 
var Pokemon = require('./../models/Pokemon');
var Type = require('./../models/Type');

router.get('/', (req, res) => {
Pokemon.find({}).populate('types').then(pokemons=>{
    res.render('pokemons/index.html', {pokemons: pokemons});
   });
});

router.get('/new', (req, res)=>{
    Type.find({}).then(types =>{
        var pokemons= new Pokemon();
    res.render('pokemons/edit.html', {pokemons : pokemons, types : types, endpoint : '/'});
    });
});

router.get('/edit/:id', (req, res)=>{
    Type.find({}).then(types =>{
    Pokemon.findById(req.params.id).then(pokemons =>{
        res.render('pokemons/edit.html', {pokemons : pokemons, types : types, endpoint : '/'+ pokemons._id.toString()})
        });
    });
})


router.get('/:id', (req, res)=>{
    Pokemon.findById(req.params.id).populate('types').then(pokemons =>{
        res.render('pokemons/show.html', {pokemons : pokemons});
    }, 
        err=> res.status(500).send(err) );
});

router.post('/:id?', (req, res)=>{
    new Promise((resolve, reject) => {
        if (req.params.id){
            Pokemon.findById(req.params.id).then(resolve, reject); 
        }
        else {resolve (new Pokemon());}
    }).then(pokemons =>{
        pokemons.name = req.body.name;
        pokemons.description = req.body.description;
        pokemons.number = req.body.number;
        pokemons.types = req.body.types;
        if(req.file) pokemons.picture = req.file.filename;
        return pokemons.save();
    }).then(()=>{
        res.redirect('/');
    }, err=> console.log(err));
});

module.exports = router ; 