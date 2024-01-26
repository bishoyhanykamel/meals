"use strict";

$(document).ready(() => {
  setNavBar();
  // Get all meals to populate website
  const res = getMeals();
  res.then((data) => {
    console.log(data);
    $("#loader").fadeOut(1000, () => {
      $("#loader").removeClass("d-flex");
      $("body").removeClass("overflow-hidden");
    });
  });
});

function setNavBar() {
  const navbarContentWidth = $("#navbarContent").innerWidth();
  $("#sideNavbar").css({ left: `-=${navbarContentWidth}` });
  $("#navbarToggler").click(() => {
    let width = $("#sideNavbar").css("left");
    if (width[0] !== "0") {
      $("#sideNavbar").animate({ left: "0px" }, 500);
    } else {
      $("#sideNavbar").animate({ left: `-=${navbarContentWidth}` }, 500);
    }
  });
}
