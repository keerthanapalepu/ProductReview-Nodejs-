const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require("lodash");
const path = require('path');
const fs = require("fs");
const multer = require("multer");

const Product = require("./models/productModel.js");
const app = express();


app.set('view engine', 'ejs');
// SET STORAGE
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({ storage: storage })

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://keerthana:keerthana@cluster0.6e3dm.mongodb.net/?retryWrites=true&w=majority");


//REST API
app.get("/", function(req, res) {
    Product.find({}, function(err, items) {
        if (!err) {
            res.render("home", {
                homeContent: "Here are the Products",
                postsList: items
            });
        }
    });
});



app.get("/compose", function(req, res) {
    res.render("compose");
});

app.post('/compose', upload.single('image'), (req, res, next) => {
    const obj = new Product({
        name: req.body.name,
        description: req.body.description,
        image: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        },
        price: req.body.price
    });
    obj.save();
    res.redirect("/");
});

app.post('/review/:product_id', async(req, res, next) => {
    // const obj = new Product({
    //     name: req.body.name,
    //     description: req.body.description,
    //     image: {
    //         data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
    //         contentType: 'image/png'
    //     },
    //     price: req.body.price
    // });
    // obj.save();
    // const comment = {
    //     name: req.body.name,
    //     rating: req.body.rate,
    //     comment: req.body.review
    // }
    // Product.findByIdAndUpdate(req.params.product_id, { $push: { reviews: comment } }, { safe: true, upsert: true },
    //     function(err, doc) {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             // console.log(doc);
    //         }
    //     });
    const product = await Product.findById(req.params.product_id);
    const comment = {
        name: req.body.name,
        rating: Number(req.body.rate),
        comment: req.body.review
    };
    product.reviews.push(comment);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
    await product.save()
    res.redirect(`/product/${req.params.product_id}`);
});


app.get("/product/:product_id", function(req, res) {
    Product.findOne({ _id: req.params.product_id }, function(err, Items) {
        res.render("product", {
            product: Items
        })
    });

});

//
app.listen(process.env.PORT || 5000, function() {
    console.log("Server started on port 5000");
});