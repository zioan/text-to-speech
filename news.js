const GUARDIAN_API_KEY = "api-key=bbc4384f-bc6e-4d02-809d-ce1699be6686";
const GUARDIAN_API_URL = "https://content.guardianapis.com/search";
let news = [];

async function fetchGuardianNews() {
  try {
    const response = await fetch(`${GUARDIAN_API_URL}?${GUARDIAN_API_KEY}&show-fields=bodyText,headline,thumbnail&page-size=5`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const articles = data.response.results;

    console.log("Fetched articles:", articles);

    return articles.map((article) => ({
      id: article.id,
      title: article.webTitle,
      section: article.sectionName,
      url: article.webUrl,
      publishedAt: article.webPublicationDate,
      fields: article.fields,
      tags: article.tags,
    }));
  } catch (error) {
    console.error("Error fetching news from The Guardian:", error);
    throw error;
  }
}

async function getNews() {
  try {
    news = await fetchGuardianNews();
  } catch (error) {
    console.error("Failed to initialize news feed:", error);
  }
}
getNews();

async function renderNews() {
  const newsContainer = document.querySelector(".news-container");
  try {
    news = await fetchGuardianNews();

    newsContainer.innerHTML = news
      .map(
        (article) => `
          <div class="news-item">
            <h3>${article.title}</h3>
            <p>${article.section}</p>
            ${article.fields.thumbnail ? `<img src="${article.fields.thumbnail}" alt="${article.title}">` : ""}
            <p>${new Date(article.publishedAt).toLocaleDateString()}</p>
            <p></p>${article.fields.bodyText}</p>
            <a href="${article.url}" target="_blank">Read more</a>
          </div>
        `
      )
      .join("");
  } catch (error) {
    newsContainer.innerHTML = "<p>Error loading news. Please try again later.</p>";
    console.error("Failed to render news:", error);
  }
}

// Wait for DOM to be loaded before rendering news
document.addEventListener("DOMContentLoaded", renderNews);
