const myRecipesContainer = document.getElementById("userRecipes");
const mealData = document.querySelector(".meal-info-wrapper");
function renderSavedMeals() {
  const savedMeals = JSON.parse(localStorage.getItem("savedMeals")) || [];
  let html = "";

  // Loop through the array of savedMeals
  savedMeals.forEach((meal) => {
    html += `
        <div class="result-card" data-id = "${meal.idMeal}">
                <div class="img-holder">
                    <img src="${meal.strMealThumb}" alt="" class="result-img" />
                </div>
                <div class="result-body">
                    <h5 class="result-title">${meal.strMeal}</h5>
                    <div class="button-holder">
                        <button class="get-recipe" id="fetch-recipe" data-id="${meal.idMeal}">Get Recipe</button>
                        <button class="remove" id="remove-collection" data-id="${meal.idMeal}">Remove from Collection</button>
                    </div>
                </div>
            </div>
    
      `;
  });

  // Render the saved meals in the container
  myRecipesContainer.innerHTML = html;
}

// Call the function
renderSavedMeals();

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

    mealData.innerHTML = html;

    // Does not seem to be working
    mealData.style.display = "block";

    // Add event listener to closeBtn
    document.getElementById("closeBtn").addEventListener("click", () => {
      mealInfo.style.display = "none";
    });
  } catch (error) {
    console.error("Error fetching meal info:", error);
    alert("Failed to get recipe. Please try again.");
  }
}

// Remove Meal from Collection
function removeFromCollection(mealId) {
  let savedMeals = JSON.parse(localStorage.getItem("savedMeals")) || [];
  savedMeals = savedMeals.filter((meal) => {
    meal.idMeal !== mealId;
  });
  localStorage.setItem("savedMeals", JSON.stringify(savedMeals));
  renderSavedMeals();
}

// Event Listener for Get Recipe and Remove Button
myRecipesContainer.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("get-recipe")) {
    const mealId = e.target.getAttribute("data-id");
    console.log("Get Recipe Clicked", mealId);
    getMealInfo(mealId);
  } else if (e.target && e.target.classList.contains("remove")) {
    const mealId = e.target.getAttribute("data-id");
    console.log("Remove from Collection clicked", mealId);
    removeFromCollection(mealId);
  }
});
