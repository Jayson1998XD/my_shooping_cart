'use strict'

let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartDOM = document.querySelector('.cart');
const addToButtonsDOM = document.querySelectorAll(
  '[data-action="ADD_TO_CART"]'
);


function insertItemDOM(product) {
  cartDOM.insertAdjacentHTML("beforeend",`
  <div class="cart-item">
   <img class="cart-item-image"
    src="${product.image}"
    alt="${product.name}">
  <h3 class="cart-item-name">${product.name}</h3>
   <h3 class="cart-item-price">${product.price}</h3>
   <button class="btn btn-primary ${
     product.quantity ===1 ? 'btn-danger' : ''
   } btn-small" 
   data-action="DECREASE_ITEM">
    &minus;
    </button>
    <h3 class="cart-item-quantity">${product.quantity}</h3>
    <button class="btn btn-primary btn-small"
     data-action="INCREASE_ITEM">
        &plus;
    </button>
    <h3 class="cart-item-quantity">1</h3>
    <button class="btn btn-primary btn-danger btn-small"
     data-action="REMOVE_ITEM">
        &times;
    </button>      
   </div>
  `
  );

  addCartFooter();
}



function addCartFooter(){
  if(document.querySelector('.cart-footer') === null){
    cartDOM.insertAdjacentHTML("afterend",`
    <div class="cart-footer">
    <button class="btn btn-danger" data-action="CLEAR_CART">
    清空购物车</button>
    <button class="btn btn-primary" data-action="CHECKOUT">
    支付</button> 
    `
    );

  document.querySelector('[data-action="CLEAR_CART"]')
  .addEventListener("click", () => clearCart());

  document.querySelector('[data-action="CHECKOUT"]')
  .addEventListener("click", () => checkOut());

   }
}

function clearCart(){
  cartDOM.querySelectorAll(".cart-item").forEach(cartItemDOM => {
    cartItemDOM.classList.add('cart-item-remove');
    setTimeout(() => cartItemDOM.remove(),250);
  });

  cart = [];
  // 本地存储为空
  localStorage.removeItem('cart');

  document.querySelector('.cart-footer').remove();

  

  addToButtonsDOM.forEach(addToButtonsDOM => {
    addToButtonsDOM.innerText = '加入购物车';
    addToButtonsDOM.disabled = false;
  });
}

function checkOut(){

}

//添加
function inceraseItem(product,cartItemDOM){
  cart.forEach(cartItem => {
    if (cartItem.name === product.name) {
      cartItemDOM.querySelector('.cart-item-quantity')
      .innerText = ++cartItem.quantity;

      cartItemDOM.
      querySelector('[data-action="DECREASE_ITEM"]')
      .classList.remove('btn-danger');

       //添加本地存储
       localStorage.setItem('cart',JSON.stringify(cart));
    }
  });
}
//减少
function decreaseItem(product,cartItemDOM,
  addToButtonDOM){
  cart.forEach(cartItem => {
    if (cartItem.name === product.name) {
      if (cartItem.quantity > 1) {
        cartItemDOM.querySelector('.cart-item-quantity')
        .innerText = --cartItem.quantity;
      } else {
        cartItemDOM.classList.add('cart-item-remove');
        //删除dom元素
          setTimeout(() => cartItemDOM.remove(), 300);
        //删除数组里的元素
        cart = cart.filter(
          cartItem => cartItem.name !== product.name
          );
          addToButtonDOM.innerText = '加入购物车';
          addToButtonDOM.disabled = false;
      }

        //添加本地存储
        localStorage.setItem('cart',JSON.stringify(cart));

      if (cartItem.quantity === 1) {
        cartItemDOM.querySelector('[data-action="DECREASE_ITEM"]')
        .classList.add('btn-danger');
      }

      //反馈footer
      if(cart.length < 1 ) {
        document.querySelector('.cart-footer').remove();
      }
}
  })
}
//删除
function deleteItem(product,cartItemDOM,addToButtonDOM){
  
        cartItemDOM.classList.add('cart-item-remove');
        //删除dom元素
          setTimeout(() => cartItemDOM.remove(), 300);
        //删除数组里的元素
        cart = cart.filter(
        cartItem => cartItem.name !== product.name);

        //添加本地存储
        localStorage.setItem('cart',JSON.stringify(cart));


        addToButtonDOM.innerText = '加入购物车';
        addToButtonDOM.disabled = false;

        //反馈footer
        if(cart.length < 1 ) {
          document.querySelector('.cart-footer').remove();
        }

}

function headleActionButtons(addToButtonDOM,product){
  addToButtonDOM.innerText='已加入';
  addToButtonDOM.disabled= true;
//拿到商品容器
const cartItemsDOM = cartDOM.querySelectorAll(".cart-item");
cartItemsDOM.forEach(cartItemDOM => {
if (
cartItemDOM.querySelector(".cart-item-name").
 innerHTML === product.name
) {

//加号按钮
cartItemDOM
.querySelector('[data-action="INCREASE_ITEM"]')
.addEventListener("click", () => {
  inceraseItem(product,cartItemDOM);
});



//减号按钮
cartItemDOM.
querySelector('[data-action="DECREASE_ITEM"]')
.addEventListener("click", () => {
  decreaseItem(product,cartItemDOM,addToButtonDOM);
});

//删除按钮
cartItemDOM.
querySelector('[data-action="REMOVE_ITEM"]')
.addEventListener("click", () => {
  deleteItem(product,cartItemDOM,addToButtonDOM);
});
}

});
}

//如果购物车有内容，就继续展示
if(cart.length>0){
  cart.forEach(cartItem =>{
    const product = cartItem;
    insertItemDOM(product);

      addToButtonsDOM.forEach(addToButtonDOM => {
        const productDOM = addToButtonDOM.parentNode;
        //判断购物车中是否存在商品
        if(productDOM.querySelector(".product-name").innerText
        === product.name) {
          headleActionButtons(addToButtonsDOM,product);
        }
      });

  });
}

//遍历添加事件
addToButtonsDOM.forEach(addToButtonDOM => {
  addToButtonDOM.addEventListener('click',() =>{
    const productDOM = addToButtonDOM.parentNode;
    const product ={
      image: productDOM.querySelector(".product-image").
      getAttribute("src"),
      name: productDOM.querySelector('.product-name').
      innerText,
      price: productDOM.querySelector('.product-price').
      innerText,
      quantity: 1
    };

    // console.table(product);

    //处理购物车里的数据
    const isInCart = cart.filter(cartItem => cartItem.name === product.name).
    length>0;

    // 判断购物车
    if (!isInCart){
    insertItemDOM(product);
    //将商品加入购物车
    cart.push(product);

    //添加本地存储
    localStorage.setItem('cart',JSON.stringify(cart));
    }

    headleActionButtons(addToButtonDOM,product);
});
});