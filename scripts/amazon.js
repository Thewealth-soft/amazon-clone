import {cart,addToCart, saveToStorage} from '../data/cart.js'
import { products } from '../data/products.js'
import { formatCurrency } from './utils/money.js'

let productsHTML = ""
products.forEach((product) => {
  productsHTML += ` <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src=${product.image}>
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src=images/ratings/rating-${product.rating.stars * 10}.png>
            <div class="product-rating-count link-primary">
             ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            $${formatCurrency(product.priceCents)}
          </div>

          <div class="product-quantity-container">
            <select>
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-to-cart">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>`
})

document.querySelector('.js-products-grid').innerHTML = productsHTML


function updateCartQuatity() {
  let cartQuantity = 0

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity
    
  })
  document.querySelector('.js-cart-quatity').innerHTML = cartQuantity
}

document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;
  addToCart(productId)
    updateCartQuatity()
    
  })
})

//Message alert
const addedMessageTimeouts = {};
document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    // Get productId from button or elsewhere in your code
    const productId = button.dataset.productId; 
    const addedMessage = button.closest('.product-container').querySelector('.added-to-cart');

    addedMessage.classList.add('added-to-cart-visible');

    // Check if there's a previous timeout for this product. If there is, we should stop it.
    const previousTimeoutId = addedMessageTimeouts[productId];
    if (previousTimeoutId) {
      clearTimeout(previousTimeoutId);
    }

    const timeoutId = setTimeout(() => {
      addedMessage.classList.remove('added-to-cart-visible');
    }, 2000);

    // Save the timeoutId for this product so we can stop it later if we need to.
    addedMessageTimeouts[productId] = timeoutId;
  });
});
