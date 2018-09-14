var express = require("express"),
    router  = express.Router(),
    Campground = require("../models/campground"),
    middleWare = require("../middleware");

//INDEX route - show all campgrounds
router.get("/",function (req,res) {
    //Get all campgrounds from DB
    Campground.find({},function (err,allCampgrounds) {
        if(err){
            console.log(err)
        }else {
            //list all campgrounds
            res.render("campgrounds/index",{campgrounds:allCampgrounds})
        }
    });
});

//CREATE route- add new campgrounds to db
router.post("/",middleWare.isLoggedIn,function (req,res) {
    var name= req.body.name;
    var price= req.body.price;
    var image= req.body.image;
    var description = req.body.description;
    var author={
       id: req.user._id,
       username: req.user.username
    }
    var newCampgroud={name: name,price:price, image: image, description: description, author: author};

    Campground.create(newCampgroud,function (err,newlyCreated) {
        if (err){
            console.log(err);
        }else {
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

//NEW route- show for to create new campgrounds
router.get("/new",middleWare.isLoggedIn,function (req,res) {
    res.render("campgrounds/new");
});

//SHOW route- shows more info about one campgrounds
router.get("/:id",function (req,res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err,foundCampground) {
        if(err){
            console.log(err);
        }else {
            console.log(foundCampground);
            //render show template with that campgrounds
            res.render("campgrounds/show",{campground:foundCampground,page:"campgrounds"});
        }
    });
});

//EDIT camprgound route
router.get("/:id/edit",middleWare.checkCampgroundOwnership, function (req,res) {
        Campground.findById(req.params.id,function (err,foundCampground) {
            res.render("campgrounds/edit",{campground: foundCampground});
        });
});

//UPDATE campground route
router.put("/:id",middleWare.checkCampgroundOwnership,function(req,res){
    //find and update correct campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function (err,updatedCampground) {
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });

});

//DESTROY campground route
router.delete("/:id" ,middleWare.checkCampgroundOwnership, function (req,res) {
   Campground.findByIdAndRemove(req.params.id, function (err) {
        if(err){
            res.redirect("/campgrounds");
        }else {
            res.redirect("/campgrounds");
        }
   });
});

module.exports= router;