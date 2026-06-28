const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../Models/listing");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/urbanNest');
}

main()
    .then(result => {
        console.log("Database connected successfully");
    })
    .catch(err => console.log(err));

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data initialised sucessfully");
};

initDB();
