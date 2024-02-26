import "/src/azimuth.js";

// test two points with default options
var test = azimuth({lat:0,lng:0},{lat:1,lng:1});

console.assert(test.azimuth == 45, "Test 1 azimuth expected 45, recived ", test.azimuth);
console.assert(test.direction == "NE", "Test 1 direction expected NE, recived ", test.direction);
console.assert(test.distance == 157250, "Test 1 distance expected 157250, recived ", test.distance);
console.assert(test.formula == "great-circle", "Test 1 formula expected great-circle, recived ", test.formula);
console.assert(test.units == "m", "Test 1 units expected m, recived ", test.units);

// test two points with custom units
var test = azimuth({lat:0,lng:0},{lat:1,lng:1},{units:"km"});

console.assert(test.azimuth == 45, "Test 2 azimuth expected 45, recived ", test.azimuth);
console.assert(test.direction == "NE", "Test 2 direction expected NE, recived ", test.direction);
console.assert(test.distance == 157, "Test 2 distance expected 157, recived ", test.distance);
console.assert(test.formula == "great-circle", "Test 2 formula expected great-circle, recived ", test.formula);
console.assert(test.units == "km", "Test 2 units expected km, recived ", test.units);

var test = azimuth({lat:0,lng:0},{lat:1,lng:1},{distancePrecision:1});

console.assert(test.azimuth == 45, "Test 3 azimuth expected 45, recived ", test.azimuth);
console.assert(test.direction == "NE", "Test 3 direction expected NE, recived ", test.direction);
console.assert(test.distance == 157249.6, "Test 3 distance expected 157249.6, recived ", test.distance);
console.assert(test.formula == "great-circle", "Test 3 formula expected great-circle, recived ", test.formula);
console.assert(test.units == "m", "Test 3 units expected m, recived ", test.units);

var test = azimuth({lat:0,lng:0},{lat:50,lng:50},{formula:"rhumb-line"});

console.assert(test.azimuth == 41, "Test 4 azimuth expected 41, recived ", test.azimuth);
console.assert(test.direction == "NE", "Test 4 direction expected NE, recived ", test.direction);
console.assert(test.distance == 7345463, "Test 4 distance expected 7345463, recived ", test.distance);
console.assert(test.formula == "rhumb-line", "Test 4 formula expected rhumb-line, recived ", test.formula);
console.assert(test.units == "m", "Test 4 units expected m, recived ", test.units);

var test = azimuth({lat:0,lng:0},{lat:50,lng:50},{azimuthPrecision:2});

console.assert(test.azimuth == 32.73, "Test 5 azimuth expected 32.73, recived ", test.azimuth);
console.assert(test.direction == "NE", "Test 5 direction expected NE, recived ", test.direction);
console.assert(test.distance == 7293897, "Test 5 distance expected 7293897, recived ", test.distance);
console.assert(test.formula == "great-circle", "Test 5 formula expected great-circle, recived ", test.formula);
console.assert(test.units == "m", "Test 5 units expected m, recived ", test.units);

var test = azimuth({lat:0,lng:0},{lat:50,lng:50},{directionPrecision:3});

console.assert(test.azimuth == 33, "Test 6 azimuth expected 33, recived ", test.azimuth);
console.assert(test.direction == "NNE", "Test 6 direction expected NNE, recived ", test.direction);
console.assert(test.distance == 7293897, "Test 6 distance expected 7293897, recived ", test.distance);
console.assert(test.formula == "great-circle", "Test 6 formula expected great-circle, recived ", test.formula);
console.assert(test.units == "m", "Test 6 units expected m, recived ", test.units);