const defaultRecipe = {
    title: "Sophia's Dessert",
    blog: "This is a totally fake dessert recipe dedicated to my girlfriend Sophia. She said she wanted to be a part of the app.",
    description: "This is Sophia's classic baked dessert made with love and affection.",
    ingredients: ["Flour", "Eggs", "Love", "Passive-Aggression", "An Undying Spirit"],
    steps: ["Mix the Flour and Eggs", "Throw batter in the blender with Passive-Aggression", "Pour out and knead with Love, adding the Undying Spirit from before."],
    difficulty: "Medium"
};
var errorLabel = document.getElementById('lbError');

window.addEventListener('load', function() {
    var serializedRecipe = JSON.stringify(defaultRecipe);
    localStorage.setItem("defaultRecipe", serializedRecipe);
    displayRecipes()
});

document.getElementById('openRecipeBlog').addEventListener('click', function() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('recipeBlogPage').style.display = 'block';
    errorLabel.style.display = "none";
});

document.getElementById('closeRecipeBlog').addEventListener('click', function() {
    document.getElementById('homePage').style.display = 'block';
    document.getElementById('recipeBlogPage').style.display = 'none';
    errorLabel.style.display = "none";
});

document.getElementById('recipeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    let title = document.getElementById('title').value;
    let blog = document.getElementById('blog').value
    let description = document.getElementById('description').value;
    let ingredients = document.getElementById('ingredients').value.split('\n');
    let steps = document.getElementById('steps').value.split('\n');
    let difficulty = document.getElementById('difficulty').value;

    let recipe = {
        title,
        blog,
        description,
        ingredients,
        steps,
        difficulty
    };

    var serializedRecipe = JSON.stringify(recipe);

    var allRecipes = Object.keys(localStorage).map(function(key) {
        return JSON.parse(localStorage.getItem(key));
    });
    function recipeWithTitleExists(title) {
        return allRecipes.some(function(existingRecipe) {
            return existingRecipe.title === title;
        });
    }

    try {
        if (recipeWithTitleExists(recipe.title)) {

            console.log("A recipe with the same title already exists.");
            throw new Error("There is already a recipe with that title!")
    
        } else {
            errorLabel.style.display = "block"
            var count = localStorage.length;
            localStorage.setItem('myRecipe' + count + 1, serializedRecipe);
            console.log("Recipe stored successfully.");
            displayRecipes(recipe);
            document.getElementById('homePage').style.display = 'block';
            document.getElementById('recipeBlogPage').style.display = 'none';
            document.getElementById('recipeForm').reset();
        }
    } catch (error) {
        errorLabel.textContent = error.message
        errorLabel.style.display = "block"
    }
    
    
    
});
function displayRecipe(recipe) {
    let recipeList = document.getElementById('recipeList');
    
    let recipeElement = document.createElement('div');
    recipeElement.classList.add('recipe-card');
    
    recipeElement.innerHTML = `
        <h2 class="recipe-title">${recipe.title}</h2>
        <p>${recipe.description}</p>
        <p><b>Difficulty:</b> ${recipe.difficulty}</p>
    `;
    
    recipeList.appendChild(recipeElement);

    let recipeTitle = recipeElement.querySelector('.recipe-title');
    recipeTitle.addEventListener('click', function() {

        displayFullRecipe(recipe);
    });
}

function displayRecipes() {
    var allRecipes = Object.keys(localStorage).map(function(key) {
        return JSON.parse(localStorage.getItem(key));
    });
    
    allRecipes.sort(function(a, b) {
        var titleA = a.title.toUpperCase(); 
        var titleB = b.title.toUpperCase(); 
        if (titleA < titleB) {
            return -1;
        }
        if (titleA > titleB) {
            return 1;
        }
        return 0;
    });
    var specialRecipeIndex = allRecipes.findIndex(function(recipe) {
        return recipe.title === "Sophia's Dessert";
    });
    if (specialRecipeIndex !== -1) {
        var specialRecipe = allRecipes.splice(specialRecipeIndex, 1)[0];
        allRecipes.unshift(specialRecipe);
    }
    let recipeList = document.getElementById('recipeList');
    recipeList.innerHTML = "";
    allRecipes.forEach(function(recipe) {
        displayRecipe(recipe);
    });
}

function displayFullRecipe(recipe) {

    document.getElementById('homePage').style.display = 'none';
    
    document.getElementById('recipeDetailsPage').style.display = 'block';
    
    let recipeDetailsPage = document.getElementById('recipeDetailsPage');
    recipeDetailsPage.innerHTML = `
        <div class="recipe-card">
        <h2>${recipe.title}</h2>
        <p><b>Description:</b> ${recipe.description}</p><br>
        <p><b>Blog/Story:</b> ${recipe.blog}</p><br>
        <p><b>Ingredients:</b></p>
        <ul>
            ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
        <p><b>Steps:</b></p>
        <ol>
            ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
        </ol>
        <p><b>Difficulty:</b> ${recipe.difficulty}</p><br>
        
        <button id="backToRecipeBlog">Back to Recipe Blog</button>
    </div>
    `;

document.getElementById('backToRecipeBlog').addEventListener('click', function() {

    document.getElementById('recipeDetailsPage').style.display = 'none';
    
    document.getElementById('homePage').style.display = 'block';
});
}
