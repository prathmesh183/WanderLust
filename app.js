const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listings.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(() => {
    console.log('Database connected successfully');
}).catch(err => {
    console.error('Database connection error:', err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Hi I am root');
});

app.get('/listings', async (req, res) => {
   const allListings= await Listing.find({});
   res.render('listings/index.ejs', {allListings: allListings});
    });

//CREATE

app.post('/listings', async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');

});

// New Route 

app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});

// Edit Route

app.get('/listings/:id/edit', async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', {listing: listing});
});

//UPDATE Route
app.put('/listings/:id', async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});
// DELETE Route
app.delete('/listings/:id', async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
});

// Show route 

app.get('/listings/:id',  async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/show.ejs', {listing: listing});
});


//app.get('/testlistings', async (req, res) => {
  //  let sampleListing = new Listing({
    //    title: "My New Villa",
      //  description: "A beautiful villa with sea view",
        //price: 500,
        //location: "California",
        //country: "USA"
   // });
    //await sampleListing.save();
    //console.log('Sample listing saved to database');
    //res.send('Successful Testing');
//});


app.listen(8080, () => {
    console.log('Server is running on port 8080');
});