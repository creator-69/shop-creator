(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const toast = (message) => {
    const node = $("#toast");
    if (!node) return;
    node.textContent = message;
    node.classList.add("show");
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(() => node.classList.remove("show"), 2300);
  };


  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");
  menuToggle?.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  $$(".nav-link", mainNav || document).forEach(link => link.addEventListener("click", () => {
    mainNav?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }));

  const heroSlides = $$(".hero-slide");
  let heroIndex = 0;
  const paintHero = (nextIndex) => {
    if (!heroSlides.length) return;
    heroIndex = (nextIndex + heroSlides.length) % heroSlides.length;
    heroSlides.forEach((slide, index) => slide.classList.toggle("is-active", index === heroIndex));
    const count = $("#heroCount");
    if (count) count.textContent = `${String(heroIndex + 1).padStart(2, "0")} / ${String(heroSlides.length).padStart(2, "0")}`;
  };
  $("#heroPrev")?.addEventListener("click", () => paintHero(heroIndex - 1));
  $("#heroNext")?.addEventListener("click", () => paintHero(heroIndex + 1));
  let heroTimer = window.setInterval(() => paintHero(heroIndex + 1), 5500);
  $(".hero-visual")?.addEventListener("mouseenter", () => window.clearInterval(heroTimer));
  $(".hero-visual")?.addEventListener("mouseleave", () => {
    window.clearInterval(heroTimer);
    heroTimer = window.setInterval(() => paintHero(heroIndex + 1), 5500);
  });

  

  // Curated demo catalog. Product photography is loaded from Unsplash; replace with licensed product-specific images before commercial use.
  // Prices are indicative marketplace references, not a live Digikala feed; verify before selling.
  const products = [
    { id:"samsung-galaxy-watch6-44", name:"Samsung Galaxy Watch6 44mm", category:"watch", tag:"CONNECTED", detail:"Smartwatch · 44 mm display", price:10900000, image:"https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=85" },
    { id:"huawei-watch-fit-3", name:"Huawei Watch Fit 3", category:"watch", tag:"FITNESS PICK", detail:"Fitness watch · AMOLED display", price:7500000, image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85" },
    { id:"xiaomi-redmi-watch-5-lite", name:"Xiaomi Redmi Watch 5 Lite", category:"watch", tag:"EVERYDAY", detail:"Smartwatch · AMOLED display · Bluetooth calls", price:10490000, image:"https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=900&q=85" },
    { id:"xiaomi-smart-band-9", name:"Xiaomi Smart Band 9", category:"watch", tag:"LIGHTWEIGHT", detail:"Fitness band · activity tracking", price:3200000, image:"https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=900&q=85" },
    { id:"amazfit-bip-5", name:"Amazfit Bip 5", category:"watch", tag:"SMART PICK", detail:"Smartwatch · calls and health tools", price:4800000, image:"https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=85" },
    { id:"haylou-solar-neo", name:"Haylou Solar Neo", category:"watch", tag:"OUTDOOR", detail:"Smartwatch · everyday tracking", price:2800000, image:"https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=85" },
    { id:"modyo-st12", name:"Modyo ST12", category:"watch", tag:"FEATURED", detail:"Smartwatch · large display", price:10300000, image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85" },
    { id:"skmei-1838", name:"SKMEI 1838 RGWT", category:"watch", tag:"MINIMAL", detail:"Digital wristwatch · casual style", price:1600000, image:"https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85" },
    { id:"g9-ultra-pro", name:"G9 Ultra Pro", category:"watch", tag:"VALUE PICK", detail:"Smartwatch · sport-inspired design", price:1100000, image:"https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=900&q=85" },
    { id:"alain-delon-ad354-1546", name:"Alain Delon AD354-1546", category:"watch", tag:"THE CLASSIC", detail:"Classic wristwatch · everyday style", price:6800000, image:"https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=85" },
    { id:"anker-soundcore-r50i", name:"Anker Soundcore R50i", category:"smart", tag:"AUDIO PICK", detail:"Wireless earbuds · USB-C · no ANC", price:2490000, image:"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=85" },
    { id:"anker-soundcore-r50i-nc", name:"Anker Soundcore R50i NC", category:"smart", tag:"NOISE CONTROL", detail:"Wireless earbuds · noise cancelling", price:3210000, image:"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=85" },
    { id:"air40-sound", name:"AIR40 Sound", category:"smart", tag:"BUDGET PICK", detail:"Wireless earbuds · compact case", price:490000, image:"https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=85" },
    { id:"p47-wireless-headphones", name:"P47 Wireless Headphones", category:"smart", tag:"ENTRY LEVEL", detail:"Wireless on-ear headphones", price:800000, image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85" },
    { id:"samsung-galaxy-buds4-pro", name:"Samsung Galaxy Buds4 Pro", category:"smart", tag:"PREMIUM AUDIO", detail:"Wireless earbuds · premium audio", price:31490000, image:"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=85" },
    { id:"apple-airpods-pro-3", name:"Apple AirPods Pro 3", category:"smart", tag:"PREMIUM PICK", detail:"Wireless earbuds · active noise control", price:37650990, image:"https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?auto=format&fit=crop&w=900&q=85" },
    { id:"jbl-clip-5", name:"JBL Clip 5", category:"smart", tag:"PORTABLE SOUND", detail:"Portable Bluetooth speaker · clip design", price:8167700, image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85" },
    { id:"jbl-go-4", name:"JBL Go 4", category:"smart", tag:"COMPACT AUDIO", detail:"Portable Bluetooth speaker · compact body", price:7999000, image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85" },
    { id:"xiaomi-sound-pocket", name:"Xiaomi Sound Pocket", category:"smart", tag:"SMALL BUT MIGHTY", detail:"Portable Bluetooth speaker", price:3068010, image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85" },
    { id:"m3-portable-speaker", name:"M3 Portable Speaker", category:"smart", tag:"BUDGET AUDIO", detail:"Compact 4W Bluetooth speaker", price:474000, image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85" },
    { id:"jbl-flip-7", name:"JBL Flip 7", category:"smart", tag:"RUGGED SOUND", detail:"Portable Bluetooth speaker · outdoor use", price:21345500, image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85" },
    { id:"xiaomi-sound-outdoor", name:"Xiaomi Sound Outdoor", category:"smart", tag:"OUTDOOR AUDIO", detail:"Portable Bluetooth speaker", price:10600000, image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85" },
    { id:"baseus-20w-charger", name:"Baseus 20W USB-C Charger", category:"accessory", tag:"DAILY ESSENTIAL", detail:"USB-C wall charger · compact design", price:850000, image:"https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=85" },
    { id:"power-bank-20000", name:"20,000mAh Power Bank", category:"accessory", tag:"ON THE GO", detail:"Portable battery · multi-device charging", price:2200000, image:"https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=85" },
    { id:"usb-c-cable", name:"Braided USB-C Cable", category:"accessory", tag:"SMALL UPGRADE", detail:"USB-C charging cable · braided finish", price:280000, image:"https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=format&fit=crop&w=900&q=85" },
    { id:"everyday-tech-pouch", name:"Everyday Tech Pouch", category:"accessory", tag:"STAY ORGANIZED", detail:"Accessory pouch · cable and gadget storage", price:950000, image:"https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=900&q=85" },
    { id:"laptop-sleeve-14", name:"14-inch Laptop Sleeve", category:"accessory", tag:"WORKDAY READY", detail:"Protective sleeve · fits many 14-inch laptops", price:1200000, image:"https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=900&q=85" },
    { id:"foldable-phone-stand", name:"Foldable Phone Stand", category:"accessory", tag:"DESK ESSENTIAL", detail:"Adjustable stand · phone and small tablet", price:390000, image:"https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=85" },
    { id:"wireless-charging-pad", name:"Wireless Charging Pad", category:"accessory", tag:"CLEAN SETUP", detail:"Qi-style wireless charging pad", price:790000, image:"https://images.unsplash.com/photo-1591290619762-c588a4e2a9c5?auto=format&fit=crop&w=900&q=85" },
    { id:"compact-backpack", name:"Compact Everyday Backpack", category:"accessory", tag:"READY TO GO", detail:"Everyday bag · tech-friendly storage", price:1850000, image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85" }
  ];

  const productGrid = $("#productGrid");
  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[character]);
  const renderProductCatalog = () => {
    if (!productGrid) return;
    productGrid.innerHTML = products.map(product => `
      <article class="product-card" data-product-id="${product.id}" data-category="${product.category}" data-name="${escapeHtml(product.name + " " + product.detail)}" data-price="${product.price}">
        <div class="product-image">
          <span class="product-tag">${escapeHtml(product.tag)}</span>
          <div class="product-placeholder" aria-label="Image placeholder">
            <span>ADD PRODUCT IMAGE</span>
            <code>${escapeHtml(product.image)}</code>
          </div>
          <img class="catalog-product-image" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">
          <button class="quick-add" type="button" data-product="${escapeHtml(product.name)}" data-price="${product.price}">Add to bag <span>+</span></button>
        </div>
        <div class="product-meta">
          <div><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.detail)}</p></div>
          <strong>${formatMoney(product.price)}</strong>
        </div>
      </article>`).join("");
    $(".catalog-product-image", productGrid).forEach(image => {
      const markMissing = () => {
        image.hidden = true;
        image.parentElement.classList.add("is-placeholder");
      };
      image.addEventListener("error", markMissing, { once: true });
      image.addEventListener("load", () => image.parentElement.classList.remove("is-placeholder"), { once: true });
      if (image.complete && image.naturalWidth === 0) markMissing();
    });
    $(".quick-add", productGrid).forEach(button => button.addEventListener("click", addToCart));
    const collectionCount = $(".collection-bottom > span:first-child");
    if (collectionCount) collectionCount.textContent = `${products.length} curated pieces`;
  };

  const searchInput = $("#searchInput");
  const formatMoney = value => Number(value).toLocaleString("en-US") + " تومان";
  const productCards = () => $(".product-card", productGrid || document);

  let selectedFilter = "all";
  const filterProducts = () => {
    const query = (searchInput?.value || "").trim().toLocaleLowerCase();
    let visible = 0;
    productCards().forEach(card => {
      const matchesCategory = selectedFilter === "all" || card.dataset.category === selectedFilter;
      const matchesQuery = !query || (card.dataset.name || "").toLocaleLowerCase().includes(query);
      const show = matchesCategory && matchesQuery;
      card.hidden = !show;
      if (show) visible++;
    });
    const noResults = $("#noResults");
    if (noResults) noResults.hidden = visible !== 0;
  };
  searchInput?.addEventListener("input", filterProducts);
  $("#searchForm")?.addEventListener("submit", event => {
    event.preventDefault();
    filterProducts();
    $("#products")?.scrollIntoView({ behavior: "smooth" });
  });
  $$(".filter-pill").forEach(button => button.addEventListener("click", () => {
    selectedFilter = button.dataset.filter || "all";
    $$(".filter-pill").forEach(pill => pill.classList.toggle("is-selected", pill === button));
    filterProducts();
  }));
  $$("[data-category]", $("#categories") || document).forEach(link => link.addEventListener("click", () => {
    selectedFilter = ["watch", "smart", "accessory"].includes(link.dataset.category) ? link.dataset.category : "all";
    $$(".filter-pill").forEach(pill => pill.classList.toggle("is-selected", pill.dataset.filter === selectedFilter));
    filterProducts();
  }));

  const storageKey = "creator-shop-demo-cart-v2";
  let cart = [];
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (Array.isArray(saved)) cart = saved.filter(item => item && typeof item.name === "string" && Number.isFinite(Number(item.price)));
  } catch (_) { cart = []; }


  const saveCart = () => {
    try { localStorage.setItem(storageKey, JSON.stringify(cart)); } catch (_) { /* private browsing may block storage */ }
    renderCart();
  };
  const renderCart = () => {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const countNode = $("#cartCount");
    const drawerCount = $("#drawerCount");
    const subtotalNode = $("#cartSubtotal");
    const itemsNode = $("#cartItems");
    if (countNode) countNode.textContent = String(count);
    if (drawerCount) drawerCount.textContent = `(${count})`;
    if (subtotalNode) subtotalNode.textContent = formatMoney(cart.reduce((sum, item) => sum + item.price * item.qty, 0));
    if (!itemsNode) return;
    if (!cart.length) {
      itemsNode.innerHTML = '<p class="cart-empty">Your bag is waiting for something good.</p>';
      return;
    }
    itemsNode.replaceChildren();
    cart.forEach(item => {
      const row = document.createElement("div");
      row.className = "cart-item";
      const details = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = item.name;
      const price = document.createElement("p");
      price.textContent = `${formatMoney(item.price)} · Qty ${item.qty}`;
      details.append(title, price);
      const remove = document.createElement("button");
      remove.className = "remove-item";
      remove.type = "button";
      remove.textContent = "Remove";
      remove.setAttribute("aria-label", `Remove ${item.name}`);
      remove.addEventListener("click", () => {
        cart = cart.filter(entry => entry.id !== item.id);
        saveCart();
      });
      row.append(details, remove);
      itemsNode.append(row);
    });
  };

  const drawer = $("#cartDrawer");
  const backdrop = $("#drawerBackdrop");
  const setDrawer = (open) => {
    drawer?.classList.toggle("is-open", open);
    backdrop?.classList.toggle("is-open", open);
    drawer?.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("drawer-open", open);
    if (open) $("#cartClose")?.focus();
  };
  $("#cartButton")?.addEventListener("click", () => setDrawer(true));
  $("#cartClose")?.addEventListener("click", () => setDrawer(false));
  $("#continueShopping")?.addEventListener("click", () => setDrawer(false));
  backdrop?.addEventListener("click", () => setDrawer(false));
  document.addEventListener("keydown", event => { if (event.key === "Escape") setDrawer(false); });

  function addToCart(event) {
    const button = event.currentTarget;
    const name = button.dataset.product || "Product";
    const price = Number(button.dataset.price || 0);
    const existing = cart.find(item => item.name === name);
    if (existing) existing.qty += 1;
    else cart.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name, price, qty: 1 });
    saveCart();
    toast("Added to your bag");
  }
  renderProductCatalog();
  renderCart();
  $("#newsletterForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const email = $("#newsletterEmail");
    const message = $("#newsletterMessage");
    if (!email?.checkValidity()) { email?.reportValidity(); return; }
    if (message) message.textContent = "Thanks! This demo form does not send or store your email.";
    email.value = "";
  });

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();