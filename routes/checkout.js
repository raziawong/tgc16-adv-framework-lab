const express = require('express');
const router = express.Router();

const CartServices = require('../services/cart_services');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/', async (req, res) => {
  const cart = new CartServices(req.session.user.id);

  // get all the items from the cart
  let items = await cart.getCart();

  // step 1 - create line items
  let lineItems = [];
  let meta = [];
  for (let item of items) {
    const lineItem = {
      'name': item.related('poster').get('title'),
      'amount': item.related('poster').get('cost'),
      'quantity': item.get('quantity'),
      'currency': 'SGD'
    }
    if (item.related('poster').get('image_url')) {
      lineItem['images'] = [item.related('poster').get('image_url')]
    }
    lineItems.push(lineItem);
    // save the quantity data along with the product id
    meta.push({
      'poster_id': item.get('poster_id'),
      'quantity': item.get('quantity')
    })
  };

  // step 2 - create stripe payment
  const domain = req.protocol + '://' + req.get('host');
  let metaData = JSON.stringify(meta);
  const payment = {
    payment_method_types: ['card'],
    line_items: lineItems,
    success_url: domain + process.env.STRIPE_SUCCESS_PATH + '?sessionId={CHECKOUT_SESSION_ID}',
    cancel_url: domain + process.env.STRIPE_CANCEL_PATH,
    metadata: {
      'orders': metaData
    }
  };

  // step 3: register the session
  let stripeSession = await Stripe.checkout.sessions.create(payment);
  res.render('cart/checkout', {
    sessionId: stripeSession.id, // 4. Get the ID of the session
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
});

router.get("/success", async (req, res) => {
  res.render('cart/success');
});

router.get("/cancel", async (req, res) => {
  res.render('cart/cancel');
});

module.exports = router;