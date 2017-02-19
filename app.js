var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	localStrategy = require("passport-local"),
	User = require("./models/user")

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/testdb5");


app.use(require("express-session")({
	secret: "Sunny Saturdays",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});



app.get("/", function(req, res){
	res.send("landing page");
});

app.get("/home", function(req, res){
	res.render("home", {currentUser: req.user})
});

app.post("/signup", function(req, res){
	var newUser = new User({username: req.body.username})
	User.register(newUser, req.body.password, function(err, user){
		if(err) {
			console.log(err);
			return res.send("unsuccessful please try again")
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/home");
		});
	});
});

app.post("/login", passport.authenticate("local", 
		{successRedirect: "/home", failureRedirect: "/"}), 
		function(req, res){

});


app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/home");
});





function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.send("you are not logged in!");
}


var server = app.listen(3000, function(){
	console.log("server has started!", server.address().port);
});