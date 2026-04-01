var API_KEY = "a7a883b730d372fabc02bdc5952b7b0c";
var BASE_URL = "https://gnews.io/api/v4";

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

var heroTitle = document.getElementById("heroTitle");
var heroDescription = document.getElementById("heroDescription");
var heroButton = document.getElementById("heroButton");
var trendingNews = document.getElementById("trendingNews");
var newsGrid = document.getElementById("newsGrid");
var latestHeadlines = document.getElementById("latestHeadlines");
var statusMessage = document.getElementById("statusMessage");
var searchForm = document.getElementById("searchForm");
var searchInput = document.getElementById("searchInput");
var categoryNav = document.getElementById("categoryNav");

function showMessage(text, isError) {
  statusMessage.textContent = text;

  if (isError) {
    statusMessage.style.color = "#c0392b";
  } else {
    statusMessage.style.color = "#666";
  }
}

function formatDate(dateText) {
  var date = new Date(dateText);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function getImage(news) {
  if (news.image) {
    return news.image;
  }

  return "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80";
}

function setHero(news) {
  if (!news) {
    heroTitle.textContent = "Stay updated with the latest headlines.";
    heroDescription.textContent = "CoreBrief highlights the top stories in one simple place.";
    heroButton.href = "#";
    return;
  }

  heroTitle.textContent = news.title || "Top Story";
  heroDescription.textContent = news.description || "Read the latest update on CoreBrief.";
  heroButton.href = news.url || "#";
}

function makeCard(news) {
  var card = document.createElement("article");
  card.className = "news-card";

  var image = document.createElement("img");
  image.src = getImage(news);
  image.alt = news.title || "News image";

  var content = document.createElement("div");
  content.className = "card-content";

  var meta = document.createElement("p");
  meta.className = "card-meta";
  meta.textContent = (news.source && news.source.name ? news.source.name : "Unknown Source") + " • " + formatDate(news.publishedAt);

  var title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = news.title || "Latest News";

  var description = document.createElement("p");
  description.className = "card-description";
  description.textContent = news.description || "No description available.";

  var button = document.createElement("a");
  button.className = "news-link";
  button.textContent = "Read More";
  button.href = news.url || "#";
  button.target = "_blank";
  button.rel = "noopener noreferrer";

  content.appendChild(meta);
  content.appendChild(title);
  content.appendChild(description);
  content.appendChild(button);

  card.appendChild(image);
  card.appendChild(content);

  return card;
}

function showTrending(news) {
  var i;
  trendingNews.innerHTML = "";

  for (i = 0; i < 3 && i < news.length; i++) {
    trendingNews.appendChild(makeCard(news[i]));
  }
}

function showCards(news) {
  var i;
  newsGrid.innerHTML = "";

  for (i = 0; i < news.length; i++) {
    newsGrid.appendChild(makeCard(news[i]));
  }
}

function showHeadlines(news) {
  var i;
  latestHeadlines.innerHTML = "";

  for (i = 0; i < 6 && i < news.length; i++) {
    var item = document.createElement("div");
    item.className = "headline-item";

    var title = document.createElement("h4");
    title.textContent = news[i].title || "Latest headline";

    var source = document.createElement("p");
    if (news[i].source && news[i].source.name) {
      source.textContent = news[i].source.name;
    } else {
      source.textContent = "Unknown Source";
    }

    item.appendChild(title);
    item.appendChild(source);
    latestHeadlines.appendChild(item);
  }

  if (news.length === 0) {
    latestHeadlines.innerHTML = '<p class="empty-message">No headlines available.</p>';
  }
}

function showNews(news) {
  if (!news || news.length === 0) {
    news = sampleNews;
  }

  setHero(news[0]);
  showTrending(news);
  showCards(news);
  showHeadlines(news);
}

function useSampleNews(text) {
  showNews(sampleNews);
  showMessage(text, true);
}

function getTopNews(category) {
  var url = BASE_URL + "/top-headlines?country=in&lang=en&max=10&apikey=" + API_KEY;

  if (category && category !== "general") {
    url = url + "&category=" + category;
  }

  getNews(url, "Loading news...");
}

function searchNews(word) {
  var url = BASE_URL + "/search?q=" + encodeURIComponent(word) + "&lang=en&country=in&max=10&apikey=" + API_KEY;
  getNews(url, "Searching news...");
}

function getNews(url, loadingText) {
  showMessage(loadingText, false);

  if (API_KEY === "YOUR_API_KEY") {
    useSampleNews("API key missing. Showing sample news.");
    return;
  }

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.articles && data.articles.length > 0) {
        showNews(data.articles);
        showMessage("News loaded successfully.", false);
      } else {
        useSampleNews("No news found. Showing sample news.");
      }
    })
    .catch(function () {
      useSampleNews("Error loading news. Showing sample news.");
    });
}

function setActiveButton(category) {
  var buttons = categoryNav.querySelectorAll(".category-btn");
  var i;

  for (i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");

    if (buttons[i].getAttribute("data-category") === category) {
      buttons[i].classList.add("active");
    }
  }
}

searchForm.addEventListener("submit", function (event) {
  var word;

  event.preventDefault();
  word = searchInput.value.trim();

  if (word === "") {
    setActiveButton("general");
    getTopNews("general");
  } else {
    searchNews(word);
  }
});

categoryNav.addEventListener("click", function (event) {
  var button = event.target;
  var category;

  if (button.classList.contains("category-btn")) {
    category = button.getAttribute("data-category");
    setActiveButton(category);
    getTopNews(category);
  }
});

showNews(sampleNews);
getTopNews("general");
