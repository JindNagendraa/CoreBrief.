var API_KEY = "a7a883b730d372fabc02bdc5952b7b0c";
var BASE_URL = "https://gnews.io/api/v4";
var FAVORITES_KEY = "corebrief-favorites";
var THEME_KEY = "corebrief-theme";

var sampleNews = [
  {
    title: "India markets open steady as investors track global cues",
    description: "Analysts expect cautious movement across sectors while traders watch earnings updates and policy signals.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    url: "#",
    publishedAt: "2026-04-01T07:00:00Z",
    source: { name: "CoreBrief Desk" }
  },
  {
    title: "New smartphone launches push competition in the technology space",
    description: "Brands are focusing on AI tools, better cameras, and battery life as buyers compare premium and mid-range devices.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    url: "#",
    publishedAt: "2026-04-01T08:30:00Z",
    source: { name: "Tech Watch" }
  },
  {
    title: "Cricket fans gear up for a packed week of major matches",
    description: "Teams continue adjusting combinations as tournament pressure builds and supporters follow every update closely.",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
    url: "#",
    publishedAt: "2026-04-01T09:15:00Z",
    source: { name: "SportsLine" }
  },
  {
    title: "Health experts encourage simple daily habits for better well-being",
    description: "Doctors say small routines like sleep, hydration, and walking can have a strong long-term impact.",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
    url: "#",
    publishedAt: "2026-04-01T05:40:00Z",
    source: { name: "Healthy Living" }
  },
  {
    title: "Streaming platforms compete with fresh entertainment releases",
    description: "Studios and online platforms are planning bigger release calendars to keep audiences engaged throughout the month.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    url: "#",
    publishedAt: "2026-04-01T10:20:00Z",
    source: { name: "Entertainment Beat" }
  },
  {
    title: "Business leaders focus on hiring and growth plans for the new quarter",
    description: "Several companies are reviewing investments, expansion, and cost strategies as demand patterns shift.",
    image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
    url: "#",
    publishedAt: "2026-04-01T06:10:00Z",
    source: { name: "Market Pulse" }
  }
];

var appState = {
  news: [],
  category: "general",
  searchText: "",
  sortType: "latest",
  searchTimer: null
};

var heroTitle = document.getElementById("heroTitle");
var heroDescription = document.getElementById("heroDescription");
var heroButton = document.getElementById("heroButton");
var trendingNews = document.getElementById("trendingNews");
var newsGrid = document.getElementById("newsGrid");
var latestHeadlines = document.getElementById("latestHeadlines");
var favoritesGrid = document.getElementById("favoritesGrid");
var favoritesMessage = document.getElementById("favoritesMessage");
var statusMessage = document.getElementById("statusMessage");
var searchForm = document.getElementById("searchForm");
var searchInput = document.getElementById("searchInput");
var categoryNav = document.getElementById("categoryNav");
var sortSelect = document.getElementById("sortSelect");
var modeToggle = document.getElementById("modeToggle");

function setStatus(text, type, showLoading) {
  var spinner = "";

  if (showLoading) {
    spinner = '<span class="loading-spinner"></span>';
  }

  statusMessage.innerHTML = spinner + "<span>" + text + "</span>";
  statusMessage.className = "status-message";

  if (type === "error") {
    statusMessage.classList.add("status-error");
  }

  if (type === "success") {
    statusMessage.classList.add("status-success");
  }
}

function showLoading(text) {
  setStatus(text, "loading", true);
}

function showError(text) {
  setStatus(text, "error", false);
}

function showSuccess(text) {
  setStatus(text, "success", false);
}

function formatDate(dateText) {
  var date = new Date(dateText);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function debounce(callback, delay) {
  return function () {
    clearTimeout(appState.searchTimer);

    appState.searchTimer = setTimeout(function () {
      callback();
    }, delay);
  };
}

function getImage(article) {
  if (article.image) {
    return article.image;
  }

  return "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80";
}

function getSourceName(article) {
  if (article.source && article.source.name) {
    return article.source.name;
  }

  return "Unknown Source";
}

function getFavorites() {
  var stored = localStorage.getItem(FAVORITES_KEY);

  if (!stored) {
    return [];
  }

  return JSON.parse(stored);
}

function saveFavorites(list) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
}

function isFavorite(url) {
  var favorites = getFavorites();

  return favorites.some(function (item) {
    return item.url === url;
  });
}

function addToFavorites(article) {
  var favorites = getFavorites();
  var alreadySaved = favorites.some(function (item) {
    return item.url === article.url;
  });

  if (!alreadySaved) {
    favorites.push(article);
    saveFavorites(favorites);
  }
}

function removeFromFavorites(url) {
  var favorites = getFavorites();
  var updatedFavorites = favorites.filter(function (item) {
    return item.url !== url;
  });

  saveFavorites(updatedFavorites);
}

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    modeToggle.textContent = "Light Mode";
  } else {
    document.body.classList.remove("dark-mode");
    modeToggle.textContent = "Dark Mode";
  }
}

function loadTheme() {
  var savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme("light");
  }
}

function toggleTheme() {
  var newTheme = "light";

  if (!document.body.classList.contains("dark-mode")) {
    newTheme = "dark";
  }

  localStorage.setItem(THEME_KEY, newTheme);
  applyTheme(newTheme);
}

function updateHero(article) {
  if (!article) {
    heroTitle.textContent = "Stay updated with the latest headlines.";
    heroDescription.textContent = "CoreBrief highlights the top stories in one simple place.";
    heroButton.href = "#";
    return;
  }

  heroTitle.textContent = article.title || "Top Story";
  heroDescription.textContent = article.description || "Read the latest update on CoreBrief.";
  heroButton.href = article.url || "#";
}

function getSaveButtonHtml(article, isFavoritesArea) {
  if (isFavoritesArea) {
    return '<button class="remove-btn" data-remove="' + article.url + '">Remove</button>';
  }

  if (isFavorite(article.url)) {
    return '<button class="save-btn saved-btn" type="button" disabled>Saved</button>';
  }

  return '<button class="save-btn" data-save="' + article.url + '">Save</button>';
}

function createCardHtml(article, isFavoritesArea) {
  var image = getImage(article);
  var source = getSourceName(article);
  var date = formatDate(article.publishedAt);
  var title = article.title || "Latest News";
  var description = article.description || "No description available.";
  var link = article.url || "#";
  var actionButton = getSaveButtonHtml(article, isFavoritesArea);

  return '<article class="news-card">' +
    '<img src="' + image + '" alt="' + title + '">' +
    '<div class="card-content">' +
    '<p class="card-meta">' + source + " • " + date + "</p>" +
    '<h3 class="card-title">' + title + "</h3>" +
    '<p class="card-description">' + description + "</p>" +
    '<div class="card-actions">' +
    '<a class="news-link" href="' + link + '" target="_blank" rel="noopener noreferrer">Read More</a>' +
    actionButton +
    "</div>" +
    "</div>" +
    "</article>";
}

function createHeadlineHtml(article) {
  var title = article.title || "Latest headline";
  var source = getSourceName(article);

  return '<div class="headline-item">' +
    "<h4>" + title + "</h4>" +
    "<p>" + source + "</p>" +
    "</div>";
}

function filterNews(newsList) {
  if (appState.searchText === "") {
    return newsList;
  }

  return newsList.filter(function (article) {
    var title = article.title || "";
    var description = article.description || "";
    var fullText = title + " " + description;

    return fullText.toLowerCase().includes(appState.searchText.toLowerCase());
  });
}

function sortNews(newsList) {
  var sortedList = newsList.slice();

  sortedList.sort(function (a, b) {
    if (appState.sortType === "oldest") {
      return new Date(a.publishedAt) - new Date(b.publishedAt);
    }

    if (appState.sortType === "title") {
      var titleA = a.title || "";
      var titleB = b.title || "";
      return titleA.localeCompare(titleB);
    }

    return new Date(b.publishedAt) - new Date(a.publishedAt);
  });

  return sortedList;
}

function getVisibleNews() {
  var filteredList = filterNews(appState.news);
  var sortedList = sortNews(filteredList);

  return sortedList;
}

function renderTrending(newsList) {
  var trendingList = newsList.slice(0, 3);
  var cardsHtml = trendingList.map(function (article) {
    return createCardHtml(article, false);
  });

  trendingNews.innerHTML = cardsHtml.join("");
}

function renderMainNews(newsList) {
  var cardsHtml = newsList.map(function (article) {
    return createCardHtml(article, false);
  });

  newsGrid.innerHTML = cardsHtml.join("");
}

function renderHeadlines(newsList) {
  var headlineList = newsList.slice(0, 6);
  var headlinesHtml = headlineList.map(function (article) {
    return createHeadlineHtml(article);
  });

  if (headlinesHtml.length === 0) {
    latestHeadlines.innerHTML = '<p class="empty-message">No headlines available.</p>';
  } else {
    latestHeadlines.innerHTML = headlinesHtml.join("");
  }
}

function renderFavorites() {
  var favorites = getFavorites();
  var favoritesHtml = favorites.map(function (article) {
    return createCardHtml(article, true);
  });

  favoritesGrid.innerHTML = favoritesHtml.join("");

  if (favorites.length === 0) {
    favoritesMessage.style.display = "block";
  } else {
    favoritesMessage.style.display = "none";
  }
}

function renderAllNews() {
  var visibleNews = getVisibleNews();

  if (visibleNews.length === 0) {
    showError("No matching articles found. Showing the available news instead.");
    visibleNews = sortNews(appState.news);
  }

  updateHero(visibleNews[0]);
  renderTrending(visibleNews);
  renderMainNews(visibleNews);
  renderHeadlines(visibleNews);
  renderFavorites();
}

function setNews(newsList) {
  if (newsList && newsList.length > 0) {
    appState.news = newsList;
  } else {
    appState.news = sampleNews;
  }

  renderAllNews();
}

function buildTopNewsUrl(category) {
  var url = BASE_URL + "/top-headlines?country=in&lang=en&max=10&apikey=" + API_KEY;

  if (category && category !== "general") {
    url = url + "&category=" + category;
  }

  return url;
}

function buildSearchUrl(word) {
  return BASE_URL + "/search?q=" + encodeURIComponent(word) + "&lang=en&country=in&max=10&apikey=" + API_KEY;
}

function loadNewsFromApi(url, loadingText) {
  showLoading(loadingText);

  fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed");
      }

      return response.json();
    })
    .then(function (data) {
      if (data.articles && data.articles.length > 0) {
        setNews(data.articles);
        showSuccess("News loaded successfully.");
      } else {
        setNews(sampleNews);
        showError("No results found right now. Showing sample news.");
      }
    })
    .catch(function () {
      setNews(sampleNews);
      showError("Something went wrong while loading news. Showing sample news.");
    });
}

function loadCategoryNews(category) {
  var url = buildTopNewsUrl(category);

  appState.category = category;
  appState.searchText = "";
  searchInput.value = "";

  loadNewsFromApi(url, "Loading news...");
}

function loadSearchNews(word) {
  var url = buildSearchUrl(word);

  appState.searchText = word;
  appState.category = "";

  loadNewsFromApi(url, "Searching news...");
}

function setActiveCategory(category) {
  var buttons = Array.from(categoryNav.querySelectorAll(".category-btn"));

  buttons.forEach(function (button) {
    var buttonCategory = button.getAttribute("data-category");

    if (buttonCategory === category) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

function findArticle(url, list) {
  return list.find(function (article) {
    return article.url === url;
  });
}

function saveArticle(url) {
  var article = findArticle(url, appState.news);

  if (article) {
    addToFavorites(article);
    renderAllNews();
  }
}

function removeArticle(url) {
  removeFromFavorites(url);
  renderAllNews();
}

function handleSubmitSearch(event) {
  var word;

  event.preventDefault();
  word = searchInput.value.trim();

  if (word === "") {
    setActiveCategory(appState.category);
    loadCategoryNews(appState.category || "general");
    return;
  }

  setActiveCategory("");
  loadSearchNews(word);
}

function runDebouncedSearch() {
  var word = searchInput.value.trim();

  if (word === "") {
    return;
  }

  setActiveCategory("");
  loadSearchNews(word);
}

var handleTypingSearch = debounce(runDebouncedSearch, 500);

function handleCategoryClick(event) {
  var button = event.target.closest(".category-btn");
  var category;

  if (!button) {
    return;
  }

  category = button.getAttribute("data-category");
  setActiveCategory(category);
  loadCategoryNews(category);
}

function handleSortChange() {
  appState.sortType = sortSelect.value;
  renderAllNews();
}

function handlePageClick(event) {
  var saveButton = event.target.closest("[data-save]");
  var removeButton = event.target.closest("[data-remove]");

  if (saveButton) {
    saveArticle(saveButton.getAttribute("data-save"));
  }

  if (removeButton) {
    removeArticle(removeButton.getAttribute("data-remove"));
  }
}

function addEventListeners() {
  searchForm.addEventListener("submit", handleSubmitSearch);
  searchInput.addEventListener("input", handleTypingSearch);
  categoryNav.addEventListener("click", handleCategoryClick);
  sortSelect.addEventListener("change", handleSortChange);
  modeToggle.addEventListener("click", toggleTheme);
  document.addEventListener("click", handlePageClick);
}

function startApp() {
  loadTheme();
  renderFavorites();
  setNews(sampleNews);
  setActiveCategory("general");
  addEventListeners();
  loadCategoryNews("general");
}

startApp();
