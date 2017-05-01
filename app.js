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

// Routes
app.get("/blogs", function(request, response){
    response.send("Index route response.")
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Blog server is running...")
})