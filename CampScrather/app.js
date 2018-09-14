var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    User = require("./models/user"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    flash = require("connect-flash-plus"),
    seedDB = require("./seeds");

var commentsRoute = require("./routes/comments"),
    campgroundsRoute = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");


mongoose.connect("mongodb://localhost/camp_discovery_v11");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
//seedDB();//seedDb

//Passport configuration
app.use(require("express-session")({
    secret: "Once again",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware to pass currentUser to all templates - otherwise we would have to pass currentUser manually in all routes
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error= req.flash("error");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentsRoute);
app.use("/campgrounds", campgroundsRoute);

app.listen(3000, function (err) {
    if (err) throw err;
    console.log("Server is working on port 3000")
});