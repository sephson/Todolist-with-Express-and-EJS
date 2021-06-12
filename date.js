module.exports.todaysDate = todaysDate(); // use this when you want to export multiple functions
function todaysDate() {
  var today = new Date();

  //   today.getDay() === 6 || today.getDay() === 0
  //     ? (day = "Weekend")
  //     : (day = "Weekday");

  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  return today.toLocaleDateString("en-US", options);
}

module.exports.getAge = getAge();

function getAge() {
  let age = 21;
  return age;
}
