const express = require('express');
const router = express.Router();

/* GET home page where you can login or register */
router.get("/", (req, res, next) => {
  res.render("index");
});

/* GET profile page */
router.get("/profile", (req, res, next) => {
  res.render("profile");
});

/* GET All festivals page "homepage after login" */
router.get("/festivals", (req, res, next) => {
  res.render("festivals");
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
router.get("/festival/details", (req, res, next) => {
  res.render("details-festival");
});

/* GET edit/delete festival */
router.get("/festival/edit", (req, res, next) => {
  res.render("edit-festival");
});

/* GET add a new festival */
router.get("/festival/new", (req, res, next) => {
  res.render("new-festival");
});

module.exports = router;
