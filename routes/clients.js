const express = require('express');
const router = express.Router();

// Article Model
let Client = require('../models/client');
// User Model
let User = require('../models/user');

// Add Route
router.get('/add', ensureAuthenticated, function(req, res){
  "use strict" ;
  res.render('add_client', {
    title:'Add Client'
  });
});

// Add Submit POST Route
router.post('/add', function(req, res){
  "use strict" ;
  req.checkBody('name','Name is required').notEmpty();
  //req.checkBody('author','Author is required').notEmpty();
  req.checkBody('ip','IP is required').notEmpty();
  req.checkBody('username','User Name is required').notEmpty();
  req.checkBody('psw','Password is required').notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_client', {
      title:'Add Client',
      errors:errors
    });
  } else {
    let client = new Client();
    client.name = req.body.name;
    client.author = req.user._id;
    client.ip = req.body.ip;
    client.username = req.body.username;
    client.psw = req.body.psw;

    client.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Client Added');
        res.redirect('/clients');
      }
    });
  }
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  "use strict" ;
  Client.findById(req.params.id, function(err, client){
    if(client.author !== req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_client', {
      title:'Edit Client',
      client:client
    });
  });
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
  "use strict" ;
  let client = {};
  client.name = req.body.name;
  client.author = req.user._id;
  client.ip = req.body.ip;
  client.username = req.body.username;
  client.psw = req.body.psw;

  let query = {_id:req.params.id};

  Client.update(query, client, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Client Updated');
      res.redirect('/');
    }
  });
});

// Delete Client
router.delete('/:id', function(req, res){
  "use strict" ;
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id};

  Client.findById(req.params.id, function(err, client){
    if(client.author !== req.user._id){
      res.status(500).send();
    } else {
      Client.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

// Get Single Article
router.get('/:id', function(req, res){
  "use strict" ;
  Client.findById(req.params.id, function(err, client){
    User.findById(client.author, function(err, user){
      res.render('client', {
        client:client,
        author: user.name
      });
    });
  });
});

// Access Control
function ensureAuthenticated(req, res, next){
  "use strict" ;
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
