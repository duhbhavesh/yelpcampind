require('dotenv').config();

var express             = require("express");
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    flash               = require("connect-flash"),
    app.locals.moment   = require('moment'),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    methodOverride      = require("method-override"),
    Campground          = require("./models/campground"),
    Comment             = require("./models/comment"),
    User                = require("./models/user"),
    seedDB              = require("./seeds")

// REQUIRING ROUTES
var commentRoutes        =   require("./routes/comments"),
    campgroundRoutes     =   require("./routes/campgrounds"),
    indexRoutes          =   require("./routes/index")

// mongoose.connect(process.env.DATABASEURL);
// mongoose.connect("mongodb://localhost/yelp_camp_v12", {
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useFindAndModify: false,
//         useUnifiedTopology: true
//     }).then(() => {
//         console.log('Connected to DB!');
//     }).catch(err => {
//         console.log('ERROR:', err.message);
//     });

mongoose.connect("mongodb+srv://yelpcamp:403Error@cluster0-qj0fi.mongodb.net/test?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Connected to DB!');
    }).catch(err => {
        console.log('ERROR:', err.message);
    });

    
app.use(bodyParser.urlencoded({extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Yea Hydroxychloroquine is the cure",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use(async function(req, res, next){
//     res.locals.currentUser = req.user;
//     if(req.user) {
//      try {
//        let user = await User.findById(req.user._id).populate('notifications', null, { isRead: false }).exec();
//        res.locals.notifications = user.notifications.reverse();
//      } catch(err) {
//        console.log(err.message);
//      }
//     }
//     res.locals.error = req.flash("error");
//     res.locals.success = req.flash("success");
//     next();
//  });
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
 });
 

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// PORT: Localhost port 3000
app.listen(3000, function(){
    console.log("Server Started");
});