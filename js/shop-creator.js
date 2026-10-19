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

  // Mobile navigation
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

  // Hero carousel
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

  // Product search and filters
  const searchInput = $("#searchInput");
  const productCards = $$(".product-card");
  let selectedFilter = "all";
  const filterProducts = () => {
    const query = (searchInput?.value || "").trim().toLocaleLowerCase();
    let visible = 0;
    productCards.forEach(card => {
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
    selectedFilter = link.dataset.category === "watch" ? "watch" : link.dataset.category === "smart" ? "smart" : "all";
    $$(".filter-pill").forEach(pill => pill.classList.toggle("is-selected", pill.dataset.filter === selectedFilter));
    filterProducts();
  }));

  // Local demo shopping bag. This is not connected to a server or payment service.
  const storageKey = "creator-shop-demo-cart-v1";
  let cart = [];
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (Array.isArray(saved)) cart = saved.filter(item => item && typeof item.name === "string" && Number.isFinite(Number(item.price)));
  } catch (_) { cart = []; }

  const formatMoney = value => "$" + Number(value).toLocaleString("en-US", { maximumFractionDigits: 2 });
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

  $$(".quick-add").forEach(button => button.addEventListener("click", () => {
    const name = button.dataset.product || "Product";
    const price = Number(button.dataset.price || 0);
    const existing = cart.find(item => item.name === name);
    if (existing) existing.qty += 1;
    else cart.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name, price, qty: 1 });
    saveCart();
    toast("Added to your bag");
  }));
  renderCart();

  // Newsletter demo feedback only; no data is sent anywhere.
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