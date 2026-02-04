// Элементы DOM
const ratingButton = document.getElementById("ratingButton");
const mainDropdown = document.getElementById("mainDropdown");
const categoryTitle = document.getElementById("categoryTitle");
const categoryDescription = document.getElementById("categoryDescription");
const ratingContent = document.getElementById("ratingContent");

// Элементы авторизации
const authBtn = document.getElementById("authBtn");
const authDropdown = document.getElementById("authDropdown");
const authForm = document.getElementById("authForm");
const submitBtn = document.getElementById("submitBtn");
const authSwitchLink = document.getElementById("authSwitchLink");
const authSwitchText = document.getElementById("authSwitchText");

// Кнопки главного меню
const menBtn = document.getElementById("menBtn");
const juniorsMenBtn = document.getElementById("juniorsMenBtn");
const womenBtn = document.getElementById("womenBtn");
const juniorsWomenBtn = document.getElementById("juniorsWomenBtn");

// Данные для весовых категорий
const weightCategories = {
  men: ["60", "65", "70", "75", "80", "85", "90", "95", "100", "100+"],
  "juniors-men": [
    "60",
    "65",
    "70",
    "75",
    "80",
    "85",
    "90",
    "95",
    "100",
    "100+",
  ],
  women: ["50", "55", "60", "65", "70", "70+"],
  "juniors-women": ["50", "55", "60", "65", "70", "70+"],
};

// Названия категорий
const categoryNames = {
  men: "Мужчины",
  "juniors-men": "Юниоры",
  women: "Женщины",
  "juniors-women": "Юниорки",
};

// Текущее состояние
let currentCategory = null;
let currentWeight = null;
let activeSubmenu = null;
let isMenuOpen = false;
let isAuthMenuOpen = false;
let isLoggedIn = false;
let isRegisterMode = false;
let currentUser = null;

// Открытие/закрытие главного меню
ratingButton.addEventListener("click", function (event) {
  event.stopPropagation();
  mainDropdown.classList.toggle("active");
  ratingButton.classList.toggle("active");
  isMenuOpen = mainDropdown.classList.contains("active");

  // Закрываем все подменю и форму авторизации
  closeAllSubmenus();
  authDropdown.classList.remove("active");
  isAuthMenuOpen = false;
});

// Открытие/закрытие формы авторизации
authBtn.addEventListener("click", function (event) {
  event.stopPropagation();

  if (isLoggedIn) {
    // Если авторизован - показываем профиль
    showProfilePopup();
  } else {
    // Если не авторизован - показываем форму
    authDropdown.classList.toggle("active");
    isAuthMenuOpen = authDropdown.classList.contains("active");

    // Закрываем меню рейтинга
    mainDropdown.classList.remove("active");
    ratingButton.classList.remove("active");
    isMenuOpen = false;
    closeAllSubmenus();
  }
});

// Переключение между входом и регистрацией
authSwitchLink.addEventListener("click", function (event) {
  event.preventDefault();

  isRegisterMode = !isRegisterMode;

  if (isRegisterMode) {
    submitBtn.textContent = "Зарегистрироваться";
    authDropdown.querySelector("h4").textContent = "Регистрация";
    authSwitchText.textContent = "Уже есть аккаунт?";
    authSwitchLink.textContent = "Войти";
  } else {
    submitBtn.textContent = "Войти";
    authDropdown.querySelector("h4").textContent = "Вход / Регистрация";
    authSwitchText.textContent = "Нет аккаунта?";
    authSwitchLink.textContent = "Зарегистрироваться";
  }
});

// Обработка формы авторизации/регистрации
authForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("authEmail").value;
  const password = document.getElementById("authPassword").value;

  if (!email || !password) {
    alert("Заполните все поля");
    return;
  }

  if (!email.includes("@")) {
    alert("Введите корректный email");
    return;
  }

  // Имитация успешной авторизации/регистрации
  const userName = email.split("@")[0];
  currentUser = {
    name: userName.charAt(0).toUpperCase() + userName.slice(1),
    email: email,
    rating: Math.floor(Math.random() * 1000) + 1500,
    rank: ["3р", "2р", "1р", "КМС", "МС"][Math.floor(Math.random() * 5)],
    weightCategory: ["70 кг", "75 кг", "80 кг", "85 кг", "90 кг"][
      Math.floor(Math.random() * 5)
    ],
  };

  isLoggedIn = true;
  isRegisterMode = false;

  // Обновляем UI
  updateAuthUI();

  // Закрываем форму
  authDropdown.classList.remove("active");
  isAuthMenuOpen = false;

  // Очищаем поля
  document.getElementById("authEmail").value = "";
  document.getElementById("authPassword").value = "";

  // Показываем сообщение
  const action = isRegisterMode ? "регистрации" : "авторизации";
  alert(`Успешная ${action}!\nДобро пожаловать, ${currentUser.name}!`);
});

// Обновление интерфейса после авторизации
function updateAuthUI() {
  if (isLoggedIn) {
    // Меняем кнопку на "Профиль" с красной рамкой
    authBtn.textContent = "Профиль";
    authBtn.classList.add("profile");

    // Сохраняем в localStorage
    localStorage.setItem("armforce_user", JSON.stringify(currentUser));
  } else {
    // Возвращаем кнопку "Авторизация"
    authBtn.textContent = "Авторизация";
    authBtn.classList.remove("profile");

    // Удаляем из localStorage
    localStorage.removeItem("armforce_user");
  }
}

// Показ попапа профиля
function showProfilePopup() {
  if (!currentUser) return;

  const profileInfo = `
        👤 Профиль пользователя
        
        Имя: ${currentUser.name}
        Email: ${currentUser.email}
        Рейтинг: ${currentUser.rating} очков
        Разряд: ${currentUser.rank}
        Весовая категория: ${currentUser.weightCategory}
        
        Хотите выйти из системы?
    `;

  if (confirm(profileInfo)) {
    // Выход из системы
    isLoggedIn = false;
    currentUser = null;
    updateAuthUI();
    alert("Вы вышли из системы");
  }
}

// Проверка сохраненной сессии при загрузке
document.addEventListener("DOMContentLoaded", function () {
  const savedUser = localStorage.getItem("armforce_user");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    isLoggedIn = true;
    updateAuthUI();
  }
});

// Функция создания подменю
function createSubmenu(category, colorClass, button) {
  // Закрываем предыдущее подменю
  closeAllSubmenus();

  const submenu = document.createElement("div");
  submenu.className = `sub-dropdown ${colorClass}`;

  weightCategories[category].forEach((weight) => {
    const weightBtn = document.createElement("button");
    weightBtn.className = `weight-item ${colorClass}`;
    weightBtn.textContent = `${weight} кг`;
    weightBtn.dataset.weight = weight;
    weightBtn.dataset.category = category;

    weightBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      selectWeightCategory(category, weight);

      // Закрываем все меню
      mainDropdown.classList.remove("active");
      ratingButton.classList.remove("active");
      isMenuOpen = false;
      submenu.remove();
    });

    submenu.appendChild(weightBtn);
  });

  // Позиционируем подменю СПРАВА от кнопки
  const rect = button.getBoundingClientRect();
  submenu.style.left = `${rect.right}px`;
  submenu.style.top = `${rect.top + window.scrollY}px`;

  document.body.appendChild(submenu);
  submenu.classList.add("active");
  activeSubmenu = submenu;

  return submenu;
}

// Обработка наведения на категории
function setupCategoryHover(button, category, colorClass) {
  button.addEventListener("mouseenter", function () {
    if (isMenuOpen) {
      createSubmenu(category, colorClass, button);
    }
  });

  button.addEventListener("click", function (event) {
    event.stopPropagation();
    createSubmenu(category, colorClass, button);
  });
}

// Настройка кнопок категорий
setupCategoryHover(menBtn, "men", "blue");
setupCategoryHover(juniorsMenBtn, "juniors-men", "blue");
setupCategoryHover(womenBtn, "women", "red");
setupCategoryHover(juniorsWomenBtn, "juniors-women", "red");

// Выбор весовой категории
function selectWeightCategory(category, weight) {
  currentCategory = category;
  currentWeight = weight;

  const isRed = category === "women" || category === "juniors-women";
  const colorClass = isRed ? "red" : "blue";
  const color = isRed ? "#dc2626" : "#2563eb";

  // Обновляем текст кнопки
  ratingButton.innerHTML = `${categoryNames[category]} ${weight}кг <i class="fas fa-chevron-down"></i>`;

  // Обновляем заголовок
  categoryTitle.textContent = `${categoryNames[category]} ${weight}кг`;
  categoryTitle.style.color = color;

  categoryDescription.textContent = `Рейтинг сильнейших армрестлеров в категории ${categoryNames[category]} ${weight}кг`;

  // Показываем рейтинг с женскими именами для женских категорий
  showRatingData(category, weight, colorClass, color);
}

// Функция показа данных рейтинга
function showRatingData(category, weight, colorClass, color) {
  // Разные данные для мужских и женских категорий
  let athletes = [];

  if (category === "women" || category === "juniors-women") {
    // Женские имена
    athletes = [
      { name: "Иванова Анна", rating: 2450, rank: "МС" },
      { name: "Петрова Елена", rating: 2380, rank: "КМС" },
      { name: "Сидорова Мария", rating: 2300, rank: "1р" },
      { name: "Смирнова Ольга", rating: 2250, rank: "2р" },
      { name: "Кузнецова Татьяна", rating: 2180, rank: "3р" },
      { name: "Васильева Ирина", rating: 2150, rank: "КМС" },
      { name: "Попова Наталья", rating: 2100, rank: "1р" },
      { name: "Соколова Юлия", rating: 2050, rank: "2р" },
      { name: "Лебедева Светлана", rating: 2000, rank: "3р" },
      { name: "Козлова Екатерина", rating: 1950, rank: "КМС" },
    ];
  } else {
    // Мужские имена
    athletes = [
      { name: "Иванов Иван", rating: 2450, rank: "МС" },
      { name: "Петров Петр", rating: 2380, rank: "КМС" },
      { name: "Сидоров Алексей", rating: 2300, rank: "1р" },
      { name: "Смирнов Дмитрий", rating: 2250, rank: "2р" },
      { name: "Кузнецов Сергей", rating: 2180, rank: "3р" },
      { name: "Васильев Андрей", rating: 2150, rank: "КМС" },
      { name: "Попов Михаил", rating: 2100, rank: "1р" },
      { name: "Соколов Антон", rating: 2050, rank: "2р" },
      { name: "Лебедев Владимир", rating: 2000, rank: "3р" },
      { name: "Козлов Николай", rating: 1950, rank: "КМС" },
    ];
  }

  let html = "";

  athletes.forEach((athlete, index) => {
    // Генерация инициалов для фото
    const initials = athlete.name
      .split(" ")
      .map((n) => n[0])
      .join("");

    html += `
            <div class="rating-item">
                <div class="rating-number ${colorClass}">${index + 1}</div>
                <div class="athlete-photo">${initials}</div>
                <div class="athlete-info">
                    <div class="athlete-name">${athlete.name}</div>
                    <div>
                        <span class="athlete-rank">${athlete.rank}</span>
                    </div>
                </div>
                <div class="rating-score ${colorClass}">${athlete.rating}</div>
            </div>
        `;
  });

  ratingContent.innerHTML = html;
}

// Функция закрытия всех подменю
function closeAllSubmenus() {
  if (activeSubmenu) {
    activeSubmenu.remove();
    activeSubmenu = null;
  }
}

// Закрытие всех меню при клике вне их
document.addEventListener("click", function (event) {
  // Проверяем клик по элементам меню рейтинга
  const isClickInRatingMenu =
    mainDropdown.contains(event.target) ||
    ratingButton.contains(event.target) ||
    (activeSubmenu && activeSubmenu.contains(event.target)) ||
    event.target.closest(".category-item");

  if (!isClickInRatingMenu) {
    mainDropdown.classList.remove("active");
    ratingButton.classList.remove("active");
    isMenuOpen = false;
    closeAllSubmenus();
  }

  // Проверяем клик по элементам авторизации
  const isClickInAuth =
    authDropdown.contains(event.target) || authBtn.contains(event.target);

  if (!isClickInAuth) {
    authDropdown.classList.remove("active");
    isAuthMenuOpen = false;
  }
});

// Закрытие меню при нажатии Esc
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    mainDropdown.classList.remove("active");
    ratingButton.classList.remove("active");
    isMenuOpen = false;
    closeAllSubmenus();

    authDropdown.classList.remove("active");
    isAuthMenuOpen = false;
  }
});

// Обработка ухода мыши с подменю
document.addEventListener("mouseover", function (event) {
  if (
    activeSubmenu &&
    !activeSubmenu.contains(event.target) &&
    !event.target.closest(".category-item")
  ) {
    setTimeout(() => {
      if (activeSubmenu && !activeSubmenu.matches(":hover")) {
        closeAllSubmenus();
      }
    }, 100);
  }
});
