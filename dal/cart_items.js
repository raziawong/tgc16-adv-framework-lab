const {
  CartItem
} = require('../models');

const getCart = async (userId) => {
  return await CartItem.collection()
    .where({
      'user_id': userId
    }).fetch({
      require: false,
      withRelated: ['poster', 'poster.mediaProperty', 'poster.tags']
    });
};

const getCartItemByUserAndPoster = async (userId, posterId) => {
  return await CartItem.where({
    'user_id': userId,
    'poster_id': posterId
  }).fetch({
    require: false
  });
}

const createCartItem = async (userId, posterId, quantity) => {
  let cartItem = new CartItem({
    'user_id': userId,
    'poster_id': posterId,
    'quantity': quantity
  })
  await cartItem.save();
  return cartItem;
};

const removeFromCart = async (userId, posterId) => {
  let cartItem = await getCartItemByUserAndPoster(userId, posterId);
  if (cartItem) {
    await cartItem.destroy();
    return true;
  }
  return false;
};

const updateQuantity = async (userId, posterId, newQuantity) => {
  let cartItem = await getCartItemByUserAndPoster(userId, posterId);
  if (cartItem) {
    cartItem.set('quantity', newQuantity);
    cartItem.save();
    return true;
  }
  return false;
}

module.exports = {
  getCart,
  getCartItemByUserAndPoster,
  createCartItem,
  removeFromCart,
  updateQuantity
};