const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRegex = /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/;

function setFieldError(field, message) {
  const wrapper = field.closest(".form-field");
  const error = document.querySelector(`[data-error-for="${field.id}"]`);

  wrapper?.classList.toggle("has-error", Boolean(message));

  if (error) {
    error.textContent = message;
    error.className = `field-message ${message ? "is-error" : ""}`;
  }
}

function setFeedback(element, message, type) {
  if (!element) return;
  element.textContent = message;
  element.className = `form-feedback ${type ? `is-${type}` : ""}`;
}

function showToast(message) {
  const toast = document.querySelector("[data-toast]");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("is-visible");

  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}

function setupHeader() {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");

  if (header) {
    const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    document.body.classList.toggle("menu-open", isOpen);
  });

  menu.addEventListener("click", (event) => {
    const clickedLink = event.target.closest("a");
    if (!clickedLink) return;
    menu.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    document.body.classList.remove("menu-open");
  });
}

function setupRevealCards() {
  const cards = document.querySelectorAll(".reveal-card");

  if (!cards.length) return;

  if (!("IntersectionObserver" in window)) {
    cards.forEach((card) => card.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  cards.forEach((card) => observer.observe(card));
}

function setupNewsletterForm() {
  const form = document.querySelector("[data-newsletter-form]");
  const feedback = document.querySelector("[data-newsletter-feedback]");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = form.email.value.trim();

    if (!emailRegex.test(email)) {
      setFeedback(feedback, "Digite um e-mail válido. Exemplo: nome@dominio.com", "error");
      return;
    }

    setFeedback(feedback, "Cadastro simulado realizado com sucesso!", "success");
    form.reset();
  });
}

function setupCatalog() {
  const filters = document.querySelectorAll("[data-filter]");
  const products = document.querySelectorAll(".product-card[data-category]");
  const emptyState = document.querySelector("[data-empty-state]");
  const countElement = document.querySelector("[data-cart-count]");
  const modal = document.querySelector("[data-product-modal]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalDescription = document.querySelector("[data-modal-description]");
  const closeModal = document.querySelector("[data-close-modal]");
  let cartCount = Number(sessionStorage.getItem("petalaCartCount")) || 0;

  if (countElement) countElement.textContent = String(cartCount);

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      let visibleCount = 0;

      filters.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");

      products.forEach((product) => {
        const shouldShow = filter === "todos" || product.dataset.category === filter;
        product.classList.toggle("is-hidden", !shouldShow);
        if (shouldShow) visibleCount += 1;
      });

      if (emptyState) emptyState.hidden = visibleCount !== 0;
    });
  });

  document.querySelectorAll("[data-add-item]").forEach((button) => {
    button.addEventListener("click", () => {
      const product = button.closest(".product-card");
      const title = product?.querySelector("h3")?.textContent || "Produto";
      cartCount += 1;
      sessionStorage.setItem("petalaCartCount", String(cartCount));
      if (countElement) countElement.textContent = String(cartCount);
      button.textContent = "Adicionado";
      button.disabled = true;
      showToast(`${title} adicionado ao orçamento simulado.`);
    });
  });

  document.querySelectorAll("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!modal || !modalTitle || !modalDescription) return;
      modalTitle.textContent = button.dataset.title || "Produto";
      modalDescription.textContent = button.dataset.description || "Descrição indisponível.";

      if (typeof modal.showModal === "function") {
        modal.showModal();
      } else {
        alert(modalDescription.textContent);
      }
    });
  });

  closeModal?.addEventListener("click", () => modal?.close());

  modal?.addEventListener("click", (event) => {
    const rect = modal.getBoundingClientRect();
    const clickedOutside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (clickedOutside) modal.close();
  });
}

function setupContactForm() {
  const form = document.querySelector("[data-contact-form]");
  const feedback = document.querySelector("[data-contact-feedback]");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.name;
    const email = form.email;
    const phone = form.phone;
    const occasion = form.occasion;
    const message = form.message;
    let isValid = true;

    const validators = [
      [name, name.value.trim().length >= 3, "Informe seu nome com pelo menos 3 caracteres."],
      [email, emailRegex.test(email.value.trim()), "Digite um e-mail válido. Exemplo: nome@dominio.com"],
      [phone, phoneRegex.test(phone.value.trim()), "Informe um telefone válido com DDD. Exemplo: (47) 99999-9999"],
      [occasion, occasion.value !== "", "Selecione uma ocasião para o pedido."],
      [message, message.value.trim().length >= 12, "Descreva o pedido com pelo menos 12 caracteres."]
    ];

    validators.forEach(([field, valid, messageText]) => {
      setFieldError(field, valid ? "" : messageText);
      if (!valid) isValid = false;
    });

    if (!isValid) {
      setFeedback(feedback, "Revise os campos destacados antes de enviar.", "error");
      return;
    }

    setFeedback(feedback, "Solicitação simulada enviada com sucesso! Em um site real, a equipe retornaria seu contato.", "success");
    form.reset();
  });

  form.querySelectorAll("input, textarea, select").forEach((field) => {
    field.addEventListener("input", () => setFieldError(field, ""));
    field.addEventListener("change", () => setFieldError(field, ""));
  });
}

function setupAccordion() {
  const accordion = document.querySelector("[data-accordion]");
  if (!accordion) return;

  accordion.querySelectorAll(".accordion-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".accordion-item");
      const isOpen = item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });
}

function setupLoginForm() {
  const form = document.querySelector("[data-login-form]");
  const feedback = document.querySelector("[data-login-feedback]");
  const togglePassword = document.querySelector("[data-toggle-password]");
  const password = document.querySelector("#login-password");

  togglePassword?.addEventListener("click", () => {
    if (!password) return;
    const isPassword = password.type === "password";
    password.type = isPassword ? "text" : "password";
    togglePassword.textContent = isPassword ? "Ocultar" : "Mostrar";
    togglePassword.setAttribute("aria-label", isPassword ? "Ocultar senha" : "Mostrar senha");
  });

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = form.email;
    const passwordField = form.password;
    let isValid = true;

    if (!emailRegex.test(email.value.trim())) {
      setFieldError(email, "Digite um e-mail válido para continuar.");
      isValid = false;
    } else {
      setFieldError(email, "");
    }

    if (passwordField.value.trim().length < 6) {
      setFieldError(passwordField, "A senha precisa ter no mínimo 6 caracteres.");
      isValid = false;
    } else {
      setFieldError(passwordField, "");
    }

    if (!isValid) {
      setFeedback(feedback, "Não foi possível entrar. Corrija os campos destacados.", "error");
      return;
    }

    setFeedback(feedback, "Login simulado realizado com sucesso! Nenhum dado foi enviado.", "success");
    form.reset();
  });

  form.querySelectorAll("input").forEach((field) => {
    field.addEventListener("input", () => setFieldError(field, ""));
  });
}

setupHeader();
setupRevealCards();
setupNewsletterForm();
setupCatalog();
setupContactForm();
setupAccordion();
setupLoginForm();
