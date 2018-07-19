const express = require('express');
const router = express.Router();
const scanner = require('local-network-scanner');
scanner.scan(devices => {
  "use strict" ;
    console.log(devices);
});
// Dockersx86 Model
let Dockersx86 = require('../models/dockersx86');
// User Model
let User = require('../models/user');

// Add Route
router.get('/add', ensureAuthenticated, function(req, res){
  "use strict" ;
  res.render('add_Dockersx86', {
    title:'Add Dockersx86'
  });
});

// Add Submit POST Route
router.post('/add', function(req, res){
  "use strict" ;
  req.checkBody('title','Title is required').notEmpty();
  //req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_Dockersx86', {
      title:'Add Dockersx86',
      errors:errors
    });
  } else {
    Dockersx86 = new Dockersx86();
    Dockersx86.title = req.body.title;
    Dockersx86.author = req.user._id;
    Dockersx86.body = req.body.body;

    Dockersx86.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Dockersx86 Added');
        res.redirect('/');
      }
    });
  }
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  "use strict" ;
  Dockersx86.findById(req.params.id, function(err, Dockersx86){
    if(Dockersx86.author !== req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_Dockersx86', {
      title:'Edit Dockersx86',
      Dockersx86:Dockersx86
    });
  });
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
  "use strict" ;
  let Dockersx86 = {};
  Dockersx86.title = req.body.title;
  Dockersx86.author = req.body.author;
  Dockersx86.body = req.body.body;

  let query = {_id:req.params.id};

  Dockersx86.update(query, Dockersx86, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Dockersx86 Updated');
      res.redirect('/');
    }
  });
});

// Delete Dockersx86
router.delete('/:id', function(req, res){
  "use strict" ;
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id};

  Dockersx86.findById(req.params.id, function(err, Dockersx86){
    if(Dockersx86.author !== req.user._id){
      res.status(500).send();
    } else {
      Dockersx86.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

// Get Single Dockersx86
router.get('/:id', function(req, res){
  "use strict" ;
  Dockersx86.findById(req.params.id, function(err, Dockersx86){
    User.findById(Dockersx86.author, function(err, user){
      res.render('Dockersx86', {
        Dockersx86:Dockersx86,
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
