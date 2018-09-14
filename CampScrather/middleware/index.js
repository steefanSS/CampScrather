//all middleware goes here (Logged in, Ownership)
var middleWareObj={};
var Campground= require("../models/campground");
var Comment= require("../models/comment");

middleWareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        //we need to pass the id of the campground
        Campground.findById(req.params.id,function (err,foundCampground) {
            if(err){
                req.flash("error","campground not found");
                res.redirect("back");
            }else {
                //does the user own the campground(Authorization)
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","You need to be logged in to do that!");
    }
}

middleWareObj.checkCommentOwnership= function(req,res,next){
    if(req.isAuthenticated()){
        //we need to pass the id of the comment
        Comment.findById(req.params.comment_id,function (err,foundComments) {
            if(err){
                res.redirect("back");
            }else {
                //does the user own the comment(Authorization)
                if(foundComments.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}

middleWareObj.isLoggedIn= function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}

module.exports= middleWareObj;