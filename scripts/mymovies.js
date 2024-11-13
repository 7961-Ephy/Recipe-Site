const myMoviesContainer = document.getElementById("userMovies");
const movieData = document.querySelector(".movie-info-wrapper");

//
function renderSavedMovies() {
  const savedMovies = JSON.parse(localStorage.getItem("movieCollection")) || [];
  let html = "";

  // Loop through the array of savedMovies
  savedMovies.forEach((movie) => {
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
                        <button class="remove" id="remove-collection" data-id="${movie.id}">
                          Remove from Collection
                        </button>
                    </div>
                </div>
            </div>
    
      `;
  });

  // Render the saved movies in the container
  myMoviesContainer.innerHTML = html;
}

// Call the function
renderSavedMovies();

// Function to fetch Movie Details By movieId
async function getMovieInfo(movieId) {
  try {
    // URL for fetching movie details by movieID
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${key}`;

    // Fetch the data
    const response = await fetch(url);

    // Check if response status is ok
    if (!response.ok) {
      throw new Error("Failed to fetch movie details");
    }

    // Convert the data to a json string
    const data = await response.json();

    // Access the actual movie object that is returned
    const movie = data;

    // Parse the data into the HTML
    let html = `
      <div class="movie-info" style="display: block;">
        <!-- Close Btn -->
        <button type="button" class="close-btn" id="closeBtn">
          <i class="fas fa-times"></i>
        </button>
        <!-- Movie Content -->
        <div class="movie-info-content">
          <h2 class="movie-title">${movie.title}</h2>
          <p class="movie-category">${movie.release_date}</p>
          <div class="movie-instruct">
            <h3>Overview:</h3>
            <p>${movie.overview}</p>   
          </div>
          <div class="movie-img">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="" />
          </div>
          <div class="movie-link">
            <a href="" target="_blank">Watch Video</a>
          </div>
        </div>
      </div>
    `;

    // Replace the content of the movieData element with the new HTML
    movieData.innerHTML = html;

    // Show the movie info container
    movieData.style.display = "block";

    // Add event listener to closeBtn
    document.getElementById("closeBtn").addEventListener("click", () => {
      movieData.style.display = "none";
    });
  } catch (error) {
    console.error("Error fetching movie info:", error);
    alert("Failed to get movie. Please try again.");
  }
}

// Remove Meal from Collection
function removeFromCollection(movieId) {
  // Get Existing Data from Local Storage
  let collection = JSON.parse(localStorage.getItem("movieCollection")) || [];

  // Find the index of the movie in the collection
  const movieIndex = collection.findIndex(
    (movie) => movie.id === parseInt(movieId)
  );

  if (movieIndex !== -1) {
    // Remove the movie from the collection
    collection.splice(movieIndex, 1);

    // Save the updated collection to local storage
    localStorage.setItem("movieCollection", JSON.stringify(collection));

    // Refresh the rendered movie collection
    renderSavedMovies();

    console.log("Movie removed from collection");
    //
  } else {
    console.log("Movie not found in collection");
  }
}

// Event Listener for Get Recipe and Remove Button
myMoviesContainer.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("get-movie")) {
    const movieId = e.target.getAttribute("data-id");
    console.log("Get Movie Clicked", movieId);
    getMovieInfo(movieId);
  } else if (e.target && e.target.classList.contains("remove")) {
    const movieId = e.target.getAttribute("data-id");
    console.log("Remove from Collection clicked", movieId);
    removeFromCollection(movieId);
  }
});
