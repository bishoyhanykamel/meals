"use strict";

$(document).ready(() => {

  const navbarContentWidth = $('#navbarContent').innerWidth();
  $('#sideNavbar').css({left: `-=${navbarContentWidth}`});
  $('#navbarToggler').click(() => {
    let width = $('#sideNavbar').css('left');
    console.log(width, 'hi');
    if($('#sideNavbar').css('left') < 0)
      $('#sideNavbar').animate({left: '0px'}, 1000);
  })

  $("#loader").fadeOut(1000, () => {

    $("#loader").removeClass("d-flex");
    $("body").removeClass("overflow-hidden");
  });
  // Get all meals to populate website
  // const res = getMeals();
  // res.then((data) => {
  //   console.log(data);
  //   $("#loader").fadeOut(1000, () => {
  //     $("#loader").removeClass("d-flex");
  //     $("body").removeClass("overflow-hidden");
  //   });
  // });
});
