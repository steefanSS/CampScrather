var express    = require("express"),
    router     = express.Router({mergeParams:true}),
    Campground = require("../models/campground"),
    Comment    = require("../models/comment"),
    middleWare = require("../middleware/");

//=======================================
// COMMENTS ROUTES
//=======================================

//NEW COMMENTS route
router.get("/new",middleWare.isLoggedIn,function (req,res) {
    Campground.findById(req.params.id, function (err,campground) {
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground:campground});
        }
    });
});

//POST COMMENTS route
router.post("/",middleWare.isLoggedIn,function (req,res) {
    Campground.findById(req.params.id, function (err,campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else {
            //create a new comment
            Comment.create(req.body.comment,function (err,comment) {
                if(err){
                    req.flash("error","Something went wrong");
                    console.log(err);
                }else {
                    //add username and id to comment and save
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();

                    campground.comments.push(comment._id);
                    campground.save();
                    req.flash("success","Successfully added comment ");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//EDIT comment route
router.get("/:comment_id/edit",middleWare.checkCommentOwnership, function (req,res) {
    //find comment id
    Comment.findById(req.params.comment_id, function (err,foundComment) {
       if(err){
           res.redirect("back");
       }else{
           //we already have campground id and we are passing commentId
           res.render("comments/edit",{campground_id:req.params.id , comment:foundComment});
       }
    });
});

//COMMENT UPDATE router
router.put("/:comment_id", function (req,res) {
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function (err,updateComment) {
        if(err){
            res.redirect("back");
        }else{
            //redirect to /campgrounds/:id/
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

//COMMENT DELETE route
router.delete("/:comment_id",middleWare.checkCommentOwnership, function (req,res) {
   Comment.findByIdAndRemove(req.params.comment_id, function (err) {
       if(err){
           res.redirect("/campgrounds");
       }else {
           req.flash("success","Comment Delete");
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});

module.exports= router;