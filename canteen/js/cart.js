// =====================================================
// CAMPUS BITES - SHARED CART
// Works on Home, Canteens and Menu pages
// =====================================================


// =====================================================
// LOAD CART FROM LOCAL STORAGE
// =====================================================

let cart = JSON.parse(
    localStorage.getItem("campusBitesCart")
) || [];


// =====================================================
// SAVE CART
// =====================================================

function saveCart() {

    localStorage.setItem(
        "campusBitesCart",
        JSON.stringify(cart)
    );

}


// =====================================================
// GET TOTAL NUMBER OF ITEMS
// =====================================================

function getCartCount() {

    let total = 0;

    cart.forEach(function(item) {

        total += item.quantity;

    });

    return total;

}


// =====================================================
// UPDATE CART COUNTER
// =====================================================

function updateCartCount() {

    const cartCount =
        document.querySelector("#cartCount");

    if (cartCount) {

        cartCount.textContent =
            getCartCount();

    }

}


// =====================================================
// ADD ITEM TO CART
// =====================================================

function addToCart(item, button) {

    const existingItem =
        cart.find(function(cartItem) {

            return (
                cartItem.item_id === item.item_id &&
                cartItem.canteen === item.canteen
            );

        });


    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({

            item_id: item.item_id,

            item_name: item.item_name,

            price: Number(item.price),

            category: item.category,

            canteen: item.canteen,

            quantity: 1

        });

    }


    // Save updated cart

    saveCart();

    updateCartCount();


    // Change Add to Cart button temporarily

    if (button) {

        button.innerHTML =
            "✓ Added";

        button.classList.add("added");


        setTimeout(function() {

            button.innerHTML =
                "🛒 &nbsp; Add to Cart";

            button.classList.remove("added");

        }, 1200);

    }

}


// =====================================================
// CREATE FLOATING CART BUTTON
// =====================================================

function createCartButton() {

    // Prevent duplicate cart buttons

    if (
        document.querySelector("#cartButton")
    ) {

        return;

    }


    const cartButton =
        document.createElement("button");


    cartButton.id =
        "cartButton";


    cartButton.innerHTML = `

        🛒

        <span id="cartCount">
            ${getCartCount()}
        </span>

    `;


    // =================================================
    // DETERMINE CURRENT PAGE
    // =================================================

    const currentPage =
        window.location.pathname.toLowerCase();


    // Home page → upper right

    if (
        currentPage.includes("index.html") ||
        currentPage.endsWith("/")
    ) {

        cartButton.classList.add(
            "cart-home"
        );

    }

    // Canteens + Menu → bottom right

    else {

        cartButton.classList.add(
            "cart-bottom"
        );

    }


    // =================================================
    // OPEN CART WHEN CLICKED
    // =================================================

    cartButton.addEventListener(
        "click",
        showCart
    );


    document.body.appendChild(
        cartButton
    );

}


// =====================================================
// SHOW CART
// =====================================================

function showCart() {

    // Remove an existing cart if already open

    const oldOverlay =
        document.querySelector(
            "#cartOverlay"
        );


    if (oldOverlay) {

        oldOverlay.remove();

    }


    let cartHTML = "";


    // =================================================
    // EMPTY CART
    // =================================================

    if (cart.length === 0) {

        cartHTML = `

            <div class="empty-cart">

                <div>
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add some delicious food
                    to get started.
                </p>

            </div>

        `;

    }


    // =================================================
    // CART WITH ITEMS
    // =================================================

    else {

        cart.forEach(function(item) {

            cartHTML += `

                <div class="cart-item">

                    <div class="cart-item-info">

                        <strong>
                            ${item.item_name}
                        </strong>

                        <small>
                            ${getCanteenName(
                                item.canteen
                            )}
                        </small>

                        <span>
                            ₹${item.price}
                            ×
                            ${item.quantity}
                        </span>

                    </div>


                    <div class="cart-item-actions">

                        <button
                            class="quantity-button"
                            data-action="decrease"
                            data-id="${item.item_id}"
                            data-canteen="${item.canteen}">

                            −

                        </button>


                        <span>
                            ${item.quantity}
                        </span>


                        <button
                            class="quantity-button"
                            data-action="increase"
                            data-id="${item.item_id}"
                            data-canteen="${item.canteen}">

                            +

                        </button>

                    </div>

                </div>

            `;

        });


        // =================================================
        // CALCULATE TOTAL
        // =================================================

        const total =
            cart.reduce(
                function(sum, item) {

                    return (
                        sum +
                        item.price *
                        item.quantity
                    );

                },
                0
            );


        cartHTML += `

            <div class="cart-total">

                <strong>
                    Total
                </strong>

                <strong>
                    ₹${total}
                </strong>

            </div>


            <button
                class="checkout-button">

                Proceed to Checkout

            </button>

        `;

    }


    // =================================================
    // CREATE CART OVERLAY
    // =================================================

    const overlay =
        document.createElement("div");


    overlay.id =
        "cartOverlay";


    overlay.innerHTML = `

        <div class="cart-panel">

            <div class="cart-header">

                <h2>
                    🛒 Your Cart
                </h2>


                <button
                    id="closeCart">

                    ✕

                </button>

            </div>


            <div class="cart-content">

                ${cartHTML}

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    // =================================================
    // CLOSE CART
    // =================================================

    document
        .querySelector("#closeCart")
        .addEventListener(
            "click",
            function() {

                overlay.remove();

            }
        );


    // =================================================
    // QUANTITY BUTTONS
    // =================================================

    document
        .querySelectorAll(
            ".quantity-button"
        )
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const id =
                        Number(
                            button.dataset.id
                        );


                    const canteen =
                        button.dataset.canteen;


                    const action =
                        button.dataset.action;


                    // Find item

                    const item =
                        cart.find(
                            function(cartItem) {

                                return (
                                    cartItem.item_id === id &&
                                    cartItem.canteen === canteen
                                );

                            }
                        );


                    if (!item) {

                        return;

                    }


                    // Increase quantity

                    if (
                        action === "increase"
                    ) {

                        item.quantity += 1;

                    }


                    // Decrease quantity

                    if (
                        action === "decrease"
                    ) {

                        item.quantity -= 1;


                        // Remove when quantity reaches zero

                        if (
                            item.quantity <= 0
                        ) {

                            cart =
                                cart.filter(
                                    function(cartItem) {

                                        return !(
                                            cartItem.item_id === id &&
                                            cartItem.canteen === canteen
                                        );

                                    }
                                );

                        }

                    }


                    // Save changes

                    saveCart();

                    updateCartCount();


                    // Refresh cart display

                    overlay.remove();

                    showCart();

                }
            );

        });

}


// =====================================================
// CANTEEN NAME
// =====================================================

function getCanteenName(canteen) {

    const names = {

        cafeteria: "Cafeteria",

        timeless: "Timeless",

        nescafe: "Nescafe"

    };


    return (
        names[canteen] ||
        canteen
    );

}


// =====================================================
// START CART
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        createCartButton();

        updateCartCount();

    }
);