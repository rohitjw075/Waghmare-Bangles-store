/* =========================================================
   WAGHMARE BANGLES STORE BIRAWALI
   Frontend E-Commerce Application
   ========================================================= */


"use strict";


/* =========================================================
   STORE CONFIGURATION
   ========================================================= */

const DEFAULT_SETTINGS = {

    storeName:
        "Waghmare Bangles Store Birawali",

    phone:
        "8329461513",

    whatsapp:
        "918329461513",

    address:
        "At.Birawali.Post.Shivali.Talu.Ausa.Dist.Latur.",

    mapUrl:
        "https://maps.app.goo.gl/LEnE1639hfxCBvcr5?g_st=ac",

    upi:
        "8329461513@axl",

    logo:
        "55724.png",

    announcement:
        "Free shipping on orders above ₹999",

    freeShipping:
        999,

    shipping:
        50,

    adminPassword:
        "Rohit075"

};


const STORAGE = {

    settings:
        "wb_settings",

    products:
        "wb_products",

    orders:
        "wb_orders",

    customers:
        "wb_customers",

    coupons:
        "wb_coupons",

    wishlist:
        "wb_wishlist",

    cart:
        "wb_cart",

    logs:
        "wb_logs",

    lastOrder:
        "wb_last_order"

};


/* =========================================================
   DEFAULT PRODUCTS
   ========================================================= */

const DEFAULT_PRODUCTS = [

    {
        id: "p1001",

        name:
            "Royal Bridal Bangles Set",

        category:
            "Bridal",

        price:
            899,

        mrp:
            1199,

        stock:
            15,

        badge:
            "Best Seller",

        image:
            "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=800&q=80",

        gallery: [],

        description:
            "Elegant bridal bangle set designed for weddings and special celebrations.",

        material:
            "Premium Finish",

        size:
            "2.4, 2.6, 2.8",

        visible:
            true
    },


    {
        id: "p1002",

        name:
            "Velvet Designer Bangles",

        category:
            "Velvet",

        price:
            499,

        mrp:
            699,

        stock:
            20,

        badge:
            "New",

        image:
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",

        gallery: [],

        description:
            "Beautiful velvet bangles with an attractive traditional finish.",

        material:
            "Velvet",

        size:
            "2.4, 2.6, 2.8",

        visible:
            true
    },


    {
        id: "p1003",

        name:
            "Classic Glass Bangles",

        category:
            "Glass",

        price:
            299,

        mrp:
            399,

        stock:
            30,

        badge:
            "",

        image:
            "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80",

        gallery: [],

        description:
            "Classic colourful glass bangles for everyday traditional looks.",

        material:
            "Glass",

        size:
            "2.4, 2.6, 2.8",

        visible:
            true
    },


    {
        id: "p1004",

        name:
            "Gold Plated Premium Set",

        category:
            "Gold Plated",

        price:
            1299,

        mrp:
            1699,

        stock:
            10,

        badge:
            "Premium",

        image:
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",

        gallery: [],

        description:
            "Premium gold plated bangle set with an elegant festive appearance.",

        material:
            "Gold Plated",

        size:
            "2.4, 2.6, 2.8",

        visible:
            true
    }

];


/* =========================================================
   APPLICATION STATE
   ========================================================= */

let settings = loadData(
    STORAGE.settings,
    DEFAULT_SETTINGS
);

let products = loadData(
    STORAGE.products,
    DEFAULT_PRODUCTS
);

let orders = loadData(
    STORAGE.orders,
    []
);

let customers = loadData(
    STORAGE.customers,
    []
);

let coupons = loadData(
    STORAGE.coupons,
    [
        {
            code: "ROHIT10",
            percent: 10,
            active: true
        }
    ]
);

let wishlist = loadData(
    STORAGE.wishlist,
    []
);

let cart = loadData(
    STORAGE.cart,
    []
);

let logs = loadData(
    STORAGE.logs,
    []
);

let selectedCategory = "All";

let checkoutDiscount = 0;

let currentPaymentOrderId = null;

let currentReceiptOrderId = null;

let isAdmin = false;


/* =========================================================
   HELPERS
   ========================================================= */

function loadData(key, fallback) {

    try {

        const saved =
            localStorage.getItem(key);

        if (!saved)
            return structuredCloneSafe(fallback);

        return JSON.parse(saved);

    } catch (error) {

        console.error(error);

        return structuredCloneSafe(fallback);
    }
}


function structuredCloneSafe(data) {

    return JSON.parse(
        JSON.stringify(data)
    );
}


function saveData(key, data) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );
}


function saveAll() {

    saveData(STORAGE.settings, settings);
    saveData(STORAGE.products, products);
    saveData(STORAGE.orders, orders);
    saveData(STORAGE.customers, customers);
    saveData(STORAGE.coupons, coupons);
    saveData(STORAGE.wishlist, wishlist);
    saveData(STORAGE.cart, cart);
    saveData(STORAGE.logs, logs);
}


function uid(prefix = "ID") {

    if (
        window.crypto &&
        crypto.randomUUID
    ) {
        return prefix + "-" +
            crypto.randomUUID()
                .slice(0, 8)
                .toUpperCase();
    }

    return prefix +
        "-" +
        Date.now() +
        "-" +
        Math.floor(
            Math.random() * 9999
        );
}


function money(value) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(Number(value) || 0);
}


function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function toast(message, type = "success") {

    const container =
        document.getElementById(
            "toastContainer"
        );

    const item =
        document.createElement("div");

    item.className =
        `toast ${type}`;

    item.textContent =
        message;

    container.appendChild(item);

    setTimeout(() => {

        item.remove();

    }, 3200);
}


function addLog(action, details = "") {

    logs.unshift({

        id: uid("LOG"),

        action,

        details,

        time:
            new Date().toLocaleString(
                "en-IN"
            )

    });

    logs =
        logs.slice(0, 100);

    saveData(
        STORAGE.logs,
        logs
    );

    renderActivityLog();
}


function openModal(id) {

    document
        .getElementById(id)
        ?.classList
        .add("active");

}


function closeModal(id) {

    document
        .getElementById(id)
        ?.classList
        .remove("active");

}


function scrollToTop() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        applySettings();

        renderProducts();

        renderCart();

        renderWishlistCount();

        updateCartCount();

        document.getElementById(
            "currentYear"
        ).textContent =
            new Date().getFullYear();

        setTimeout(() => {

            document
                .getElementById(
                    "pageLoader"
                )
                .classList
                .add("hide");

        }, 900);


        document
            .getElementById(
                "checkoutForm"
            )
            .addEventListener(
                "submit",
                handleCheckout
            );


        document
            .getElementById(
                "productForm"
            )
            .addEventListener(
                "submit",
                saveProduct
            );


        document
            .getElementById(
                "settingsForm"
            )
            .addEventListener(
                "submit",
                saveSettings
            );


        document
            .getElementById(
                "couponForm"
            )
            .addEventListener(
                "submit",
                addCoupon
            );


        renderAdmin();

    }
);


/* =========================================================
   SETTINGS
   ========================================================= */

function applySettings() {

    document.getElementById(
        "headerStoreName"
    ).textContent =
        settings.storeName;

    document.getElementById(
        "footerStoreName"
    ).textContent =
        settings.storeName;

    document.getElementById(
        "footerAddress"
    ).textContent =
        settings.address;

    const phone =
        document.getElementById(
            "footerPhone"
        );

    phone.textContent =
        settings.phone;

    phone.href =
        "tel:" + settings.phone;

    document.getElementById(
        "announcementText"
    ).textContent =
        settings.announcement;


    const logo =
        document.getElementById(
            "headerLogo"
        );

    if (settings.logo) {

        logo.src =
            settings.logo;

        logo.style.display =
            "block";

    }


    fillSettingsForm();

}


function fillSettingsForm() {

    const fields = {

        setStoreName:
            settings.storeName,

        setPhone:
            settings.phone,

        setLogo:
            settings.logo,

        setAnnouncement:
            settings.announcement,

        setAddress:
            settings.address,

        setUPI:
            settings.upi,

        setFreeShipping:
            settings.freeShipping,

        setShipping:
            settings.shipping,

        setPassword:
            settings.adminPassword

    };


    Object.entries(fields)
        .forEach(
            ([id, value]) => {

                const element =
                    document.getElementById(id);

                if (element)
                    element.value =
                        value;

            }
        );

}


function saveSettings(event) {

    event.preventDefault();


    settings.storeName =
        document.getElementById(
            "setStoreName"
        ).value.trim();


    settings.phone =
        document.getElementById(
            "setPhone"
        ).value.trim();


    settings.logo =
        document.getElementById(
            "setLogo"
        ).value.trim();


    settings.announcement =
        document.getElementById(
            "setAnnouncement"
        ).value.trim();


    settings.address =
        document.getElementById(
            "setAddress"
        ).value.trim();


    settings.upi =
        document.getElementById(
            "setUPI"
        ).value.trim();


    settings.freeShipping =
        Number(
            document.getElementById(
                "setFreeShipping"
            ).value
        ) || 0;


    settings.shipping =
        Number(
            document.getElementById(
                "setShipping"
            ).value
        ) || 0;


    const password =
        document.getElementById(
            "setPassword"
        ).value.trim();

    if (password)
        settings.adminPassword =
            password;


    saveData(
        STORAGE.settings,
        settings
    );

    applySettings();

    addLog(
        "Store Settings Updated"
    );

    toast(
        "Store settings saved successfully."
    );

}


/* =========================================================
   PRODUCTS
   ========================================================= */

function renderProducts() {

    const grid =
        document.getElementById(
            "productGrid"
        );

    const search =
        document.getElementById(
            "searchInput"
        ).value
            .trim()
            .toLowerCase();


    let visible =
        products.filter(
            product =>
                product.visible !== false
        );


    if (
        selectedCategory !==
        "All"
    ) {

        visible =
            visible.filter(
                product =>
                    product.category ===
                    selectedCategory
            );

    }


    if (search) {

        visible =
            visible.filter(
                product =>
                    (
                        product.name +
                        " " +
                        product.category +
                        " " +
                        product.description
                    )
                        .toLowerCase()
                        .includes(search)
            );

    }


    document.getElementById(
        "productResultCount"
    ).textContent =
        `${visible.length} products`;


    if (!visible.length) {

        grid.innerHTML = `

            <div class="empty-state"
                 style="grid-column:1/-1">

                <i class="fa-solid fa-box-open"></i>

                <h3>No products found</h3>

                <p>
                    Try another category or search.
                </p>

            </div>

        `;

        return;
    }


    grid.innerHTML =
        visible.map(
            productCard
        ).join("");

}


function productCard(product) {

    const inWishlist =
        wishlist.includes(
            product.id
        );


    return `

        <article class="product-card">

            <div class="product-image"
                 onclick="openProduct('${product.id}')">

                <img
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                    onerror="this.src='https://placehold.co/600x600/f6ead5/5b1020?text=Bangles'">

                ${
                    product.badge
                    ?
                    `<span class="product-badge">
                        ${escapeHTML(product.badge)}
                    </span>`
                    :
                    ""
                }


                <button
                    class="wishlist-product"
                    onclick="event.stopPropagation();toggleWishlist('${product.id}')">

                    <i class="${
                        inWishlist
                        ?
                        "fa-solid"
                        :
                        "fa-regular"
                    } fa-heart"></i>

                </button>

            </div>


            <div class="product-info">

                <span class="product-category">
                    ${escapeHTML(product.category)}
                </span>

                <h3 class="product-name">
                    ${escapeHTML(product.name)}
                </h3>

                <p class="product-description">
                    ${escapeHTML(
                        product.description ||
                        "Beautiful bangles collection."
                    )}
                </p>


                <div class="price-row">

                    <div>

                        <span class="price">
                            ${money(product.price)}
                        </span>

                        ${
                            product.mrp
                            ?
                            `<span class="mrp">
                                ${money(product.mrp)}
                            </span>`
                            :
                            ""
                        }

                    </div>


                    <button
                        class="add-btn"
                        onclick="addToCart('${product.id}')">

                        <i class="fa-solid fa-plus"></i>

                    </button>

                </div>

            </div>

        </article>

    `;

}


function setCategory(category) {

    selectedCategory =
        category;

    document
        .querySelectorAll(
            ".category-btn"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.category ===
                    category
                );

            }
        );


    renderProducts();

    document.getElementById(
        "products"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


function toggleFilters() {

    const panel =
        document.getElementById(
            "filterPanel"
        );

    panel.classList.toggle(
        "hidden"
    );

}


/* =========================================================
   PRODUCT DETAILS
   ========================================================= */

function openProduct(id) {

    const product =
        products.find(
            p => p.id === id
        );

    if (!product)
        return;


    const gallery =
        [
            product.image,
            ...(product.gallery || [])
        ];


    document.getElementById(
        "productDetails"
    ).innerHTML = `

        <div class="product-detail-grid">

            <div>

                <div class="product-detail-image">

                    <img
                        id="detailMainImage"
                        src="${escapeHTML(product.image)}"
                        onerror="this.src='https://placehold.co/700x700/f6ead5/5b1020?text=Bangles'">

                </div>


                <div class="gallery">

                    ${
                        gallery.map(
                            image => `

                                <img
                                    src="${escapeHTML(image)}"
                                    onclick="document.getElementById('detailMainImage').src='${escapeHTML(image)}'">

                            `
                        ).join("")
                    }

                </div>

            </div>


            <div class="product-detail-info">

                <span class="product-category">
                    ${escapeHTML(product.category)}
                </span>

                <h2>
                    ${escapeHTML(product.name)}
                </h2>

                <div class="detail-price">
                    ${money(product.price)}
                    ${
                        product.mrp
                        ?
                        `<span class="mrp">
                            ${money(product.mrp)}
                        </span>`
                        :
                        ""
                    }
                </div>

                <p class="detail-description">
                    ${escapeHTML(product.description)}
                </p>


                <p>
                    <strong>Material:</strong>
                    ${escapeHTML(product.material || "-")}
                </p>

                <p>
                    <strong>Available Sizes:</strong>
                    ${escapeHTML(product.size || "-")}
                </p>

                <p style="margin:12px 0;color:#5b1020">
                    <strong>Stock:</strong>
                    ${product.stock}
                </p>


                <button
                    class="primary-btn full"
                    onclick="addToCart('${product.id}');closeModal('productModal')">

                    <i class="fa-solid fa-bag-shopping"></i>
                    Add to Cart

                </button>

            </div>

        </div>

    `;


    openModal("productModal");

}


/* =========================================================
   CART
   ========================================================= */

function addToCart(id) {

    const product =
        products.find(
            p => p.id === id
        );

    if (!product)
        return;


    if (
        Number(product.stock) <= 0
    ) {

        toast(
            "This product is out of stock.",
            "error"
        );

        return;
    }


    const existing =
        cart.find(
            item => item.productId === id
        );


    if (existing) {

        if (
            existing.quantity >=
            product.stock
        ) {

            toast(
                "Maximum available stock reached.",
                "error"
            );

            return;
        }

        existing.quantity++;

    } else {

        cart.push({

            productId: id,

            quantity: 1

        });

    }


    saveData(
        STORAGE.cart,
        cart
    );

    renderCart();

    updateCartCount();

    toast(
        `${product.name} added to cart.`
    );

}


function updateQuantity(id, change) {

    const item =
        cart.find(
            x => x.productId === id
        );

    const product =
        products.find(
            x => x.id === id
        );

    if (!item || !product)
        return;


    item.quantity +=
        change;


    if (
        item.quantity <= 0
    ) {

        cart =
            cart.filter(
                x => x.productId !== id
            );

    }


    if (
        item.quantity >
        product.stock
    ) {

        item.quantity =
            product.stock;

        toast(
            "Stock limit reached.",
            "error"
        );

    }


    saveData(
        STORAGE.cart,
        cart
    );

    renderCart();

    updateCartCount();

}


function removeFromCart(id) {

    cart =
        cart.filter(
            x => x.productId !== id
        );

    saveData(
        STORAGE.cart,
        cart
    );

    renderCart();

    updateCartCount();

}


function getCartDetails() {

    return cart
        .map(
            item => {

                const product =
                    products.find(
                        p =>
                            p.id ===
                            item.productId
                    );

                if (!product)
                    return null;

                return {

                    ...item,

                    product,

                    lineTotal:
                        product.price *
                        item.quantity

                };

            }
        )
        .filter(Boolean);

}


function getCartSubtotal() {

    return getCartDetails()
        .reduce(
            (sum, item) =>
                sum + item.lineTotal,
            0
        );

}


function getShipping(subtotal) {

    if (
        subtotal <= 0
    )
        return 0;

    if (
        subtotal >=
        Number(settings.freeShipping)
    )
        return 0;

    return Number(
        settings.shipping
    ) || 0;

}


function renderCart() {

    const container =
        document.getElementById(
            "cartItems"
        );

    const items =
        getCartDetails();


    if (!items.length) {

        container.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-bag-shopping"></i>

                <h3>Your cart is empty</h3>

                <p>
                    Add beautiful bangles to your cart.
                </p>

            </div>

        `;

    } else {

        container.innerHTML =
            items.map(
                item => `

                    <div class="cart-item">

                        <img
                            src="${escapeHTML(item.product.image)}"
                            onerror="this.src='https://placehold.co/100x100/f6ead5/5b1020?text=B'">

                        <div>

                            <h4>
                                ${escapeHTML(item.product.name)}
                            </h4>

                            <small>
                                ${money(item.product.price)}
                            </small>


                            <div class="qty-control">

                                <button
                                    onclick="updateQuantity('${item.product.id}',-1)">
                                    −
                                </button>

                                <strong>
                                    ${item.quantity}
                                </strong>

                                <button
                                    onclick="updateQuantity('${item.product.id}',1)">
                                    +
                                </button>

                            </div>

                        </div>


                        <div style="text-align:right">

                            <strong>
                                ${money(item.lineTotal)}
                            </strong>

                            <br>

                            <button
                                class="small-btn"
                                onclick="removeFromCart('${item.product.id}')">
                                Remove
                            </button>

                        </div>

                    </div>

                `
            ).join("");

    }


    const subtotal =
        getCartSubtotal();

    const shipping =
        getShipping(subtotal);

    const total =
        subtotal + shipping;


    document.getElementById(
        "cartSubtotal"
    ).textContent =
        money(subtotal);

    document.getElementById(
        "cartShipping"
    ).textContent =
        shipping === 0
        ?
        "FREE"
        :
        money(shipping);

    document.getElementById(
        "cartTotal"
    ).textContent =
        money(total);

}


function updateCartCount() {

    const count =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );

    document.getElementById(
        "cartCount"
    ).textContent =
        count;

}


function openCart() {

    renderCart();

    document
        .getElementById(
            "cartOverlay"
        )
        .classList
        .add("active");

    document
        .getElementById(
            "cartDrawer"
        )
        .classList
        .add("active");

}


function closeCart() {

    document
        .getElementById(
            "cartOverlay"
        )
        .classList
        .remove("active");

    document
        .getElementById(
            "cartDrawer"
        )
        .classList
        .remove("active");

}


/* =========================================================
   WISHLIST
   ========================================================= */

function toggleWishlist(id) {

    if (
        wishlist.includes(id)
    ) {

        wishlist =
            wishlist.filter(
                x => x !== id
            );

        toast(
            "Removed from wishlist."
        );

    } else {

        wishlist.push(id);

        toast(
            "Added to wishlist."
        );

    }


    saveData(
        STORAGE.wishlist,
        wishlist
    );

    renderProducts();

    renderWishlistCount();

    renderWishlist();

}


function renderWishlistCount() {

    document.getElementById(
        "wishlistCount"
    ).textContent =
        wishlist.length;

}


function renderWishlist() {

    const container =
        document.getElementById(
            "wishlistItems"
        );

    const items =
        wishlist
            .map(
                id =>
                    products.find(
                        p => p.id === id
                    )
            )
            .filter(Boolean);


    if (!items.length) {

        container.innerHTML = `

            <div class="empty-state">

                <i class="fa-regular fa-heart"></i>

                <h3>Wishlist is empty</h3>

            </div>

        `;

        return;
    }


    container.innerHTML =
        items.map(
            product => `

                <div class="admin-product-row">

                    <img
                        src="${escapeHTML(product.image)}">

                    <div>

                        <h4>
                            ${escapeHTML(product.name)}
                        </h4>

                        <small>
                            ${money(product.price)}
                        </small>

                    </div>


                    <div class="admin-actions">

                        <button
                            class="small-btn"
                            onclick="addToCart('${product.id}')">

                            Add

                        </button>

                        <button
                            class="small-btn"
                            onclick="toggleWishlist('${product.id}')">

                            Remove

                        </button>

                    </div>

                </div>

            `
        ).join("");

}


function openWishlist() {

    renderWishlist();

    openModal(
        "wishlistModal"
    );

}


/* =========================================================
   CHECKOUT
   ========================================================= */

function openCheckout() {

    if (!cart.length) {

        toast(
            "Your cart is empty.",
            "error"
        );

        return;
    }


    closeCart();

    checkoutDiscount = 0;

    document.getElementById(
        "couponInput"
    ).value = "";

    document.getElementById(
        "couponMessage"
    ).textContent = "";

    renderCheckoutSummary();

    openModal(
        "checkoutModal"
    );

}


function renderCheckoutSummary() {

    const subtotal =
        getCartSubtotal();

    const shipping =
        getShipping(subtotal);

    const discount =
        subtotal *
        checkoutDiscount /
        100;

    const total =
        Math.max(
            0,
            subtotal +
            shipping -
            discount
        );


    document.getElementById(
        "checkoutSummary"
    ).innerHTML = `

        <div class="summary-line">
            <span>Subtotal</span>
            <strong>${money(subtotal)}</strong>
        </div>

        <div class="summary-line">
            <span>Shipping</span>
            <strong>
                ${
                    shipping === 0
                    ?
                    "FREE"
                    :
                    money(shipping)
                }
            </strong>
        </div>

        ${
            checkoutDiscount
            ?
            `
                <div class="summary-line">
                    <span>
                        Discount (${checkoutDiscount}%)
                    </span>

                    <strong>
                        -${money(discount)}
                    </strong>
                </div>
            `
            :
            ""
        }


        <div class="summary-line summary-total">
            <span>Total</span>
            <strong>${money(total)}</strong>
        </div>

    `;

}


function applyCoupon() {

    const code =
        document.getElementById(
            "couponInput"
        ).value
            .trim()
            .toUpperCase();


    const coupon =
        coupons.find(
            c =>
                c.code === code &&
                c.active !== false
        );


    if (!coupon) {

        checkoutDiscount = 0;

        document.getElementById(
            "couponMessage"
        ).textContent =
            "Invalid coupon code.";

        document.getElementById(
            "couponMessage"
        ).style.color =
            "#b32636";

        renderCheckoutSummary();

        return;
    }


    checkoutDiscount =
        Number(coupon.percent);


    document.getElementById(
        "couponMessage"
    ).textContent =
        `${coupon.percent}% discount applied!`;

    document.getElementById(
        "couponMessage"
    ).style.color =
        "#20733c";


    renderCheckoutSummary();

}


function handleCheckout(event) {

    event.preventDefault();


    if (!cart.length) {

        toast(
            "Cart is empty.",
            "error"
        );

        return;
    }


    const name =
        document.getElementById(
            "customerName"
        ).value.trim();


    const phone =
        document.getElementById(
            "customerPhone"
        ).value.trim();


    const address =
        document.getElementById(
            "customerAddress"
        ).value.trim();


    const city =
        document.getElementById(
            "customerCity"
        ).value.trim();


    const subtotal =
        getCartSubtotal();

    const shipping =
        getShipping(subtotal);

    const discount =
        subtotal *
        checkoutDiscount /
        100;

    const total =
        Math.max(
            0,
            subtotal +
            shipping -
            discount
        );


    const customer = {

        id:
            uid("CUS"),

        name,

        phone,

        address,

        city,

        updatedAt:
            new Date().toISOString()

    };


    const existingCustomer =
        customers.find(
            c => c.phone === phone
        );


    if (existingCustomer) {

        Object.assign(
            existingCustomer,
            customer
        );

    } else {

        customers.push(
            customer
        );

    }


    const order = {

        id:
            uid("ORD"),

        customerId:
            customer.id,

        customer: {
            name,
            phone,
            address,
            city
        },

        items:
            getCartDetails()
                .map(
                    item => ({
                        productId:
                            item.product.id,

                        name:
                            item.product.name,

                        price:
                            item.product.price,

                        quantity:
                            item.quantity,

                        total:
                            item.lineTotal,

                        image:
                            item.product.image
                    })
                ),

        subtotal,

        shipping,

        discount,

        coupon:
            checkoutDiscount
                ? document.getElementById(
                    "couponInput"
                ).value
                : "",

        total,

        paymentStatus:
            "Pending",

        orderStatus:
            "Payment Pending",

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    };


    orders.unshift(order);

    saveData(
        STORAGE.orders,
        orders
    );

    saveData(
        STORAGE.customers,
        customers
    );


    currentPaymentOrderId =
        order.id;


    closeModal(
        "checkoutModal"
    );


    openPayment(order);


    addLog(
        "New Order Created",
        order.id
    );

}


/* =========================================================
   PAYMENT
   ========================================================= */

function openPayment(order) {

    document.getElementById(
        "paymentAmount"
    ).textContent =
        money(order.total);


    document.getElementById(
        "paymentUpi"
    ).textContent =
        settings.upi;


    const upiLink =
        createUPILink(
            order
        );


    document.getElementById(
        "upiPayButton"
    ).href =
        upiLink;


    const qr =
        document.getElementById(
            "qrCode"
        );

    qr.innerHTML = "";


    if (
        typeof QRCode !==
        "undefined"
    ) {

        new QRCode(
            qr,
            {
                text: upiLink,

                width: 210,

                height: 210,

                correctLevel:
                    QRCode.CorrectLevel.H
            }
        );

    } else {

        qr.innerHTML = `
            <div class="empty-state">
                QR library unavailable.
            </div>
        `;

    }


    openModal(
        "paymentModal"
    );

}


function createUPILink(order) {

    const params =
        new URLSearchParams({

            pa:
                settings.upi,

            pn:
                settings.storeName,

            am:
                Number(order.total)
                    .toFixed(2),

            cu:
                "INR",

            tn:
                "Order " +
                order.id

        });


    return "upi://pay?" +
        params.toString();

}


function copyUPI() {

    navigator.clipboard
        ?.writeText(
            settings.upi
        )
        .then(
            () =>
                toast(
                    "UPI ID copied."
                )
        );

}


function submitPayment() {

    const order =
        orders.find(
            o =>
                o.id ===
                currentPaymentOrderId
        );


    if (!order)
        return;


    order.paymentStatus =
        "Submitted";

    order.orderStatus =
        "Payment Submitted";

    order.updatedAt =
        new Date().toISOString();


    saveData(
        STORAGE.orders,
        orders
    );


    closeModal(
        "paymentModal"
    );


    document.getElementById(
        "successOrderId"
    ).textContent =
        "Order ID: " +
        order.id;


    localStorage.setItem(
        STORAGE.lastOrder,
        order.id
    );


    openModal(
        "successModal"
    );


    toast(
        "Payment submitted for verification."
    );


    renderAdmin();

}


/* =========================================================
   ORDER VIEW
   ========================================================= */

function viewMyOrder() {

    closeModal(
        "successModal"
    );

    const id =
        localStorage.getItem(
            STORAGE.lastOrder
        );

    const order =
        orders.find(
            o => o.id === id
        );


    if (!order) {

        toast(
            "Order not found.",
            "error"
        );

        return;
    }


    renderMyOrder(
        order
    );

    openModal(
        "orderModal"
    );

}


function renderMyOrder(order) {

    const statusClass =
        getStatusClass(
            order.orderStatus
        );


    document.getElementById(
        "myOrderDetails"
    ).innerHTML = `

        <div class="order-admin-card">

            <div class="order-admin-header">

                <strong>
                    ${escapeHTML(order.id)}
                </strong>

                <span class="status-badge ${statusClass}">
                    ${escapeHTML(order.orderStatus)}
                </span>

            </div>


            <p>
                <strong>Customer:</strong>
                ${escapeHTML(order.customer.name)}
            </p>

            <p>
                <strong>Phone:</strong>
                ${escapeHTML(order.customer.phone)}
            </p>

            <p>
                <strong>Address:</strong>
                ${escapeHTML(order.customer.address)},
                ${escapeHTML(order.customer.city)}
            </p>


            <div class="order-admin-items">

                ${
                    order.items.map(
                        item =>
                            `${escapeHTML(item.name)}
                             × ${item.quantity}
                             = ${money(item.total)}`
                    ).join("<br>")
                }

            </div>


            <p>
                <strong>Payment:</strong>
                ${escapeHTML(order.paymentStatus)}
            </p>


            <div class="order-total">
                Total: ${money(order.total)}
            </div>


            <div class="admin-actions"
                 style="margin-top:15px">

                <button
                    class="primary-btn"
                    onclick="openReceipt('${order.id}')">

                    <i class="fa-solid fa-file-invoice"></i>
                    Receipt

                </button>

            </div>

        </div>

    `;

}


/* =========================================================
   ADMIN LOGIN
   ========================================================= */

function openAdminLogin() {

    if (isAdmin) {

        openAdmin();

        return;
    }


    document.getElementById(
        "adminPasswordInput"
    ).value = "";


    openModal(
        "adminLoginModal"
    );

}


function adminLogin() {

    const password =
        document.getElementById(
            "adminPasswordInput"
        ).value;


    if (
        password !==
        settings.adminPassword
    ) {

        toast(
            "Incorrect admin password.",
            "error"
        );

        return;
    }


    isAdmin = true;

    closeModal(
        "adminLoginModal"
    );

    openAdmin();

    addLog(
        "Admin Login"
    );

}


function openAdmin() {

    renderAdmin();

    openModal(
        "adminModal"
    );

}


function adminLogout() {

    isAdmin = false;

    closeModal(
        "adminModal"
    );

    toast(
        "Admin logged out."
    );

}


/* =========================================================
   ADMIN NAVIGATION
   ========================================================= */

function showAdminSection(section) {

    document
        .querySelectorAll(
            ".admin-section"
        )
        .forEach(
            el =>
                el.classList.remove(
                    "active"
                )
        );


    const target =
        document.getElementById(
            "admin-" + section
        );


    if (target)
        target.classList.add(
            "active"
        );


    document
        .querySelectorAll(
            ".admin-nav"
        )
        .forEach(
            btn => {

                btn.classList.toggle(
                    "active",
                    btn.dataset.adminSection ===
                    section
                );

            }
        );


    const titles = {

        dashboard:
            "Dashboard",

        products:
            "Product Management",

        orders:
            "Order Management",

        customers:
            "Customers",

        coupons:
            "Coupons",

        settings:
            "Store Settings",

        data:
            "Data & Backup"

    };


    document.getElementById(
        "adminSectionTitle"
    ).textContent =
        titles[section] ||
        "Admin";


    if (section === "dashboard")
        renderAdminDashboard();

    if (section === "products")
        renderAdminProducts();

    if (section === "orders")
        renderAdminOrders();

    if (section === "customers")
        renderAdminCustomers();

    if (section === "coupons")
        renderAdminCoupons();

    if (section === "settings")
        fillSettingsForm();

    if (section === "data")
        renderActivityLog();

}


function renderAdmin() {

    renderAdminDashboard();

    renderAdminProducts();

    renderAdminOrders();

    renderAdminCustomers();

    renderAdminCoupons();

    renderActivityLog();

}


/* =========================================================
   ADMIN DASHBOARD
   ========================================================= */

function renderAdminDashboard() {

    document.getElementById(
        "statProducts"
    ).textContent =
        products.length;


    document.getElementById(
        "statOrders"
    ).textContent =
        orders.length;


    const revenue =
        orders
            .filter(
                o =>
                    o.paymentStatus ===
                    "Paid"
            )
            .reduce(
                (sum, order) =>
                    sum + order.total,
                0
            );


    document.getElementById(
        "statRevenue"
    ).textContent =
        money(revenue);


    const pending =
        orders.filter(
            o =>
                o.paymentStatus !==
                "Paid" &&
                o.orderStatus !==
                "Cancelled"
        ).length;


    document.getElementById(
        "statPending"
    ).textContent =
        pending;


    const recent =
        orders.slice(
            0,
            5
        );


    document.getElementById(
        "recentOrders"
    ).innerHTML =
        recent.length
        ?
        recent.map(
            order =>
                miniOrder(
                    order
                )
        ).join("")
        :
        `
            <div class="empty-state">
                No orders yet.
            </div>
        `;

}


function miniOrder(order) {

    return `

        <div class="order-admin-card">

            <div class="order-admin-header">

                <strong>
                    ${escapeHTML(order.id)}
                </strong>

                <span>
                    ${money(order.total)}
                </span>

            </div>

            <small>
                ${escapeHTML(order.customer.name)}
            </small>

            <br>

            <span class="status-badge">
                ${escapeHTML(order.orderStatus)}
            </span>

        </div>

    `;

}


/* =========================================================
   ADMIN PRODUCT MANAGEMENT
   ========================================================= */

function renderAdminProducts() {

    const container =
        document.getElementById(
            "adminProductList"
        );


    if (!products.length) {

        container.innerHTML = `
            <div class="empty-state">
                No products.
            </div>
        `;

        return;
    }


    container.innerHTML =
        products.map(
            product => `

                <div class="admin-product-row">

                    <img
                        src="${escapeHTML(product.image)}"
                        onerror="this.src='https://placehold.co/100x100/f6ead5/5b1020?text=B'">


                    <div>

                        <h4>
                            ${escapeHTML(product.name)}
                        </h4>

                        <small>
                            ${escapeHTML(product.category)}
                            •
                            ${money(product.price)}
                            •
                            Stock ${product.stock}
                        </small>

                        <br>

                        <span class="status-badge ${
                            product.visible !== false
                            ?
                            "paid"
                            :
                            "cancelled"
                        }">

                            ${
                                product.visible !== false
                                ?
                                "Visible"
                                :
                                "Hidden"
                            }

                        </span>

                    </div>


                    <div class="admin-actions">

                        <button
                            class="small-btn"
                            onclick="openProductEditor('${product.id}')">

                            Edit

                        </button>


                        <button
                            class="small-btn"
                            onclick="toggleProductVisibility('${product.id}')">

                            ${
                                product.visible !== false
                                ?
                                "Hide"
                                :
                                "Show"
                            }

                        </button>


                        <button
                            class="small-btn"
                            onclick="deleteProduct('${product.id}')">

                            Delete

                        </button>

                    </div>

                </div>

            `
        ).join("");

}


function openProductEditor(id = "") {

    document.getElementById(
        "productForm"
    ).reset();


    document.getElementById(
        "editProductId"
    ).value =
        id;


    if (!id) {

        document.getElementById(
            "productEditorTitle"
        ).textContent =
            "Add Product";

        document.getElementById(
            "productVisible"
        ).checked =
            true;

        openModal(
            "productEditorModal"
        );

        return;
    }


    const product =
        products.find(
            p => p.id === id
        );


    if (!product)
        return;


    document.getElementById(
        "productEditorTitle"
    ).textContent =
        "Edit Product";


    document.getElementById(
        "productName"
    ).value =
        product.name;


    document.getElementById(
        "productCategory"
    ).value =
        product.category;


    document.getElementById(
        "productPrice"
    ).value =
        product.price;


    document.getElementById(
        "productMRP"
    ).value =
        product.mrp || "";


    document.getElementById(
        "productStock"
    ).value =
        product.stock;


    document.getElementById(
        "productBadge"
    ).value =
        product.badge || "";


    document.getElementById(
        "productImage"
    ).value =
        product.image;


    document.getElementById(
        "productGallery"
    ).value =
        (product.gallery || [])
            .join(", ");


    document.getElementById(
        "productDescription"
    ).value =
        product.description || "";


    document.getElementById(
        "productMaterial"
    ).value =
        product.material || "";


    document.getElementById(
        "productSize"
    ).value =
        product.size || "";


    document.getElementById(
        "productVisible"
    ).checked =
        product.visible !== false;


    openModal(
        "productEditorModal"
    );

}


function saveProduct(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "editProductId"
        ).value;


    const productData = {

        name:
            document.getElementById(
                "productName"
            ).value.trim(),

        category:
            document.getElementById(
                "productCategory"
            ).value,

        price:
            Number(
                document.getElementById(
                    "productPrice"
                ).value
            ),

        mrp:
            Number(
                document.getElementById(
                    "productMRP"
                ).value
            ) || 0,

        stock:
            Number(
                document.getElementById(
                    "productStock"
                ).value
            ) || 0,

        badge:
            document.getElementById(
                "productBadge"
            ).value,

        image:
            document.getElementById(
                "productImage"
            ).value.trim(),

        gallery:
            document.getElementById(
                "productGallery"
            ).value
                .split(",")
                .map(
                    x => x.trim()
                )
                .filter(Boolean),

        description:
            document.getElementById(
                "productDescription"
            ).value.trim(),

        material:
            document.getElementById(
                "productMaterial"
            ).value.trim(),

        size:
            document.getElementById(
                "productSize"
            ).value.trim(),

        visible:
            document.getElementById(
                "productVisible"
            ).checked

    };


    if (!productData.name ||
        !productData.image) {

        toast(
            "Product name and image are required.",
            "error"
        );

        return;
    }


    if (id) {

        const product =
            products.find(
                p => p.id === id
            );

        if (product) {

            Object.assign(
                product,
                productData
            );

            addLog(
                "Product Updated",
                product.name
            );

        }

    } else {

        products.unshift({

            id:
                uid("PROD"),

            ...productData

        });


        addLog(
            "Product Added",
            productData.name
        );

    }


    saveData(
        STORAGE.products,
        products
    );


    closeModal(
        "productEditorModal"
    );


    renderProducts();

    renderAdminProducts();

    toast(
        "Product saved successfully."
    );

}


function deleteProduct(id) {

    const product =
        products.find(
            p => p.id === id
        );


    if (!product)
        return;


    if (
        !confirm(
            `Delete "${product.name}"?`
        )
    )
        return;


    products =
        products.filter(
            p => p.id !== id
        );


    cart =
        cart.filter(
            item =>
                item.productId !== id
        );


    wishlist =
        wishlist.filter(
            item => item !== id
        );


    saveData(
        STORAGE.products,
        products
    );

    saveData(
        STORAGE.cart,
        cart
    );

    saveData(
        STORAGE.wishlist,
        wishlist
    );


    renderProducts();

    renderCart();

    renderAdminProducts();

    updateCartCount();

    renderWishlistCount();


    addLog(
        "Product Deleted",
        product.name
    );

    toast(
        "Product deleted."
    );

}


function toggleProductVisibility(id) {

    const product =
        products.find(
            p => p.id === id
        );


    if (!product)
        return;


    product.visible =
        product.visible === false;


    saveData(
        STORAGE.products,
        products
    );


    renderProducts();

    renderAdminProducts();


    addLog(
        product.visible
        ?
        "Product Shown"
        :
        "Product Hidden",
        product.name
    );

}


/* =========================================================
   ADMIN ORDERS
   ========================================================= */

function renderAdminOrders() {

    const container =
        document.getElementById(
            "adminOrderList"
        );


    const filter =
        document.getElementById(
            "orderFilter"
        )?.value ||
        "All";


    let filtered =
        [...orders];


    if (
        filter !== "All"
    ) {

        filtered =
            filtered.filter(
                order =>
                    order.orderStatus ===
                    filter
            );

    }


    if (!filtered.length) {

        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-receipt"></i>
                <h3>No orders</h3>
            </div>
        `;

        return;
    }


    container.innerHTML =
        filtered.map(
            adminOrderCard
        ).join("");

}


function adminOrderCard(order) {

    return `

        <div class="order-admin-card">

            <div class="order-admin-header">

                <div>

                    <strong>
                        ${escapeHTML(order.id)}
                    </strong>

                    <br>

                    <small>
                        ${new Date(
                            order.createdAt
                        ).toLocaleString("en-IN")}
                    </small>

                </div>


                <div class="order-total">
                    ${money(order.total)}
                </div>

            </div>


            <p>
                <strong>Customer:</strong>
                ${escapeHTML(order.customer.name)}
            </p>

            <p>
                <strong>Phone:</strong>
                ${escapeHTML(order.customer.phone)}
            </p>


            <div class="order-admin-items">

                <strong>Items:</strong><br>

                ${
                    order.items.map(
                        item =>
                            `${escapeHTML(item.name)}
                             × ${item.quantity}
                             = ${money(item.total)}`
                    ).join("<br>")
                }

            </div>


            <p>
                <strong>Payment:</strong>

                <span class="status-badge ${
                    order.paymentStatus === "Paid"
                    ?
                    "paid"
                    :
                    ""
                }">

                    ${escapeHTML(order.paymentStatus)}

                </span>

            </p>


            <div class="admin-actions"
                 style="margin-top:12px">

                <select
                    class="status-select"
                    onchange="changeOrderStatus('${order.id}',this.value)">

                    ${
                        [
                            "Payment Pending",
                            "Payment Submitted",
                            "Order Placed",
                            "Processing",
                            "Shipped",
                            "Delivered",
                            "Completed",
                            "Cancelled"
                        ]
                        .map(
                            status =>
                                `
                                <option
                                    value="${status}"
                                    ${
                                        order.orderStatus === status
                                        ?
                                        "selected"
                                        :
                                        ""
                                    }>
                                    ${status}
                                </option>
                                `
                        )
                        .join("")
                    }

                </select>


                ${
                    order.paymentStatus !== "Paid"
                    ?
                    `
                    <button
                        class="primary-btn"
                        onclick="acceptPayment('${order.id}')">

                        <i class="fa-solid fa-check"></i>
                        Accept Payment & Place Order

                    </button>
                    `
                    :
                    ""
                }


                <button
                    class="small-btn"
                    onclick="openReceipt('${order.id}')">

                    Receipt

                </button>


                <button
                    class="small-btn"
                    onclick="notifyOwner('${order.id}')">

                    WhatsApp Owner

                </button>


                <button
                    class="small-btn"
                    onclick="deleteOrder('${order.id}')">

                    Remove

                </button>

            </div>

        </div>

    `;

}


function changeOrderStatus(id, status) {

    const order =
        orders.find(
            o => o.id === id
        );


    if (!order)
        return;


    order.orderStatus =
        status;

    order.updatedAt =
        new Date().toISOString();


    if (
        status ===
        "Order Placed"
    ) {

        if (
            order.paymentStatus !==
            "Paid"
        ) {

            order.paymentStatus =
                "Paid";

        }

    }


    if (
        status ===
        "Cancelled"
    ) {

        order.paymentStatus =
            "Cancelled";

    }


    saveData(
        STORAGE.orders,
        orders
    );


    renderAdmin();

    addLog(
        "Order Status Changed",
        `${order.id} → ${status}`
    );


    toast(
        `Order updated to ${status}.`
    );

}


function acceptPayment(id) {

    const order =
        orders.find(
            o => o.id === id
        );


    if (!order)
        return;


    if (
        order.paymentStatus ===
        "Paid"
    )
        return;


    order.paymentStatus =
        "Paid";

    order.orderStatus =
        "Order Placed";

    order.updatedAt =
        new Date().toISOString();


    /* REDUCE STOCK ONLY ONCE */

    order.items.forEach(
        item => {

            const product =
                products.find(
                    p =>
                        p.id ===
                        item.productId
                );

            if (product) {

                product.stock =
                    Math.max(
                        0,
                        product.stock -
                        item.quantity
                    );

            }

        }
    );


    saveData(
        STORAGE.orders,
        orders
    );

    saveData(
        STORAGE.products,
        products
    );


    addLog(
        "Payment Accepted",
        order.id
    );


    renderAdmin();

    renderProducts();


    toast(
        "Payment accepted. Order placed successfully."
    );


    notifyOwner(
        id,
        true
    );

}


function deleteOrder(id) {

    const order =
        orders.find(
            o => o.id === id
        );


    if (!order)
        return;


    if (
        !confirm(
            `Remove order ${order.id}?`
        )
    )
        return;


    orders =
        orders.filter(
            o => o.id !== id
        );


    saveData(
        STORAGE.orders,
        orders
    );


    renderAdmin();

    addLog(
        "Order Removed",
        order.id
    );

    toast(
        "Order removed."
    );

}


/* =========================================================
   WHATSAPP OWNER NOTIFICATION
   ========================================================= */

function notifyOwner(
    id,
    afterAccept = false
) {

    const order =
        orders.find(
            o => o.id === id
        );


    if (!order)
        return;


    const itemText =
        order.items
            .map(
                item =>
                    `${item.name} x ${item.quantity}`
            )
            .join(", ");


    const message =
        (
            afterAccept
            ?
            "✅ PAYMENT ACCEPTED & ORDER PLACED"
            :
            "🛍️ NEW STORE ORDER"
        ) +

        "\n\n" +

        `Order: ${order.id}` +

        "\n" +

        `Customer: ${order.customer.name}` +

        "\n" +

        `Phone: ${order.customer.phone}` +

        "\n" +

        `Items: ${itemText}` +

        "\n" +

        `Total: ${money(order.total)}` +

        "\n" +

        `Payment: ${order.paymentStatus}` +

        "\n" +

        `Status: ${order.orderStatus}`;


    const url =
        "https://wa.me/" +
        settings.whatsapp +
        "?text=" +
        encodeURIComponent(
            message
        );


    window.open(
        url,
        "_blank"
    );

}


/* =========================================================
   CUSTOMERS
   ========================================================= */

function renderAdminCustomers() {

    const container =
        document.getElementById(
            "adminCustomerList"
        );


    if (!customers.length) {

        container.innerHTML = `
            <div class="empty-state">
                No customers yet.
            </div>
        `;

        return;
    }


    container.innerHTML =
        customers.map(
            customer => {

                const customerOrders =
                    orders.filter(
                        order =>
                            order.customer.phone ===
                            customer.phone
                    );


                const spent =
                    customerOrders
                        .filter(
                            o =>
                                o.paymentStatus ===
                                "Paid"
                        )
                        .reduce(
                            (sum, o) =>
                                sum + o.total,
                            0
                        );


                return `

                    <div class="order-admin-card">

                        <strong>
                            ${escapeHTML(customer.name)}
                        </strong>

                        <p>
                            ${escapeHTML(customer.phone)}
                        </p>

                        <p>
                            ${escapeHTML(customer.address)}
                            ${escapeHTML(customer.city)}
                        </p>

                        <small>
                            Orders:
                            ${customerOrders.length}
                            •
                            Spent:
                            ${money(spent)}
                        </small>

                    </div>

                `;

            }
        ).join("");

}


/* =========================================================
   COUPONS
   ========================================================= */

function renderAdminCoupons() {

    const container =
        document.getElementById(
            "adminCouponList"
        );


    if (!coupons.length) {

        container.innerHTML =
            `<div class="empty-state">
                No coupons.
            </div>`;

        return;
    }


    container.innerHTML =
        coupons.map(
            coupon => `

                <div class="admin-product-row">

                    <div class="admin-logo">
                        <i class="fa-solid fa-ticket"></i>
                    </div>

                    <div>

                        <h4>
                            ${escapeHTML(coupon.code)}
                        </h4>

                        <small>
                            ${coupon.percent}% discount
                        </small>

                    </div>

                    <button
                        class="small-btn"
                        onclick="deleteCoupon('${escapeHTML(coupon.code)}')">

                        Delete

                    </button>

                </div>

            `
        ).join("");

}


function addCoupon(event) {

    event.preventDefault();


    const code =
        document.getElementById(
            "newCouponCode"
        ).value
            .trim()
            .toUpperCase();


    const percent =
        Number(
            document.getElementById(
                "newCouponPercent"
            ).value
        );


    if (!code || percent <= 0)
        return;


    if (
        coupons.some(
            c => c.code === code
        )
    ) {

        toast(
            "Coupon already exists.",
            "error"
        );

        return;
    }


    coupons.push({

        code,

        percent,

        active: true

    });


    saveData(
        STORAGE.coupons,
        coupons
    );


    event.target.reset();

    renderAdminCoupons();

    addLog(
        "Coupon Added",
        code
    );

    toast(
        "Coupon added."
    );

}


function deleteCoupon(code) {

    coupons =
        coupons.filter(
            c => c.code !== code
        );


    saveData(
        STORAGE.coupons,
        coupons
    );


    renderAdminCoupons();

    toast(
        "Coupon deleted."
    );

}


/* =========================================================
   RECEIPT
   ========================================================= */

function openReceipt(id) {

    const order =
        orders.find(
            o => o.id === id
        );


    if (!order)
        return;


    currentReceiptOrderId =
        id;


    const rows =
        order.items.map(
            item => `

                <tr>

                    <td>
                        ${escapeHTML(item.name)}
                    </td>

                    <td>
                        ${item.quantity}
                    </td>

                    <td>
                        ${money(item.price)}
                    </td>

                    <td>
                        ${money(item.total)}
                    </td>

                </tr>

            `
        ).join("");


    document.getElementById(
        "receiptContent"
    ).innerHTML = `

        <div class="receipt-paper">

            <div class="receipt-header">

                <h2>
                    ${escapeHTML(settings.storeName)}
                </h2>

                <p>
                    ${escapeHTML(settings.address)}
                </p>

                <p>
                    Contact: ${escapeHTML(settings.phone)}
                </p>

            </div>


            <div class="receipt-info">

                <div>

                    <strong>Order ID</strong>
                    <br>
                    ${escapeHTML(order.id)}

                </div>


                <div>

                    <strong>Date</strong>
                    <br>
                    ${new Date(
                        order.createdAt
                    ).toLocaleString("en-IN")}

                </div>


                <div>

                    <strong>Customer</strong>
                    <br>
                    ${escapeHTML(order.customer.name)}

                </div>


                <div>

                    <strong>Phone</strong>
                    <br>
                    ${escapeHTML(order.customer.phone)}

                </div>


                <div>

                    <strong>Address</strong>
                    <br>
                    ${escapeHTML(order.customer.address)},
                    ${escapeHTML(order.customer.city)}

                </div>


                <div>

                    <strong>Payment</strong>
                    <br>
                    ${escapeHTML(order.paymentStatus)}

                </div>

            </div>


            <table class="receipt-table">

                <thead>

                    <tr>

                        <th>Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>

                    </tr>

                </thead>


                <tbody>

                    ${rows}

                </tbody>

            </table>


            <div style="margin-top:15px">

                <div class="summary-line">

                    <span>Subtotal</span>

                    <strong>
                        ${money(order.subtotal)}
                    </strong>

                </div>


                <div class="summary-line">

                    <span>Shipping</span>

                    <strong>
                        ${
                            order.shipping === 0
                            ?
                            "FREE"
                            :
                            money(order.shipping)
                        }
                    </strong>

                </div>


                <div class="summary-line">

                    <span>Discount</span>

                    <strong>
                        -${money(order.discount)}
                    </strong>

                </div>

            </div>


            <div class="receipt-total">

                Grand Total:
                ${money(order.total)}

            </div>


            <div style="
                text-align:center;
                margin-top:25px;
                color:#777;
                font-size:10px;
            ">

                Thank you for shopping with us ❤️

            </div>

        </div>

    `;


    openModal(
        "receiptModal"
    );

}


function printReceipt() {

    const content =
        document.getElementById(
            "receiptContent"
        ).innerHTML;


    const printWindow =
        window.open(
            "",
            "_blank"
        );


    if (!printWindow) {

        toast(
            "Please allow popups to print receipt.",
            "error"
        );

        return;
    }


    printWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>
                Store Receipt
            </title>

            <style>

                body {
                    font-family: Arial, sans-serif;
                    padding: 25px;
                    background: white;
                    color: #222;
                }

                .receipt-paper {
                    max-width: 700px;
                    margin: auto;
                }

                .receipt-header {
                    text-align: center;
                    border-bottom: 1px dashed #999;
                    padding-bottom: 15px;
                }

                .receipt-header h2 {
                    color: #5b1020;
                }

                .receipt-header p {
                    font-size: 11px;
                }

                .receipt-info {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    padding: 20px 0;
                    font-size: 11px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 11px;
                }

                th, td {
                    padding: 8px;
                    border-bottom: 1px solid #ddd;
                    text-align: left;
                }

                .summary-line {
                    display: flex;
                    justify-content: space-between;
                    padding: 5px 0;
                }

                .receipt-total {
                    text-align: right;
                    color: #5b1020;
                    font-size: 18px;
                    font-weight: bold;
                    margin-top: 15px;
                }

            </style>

        </head>

        <body>

            ${content}

            <script>

                window.onload = function() {
                    window.print();
                };

            <\/script>

        </body>

        </html>

    `);


    printWindow.document.close();

}


/* =========================================================
   DATA BACKUP
   ========================================================= */

function exportData() {

    const backup = {

        version:
            "1.0",

        exportedAt:
            new Date().toISOString(),

        settings,

        products,

        orders,

        customers,

        coupons,

        wishlist,

        cart,

        logs

    };


    const blob =
        new Blob(
            [
                JSON.stringify(
                    backup,
                    null,
                    2
                )
            ],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const a =
        document.createElement(
            "a"
        );


    a.href = url;

    a.download =
        "waghmare-bangles-store-backup.json";

    a.click();


    URL.revokeObjectURL(
        url
    );


    addLog(
        "Store Data Exported"
    );

    toast(
        "Backup downloaded."
    );

}


function importData(event) {

    const file =
        event.target.files[0];


    if (!file)
        return;


    const reader =
        new FileReader();


    reader.onload =
        function(e) {

            try {

                const data =
                    JSON.parse(
                        e.target.result
                    );


                if (
                    !data.products ||
                    !data.settings
                ) {

                    throw new Error(
                        "Invalid backup"
                    );

                }


                settings =
                    data.settings;

                products =
                    data.products;

                orders =
                    data.orders || [];

                customers =
                    data.customers || [];

                coupons =
                    data.coupons || [];

                wishlist =
                    data.wishlist || [];

                cart =
                    data.cart || [];

                logs =
                    data.logs || [];


                saveAll();

                applySettings();

                renderProducts();

                renderCart();

                updateCartCount();

                renderWishlistCount();

                renderAdmin();


                addLog(
                    "Store Data Imported"
                );


                toast(
                    "Backup imported successfully."
                );

            } catch (error) {

                console.error(error);

                toast(
                    "Invalid backup file.",
                    "error"
                );

            }

        };


    reader.readAsText(
        file
    );

    event.target.value = "";

}


function clearStoreData() {

    if (
        !confirm(
            "This will reset products, orders and settings to the default demo data. Continue?"
        )
    )
        return;


    localStorage.removeItem(
        STORAGE.settings
    );

    localStorage.removeItem(
        STORAGE.products
    );

    localStorage.removeItem(
        STORAGE.orders
    );

    localStorage.removeItem(
        STORAGE.customers
    );

    localStorage.removeItem(
        STORAGE.coupons
    );

    localStorage.removeItem(
        STORAGE.wishlist
    );

    localStorage.removeItem(
        STORAGE.cart
    );

    localStorage.removeItem(
        STORAGE.logs
    );


    location.reload();

}


/* =========================================================
   ACTIVITY LOG
   ========================================================= */

function renderActivityLog() {

    const container =
        document.getElementById(
            "activityLog"
        );


    if (!logs.length) {

        container.innerHTML =
            `<div class="empty-state">
                No activity yet.
            </div>`;

        return;
    }


    container.innerHTML =
        logs.map(
            log => `

                <div class="log-row">

                    <strong>
                        ${escapeHTML(log.action)}
                    </strong>

                    ${
                        log.details
                        ?
                        " — " +
                        escapeHTML(log.details)
                        :
                        ""
                    }

                    <br>

                    <small>
                        ${escapeHTML(log.time)}
                    </small>

                </div>

            `
        ).join("");

}


/* =========================================================
   STORE LOCATION
   ========================================================= */

function openStoreLocation() {

    window.open(
        settings.mapUrl,
        "_blank"
    );

}


/* =========================================================
   STATUS HELPERS
   ========================================================= */

function getStatusClass(status) {

    if (
        status ===
        "Delivered" ||
        status ===
        "Completed"
    )
        return "paid";


    if (
        status ===
        "Shipped"
    )
        return "shipped";


    if (
        status ===
        "Cancelled"
    )
        return "cancelled";


    return "";

}


/* =========================================================
   STORAGE SYNC
   ========================================================= */

window.addEventListener(
    "storage",
    event => {

        if (!event.key)
            return;


        if (
            Object.values(
                STORAGE
            ).includes(
                event.key
            )
        ) {

            settings =
                loadData(
                    STORAGE.settings,
                    DEFAULT_SETTINGS
                );

            products =
                loadData(
                    STORAGE.products,
                    DEFAULT_PRODUCTS
                );

            orders =
                loadData(
                    STORAGE.orders,
                    []
                );

            customers =
                loadData(
                    STORAGE.customers,
                    []
                );

            coupons =
                loadData(
                    STORAGE.coupons,
                    []
                );

            wishlist =
                loadData(
                    STORAGE.wishlist,
                    []
                );

            cart =
                loadData(
                    STORAGE.cart,
                    []
                );


            applySettings();

            renderProducts();

            renderCart();

            updateCartCount();

            renderWishlistCount();

            renderAdmin();

        }

    }
);


/* =========================================================
   ESC KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        )
            return;


        document
            .querySelectorAll(
                ".modal.active"
            )
            .forEach(
                modal =>
                    modal.classList
                        .remove("active")
            );


        closeCart();

    }
);


/* =========================================================
   PREVENT ACCIDENTAL FORM SUBMISSION
   ========================================================= */

document.addEventListener(
    "submit",
    event => {

        /* handled by individual forms */

    }
);


/* =========================================================
   END
   ========================================================= */