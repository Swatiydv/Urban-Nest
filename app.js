const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/urbanNest');
}

main()
    .then(result => {
        console.log("Database connected successfully");
    })
    .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("server working");
});

app.get("/listings", async (req, res) => {
    const allListing = await Listing.find({});
    res.render("Listings/index.ejs", { allListing });
});

app.get("/listings/new", (req, res) => {
    res.render("Listings/new.ejs");
});

app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

app.get("/listings/:id", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("Listings/show.ejs", { listing });
});

app.get("/listings/:id/edit", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("Listings/edit.ejs", { listing });
});

app.put("/listings/:id", async (req, res) => {
    const { id } = req.params;
    const listing = req.body.listing;
    await Listing.findByIdAndUpdate(id, { ...listing },
        { new: true, runValidators: true });
    res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id", async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

app.listen(3000, (req, res) => {
    console.log("server listening to port 3000");
});