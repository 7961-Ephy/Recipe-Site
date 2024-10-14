const mealInfoContent = document.querySelector("meal-details-content");
const recipeCloseBtn = document.getElementById("closeBtn");
const searchResult = document.getElementById("searchResult");
const mealInfo = document.querySelector(".meal-info-wrapper");
// Get meal list that matches with the ingredients
async function getMealList() {
  try {
    //   Get user input
    let searchInput = document.getElementById("search-input").value.trim();

    //   URL variable
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInput}`;

    //   Fetching Data from API
    const response = await fetch(url);

    //   Check if Response Status is OK
    if (!response.ok) {
      throw new Error("Failed to fetch Meal List");
    }

    //   Convert the response to a json string
    const data = await response.json();
    console.log(data.meals[0]);
    // Parse in the Data to html
    let html = "";
    if (data.meals) {
      // Iterate over the meals array which is the item returned by the API
      data.meals.forEach((meal) => {
        html += `
           
            <div class="result-card" data-id = "${meal.idMeal}">
                <div class="img-holder">
                    <img src="${meal.strMealThumb}" alt="" class="result-img" />
                </div>
                <div class="result-body">
                    <h5 class="result-title">${meal.strMeal}</h5>
                    <div class="button-holder">
                        <button class="get-recipe" id="fetch-recipe" data-id="${meal.idMeal}">Get Recipe</button>
                        <button class="add" id="add-collection" data-id="${meal.idMeal}">Add To Collection</button>
                    </div>
                </div>
            </div>
        
          `;
      });
    }

    //   Parse the modified htm result
    searchResult.innerHTML = html;
  } catch (error) {
    console.error("Error fetching meal list:", error);
    let searchResult = document.getElementById("searchResult");
    searchResult.classList.add("notFound");
    searchResult.innerHTML =
      "Sorry, we didn't find any meal. Please try again.";
  }
}

// Function to fetch Meal Details By mealId
async function getMealInfo(mealID) {
  try {
    //   URL for fetching meal details by mealID
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`;

    //   Fetch the data
    const response = await fetch(url);

    //   Check if response status is ok
    if (!response.ok) {
      throw new Error("Failed to fetch meal details");
    }

    //   Convert the data to a json string
    const data = await response.json();

    console.log(data.meals[0]);

    //Access the actual array that is returned
    const meal = data.meals[0];

    // Parse in the data to our html doc
    let html = `
      <div class="meal-info" style="display: block;">
        <!-- Close Btn -->
        <button type="button" class="close-btn" id="closeBtn">
          <i class="fas fa-times"></i>
        </button>
        <!-- Meal Content -->
        <div class="meal-info-content">
          <h2 class="recipe-title">${meal.strMeal}</h2>
          <p class="recipe-category">${meal.strCategory}</p>
          <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>   
          </div>
          <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="" />
          </div>
          <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
          </div>
        </div>
      </div>
    `;

    mealInfo.innerHTML = html;

    // Does not seem to be working
    mealInfo.style.display = "block";

    // Add event listener to closeBtn
    document.getElementById("closeBtn").addEventListener("click", () => {
      mealInfo.style.display = "none";
    });
  } catch (error) {
    console.error("Error fetching meal info:", error);
    alert("Failed to get recipe. Please try again.");
  }
}

// Function to add meal to collection
async function addToCollection(mealID) {
  try {
    // URL for fetching meal details by mealID
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`;

    // Fetch the data
    const response = await fetch(url);

    // Check if response status is ok
    if (!response.ok) {
      throw new Error("Failed to fetch meal details");
    }

    // Convert the data to a json string
    const data = await response.json();

    //Access the actual array that is returned
    const meal = data.meals[0];

    // Save the meal data to local storage
    let savedMeals = JSON.parse(localStorage.getItem("savedMeals")) || [];
    if (!savedMeals.some((savedMeal) => savedMeal.idMeal === meal.idMeal)) {
      savedMeals.push({
        idMeal: meal.idMeal,
        strMeal: meal.strMeal,
        strMealThumb: meal.strMealThumb,
      });
      localStorage.setItem("savedMeals", JSON.stringify(savedMeals));
      alert("Meal added to your collection!");
    } else {
      alert("This Meal is already in your collection");
    }
    //
  } catch (error) {
    console.error("Error adding meal to collection", error);
    alert("Failed to add meal to your collection. Please try again");
  }
}

// Add Event Listener to the Get Recipe Button

searchResult.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target && e.target.classList.contains("get-recipe")) {
    const mealId = e.target.getAttribute("data-id");
    console.log("Get Recipe Clicked", mealId);
    getMealInfo(mealId);
  } else if (e.target && e.target.classList.contains("add")) {
    const mealId = e.target.getAttribute("data-id");
    console.log("Add to Collection Clicked", mealId);
    addToCollection(mealId);
  }
});

const searchBtn = document.getElementById("searchBtn");
// Event Listeners
searchBtn.addEventListener("click", getMealList);
