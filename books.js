const cart = document.querySelector("nav .cart");
const cartSidebar = document.querySelector(".cart-sidebar");
const closeCart = document.querySelector(".close-cart");
const cartUI = document.querySelector(".cart-sidebar .cart");
const totalDiv = document.querySelector(".total-sum");
const cartPriceTotal = document.querySelector(".total-amount");
const clearBtn = document.querySelector(".clear-cart-btn");
const cartContent = document.querySelector(".cart-content");
const searchBar = document.querySelector(".search")

let Cart = []
let buttonsDOM = []
let products = []

cart.addEventListener("click", function(){
    cartSidebar.style.transform = "translate(0%)"
})

closeCart.addEventListener("click", function(){
    cartSidebar.style.transform = "translate(100%)"
})

const proceed = document.querySelector(".proceed")
proceed.addEventListener("click", function(){
    window.open("/order.html")
})

searchBar.addEventListener("input", function (e){
    const search = e.target.value.toLowerCase()
    products.forEach(product=>{
        const isVisible = product.title.toLowerCase().includes(search)
        console.log(isVisible)
        const p = document.querySelector(`.book-${product.id}`)
        console.log(p)
        if (!isVisible){
            p.classList.toggle("hide", true)
        }
        else{
            p.classList.toggle("hide", false)
        }
    })
 })

class Product{
    async getProduct(){
        const response = await fetch("products.json");
        const data = await response.json();
        let productsWithin = data.items;
        products = productsWithin.map(item=>{
            const{title, price, wordcount, desc} = item.fields;
            const{id} = item.sys;
            const image = item.fields.image.fields.file.url;
            return{title, price, wordcount, desc, id, image};
        })
        return products;
    }
}

class UI{
    displayProducts(products){
        let count = 0
        products.forEach(product=>{
            const productDiv = document.createElement("div")
            productDiv.innerHTML = `
            <div class = "book book-${product.id}">
                <img src=${product.image} alt = ${product.title}/>
                <div class = "title">${product.title}</div>
                <div class="word-count"><span style = "font-weight:bold">Word Count: </span> <span style = "color:white">${product.wordcount}</span></div>
                <div class="desc"> <span style = "font-weight:bold">Description: </span>${product.desc}</div>
                <div class ="price"> <span style = "font-weight:bold">Price: </span><span style = "color:white">${product.price}</span></div>
                <span class = "add-to-cart" data-id = "${product.id}">Add to Cart</span>
            </div>`
            const p = document.querySelector(".columns-desktop")
            p.append(productDiv)
            count++
        })
    }
    
    getButtons(){
        const btns = document.querySelectorAll(".add-to-cart")
        Array.from(btns)
        buttonsDOM = btns;
        btns.forEach((btn)=>{
            let id = btn.dataset.id;
            let inCart = Cart.find((item)=>item.id);
            //if it's already in cart, turn the button off
            if(inCart){
                btn.innerHTML = "In Cart"
                btn.dissabled = true
            }
            //What happens when the button is clicked
            btn.addEventListener("click", (e)=>{
                e.currentTarget.innerHTML = "In Cart"
                e.currentTarget.classList.toggle("in-cart")
                let cartItem = {...Storage.getStorageProducts(id)}
                Cart.push(cartItem)
                //I think this is so that even if it is refreshed it is still saved - that's what storage is for
                Storage.saveCart(Cart)
                this.setCartValues(Cart)
                this.addCartItem(cartItem)
            })
        })
    }
    //Adds the price of the item being added to the total value in the cart
    setCartValues(Cart){
        let tempTotal = 0;
        Cart.map((item)=>{
            tempTotal+=parseFloat(item.price)
        })
        cartPriceTotal.innerHTML = tempTotal
    }
    //Adds all of the data to the cart in HTML format under cartContent
    addCartItem(cartItem){
        let cartItemUI = document.createElement("div")
        cartItemUI.innerHTML = `<div class = "cart-product">
                                    <div class = "product-image">
                                        <img src = "${cartItem.image}" alt = "product">
                                    </div>
                                    <div class = "cart-product-content">
                                        <div class = "cart-product-name"><h3>${cartItem.title}</h3></div>
                                        <div class = "cart-product-price"><h3>$${cartItem.price}</h3></div>
                                        <button class = "cart-product-remove" data-id = "${cartItem.id}">
                                            remove
                                        </button>
                                    </div>
                                </div>`
                                    cartContent.append(cartItemUI);
    }
    setupApp(){
        Cart = Storage.getCart()
        this.setCartValues(Cart)
        Cart.map((item)=>{
            this.addCartItem(item)
        })
    }
    cartLogic(){
        //if the button pressed was the clear button, call clearCart function
        clearBtn.addEventListener("click", ()=>{
            this.clearCart();
        })
        //if the button pressed was the remove button, remove the item
        cartContent.addEventListener("click", (event)=>{
            if(event.target.classList.contains("cart-product-remove")){
                let id = event.target.dataset.id;
                this.removeItem(id)
                let div = event.target.parentElement.parentElement.parentElement.parentElement
                div.removeChild(event.target.parentElement.parentElement.parentElement)
            }
            /*else if(event.target.classList.contains("add-amount")){
                let id = event.target.dataset.id
                let item = Cart.find((item)=>item.id===id)
                item-amount++
                Storage.saveCart(cart)
                this.setCartValues(Cart)
                event.target.nextElementSibling.innerHTML = item.amount
            }
            else if(event.target.classList.contains("reduce-amount")){
                let id = event.target.dataset.id
                let item = Cart.find((item)=>item.id===id)
                if()
                item-amount--
                Storage.saveCart(cart)
                this.setCartValues(Cart)
                event.target.nextElementSibling.innerHTML = item.amount
            }*/
        })
    }
    clearCart(){
        let cartItem = Cart.map(item=>item.id)
        cartItem.forEach((id)=>this.removeItem(id))
        const cartProduct = document.querySelectorAll(".cart-product")
        cartProduct.forEach((item)=>{
            if(item){
                item.parentElement.removeChild(item)
            }
        })
    }
    removeItem(id){
        Cart = Cart.filter((item)=>item.id!=id)
        this.setCartValues(Cart)
        Storage.saveCart(Cart)
        let button = this.getSingleButton(id)
        button.innerHTML = `Add to Cart`
        button.classList.toggle("in-cart", false)
    }
    getSingleButton(id){
        let btn
        buttonsDOM.forEach((button)=>{
            if(button.dataset.id == id){
                btn = button
            }
        })
        return btn
    }
}

class Storage{
    static saveProducts(products){
        //creates a key "products", and assigns the value of the JSON to that product
        localStorage.setItem("products", JSON.stringify(products))
    }
    static getStorageProducts(id){
        //using the key "products", will return the JSON string, and then will parse it into a Javascript object (products is an array of book objects)
        let products = JSON.parse(localStorage.getItem("products"))
        console.log(products[0].id)
        let item
        for(item in products){
            if(products[item].id==id){
                return products[item]
            }
        }
    }
    static getStorageProductsByName(title){
        //using the key "products", will return the JSON string, and then will parse it into a Javascript object (products is an array of book objects)
        let products = JSON.parse(localStorage.getItem("products"))
        let item
        for(item in products){
            if(products[item].title==title){
                return products[item]
            }
        }
    }
    static saveCart(Cart){
        localStorage.setItem('Cart', JSON.stringify(Cart))
    }
    static getCart(){
        return localStorage.getItem('Cart')? JSON.parse(localStorage.getItem("Cart")):[]
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    const products = new Product();
    const ui = new UI();
    ui.setupApp();
    products.getProduct().then(products=>{
        ui.displayProducts(products)
        Storage.saveProducts(products)
    }).then(()=>{
        ui.getButtons();
        ui.cartLogic();
    })
    console.log(Cart[0])
})