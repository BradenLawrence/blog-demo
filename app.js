var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override")
    
// App settings
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride("_method"))

// Database settings
mongoose.connect("mongodb://localhost/blog-demo")
var blogSchema = new mongoose.Schema({
    title:  String,
    text:   String,
    image:  String,
    date:   {type: Date, default: Date.now}
})
var Blog = mongoose.model("Blog", blogSchema)

Blog.create({
    title: "Test post, please ignore.",
    text: "Nothing to see here. Keep moving, citizen.",
    image: "http://i.imgur.com/IbDSnAG.jpg"
})

// Routes:
// // Index
app.get("/", function(request, response){
    response.redirect("/blogs")
})

app.get("/blogs", function(request, response){
    Blog.find({}, function(error, dbResponse){
        if(error){
            console.log("Could not retrieve blog entries.")
        } else {
            response.render("index", {blogs: dbResponse})        
        }
    })
    
})

// New
app.get("/blogs/new", function(request, response){
    response.render("new")
})

// Create
app.post("/blogs", function(request, response){
    Blog.create(request.body.blogEntry, function(error, dbResponse){
        if(error){
            console.log("Oh no!")
        } else {
            response.redirect("/blogs")
        }
    })
})

// Show
app.get("/blogs/:id", function(request, response){
    Blog.findById(request.params.id, function(error, dbResponse){
        if(error){
            console.log("Oh no!")
        } else {
            response.render("show", {blog: dbResponse})
        }
    })
})

// Edit
app.get("/blogs/:id/edit", function(request, response){
    Blog.findById(request.params.id, function(error, dbResponse){
        if(error) {
            console.log("Oh no!")
        } else {
            response.render("edit", {blog: dbResponse})
        }
    })
})

// Update
app.put("/blogs/:id", function(request, response){
    Blog.findByIdAndUpdate(request.params.id, request.body.blogEntry, function(error, dbResponse){
        if(error){
            response.redirect("/blogs")
        } else {
            response.redirect("/blogs/" + request.params.id)
        }
    })
})


// Delete
app.delete("/blogs/:id", function(request, response){
    Blog.findByIdAndRemove(request.params.id, function(error){
        if(error){
            console.log("Oh no!")
        } else {
            response.redirect("/blogs")
        }
    })
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Blog server is running...")
})