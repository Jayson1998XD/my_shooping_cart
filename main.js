
let cart = [];
const cartDOM = document.querySelector('.cart');

const addToButtonsDOM = document.querySelectorAll(
  '[data-action="ADD_TO_CART"]'
);

// console.log(addToButtonsDOM);

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
      cartDOM.insertAdjacentHTML("beforeend",`
      <div class="cart-item">
       <img class="cart-item-image"
        src="${product.image}"
        alt="${product.name}">
      <h3 class="cart-item-name">${product.name}</h3>
       <h3 class="cart-item-price">${product.price}</h3>
       <button class="btn btn-primary btn-danger btn-small" 
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
      `)
    }

    //将商品加入购物车
    cart.push(product);

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
          cart.forEach(cartItem => {
            if (cartItem.name === product.name) {
              cartItemDOM.querySelector('.cart-item-quantity')
              .innerText = ++cartItem.quantity;

              cartItemDOM.
              querySelector('[data-action="DECREASE_ITEM"]')
              .classList.remove('btn-danger');
            }
          });
        });

        //减号按钮
        cartItemDOM.
        querySelector('[data-action="DECREASE_ITEM"]')
        .addEventListener("click", () => {
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

              if (cartItem.quantity === 1) {
                cartItemDOM.querySelector('[data-action="DECREASE_ITEM"]')
                .classList.add('btn-danger');
              }
            }
          })
        })

        //删除按钮
        cartItemDOM.
        querySelector('[data-action="REMOVE_ITEM"]')
        .addEventListener("click", () => {
          cart.forEach(cartItem => {
            if (cartItem.name === product.name) {
                cartItemDOM.classList.add('cart-item-remove');
                //删除dom元素
                  setTimeout(() => cartItemDOM.remove(), 300);
                //删除数组里的元素
                cart = cart.filter(
                  cartItem => cartItem.name !== product.name);
                  addToButtonDOM.innerText = '加入购物车';
                  addToButtonDOM.disabled = false;
            }
          })
        })
      }
    })
  });
});