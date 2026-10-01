require('dotenv').config();
const mongoose = require('mongoose');
const Merchant = require('./models/Merchant');
const Offer = require('./models/Offer');
const Claim = require('./models/Claim');

// Returns a date N days from now (negative = in the past)
const daysFromNow = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

const loadDummyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear old data (claims first, since they reference offers)
    await Claim.deleteMany();
    await Offer.deleteMany();
    await Merchant.deleteMany();

    const merchants = await Merchant.insertMany([
      { storeName: 'Cafe Aroma', location: 'Koregaon Park, Pune', contact: '9876500001' },
      { storeName: 'FitZone Gym', location: 'Baner, Pune', contact: '9876500002' },
      { storeName: 'Style Hub Salon', location: 'Kothrud, Pune', contact: '9876500003' },
    ]);

    await Offer.insertMany([
      {
        merchant: merchants[0]._id,
        title: 'Buy 1 Get 1 Coffee',
        description: 'Enjoy two handcrafted coffees for the price of one.',
        productName: 'Cappuccino',
        image: 'https://picsum.photos/seed/coffee/600/400',
        originalPrice: 400,
        offerPrice: 200,
        startDate: daysFromNow(-2),
        expiryDate: daysFromNow(14),
        quantity: 50,
        terms: 'Valid on dine-in only. One offer per customer.',
      },
      {
        merchant: merchants[1]._id,
        title: '1 Month Gym Membership',
        description: 'Full access to gym floor, cardio and group classes.',
        productName: 'Monthly Membership',
        image: 'https://picsum.photos/seed/gym/600/400',
        originalPrice: 3000,
        offerPrice: 1999,
        startDate: daysFromNow(-5),
        expiryDate: daysFromNow(30),
        quantity: 20,
        terms: 'New members only. ID proof required.',
      },
      {
        merchant: merchants[2]._id,
        title: 'Haircut + Spa Combo',
        description: 'Haircut, wash and relaxing head massage.',
        productName: 'Haircut and Spa',
        image: 'https://picsum.photos/seed/salon/600/400',
        originalPrice: 1200,
        offerPrice: 699,
        startDate: daysFromNow(-1),
        expiryDate: daysFromNow(20),
        quantity: 30,
        terms: 'Prior appointment recommended.',
      },
      {
        merchant: merchants[0]._id,
        title: 'Weekend Brunch Combo',
        description: 'Brunch platter with a drink and a dessert.',
        productName: 'Brunch Platter',
        image: 'https://picsum.photos/seed/brunch/600/400',
        originalPrice: 800,
        offerPrice: 499,
        startDate: daysFromNow(-1),
        expiryDate: daysFromNow(7),
        quantity: 5, // low quantity
        terms: 'Saturday and Sunday only.',
      },
      {
        merchant: merchants[0]._id,
        title: 'Festive Dessert Box',
        description: 'Assorted desserts box. This offer has ended.',
        productName: 'Dessert Box',
        image: 'https://picsum.photos/seed/dessert/600/400',
        originalPrice: 600,
        offerPrice: 349,
        startDate: daysFromNow(-30),
        expiryDate: daysFromNow(-2), // already expired
        quantity: 10,
        terms: 'Limited festive offer.',
      },
      {
        merchant: merchants[1]._id,
        title: 'Yoga Class Pass',
        description: '10 yoga sessions with certified trainers.',
        productName: 'Yoga 10-Session Pass',
        image: 'https://picsum.photos/seed/yoga/600/400',
        originalPrice: 2500,
        offerPrice: 1500,
        startDate: daysFromNow(5), // starts in the future
        expiryDate: daysFromNow(45),
        quantity: 15,
        terms: 'Valid for 60 days after the first session.',
      },
    ]);

    console.log('Dummy data loaded: 3 merchants and 6 offers created');
  } catch (error) {
    console.error('Loading dummy data failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

loadDummyData();