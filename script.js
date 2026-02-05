const ratingButton = document.getElementById("ratingButton");
const mainDropdown = document.getElementById("mainDropdown");
const categoryTitle = document.getElementById("categoryTitle");
const categoryDescription = document.getElementById("categoryDescription");
const menBtn = document.getElementById("menBtn");
const juniorsMenBtn = document.getElementById("juniorsMenBtn");
const womenBtn = document.getElementById("womenBtn");
const juniorsWomenBtn = document.getElementById("juniorsWomenBtn");

// ПУСТЫЕ МАССИВЫ - все веса будут браться из JSON
const weightCategories = {
  men: [],
  "juniors-men-14-15": [],
  "juniors-men-16-18": [],
  "juniors-men-19-21": [],
  women: [],
  "juniors-women-14-15": [],
  "juniors-women-16-18": [],
  "juniors-women-19-21": [],
};

const categoryDisplayNames = {
  men: "Мужчины",
  "juniors-men-14-15": "Юниоры 14-15 лет",
  "juniors-men-16-18": "Юниоры 16-18 лет",
  "juniors-men-19-21": "Юниоры 19-21 лет",
  women: "Женщины",
  "juniors-women-14-15": "Юниорки 14-15 лет",
  "juniors-women-16-18": "Юниорки 16-18 лет",
  "juniors-women-19-21": "Юниорки 19-21 лет",
};

const categoryShortNames = {
  men: "Мужчины",
  "juniors-men-14-15": "Юниоры 14-15",
  "juniors-men-16-18": "Юниоры 16-18",
  "juniors-men-19-21": "Юниоры 19-21",
  women: "Женщины",
  "juniors-women-14-15": "Юниорки 14-15",
  "juniors-women-16-18": "Юниорки 16-18",
  "juniors-women-19-21": "Юниорки 19-21",
};

let currentCategory = null;
let currentWeight = null;
let activeSubmenu = null;
let activeAgeSubmenu = null;
let isMenuOpen = false;
let ratingData = null;

async function loadRatingData() {
  try {
    console.log("📥 Загружаю данные рейтинга...");
    showLoading();

    // Для GitHub Pages
    const response = await fetch("./data/rating.json?v=" + Date.now());
    if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

    ratingData = await response.json();
    console.log("✅ Данные загружены");
    updateLastUpdatedTime();
    hideLoading();
  } catch (error) {
    console.error("❌ Ошибка:", error);
    showError();
  }
}

function showLoading() {
  const left = document.getElementById("leftHandRating");
  const right = document.getElementById("rightHandRating");

  if (left && right) {
    left.innerHTML = `<div class="placeholder"><div class="loading-spinner"></div><p>Загрузка...</p></div>`;
    right.innerHTML = `<div class="placeholder"><div class="loading-spinner"></div><p>Загрузка...</p></div>`;
  }
}

function hideLoading() {
  const left = document.getElementById("leftHandRating");
  const right = document.getElementById("rightHandRating");

  if (left && right && left.innerHTML.includes("loading-spinner")) {
    left.innerHTML = `
      <div class="placeholder">
        <i class="fas fa-hand-point-left" style="font-size: 32px; margin-bottom: 15px; color: #4d4d4d;"></i>
        <p>Выберите категорию для отображения рейтинга левой руки</p>
      </div>
    `;
    right.innerHTML = `
      <div class="placeholder">
        <i class="fas fa-hand-point-right" style="font-size: 32px; margin-bottom: 15px; color: #4d4d4d;"></i>
        <p>Выберите категорию для отображения рейтинга правой руки</p>
      </div>
    `;
  }
}

function showError() {
  const left = document.getElementById("leftHandRating");
  const right = document.getElementById("rightHandRating");

  if (left && right) {
    left.innerHTML = `
      <div class="placeholder">
        <i class="fas fa-exclamation-triangle" style="color: #ff9900; font-size: 32px;"></i>
        <p>Ошибка загрузки</p>
        <button onclick="loadRatingData()" class="retry-button">Повторить</button>
      </div>
    `;
    right.innerHTML = left.innerHTML;
  }
}

function updateLastUpdatedTime() {
  if (!ratingData || !ratingData.last_updated) return;

  let timeElement = document.getElementById("lastUpdatedTime");
  if (!timeElement) {
    timeElement = document.createElement("div");
    timeElement.id = "lastUpdatedTime";
    timeElement.className = "last-updated";
    document.querySelector(".content").appendChild(timeElement);
  }
  timeElement.textContent = `Обновлено: ${ratingData.last_updated}`;
}

function showRatingForCategory(category, weight) {
  if (!ratingData || !ratingData.categories || !ratingData.categories[category]) {
    console.warn("Нет данных для:", category);
    showNoData();
    return;
  }

  const categoryWeights = ratingData.categories[category];
  if (!categoryWeights[weight]) {
    console.warn(`Нет веса ${weight} в ${category}`);
    showNoData();
    return;
  }

  const data = categoryWeights[weight];
  const isRed = category.includes("women") || category.includes("juniors-women");
  const colorClass = isRed ? "red" : "blue";
  const color = isRed ? "#dc2626" : "#2563eb";

  ratingButton.innerHTML = `${categoryShortNames[category]} ${weight}кг <i class="fas fa-chevron-down"></i>`;
  categoryTitle.textContent = `${categoryDisplayNames[category]} ${weight}кг`;
  categoryTitle.style.color = color;
  categoryDescription.textContent = `Рейтинг в категории ${categoryDisplayNames[category]} ${weight}кг`;

  renderAthletes(data.left || [], "leftHandRating", colorClass);
  renderAthletes(data.right || [], "rightHandRating", colorClass);
}

function showNoData() {
  const left = document.getElementById("leftHandRating");
  const right = document.getElementById("rightHandRating");

  if (left && right) {
    left.innerHTML = `<div class="placeholder"><i class="fas fa-user-slash" style="font-size: 32px; color: #666;"></i><p>Нет данных</p></div>`;
    right.innerHTML = left.innerHTML;
  }
}

function renderAthletes(athletes, containerId, colorClass) {
  const container = document.getElementById(containerId);

  if (!athletes || athletes.length === 0) {
    container.innerHTML = `<div class="placeholder"><i class="fas fa-user-slash" style="font-size: 32px; color: #666;"></i><p>Нет спортсменов</p></div>`;
    return;
  }

  let html = "";

  athletes.forEach((athlete, index) => {
    // ПУТЬ К ФОТО для GitHub Pages
    const baseName = athlete.name.replace(/ /g, "_");
    const photoVariants = [
      `./photos/${baseName}.jpg`,
      `./photos/${baseName}.jpeg`,
      `./photos/${baseName}.png`,
      `./photos/${baseName.replace(/ё/g, 'е')}.jpg`,
    ];

    // Инициалы для фолбэка
    const nameParts = athlete.name.split(" ");
    let initials = "";
    if (nameParts.length >= 2) {
      initials = (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    } else if (nameParts.length === 1) {
      initials = nameParts[0].substring(0, 2).toUpperCase();
    }

    // Разряд
    let rankText = athlete.rank || "";

    html += `
      <div class="rating-item">
        <div class="rating-number ${colorClass}">${index + 1}</div>
        <div class="athlete-photo">
          <img src="${photoVariants[0]}" alt="${athlete.name}" 
               class="athlete-photo-img"
               onerror="
                 this.onerror = null;
                 this.src = '${photoVariants[1]}';
               ">
          <div class="photo-fallback" style="display: none;">${initials}</div>
        </div>
        <div class="athlete-info">
          <div class="athlete-name">${athlete.name}</div>
          <div class="athlete-rank">${rankText}</div>
        </div>
        <div class="rating-score ${colorClass}">${athlete.rating}</div>
      </div>
    `;
  });

  container.innerHTML = html;
  
  // После загрузки проверяем фото
  setTimeout(() => {
    const imgs = container.querySelectorAll('.athlete-photo-img');
    imgs.forEach(img => {
      if (!img.complete || img.naturalHeight === 0) {
        const parent = img.parentElement;
        const fallback = parent.querySelector('.photo-fallback');
        if (fallback) {
          img.style.display = 'none';
          fallback.style.display = 'flex';
          fallback.style.alignItems = 'center';
          fallback.style.justifyContent = 'center';
          fallback.style.width = '100%';
          fallback.style.height = '100%';
          fallback.style.fontSize = '18px';
          fallback.style.color = '#aaaaaa';
        }
      }
    });
  }, 100);
}

ratingButton.addEventListener("click", function (event) {
  event.stopPropagation();
  mainDropdown.classList.toggle("active");
  ratingButton.classList.toggle("active");
  isMenuOpen = mainDropdown.classList.contains("active");
  closeAllSubmenus();
});

function createWeightSubmenu(category, colorClass, button) {
  closeAllSubmenus();
  const submenu = document.createElement("div");
  submenu.className = `sub-dropdown ${colorClass}`;

  // Берем веса сначала из weightCategories, если пусто - из JSON
  let weights = weightCategories[category] || [];
  if (weights.length === 0 && ratingData && ratingData.categories[category]) {
    weights = Object.keys(ratingData.categories[category]);
    // Сортируем веса: сначала числовые, потом с плюсом
    weights.sort((a, b) => {
      const aNum = parseInt(a.replace('+', '')) || 0;
      const bNum = parseInt(b.replace('+', '')) || 0;
      if (a.endsWith('+') && !b.endsWith('+')) return 1;
      if (!a.endsWith('+') && b.endsWith('+')) return -1;
      return aNum - bNum;
    });
  }

  weights.forEach((weight) => {
    const weightBtn = document.createElement("button");
    weightBtn.className = `weight-item ${colorClass}`;
    weightBtn.textContent = `${weight} кг`;
    weightBtn.dataset.weight = weight;
    weightBtn.dataset.category = category;

    weightBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      currentCategory = category;
      currentWeight = weight;
      showRatingForCategory(category, weight);
      mainDropdown.classList.remove("active");
      ratingButton.classList.remove("active");
      isMenuOpen = false;
      submenu.remove();
      if (activeAgeSubmenu) activeAgeSubmenu.remove();
    });

    submenu.appendChild(weightBtn);
  });

  const rect = button.getBoundingClientRect();
  submenu.style.left = `${rect.right}px`;
  submenu.style.top = `${rect.top + window.scrollY}px`;
  document.body.appendChild(submenu);
  submenu.classList.add("active");
  activeSubmenu = submenu;
  return submenu;
}

function createAgeSubmenu(categoryType, colorClass, button) {
  if (activeAgeSubmenu) activeAgeSubmenu.remove();
  const ageSubmenu = document.createElement("div");
  ageSubmenu.className = `age-dropdown ${colorClass}`;

  const ageGroups = categoryType === "juniors-men" 
    ? ["14-15 лет", "16-18 лет", "19-21 лет"]
    : ["14-15 лет", "16-18 лет", "19-21 лет"];

  ageGroups.forEach((ageGroup) => {
    const ageBtn = document.createElement("button");
    ageBtn.className = `age-item ${colorClass}`;
    ageBtn.textContent = ageGroup;
    const ageKey = ageGroup.replace(" лет", "").replace("-", "_");
    const categoryKey = `${categoryType}-${ageKey.replace("_", "-")}`;
    ageBtn.dataset.category = categoryKey;
    ageBtn.dataset.ageGroup = ageGroup;

    ageBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      createWeightSubmenu(categoryKey, colorClass, button);
      ageSubmenu.remove();
      activeAgeSubmenu = null;
    });

    ageSubmenu.appendChild(ageBtn);
  });

  const rect = button.getBoundingClientRect();
  ageSubmenu.style.left = `${rect.right}px`;
  ageSubmenu.style.top = `${rect.top + window.scrollY}px`;
  document.body.appendChild(ageSubmenu);
  ageSubmenu.classList.add("active");
  activeAgeSubmenu = ageSubmenu;
  return ageSubmenu;
}

function setupCategoryHover(button, category, colorClass) {
  button.addEventListener("mouseenter", function () {
    if (isMenuOpen) {
      if (category === "juniors-men" || category === "juniors-women") {
        createAgeSubmenu(category, colorClass, button);
      } else {
        createWeightSubmenu(category, colorClass, button);
      }
    }
  });

  button.addEventListener("click", function (event) {
    event.stopPropagation();
    if (category === "juniors-men" || category === "juniors-women") {
      createAgeSubmenu(category, colorClass, button);
    } else {
      createWeightSubmenu(category, colorClass, button);
    }
  });
}

setupCategoryHover(menBtn, "men", "blue");
setupCategoryHover(juniorsMenBtn, "juniors-men", "blue");
setupCategoryHover(womenBtn, "women", "red");
setupCategoryHover(juniorsWomenBtn, "juniors-women", "red");

function closeAllSubmenus() {
  if (activeSubmenu) {
    activeSubmenu.remove();
    activeSubmenu = null;
  }
  if (activeAgeSubmenu) {
    activeAgeSubmenu.remove();
    activeAgeSubmenu = null;
  }
}

document.addEventListener("click", function (event) {
  const isClickInRatingMenu =
    mainDropdown.contains(event.target) ||
    ratingButton.contains(event.target) ||
    (activeSubmenu && activeSubmenu.contains(event.target)) ||
    (activeAgeSubmenu && activeAgeSubmenu.contains(event.target)) ||
    event.target.closest(".category-item") ||
    event.target.closest(".age-item") ||
    event.target.closest(".weight-item");

  if (!isClickInRatingMenu) {
    mainDropdown.classList.remove("active");
    ratingButton.classList.remove("active");
    isMenuOpen = false;
    closeAllSubmenus();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    mainDropdown.classList.remove("active");
    ratingButton.classList.remove("active");
    isMenuOpen = false;
    closeAllSubmenus();
  }
});

// Проверка для отладки
console.log("ArmForce рейтинг загружен");
console.log("GitHub Pages путь:", window.location.href);

document.addEventListener("DOMContentLoaded", function () {
  loadRatingData();
  setInterval(loadRatingData, 5 * 60 * 1000);
});
