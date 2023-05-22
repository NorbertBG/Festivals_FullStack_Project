const express = require('express');
const router = express.Router();
const appGenres = require("../utils/genres");

// ********* require fileUploader in order to use it *********
const fileUploader = require('../config/cloudinary.config');

const countryList = require("../middleware/getCountryList");

// Require the Festival model in order to interact with the database
const mongoose = require("mongoose");
const Festival = require("../models/Festival.model");
const User = require("../models/User.model")
const Comment = require("../models/Comment.model")


/* GET home page where you can login or register */
router.get("/", (req, res, next) => {
  res.render("auth/index");
});

/* GET profile page */
router.get("/profile", (req, res, next) => {
  User.findOne()
    .then((data) => {
      // console.log(data)
      res.render("profile", { data });
    })
})

/* POST profile page */
router.post("/profile", (request, response, next) => {
  const { id, email, password, firstName, lastName, bio, profileImage } = request.body;

  console.log(request.body)
  User.findByIdAndUpdate(id, {
    email: email,
    password: password,
    firstName: firstName,
    lastName: lastName,
    bio: bio,
    profileImage: profileImage
  }, { returnOriginal: false }).then((data) => {
    /**
     * Optional: We set a new variable "message" under request.session
     * which will be used later as a notification message
     */
    request.session.message = {
      type: 'success',
      body: 'Your changes has been saved'
    };
    response.redirect(`/profile`);

  })
})
/* GET All festivals page "homepage after login" */
router.get("/festivals", (req, res, next) => {
  Festival.find()
    .then((datafromDB) => {

      res.render("festivals", { datafromDB });
    })
});

/* GET All countries */
router.get("/countries", (req, res, next) => {
  Festival.find()
    .then((data) => {

      res.render("countries", { data });
    })
});

/* GET All festivals in one city */
router.get("/:city/festivals", (req, res, next) => {
  res.render("city-festivals");
});



/* GET add a new festival */
router.get("/festivals/new", countryList, (req, res, next) => {
  const countries = [];
  // console.log(req.countries)
  req.countries.forEach(item => {
    countries.push(item);
  });
  res.render("new-festival", { appGenres, countries: countries });
});

/* POST add a new festival */
router.post("/festivals/new", fileUploader.single('eventImage'), (req, res, next) => {
  const { name, country, city, description, genre, season } = req.body;
  console.log(req.body)
  Festival.create({ name, country, city, description, genre, season, eventImage: req.file.path })
    .then((datafromDB) => {
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
    .populate("author comments") // <-- the same as .populate('author).populate('comments')
    .populate({
      // we are populating author in the previously populated comments
      path: "comments",
      populate: {
        path: "author",
        model: "User"
      }
    })
    .then((data) => {
      res.render("details-festival", { data, message, festivalID }
      )
    })
    .catch((error) => {
      console.log(`Err while getting a single post from the  DB: ${error}`);
      next(error);
    });

});


/* GET edit/delete festival */
router.get("/festivals/:festivalID/edit", countryList, (req, res, next) => {
  const { festivalID } = req.params;
  Festival.findById(festivalID)
    .then((data) => {
      const genresObject = []
      appGenres.forEach(item => {
        if (data.genre == item) {
          genresObject.push({ label: item, isSelected: true });
        } else {
          genresObject.push({ label: item, isSelected: false });
        }
      })
      return { data, genresObject };
    })
    .then((response) => {
      //console.log(response.data.name)
      const countriesArray = []
      req.countries.forEach(item => {
        if (response.data.genre == item) {
          countriesArray.push({ label: item, isSelected: true });
        } else {
          countriesArray.push({ label: item, isSelected: false });
        }
      })
      res.render("edit-festival", { data: response.data, genresObject: response.genresObject, countriesArray: countriesArray });
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
  }, { returnOriginal: false }).then((data) => {
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

// POST comments in festivals details page
router.post("/festivals/:festivalId/comment", (req, res, next) => {
  const { festivalId } = req.params;
  const { author, content } = req.body;

  let user;

  User.findOne({ email: author })
    .then((userDocFromDB) => {
      user = userDocFromDB;

      // 1. if commenter is not user yet, let's register him/her as a user
      if (!userDocFromDB) {
        return User.create({ email: author });
      }
    })
    .then((newUser) => {
      // prettier-ignore
      Festival.findById(festivalId)
        .then(dbFestival => {
          let newComment;

          // 2. the conditional is result of having the possibility that we have already existing or new users
          if (newUser) {
            newComment = new Comment({ author: newUser._id, content });
          } else {
            newComment = new Comment({ author: user._id, content });
          }

          // 3. when new comment is created, we save it ...
          newComment
            .save()
            .then(dbComment => {

              // ... and push its ID in the array of comments that belong to this specific post
              dbFestival.comments.push(dbComment._id);
              
              // 4. after adding the ID in the array of comments, we have to save changes in the post
              dbFestival
                .save()       // 5. if everything is ok, we redirect to the same page to see the comment
                .then(updatedFestival => res.redirect(`/festivals/${updatedFestival._id}`))
            });
        });
    })
    .catch((err) => {
      console.log(`Error while creating the comment: ${err}`);
      next(err);
    });
});

router.post("/festivals/:festivalID/comments/:commentID/delete", (req, res, next) => {
  const { festivalID, commentID } = req.params;

  Comment.findByIdAndRemove(commentID)
  .then(() => {
    // Comment deleted successfully
    res.redirect(`/festivals/${festivalID}`);
  })
  .catch((error) => {
    console.log(`Error deleting comment: ${error}`);
    next(error);
  });
});


module.exports = router;
