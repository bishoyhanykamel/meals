"use strict";
const PRODUCTION = false;

$(document).ready(() => {
  setupNavBar(500);
  mapLinksToRoutes();
  loadNewPage("home");
});

///////////////////////////////////////////////////////////////////////////
// Navbar functions
function setupNavBar(animDelay) {
  const navbarContentWidth = $("#navbarContent").innerWidth();
  $("#sideNavbar").css({ left: `-=${navbarContentWidth}`, zIndex: 10 });
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
    `./..${PRODUCTION ? "/meals" : "/"}components/mealcard.html`
  );
  return await req.text();
}

async function loadMealDetailsPage() {
  const req = await fetch(
    `./..${PRODUCTION ? "/meals" : "/"}components/mealdetails.html`
  );
  return await req.text();
}

///////////////////////////////////////////////////////////////////////////
// Modeling data to components (Updating UI)
function generateMeals(meals, literal) {
  let template = "";
  for (let i = 0; i < meals.length; i++) {
    let temp = literal.replace("%MEAL_IMG%", meals[i].strMealThumb);
    temp = temp.replace("%MEAL_NAME%", meals[i].strMeal);

    template += temp;
  }
  $("#routing").html(template);
}

function generateMealDetails(meal, literal) {
  let template = "";
  let recipesTemplate = ``;

  const objArray = Object.entries(meal);
  for (let i = 1; i <= 20; i++) {
    const ingredient = objArray[`strIngredient${i}`];
    const measure = objArray[`strMeasure${i}`];
    if (ingredient.length > 0) {
      recipesTemplate += `<span class="d-inline-block px-3 py-1 bg-info text-info">${measure} ${ingredient}</span>`;
    } else continue;
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

///////////////////////////////////////////////////////////////////////////
// Loading page
function startLoading() {
  $("#loader").addClass("d-flex");
  $("body").addClass("overflow-hidden");
  $("#routingDiv").addClass("d-none");
}

function finishLoading() {
  $("#loader").fadeOut(1000, function () {
    $("body").removeClass("overflow-hidden");
    $("#loader").removeClass("d-flex");
    $("#routingDiv").removeClass("d-none");
  });
}

///////////////////////////////////////////////////////////////////////////
// Setup routing
function prepareNewPage() {
  $("#routing").html("");
  startLoading();
}
function loadNewPage(page) {
  prepareNewPage();
  switch (page) {
    case "search":
      {
        const apiRes = getMeals();
        const fileRes = loadMealPage();
        apiRes.then((data) => {
          console.log("Search page loaded - data fetched: ", data);
          fileRes.then((text) => {
            generateMeals(data.meals, text);
            finishLoading();
          });
        });
      }
      break;
    case "mealDetails": {
      const apiRes = getMealById(/* store meal id in local storage */);
      const fileRes = loadMealDetailsPage();
      apiRes.then((data) => {
        fileRes.then((text) => {
          generateMealDetails(data, text);
          finishLoading();
        });
      });
      break;
    }
    default: {
      const apiRes = getMeals();
      const fileRes = loadMealPage();
      console.log("s");
      apiRes.then((data) => {
        console.log("Document ready - data fetched: ", data);
        fileRes.then((text) => {
          generateMeals(data.meals, text);
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
