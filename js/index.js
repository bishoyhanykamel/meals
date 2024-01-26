"use strict";
$(document).ready(() => {

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
