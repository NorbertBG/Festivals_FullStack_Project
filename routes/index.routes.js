const express = require('express');
const router = express.Router();
const appGenres = require("../utils/genres");

// Require the Festival model in order to interact with the database
const mongoose = require("mongoose");
const Festival = require("../models/Festival.model");

/* GET home page where you can login or register */
router.get("/", (req, res, next) => {
  res.render("auth/index");
});

/* GET profile page */
router.get("/profile", (req, res, next) => {
  res.render("profile");
});

/* GET All festivals page "homepage after login" */
router.get("/festivals", (req, res, next) => {
  Festival.find()
    .then( (datafromDB) => {
      console.log(datafromDB)
      res.render("festivals", { datafromDB });
  })
});

/* GET All cities */
router.get("/cities", (req, res, next) => {
  res.render("cities");
});

/* GET All festivals in one city */
router.get("/:city/festivals", (req, res, next) => {
  res.render("city-festivals");
});



/* GET add a new festival */
router.get("/festivals/new", (req, res, next) => {
  res.render("new-festival", { appGenres });
});

/* POST add a new festival */
router.post("/festivals/new", (req, res, next) => {
  const data = req.body;
  console.log(data)
  Festival.create(data).then( (datafromDB) => {
   console.log(datafromDB)
    res.redirect('/festivals');
  });
});

/* GET details of one festival */
router.get("/festivals/:festivalID", (req, res, next) => {

  const { festivalID } = req.params;
  /**
   * Optional: We read the "message" variable exists and
   * is stored stored under session
   */
  const message = req.session.message;
  delete req.session.message;

  Festival.findById(festivalID)
    .then( (data) => {
      /**
       * data and message are both passed to the template /views/single-cats.hbs
       */
      res.render("details-festival", { data, message });
    });
});

/* GET edit/delete festival */
router.get("/festivals/:festivalID/edit", (req, res, next) => {
  const { festivalID } = req.params;
  Festival.findById(festivalID)
    .then( (data) => {
      const genresObject = []
      appGenres.forEach( item => {
        if (data.genre == item) {
          genresObject.push({ label: item, isSelected: true });
        } else {
          genresObject.push({ label: item, isSelected: false });
        }
      })
      res.render("edit-festival", { data, genresObject});
    })
  });

router.post('/festivals/:festivalID/edit', (request, response) => {
  const { id, name, description, genre, season, location } = request.body;

  Festival.findByIdAndUpdate(id, {
    name: name,
    description: description,
    genre: genre,
    season: season,
    location: location
  }, { returnOriginal: false }).then( (data) => {
    /**
     * Optional: We set a new variable "message" under request.session
     * which will be used later as a notification message
     */
    request.session.message = {
      type: 'success',
      body: 'Your changes has been saved'
    };
    response.redirect(`/festivals/${data.id}`);
  })
});

router.post('/festivals/:festivalID/delete', (req, res) => {
  const { festivalID } = req.params

  Festival.findByIdAndDelete(festivalID)
    .then(() => res.redirect("/festivals"))
    .catch(error => next(error));
 });

module.exports = router;
