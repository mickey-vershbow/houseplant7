///////////////////////////////
//! Import Router
////////////////////////////////
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user")
const axios = require("axios");


////////////////////////////////
//! Custom Middleware Functions
////////////////////////////////
// Middleware to check if userId is in sessions and create req.user
const addUserToRequest = async (req, res, next) => {
    if(req.session.userId) {
        req.user = await User.findById(req.session.userId);
        next();
    } else {
        next();
    };
};

// Authorization middleware function to check if a user is authorized for a route
const isAuthorized = (req, res, next) => {
    // check if the user session property exists, if not redirect back to login page
    if (req.user) {
        next();
    } else {
        // redirect to login
        res.redirect("/auth/login");
    };
};

///////////////////////////////
//! Router Specific Middleware
////////////////////////////////

router.use(addUserToRequest);



///////////////////////////////
//! LANDING PAGE Router
////////////////////////////////
router.get("/", (req, res) => {
   res.render("landing");
})

///////////////////////////////
//! HOME PAGE Router
////////////////////////////////
router.get("/home", (req, res) => {
      res.render("home", { isLoggedIn: req.session.userId });
})

////////////////////////
//! USER AUTH ROUTES
////////////////////////

// Sign-Up Route
router.get("/auth/signup", (req, res) => {
    res.render("auth/signup", { isLoggedIn: req.session.userId });
})

router.post("/auth/signup", async (req, res) => {
    try {
        // generate salt for hashing
        const salt = await bcrypt.genSalt(10);
        // hash the password
        req.body.password = await bcrypt.hash(req.body.password, salt);
        // create a user
        await User.create(req.body);
        // redirect to login page
        res.redirect("/auth/login");
    } catch (error) {
        res.json(error);
    };
});

// Login Routes
router.get("/auth/login", (req, res) => {
    res.render("auth/login", { isLoggedIn: req.session.userId });
});

router.post("/auth/login", async (req, res, next) => {
    try {
        // check if the user exists (make sure to use findOne, not find)
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            // check if the password matches
            const result = await bcrypt.compare(req.body.password, user.password);
            if (result) {
                // create user session property
                req.session.userId = user._id;
                // redirect to /images
                res.redirect("/user/profile");
            } else {
                // send "passwords don't match" error
                res.json({ error: "passwords don't match"});
            }
        } else {
            res.json({ error: "username does not exist"});
        }
    } catch (error) {
        res.json(error);
    };
});

// Logout route
router.get("/user/logout", (req, res) => {
    // remove the user property from the session
    req.session.userId = null;
    // redirect back to the home page
    res.redirect("/");
});

//////////////////////////
//! PLANTS INDEX ROUTES
//////////////////////////


// Trefle Index API Call
// ---- page number is dynamic ------\\
router.get("/trefle/:pageNumber", async (req, res) => {
  // fetch the data with axios
  console.log(req.params.pageNumber);
  let pageNumber = req.params.pageNumber;
  const response = await axios(
    `https://trefle.io/api/v1/plants?token=s8drF5lfAM1u6ZQEjpl7y1Nw9hwJN3ms5F717muNPoE&page=${pageNumber}`
  );
  // grab the plant data from the response object
  const plants = response.data.data;
  const plantsBySchema = plants.map(item => {
      const container = {};

      container.name = item.common_name;
      container.url = item.image_url;
      container.description = item.scientific_name;
      container.origin = item.family_common_name;
      container.petsafe = item.family;

      return container;
  })

  res.render("trefle/index", {
    plantsBySchema,
    next: parseInt(req.params.pageNumber) + 1,
    back: parseInt(req.params.pageNumber) - 1,
    currentPage: pageNumber,
    isLoggedIn: req.session.userId,
  });
});


// INDEX user/profile
router.get("/user/profile", isAuthorized, async (req, res) => {
    // get the updated user
    const user = await User.findOne({ username: req.user.username});
        // if user is logged in, render a template passing it the list of plants
        res.render("user/profile", {
          plants: user.plants,
          isLoggedIn: req.session.userId,
        });
});


// NEW plant get route
router.get("/user/new", isAuthorized, async (req, res) => {
  // get the updated user
  const user = await User.findOne({ username: req.user.username });
  // render a template passing it the list of plants
  res.render("user/new", { isLoggedIn: req.session.userId });
});

// DELETE route
router.delete("/user/profile/:id", async (req, res) => {
  const id = req.params.id;
  const index = req.user.plants.findIndex((plant) => `${plant._id}` === id);
  req.user.plants.splice(index, 1);
  req.user.save();
  res.redirect("/user/profile");
});

// UPDATE put route
router.put("/user/profile/:id", isAuthorized, async (req, res) => {
    const id = req.params.id;
    const index = req.user.plants.findIndex((plant) => `${plant._id}` === id);
    req.user.plants[index].url = req.body.url;
    req.user.plants[index].name = req.body.name
    req.user.plants[index].description = req.body.description;
    req.user.plants[index].petsafe = req.body.petsafe;
    req.user.plants[index].origin = req.body.origin;
    req.user.save();
    res.redirect("/user/profile");
    //TODO: Add "notes", "preferred climate", "also known as" etc. properties to model
    });


// CREATE plant post route
router.post("/user/new", isAuthorized, async (req, res) => {
  // fetch up to date user
  const user = await User.findOne({ username: req.user.username });
  // push a new plant and save
  user.plants.push(req.body);
  await user.save();
  // redirect back to user profile
  res.redirect("/user/profile");
});

// EDIT form is in user show page

// SHOW page get request
router.get("/user/profile/:id", isAuthorized, async (req, res) => {
    const plant = await req.user.plants.find((plant) => {
        return req.params.id === `${plant._id}`
    })
  res.render("user/show.ejs",
    {
        plant,
        isLoggedIn: req.session.userId
    }
  )
});



router.all("/test", (req, res) => {
  res.json({
    url: req.url,
    method: req.method,
    body: req.body,
    headers: req.headers,
    query: req.query,
  });
});


///////////////////////////////
// Export Router
////////////////////////////////
module.exports = router
