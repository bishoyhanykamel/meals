"use strict";
const PRODUCTION = true;

$(document).ready(() => {
  setupNavBar(500);
  mapLinksToRoutes();
  loadNewPage("home");
});

///////////////////////////////////////////////////////////////////////////
// Navbar functions
function setupNavBar(animDelay) {
  const navbarContentWidth = $("#navbarContent").innerWidth();
  $("#sideNavbar").css({ left: `-=${navbarContentWidth}` });
  $("#navbarLinks li").css({ top: "300px" });
  $("#navbarToggler").click(() => {
    let width = $("#sideNavbar").css("left");
    if (width[0] !== "0") {
      openNavbar(animDelay);
    } else {
      closeNavbar(animDelay, navbarContentWidth);
    }
  });
}

function openNavbar(animDelay) {
  $("#sideNavbar").animate({ left: "0px" }, animDelay);
  $("#navbarLinks li").animate({ top: "0px" }, animDelay);
  $("#navbarToggler").removeClass("fa-bars");
  $("#navbarToggler").addClass("fa-x");
}

function closeNavbar(animDelay, navbarContentWidth) {
  $("#sideNavbar").animate({ left: `-=${navbarContentWidth}` }, animDelay);
  $("#navbarToggler").addClass("fa-bars");
  $("#navbarToggler").removeClass("fa-x");
  $("#navbarLinks li").animate({ top: "300px" }, animDelay * 2);
}

///////////////////////////////////////////////////////////////////////////
// Component loading functions
async function loadMealPage() {
  const req = await fetch(
    `./..${PRODUCTION ? "/meals/" : "/"}components/mealcard.html`
  );
  return req.text();
}

async function loadMealDetailsPage() {
  const req = await fetch(
    `./..${PRODUCTION ? "/meals/" : "/"}components/mealdetails.html`
  );
  return req.text();
}

async function loadCategoriesPage() {
  const req = await fetch(
    `./..${PRODUCTION ? "/meals/" : "/"}components/category.html`
  );
  return req.text();
}
async function loadAreaPage() {
  const req = await fetch(
    `./..${PRODUCTION ? "/meals/" : "/"}components/area.html`
  );
  return req.text();
}

async function loadContactPage() {
  const req = await fetch(
    `./..${PRODUCTION ? "/meals/" : "/"}components/contact.html`
  );
  return req.text();
}
///////////////////////////////////////////////////////////////////////////
// Modeling data to components (Updating UI)
// Meals
function generateMeals(meals, literal) {
  let template = "";
  for (let i = 0; i < meals.length; i++) {
    let temp = literal.replace("%MEAL_IMG%", meals[i].strMealThumb);
    temp = temp
      .replace("%MEAL_NAME%", meals[i].strMeal)
      .replace("%MEAL_ID%", meals[i].idMeal);

    template += temp;
  }
  $("#routing").html(template);
}

function generateMealDetails(meal, literal) {
  let template = "";
  let recipesTemplate = ``;
  const ingredients = [];
  const measures = [];

  const objArray = Object.entries(meal);
  objArray.forEach(([key, val], i) => {
    if (key.startsWith("strIngredient"))
      if (val.length > 0) ingredients.push(val);
    if (key.startsWith("strMeasure")) if (val.length > 0) measures.push(val);
  });
  for (let i = 0; i < ingredients.length; i++) {
    recipesTemplate += `<span class="d-inline-block px-3 py-1 bg-primary m-2 text-white bg-opacity-10 rounded-3">
    ${measures[i]} ${ingredients[i]}
    </span>`;
  }

  template = literal
    .replace("%MEAL_IMG%", meal.strMealThumb)
    .replace("%MEAL_NAME%", meal.strMeal)
    .replace("%INSTRUCTIONS%", meal.strInstructions)
    .replace("%AREA%", meal.strArea)
    .replace("%CATEGORY%", meal.strCategory)
    .replace("%RECIPES%", recipesTemplate)
    .replace("%TAGS%", meal.strTags === null ? "" : meal.strTags)
    .replace("%SOURCE%", meal.strSource)
    .replace("%YOUTUBE%", meal.strYoutube);

  $("#routing").html(template);
}

// Categories
function generateCategoriesPage(categories, literal) {
  let template = "";
  for (let i = 0; i < categories.length; i++) {
    template += literal
      .replace("%CATEGORY_STR%", categories[i].strCategory)
      .replace("%CATEGORY_IMG%", categories[i].strCategoryThumb)
      .replace("%CATEGORY_NAME%", categories[i].strCategory)
      .replace(
        "%CATEGORY_DESC%",
        categories[i].strCategoryDescription.split(".")[0]
      );
  }
  $("#routing").html(template);
}

// Areas 
function generateAreaPage(areas, literal) {
  let template = "";
  for (let i = 0; i < areas.length; i++) {
    template += literal.replaceAll('%AREA_STR%', areas[i].strArea);
  }
  $("#routing").html(template);
}

// Contact Page
function generateContactPage(literal) {
  $("#routing").html(literal);
  // contactPageValidations();
}

///////////////////////////////////////////////////////////////////////////
// Loading page
function startLoading() {
  $("#loader").addClass("d-flex");
  $("body").addClass("overflow-hidden");
  $("#routingDiv").addClass("d-none");
  $("#sideNavbar").css({ zIndex: -1 });
}

function finishLoading() {
  $("#loader").fadeOut(1000, function () {
    $("body").removeClass("overflow-hidden");
    $("#loader").removeClass("d-flex");
    $("#routingDiv").removeClass("d-none");
    $("#sideNavbar").css({ zIndex: 3 });
  });
}

///////////////////////////////////////////////////////////////////////////
// Setup routing
function prepareNewPage() {
  $("#routing").html("");
  startLoading();
}
function loadNewPage(page, idx = 0) {
  prepareNewPage();
  switch (page) {
    case "search": {
      const apiRes = getMeals();
      const fileRes = loadMealPage();
      apiRes.then((data) => {
        fileRes.then((model) => {
          generateMeals(data.meals, model);
          finishLoading();
        });
      });
      break;
    }
    case "category": {
      const apiRes = getCategories();
      const fileRes = loadCategoriesPage();
      apiRes.then((data) => {
        fileRes.then((model) => {
          generateCategoriesPage(data.categories, model);
          finishLoading();
        });
      });
      break;
    }
    case "area": {
      const apiRes = getAreas();
      const fileRes = loadAreaPage();
      apiRes.then((data) => {
        fileRes.then((model) => {
          generateAreaPage(data.meals, model);
          finishLoading();
        });
      });
      break;
    }
    case "contact": {
      const fileRes = loadContactPage();
      fileRes.then((model) => {
        generateContactPage(model);
        finishLoading();
      });
      break;
    }
    case "mealDetails": {
      const apiRes = getMealById(idx);
      const fileRes = loadMealDetailsPage();
      apiRes.then((data) => {
        fileRes.then((model) => {
          generateMealDetails(data.meals[0], model);
          finishLoading();
        });
      });
      break;
    }
    case "mealsByCategory": {
      const apiRes = getMealsByCategory(idx);
      const fileRes = loadMealPage();
      apiRes.then((data) => {
        fileRes.then((model) => {
          generateMeals(data.meals, model);
          finishLoading();
        });
      });
      break;
    }
    case "mealsByArea": {
      const apiRes = getMealsByArea(idx);
      const fileRes = loadMealPage();
      apiRes.then((data) => {
        fileRes.then((model) => {
          generateMeals(data.meals, model);
          finishLoading();
        });
      });
      break;
    }
    default: {
      const apiRes = getMeals();
      const fileRes = loadMealPage();
      apiRes.then((data) => {
        console.log("Document ready - data fetched: ", data);
        fileRes.then((model) => {
          generateMeals(data.meals, model);
          finishLoading();
        });
      });
    }
  }
}
function mapLinksToRoutes() {
  $("#searchLink").on("click", () => loadNewPage("search"));
  $("#categoryLink").on("click", () => loadNewPage("category"));
  $("#areaLink").on("click", () => loadNewPage("area"));
  $("#ingredientsLink").on("click", () => loadNewPage("ingredients"));
  $("#contactLink").on("click", () => loadNewPage("contact"));
}

function prepareMealDetails(meal) {
  loadNewPage("mealDetails", meal.getAttribute("--meal-id"));
}

function prepareMealsByCategory(category) {
  loadNewPage("mealsByCategory", category.getAttribute("--category-str"));
}

function prepareMealsByArea(area) {
  loadNewPage("mealsByArea", area.getAttribute("--area-str"));
}
///////////////////////////////////////////////////////////////////////////
// Helper functions

// function contactPageValidations() {
//   // regex patterns
//   const nameRegex = /^[A-Za-z]$/;
//   const emailRegex = /@.com/;

//   let nameValid = false;
//   let emailValid = false;
//   let phoneNumber = false;
//   let ageValid = false;
//   let passwordConfirmed = false;
//   $("#nameInput").on("keyup", () => {
//     if (nameRegex.test($(this).val() == true)) {
//       nameValid = true;
//       $('#nameLabel').addClass('d-none');
//     } else
//       $("#nameLabel").removeClass("d-none");
//       nameValid = false;
//   });

//   $('#formsPage').on('hover', () => {
//     $('#formSubmitBtn').attr('disabled') = (nameValid && emailValid && phoneNumber && ageValid && passwordConfirmed);
//   })
// }
