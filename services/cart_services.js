const {
  getCartItemByUserAndPoster,
  updateQuantity,
  createCartItem,
  removeFromCart,
  getCart
} = require("../dal/cart_items");

class CartServices {
  constructor(user_id) {
    this.user_id = user_id;
  }

  async addToCart(posterId, quantity) {
    let cartItem = await getCartItemByUserAndPoster(this.user_id, posterId);

    if (cartItem) {
      return await updateQuantity(this.user_id, posterId, cartItem.get('quantity') + quantity);
    } else {
      let newCartItem = createCartItem(this.user_id, posterId, quantity);
      return newCartItem;
    }
  }

  async remove(posterId) {
    return await removeFromCart(this.user_id, posterId);
  }

  async setQuantity(posterId, quantity) {
    return await updateQuantity(this.user_id, posterId, quantity);
  }

  async getCart() {
    return await getCart(this.user_id);
  }
}

module.exports = CartServices;