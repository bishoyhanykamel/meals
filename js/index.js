'use strict';
$(document).ready(() => {
    const res = getMeals();
    res.then((data) => {
      console.log(data);
      $("#loader").fadeOut(1000, () => {
        $('#loader').removeClass('d-flex');
      });
    });
  });