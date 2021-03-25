//express is a node modoule for bulding HTTP servers

const { resolveSoa } = require('dns');
var datastore = require('nedb');
var db = new datastore({ filename: 'database.json', autoload: true });
var express = require('express');

var multer  = require('multer');

var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

var upload = multer({ dest: 'public/uploads/' });

var urlencodedBodyParser = bodyParser.urlencoded({extended: true});
app.use(urlencodedBodyParser);

//Tell express to look in the "public"
app.use(express.static("public"));

app.set('view engine', 'ejs');

var submittedData = [];
//The defult route of / and what to do!
app.get("/", function(req,res){
    res.send("Hello Hello thank you for connecting!");
});

app.get('/displayrecord', function (req,res){
    db.find({_id: req.query._id}, function(err,docs){
        var dataWrapper = {data: docs[0]};
        res.render("individul.ejs", dataWrapper );
       });
});

app.get('/search', function(req, res){
    // /searrch?q=text to search for
    console.log("search for: "+ req.query.q);
    var query = new RegExp (req.query.q, 'i');
    db.find({text: query}, function(err, docs){
        var dataWrapper = {data: docs};
        res.render("outputtemplate.ejs", dataWrapper );
    })
});

app.post('/formdata', upload.fields([{name: 'photo'}, {name: 'video'}]), function(req, res){
    console.log(req.files);
    
if (req.files.video[0].mimetype == "video/mp4" && (req.files.photo[0].mimetype == "image/jpeg" || req.files.photo[0].mimetype == "image/png")){
    console.log(req.body.data);

var dataToSave = {
    file: req.files.photo[0],
    video: req.files.video[0],
    text: req.body.data,
    number: req.body.age,
    color: req.body.color,
    longtext:req.body.longtext
};


db.insert(dataToSave, function (err, newDoc) {  
    db.find({}, function (err, docs) {
        var dataWrapper = {data: docs};
        res.render("outputtemplate.ejs",dataWrapper )
    
      });
  });
}
// else{
//     fs.unlink(req.files.path, function(err){
//         if(err) {
            
//             console.log  (err);
//         } else{
//         console.log(req.files.path + 'was deleted');
//         }
//     });
    
//     res.send("Not an image file");
// }
});

    app.listen(80, function (){
        console.log('Example app listening on part 80!')
    })
