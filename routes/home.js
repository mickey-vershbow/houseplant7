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
    res.render("landing")
})

///////////////////////////////
//! HOME PAGE Router
////////////////////////////////
router.get("/home", (req, res) => {
    res.render("home")
})


////////////////////////
//! USER AUTH ROUTES
////////////////////////

// Sign-Up Route
router.get("/auth/signup", (req, res) => {
    res.render("auth/signup")
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
    res.render("auth/login");
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
router.get("/auth/logout", (req, res) => {
    // remove the user property from the session
    req.session.userId = null;
    // redirect back to the home page
    res.redirect("/");
});

//////////////////////////
//! PLANTS INDEX ROUTES
//////////////////////////

// INDEX guest route
router.get('/index', (req, res) => {
    // if (req.session.userId) {
    //     res.render('index', {
    //         isLoggedIn: true,
    //     });
    // } else {
        res.render('index', {
            seedData: [
                {
                    url:
                        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.5xXdmr-fIdI0sTMxOxMj5QAAAA%26pid%3DApi&f=1',
                    name: 'Snake Plant',
                    description:
                        "some text",
                    petsafe: 'Moderate Risk',
                    origin: 'West Africa',
                },
                {
                    url:
                        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi1.wp.com%2Fwww.worldtopupdates.com%2Fwp-content%2Fuploads%2F2017%2F08%2Fimage-result-for-peace-lily.jpeg%3Fresize%3D1060%252C1378&f=1&nofb=1',
                    name: 'Peace Lily',
                    description:
                        "some text",
                    petsafe: 'No',
                    origin: 'The rainforests of Central and South America',
                },
                {
                    url:
                        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fbalconygardenweb-lhnfx0beomqvnhspx.netdna-ssl.com%2Fwp-content%2Fuploads%2F2018%2F11%2Fspider-plant-indoors.jpg&f=1&nofb=1',
                    name: 'Spider Plant',
                    description:
                        "some text",
                    petsafe: 'Yes',
                    origin:
                        'Tropical and Southern Africa, but has become naturalized in other parts of the world, including western Australia.',
                },
            ],
        });
});


// INDEX user/profile
router.get("/user/profile", isAuthorized, async (req, res) => {
    // get the updated user
    const user = await User.findOne({ username: req.user.username});
        // if user is logged in, render a template passing it the list of plants
        res.render("user/profile", {
            plants: user.plants,
        });
});


// NEW plant get route
router.get("/user/new", isAuthorized, async (req, res) => {
  // get the updated user
  const user = await User.findOne({ username: req.user.username });
  // render a template passing it the list of plants
  res.render("user/new")
});

// DELETE route
router.delete("/user/profile/:id", (req, res) => {
    // TODO: Get this done
});

// UPDATE put route
router.put("/user/profile/:id", async (req, res) => {
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
router.post("/user/new", async (req, res) => {
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
router.get("/user/profile/:id", (req, res) => {
    const plant = req.user.plants.find((plant) => {
        return req.params.id === `${plant._id}`
    })
  res.render("user/show.ejs",
    {plant}
  )
});

// Carousel Route
router.get("/carousel", (req, res) => {
  res.render("carousel");
})

  /////////////////////////////
  // Trefle API Call
  ///////////////////////////

//! ======== PAGE 1 =========
router.get("/trefle/index", async (req, res) => {
  // fetch the data with axios
  const response = await axios(
    "https://trefle.io/api/v1/plants?token=s8drF5lfAM1u6ZQEjpl7y1Nw9hwJN3ms5F717muNPoE"
  );
  // grab the plant data from the response object
  const plants = response.data.data;
//   console.log(plants);
  const plantsBySchema = plants.map(item => {
      const container = {};

      container.name = item.common_name;
      container.url = item.image_url;
      container.description = item.scientific_name;
      container.origin = item.family_common_name;
      container.petsafe = item.family;

      return container;
  })
  console.log(plantsBySchema);
//   res.json(plants);

  res.render("trefle/index", {
    plantsBySchema,
  });
});

//! ======== PAGE 2 =========
router.get("/trefle/index-1", async (req, res) => {
  // fetch the data with axios
  const response = await axios(
    "https://trefle.io/api/v1/plants?token=s8drF5lfAM1u6ZQEjpl7y1Nw9hwJN3ms5F717muNPoE&page=2"
  );
  // grab the plant data from the response object
  const plants1 = response.data.data;
//   console.log(plants1);
  const plantsBySchema1 = plants1.map(item => {
      const container = {};

      container.name = item.common_name;
      container.url = item.image_url;
      container.description = item.scientific_name;
      container.origin = item.family_common_name;
      container.petsafe = item.family;

      return container;
  })
  console.log(plantsBySchema1);
//   res.json(plants);

  res.render("trefle/index-1", {
    plantsBySchema1,
  });
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
