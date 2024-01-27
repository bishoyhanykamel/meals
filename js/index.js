"use strict";
const PRODUCTION = false;

$(document).ready(() => {
  setupNavBar(500);
  // Get all meals to populate website
  const apiRes = getMeals();
  const fileRes = loadMealPage();
  apiRes.then((data) => {
    console.log("s", data);
    fileRes.then((text) => {
      generateMeals(data.meals, text);
      $("#loader").fadeOut(1000, () => {
        $("#loader").removeClass("d-flex");
        $("body").removeClass("overflow-hidden");
      });
    });
  });
});

//////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////////
// Component loading functions
async function loadMealPage() {
  const req = await fetch(
    `./..${PRODUCTION ? "/meals" : "/"}components/mealcard.html`
  );
  return await req.text();
}

//////////////////////////////////////////////////////////////
// Modeling data to components
function generateMeals(meals, literal) {
  let template = "";
  for (let i = 0; i < meals.length; i++) {
    let temp = literal.replace("%MEAL_IMG%", meals[i].strMealThumb);
    temp = temp.replace("%MEAL_NAME%", meals[i].strMeal);

    template += temp;
  }
  $("#routing").html(template);
}
