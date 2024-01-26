"use strict";

$(document).ready(() => {
  setupNavBar(500);
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

async function readTest() {
  console.log("hi");
  const req = await fetch("./../meals/test.html")
    .then((res) => res.text())
    .then((text) => $('routing').html(text));
}

readTest();
