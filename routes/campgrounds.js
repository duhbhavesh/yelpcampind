var express     =   require("express");
var router      =   express.Router();
var Campground  =   require("../models/campground");
var middleware  =   require("../middleware");
// var Notification =  require("../models/notification");
var multer = require('multer');

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dws2yfkqq', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// var NodeGeocoder = require('node-geocoder');

// var options = {
//     provider: 'google',
//     httpAdapter: 'https',
//     apiKey: process.env.GEOCODER_API_KEY,
//     formatter: null
//   };

// var geocoder = NodeGeocoder(options);

//INDEX - show all campgrounds
router.get("/", function(req, res){
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        Campground.find({name: regex}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              if(allCampgrounds.length < 1) {
                  noMatch = "No campgrounds match that query, please try again.";
              }
              res.render("campgrounds/index",{campgrounds:allCampgrounds, noMatch: noMatch});
           }
        });
    } else {
        // Get all campgrounds from DB
        Campground.find({}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              res.render("campgrounds/index",{campgrounds:allCampgrounds, noMatch: noMatch});
           }
        });
    }
});


//CREATE - add new campground to DB

// router.post("/", middleware.isLoggedIn, function(req, res){
//     // get data from form and add to campgrounds array
//     var name = req.body.name;
//     var image = req.body.image;
//     var desc = req.body.description;
//     var author = {
//         id: req.user._id,
//         username: req.user.username
//     };
    
//     geocoder.geocode(req.body.location, function (err, data) {
//       if (err || !data.length) {
//         req.flash('error', 'Invalid address');
//         console.log(err.message)
//         return res.redirect('back');
//       }
//       var lat = data[0].latitude;
//       var lng = data[0].longitude;
//       var location = data[0].formattedAddress;
//       var newCampground = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
//       // Create a new campground and save to DB
//       Campground.create(newCampground, function(err, newlyCreated){
//           if(err){
//               console.log(err);
//           } else {
//               //redirect back to campgrounds page
//               console.log(newlyCreated);
//               res.redirect("/campgrounds");
//           }
//       });
//     });
//   });

//==========================================================================================

// router.post("/", middleware.isLoggedIn, upload.single('image'), async function(req, res) {
//   cloudinary.uploader.upload(req.file.path, async function(result) {
//       // add cloudinary url for the image to the Campground object under image property
//       req.body.campground.image = result.secure_url;
//        // add image's public_id to campground object
//       req.body.campground.imageId = result.public_id;
//       // add author to Campground
//       req.body.campground.author = {
//           id: req.user._id,
//           username: req.user.username
//         };
      
//       try {
//           let campground = await Campground.create(newCampground);
//           let user = await User.findById(req.user._id).populate('followers').exec();
//           let newNotification = {
//             username: req.user.username,
//             campgroundId: campground.id
 
//           }
 
//           for(const follower of user.followers) {
//             let notification = await Notification.create(newNotification);
//             follower.notifications.push(notification);
//             follower.save();
//           }
    
//           //redirect back to Campgrounds page
//           res.redirect(`/campgrounds/${campground.id}`);
//         } catch(err) {
//           req.flash('error', err.message);
//           res.redirect('back');
//         }
//     });
// });

router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
      if(err) {
        req.flash('error', err.message);
         console.log(err.message)
        return res.redirect('back');
      }
      // add cloudinary url for the image to the campground object under image property
      req.body.campground.image = result.secure_url;
      // add image's public_id to campground object
      req.body.campground.imageId = result.public_id;
      // add author to campground
      req.body.campground.author = {
        id: req.user._id,
        username: req.user.username
      }
      Campground.create(req.body.campground, function(err, campground) {
        if (err) {
          req.flash('error', err.message);
          console.log(err.message)
          return res.redirect('back');
        }
        res.redirect('/campgrounds/' + campground.id);
      });
    });
});



// NEW: Show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});


// SHOW: Shows more info about the campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
            Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground});
     });  
});



// UPDATE CAMPGROUND ROUTE

// router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
//   geocoder.geocode(req.body.location, function (err, data) {
//     if (err || !data.length) {
//       req.flash('error', 'Invalid address');
//       console.log(err.message)
//       return res.redirect('back');
//     }
//     req.body.campground.lat = data[0].latitude;
//     req.body.campground.lng = data[0].longitude;
//     req.body.campground.location = data[0].formattedAddress;

//     Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
//         if(err){
//             req.flash("error", err.message);
//             res.redirect("back");
//         } else {
//             req.flash("success","Successfully Updated!");
//             res.redirect("/campgrounds/" + campground._id);
//         }
//     });
//   });
// });


router.put("/:id", upload.single('image'), function(req, res){
    Campground.findById(req.params.id, async function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(campground.imageId);
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
                  campground.imageId = result.public_id;
                  campground.image = result.secure_url;
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }
            campground.name = req.body.name;
            campground.description = req.body.description;
            campground.cost = req.body.cost;
            campground.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
});


// DESTROY CAMPGROUND ROUTE
router.delete('/:id', function(req, res) {
    Campground.findById(req.params.id, async function(err, campground) {
      if(err) {
        req.flash("error", err.message);
        return res.redirect("back");
      }
      try {
          await cloudinary.v2.uploader.destroy(campground.imageId);
          campground.remove();
          req.flash('success', 'Campground deleted successfully!');
          res.redirect('/campgrounds');
      } catch(err) {
          if(err) {
            req.flash("error", err.message);
            return res.redirect("back");
          }
      }
    });
  });
  

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports  = router;