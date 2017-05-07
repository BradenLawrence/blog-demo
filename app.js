var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose")
    
// App settings
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))

// Database settings
mongoose.connect("mongodb://localhost/blog-demo")
var blogSchema = new mongoose.Schema({
    title:  String,
    text:   String,
    image:  String,
    date:   {type: Date, default: Date.now}
})
var Blog = mongoose.model("Blog", blogSchema)

// Blog.create({
//     title: "Test post, please ignore.",
//     text: "Nothing to see here. Keep moving, citizen.",
//     image: "http://i.imgur.com/IbDSnAG.jpg"
// })

// Routes
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

app.get("/blogs/new", function(request, response){
    response.render("new")
})

app.post("/blogs", function(request, response){
    var entry = {
        title:  request.body.title,
        text:   request.body.text,
        image:  request.body.image
    }
    Blog.create(entry, function(error, dbResponse){
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