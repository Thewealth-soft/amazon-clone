import { cart, removeFromCart, updateQuantity, updateDeliveryOption } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOption.js";
import  renderPaymentSummary  from "./paymentSummary.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";
export function renderOderSummary() {

  let cartSummaryHTML = ''

  cart.forEach((cartItem) => {
    const productId = cartItem.productId

    const matchingProduct = getProduct(productId)


    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId)



    const today = dayjs()
    const deliveryDate = today.add(
      deliveryOption.deliveryDays,
      'days'
    )
    const dateString = deliveryDate.format('dddd, MMMM, D')

    cartSummaryHTML += `
  <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
  <div class="delivery-date">
    Delivery date: ${dateString}
  </div>

  <div class="cart-item-details-grid">
    <img class="product-image"
      src="${matchingProduct.image}">

    <div class="cart-item-details">
      <div class="product-name">
        ${matchingProduct.name}
      </div>
      <div class="product-price">
        ${formatCurrency(matchingProduct.priceCents)}
      </div>
      <div class="product-quantity">
        <span>
          Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
        </span>
        
        <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">Update</span>

        <input min="1" max="100" class= "quantity-input js-quantity-input-${matchingProduct.id}" data-product-id=${matchingProduct.id}>

        <span class= "save-quantity-link  link-primary js-save-link" data-product-id=${matchingProduct.id}>Save</span>

        <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
          Delete
        </span>

       
      </div>
    </div>

    <div class="delivery-options">
      <div class="delivery-options-title">
        Choose a delivery option:
      </div>     
      ${deliveryOptionsHTML(matchingProduct, cartItem)}
     
    </div>
  </div>
 </div>
  `
  })



  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = ''
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs()
      const deliveryDate = today.add(
        deliveryOption.deliveryDays,
        'days'
      )
      const dateString = deliveryDate.format('dddd, MMMM, D')

      const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId

      html += `
    <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
 
        <input type="radio" ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">

        <div>
          <div class="delivery-option-date">
           ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>`
    })
    return html
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId
      removeFromCart(productId)


      let container = document.querySelector(`.js-cart-item-container-${productId}`)
      // updateCartquantity()
      container.remove()
      renderPaymentSummary()
      renderCheckoutHeader()
    })
  })

  // function updateCartquantity() {
  //   let cartQuantity = 0

  //   cart.forEach((cartItem) => {
  //     cartQuantity += cartItem.quantity
  //   })
  //   document.querySelector('.js-cart-quantity').innerHTML = `${cartQuantity} Items`
  // }
  // updateCartquantity()

  // code to update an item
  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.add('is-editing-quantity');

    })
  })
  // Code to save item input
  document.querySelectorAll('.js-save-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.remove('is-editing-quantity');

      const quantityInput = document.querySelector(`.js-quantity-input-${productId}`)
      const newQuatityInput = Number(quantityInput.value)

      updateQuantity(productId, newQuatityInput)

      const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`)
      quantityLabel.innerHTML = newQuatityInput
      // updateCartquantity()
      renderCheckoutHeader()
      renderPaymentSummary()
    })
  })

  // This is code for enter key

  document.querySelectorAll('.quantity-input').forEach((element) => {
    element.addEventListener("keyup", (event) => {

      const productId = element.dataset.productId;
      if (event.key === 'Enter') {
        const quantityInput = document.querySelector(`.js-quantity-input-${productId}`)

        const newQuatityInput = Number(quantityInput.value)
        if (newQuatityInput < 0 || newQuatityInput > 100) {
          alert('Quatity must be 1 and lessthan 100')
        }
        updateQuantity(productId, newQuatityInput)

        const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`)
        quantityLabel.innerHTML = newQuatityInput
        // updateCartquantity()
        renderCheckoutHeader()
        renderPaymentSummary()
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.classList.remove('is-editing-quantity');
      }

    })
  })

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId)
      renderOderSummary()
      renderPaymentSummary()
      renderCheckoutHeader()
    })
  })
}
renderOderSummary()



