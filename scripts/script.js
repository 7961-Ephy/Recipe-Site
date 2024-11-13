// TMDB API Key
const key = "037507ad3df661b09d8e20748396d8a2";

const movieInfoContent = document.querySelector(".movie-details-content");
const recipeCloseBtn = document.getElementById("closeBtn");
const searchResult = document.getElementById("searchResult");
const movieInfo = document.querySelector(".movie-info-wrapper");

// Get movie list that matches with the search details
async function getMovieList() {
  try {
    //   Get user input
    let searchInput = document.getElementById("search-input").value.trim();

    //   URL variable
    const url = `https://api.themoviedb.org/3/search/movie?query=${searchInput}&api_key=${key}`;
    // const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`;

    //   Fetching Data from API
    const response = await fetch(url);

    //   Check if Response Status is OK
    if (!response.ok) {
      throw new Error("Failed to fetch Movie List");
    }

    //   Convert the response to a json string
    const data = await response.json();
    console.log(data.results[0].title);
    // Parse in the Data to html
    let html = "";
    if (data.results) {
      // Map over the movies array which is the item returned by the API

      data.results.map((movie) => {
        html += `
        <div class="result-card" data-id = "${movie.id}">
                <div class="img-holder">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="" class="result-img" />
                </div>
                <div class="result-body">
                    <h5 class="result-title">${movie.title}</h5>
                    <div class="button-holder">
                        <button class="get-movie" id="fetch-movie" data-id="${movie.id}">
                          Get Movie
                        </button>
                        <button class="add" id="add-collection" data-id="${movie.id}">Add To Collection</button>
                    </div>
                </div>
            </div>
        `;
      });
    }

    //   Parse the modified html result
    searchResult.innerHTML = html;
  } catch (error) {
    console.error("Error fetching movies:", error);
    let searchResult = document.getElementById("searchResult");
    searchResult.classList.add("notFound");
    searchResult.innerHTML =
      "Sorry, we didn't find any movie. Please try again.";
  }
}

// Function to fetch Movie Details By movieId
async function getMovieInfo(movieId) {
  try {
    //   URL for fetching movie details by movieID
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${key}`;

    //   Fetch the data
    const response = await fetch(url);

    //   Check if response status is ok
    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.status}`);
    }

    //   Convert the data to a json string
    const data = await response.json();

    console.log("Movie Data:", data);

    // Parse in the data to our html doc
    let html = `
      <div class="movie-info" style="display: block;">
        <!-- Close Btn -->
        <button type="button" class="close-btn" id="closeBtn">
          <i class="fas fa-times"></i>
        </button>
        <!-- Movie Content -->
        <div class="movie-info-content">
          <h2 class="movie-title">${data.title}</h2>
          <p class="movie-category">${data.release_date}</p>
          <div class="movie-instruct">
            <h3>Overview:</h3>
            <p>${data.overview}</p>   
          </div>
          <div class="movie-img">
            <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="" />
          </div>
          <div class="movie-link">
            <a href="" target="_blank">Watch Video</a>
          </div>
        </div>
      </div>
    `;

    movieInfo.innerHTML = html;
    movieInfo.style.display = "block";

    // Add event listener to closeBtn
    document.getElementById("closeBtn").addEventListener("click", () => {
      movieInfo.style.display = "none";
    });
  } catch (error) {
    console.error("Error fetching movie info:", error);
    alert("Failed to get movie. Please try again.");
  }
}

// Function to add movie to collection
async function addToCollection(movieId) {
  try {
    //   URL for fetching movie details by movieID
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${key}`;

    //   Fetch the data
    const response = await fetch(url);

    //   Check if response status is ok
    if (!response.ok) {
      throw new Error("Failed to fetch movie details");
    }

    //   Convert the data to a json string
    const data = await response.json();

    console.log(data);

    //Access the actual object that is returned
    const movieData = data;

    // Get existing data from LocalStorage
    let collection = JSON.parse(localStorage.getItem("movieCollection")) || [];

    // Check if the movie already exists in the collection
    if (collection.some((movie) => movie.id === movieData.id)) {
      alert("Movie already exists in your collection!");
      return;
    }

    // Add the movie data to the collection
    collection.push(movieData);

    // Save the updated collection to local storage
    localStorage.setItem("movieCollection", JSON.stringify(collection));

    // Log data to confirm it works
    console.log("Movie added to collection", movieData.title);

    //
  } catch (error) {
    console.error("Error to save movie:", error);
  }
}

// Add Event Listener to the Get Movie Button

searchResult.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target && e.target.classList.contains("get-movie")) {
    const movieId = e.target.getAttribute("data-id");
    console.log("Get Movie Clicked", movieId);
    getMovieInfo(movieId);
  } else if (e.target && e.target.classList.contains("add")) {
    const movieId = e.target.getAttribute("data-id");
    console.log("Add to Collection Clicked", movieId);
    addToCollection(movieId);
  }
});

const searchBtn = document.getElementById("searchBtn");
// Event Listeners
searchBtn.addEventListener("click", getMovieList);
