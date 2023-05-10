const express = require('express');
const router = express.Router();

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

/* GET details of one festival */
router.get("/festivals/:festivalID", (req, res, next) => {
  
  res.render("details-festival");

  const { festivalID } = request.params;
  /**
   * Optional: We read the "message" variable exists and
   * is stored stored under session
   */
  const message = request.session.message;
  delete request.session.message;

  Festival.findById(festivalID)
    .then( (data) => {
      /**
       * data and message are both passed to the template /views/single-cats.hbs
       */
      res.render("details-festival", { data, message });
    });
});

/* GET edit/delete festival */
router.get("/festivals/edit", (req, res, next) => {
  res.render("edit-festival");
});

/* GET add a new festival */
router.get("/festivals/new", (req, res, next) => {
  res.render("new-festival");
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

module.exports = router;
