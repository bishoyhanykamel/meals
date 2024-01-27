const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";

const getMeals = async function () {
  const req = await fetch(`${BASE_URL}search.php?s=`);
  return req.json();
};

const getMealByName = async function (searchIdx) {
  const req = await fetch(`${BASE_URL}search.php?s=${searchIdx}`);
  return req.json();
};

const getMealById = async function(id) {
  const req = await fetch(`${BASE_URL}lookup.php?i=${id}`);
  return req.json();
}