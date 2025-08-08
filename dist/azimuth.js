var azimuth = (function () {

  function _readOnlyError(r) {
    throw new TypeError('"' + r + '" is read-only');
  }

  /**
   * @typedef {Object} Azimuth
   * @property {number} distance Distance between the two points, in the specified units.
   * @property {string} units Units of the distance ("m", "km", "ft", "yd", "mi", "nm").
   * @property {number|string} bearing Initial bearing from point 1 to point 2 (degrees, or empty string if distance is 0).
   * @property {string} formula Calculation formula used ("great-circle" or "rhumb-line").
   * @property {string} [direction] Compass direction from point 1 to point 2 (present if directionPrecision !== 0).
   */

  /**
   * @typedef {Object} LatLng
   * @property {number} lat Latitude of the point (degrees).
   * @property {number} lng Longitude of the point (degrees).
   */

  /**
   * @typedef {"m" | "km" | "ft" | "yd" | "mi" | "nm"} Units
   * Units of distance: meters, kilometers, feet, yards, miles, nautical miles.
   */

  /**
   * @typedef {"great-circle" | "rhumb-line"} Formula
   * Calculation formula: 'great-circle' for shortest path, 'rhumb-line' for constant bearing.
   */

  /**
   * Mean radius of earth in meters used for calculations.
   * 
   * A globally-average value is usually considered to be 6,371 kilometres (3,959 mi) with a 0.3% variability
   * 
   * @type {Number}
   * @const
   */
  var R = 6371009;

  /**
   * Converts decimal degrees to radians.
   * @param {number} n Angle in degrees.
   * @returns {number} Angle in radians.
   * @throws {Error} If input is not a number.
   */
  function deg2rad(n) {
    if (typeof n !== "number" || isNaN(n)) {
      throw new Error("Input to deg2rad must be a valid number.");
    }
    return n * (Math.PI / 180);
  }

  /**
   * Converts radians to degrees.
   * @param {number} n Angle in radians.
   * @returns Angle in degrees.
   * @throws {Error} If input is not a number.
   */
  function rad2deg(n) {
    if (typeof n !== "number" || isNaN(n)) {
      throw new Error("Input to rad2deg must be a valid number.");
    }
    return n * (180 / Math.PI);
  }

  /**
   * Rounds a number to a specific number of decimal places.
   * @param {number} number The number to round.
   * @param {number} precision  Number of decimal places.
   * @returns {number} The rounded number.
   */
  function round(number, precision) {
    if (precision === void 0) {
      precision = 0;
    }
    return Number(Math.round(Number(number) + "e+" + precision) + "e-" + precision);
  }

  /**
   * Get bearing using Rhumb-Line formula
   * @returns {number} Bearing in degrees.
   */
  function getBearingRhumbLine(lat1, lng1, lat2, lng2) {
    // if coordinates are the same, distance is zero (skip calculations)
    if (lat1 === lat2 && lng1 === lng2) return 0;
    var rLat1 = deg2rad(lat1);
    var rLat2 = deg2rad(lat2);
    var dLong = deg2rad(lng2 - lng1);
    var dPhi = Math.log(Math.tan(Math.PI / 4 + rLat2 / 2) / Math.tan(Math.PI / 4 + rLat1 / 2));

    // Correct for anti-meridian crossing
    if (Math.abs(dLong) > Math.PI) {
      dLong = dLong > 0 ? -(2 * Math.PI - dLong) : 2 * Math.PI + dLong;
    }
    var radians = Math.atan2(dLong, dPhi);
    var brng = (rad2deg(radians) + 360) % 360; // in degrees

    return brng;
  }

  /**
   * Get bearing using Great-Circle formula
   * @returns {number} Bearing in degrees.
   */
  function getBearingGreatCircle(lat1, lng1, lat2, lng2) {
    var rLat1 = deg2rad(lat1);
    var rLat2 = deg2rad(lat2);
    var dLong = deg2rad(lng2 - lng1);
    var y = Math.sin(dLong) * Math.cos(rLat2);
    var x = Math.cos(rLat1) * Math.sin(rLat2) - Math.sin(rLat1) * Math.cos(rLat2) * Math.cos(dLong);
    var radians = Math.atan2(y, x);
    var brng = (rad2deg(radians) + 360) % 360; // in degrees

    return brng;
  }

  /**
   * Convert bearing degrees to compass direction.
   * @param {number} degrees Bearing in degrees.
   * @param {number} precision Precision level (1=cardinal, 2=intercardinal, 3=secondary intercardinal).
   * @returns {string} Compass direction.
   * @throws {Error} If parameters are invalid.
   */
  function getCompassDirection(degrees, precision) {
    if (typeof degrees !== "number" || isNaN(degrees)) {
      throw new Error('Degrees parameter is not a valid number!');
    }
    if (typeof precision !== "number" || isNaN(precision)) {
      throw new Error('Precision parameter is not a valid number!');
    }
    if (degrees < 0 || degrees > 360) {
      throw new Error('Degrees parameter outside of range (0-360)!');
    }
    if (precision < 1 || precision > 3) {
      throw new Error('Precision parameter outside of range (1-3)!');
    }

    // Normalize 360 to 0
    if (degrees === 360) degrees = 0;
    var directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

    // Default precision number of directions
    var maxDirections = 4;
    if (precision === 2) maxDirections = 8;
    if (precision === 3) maxDirections = 16;
    var unitAngle = 360 / maxDirections;
    var indexMultiplier = directions.length / maxDirections;
    var directionIndex = Math.round(degrees / unitAngle) * indexMultiplier;

    // If over the last direction, display first
    if (directionIndex >= directions.length) directionIndex = 0;
    return directions[directionIndex];
  }

  /**
   * Haversine formula to calculate the great-circle distance between two points
   * @returns {number} Distance in meters.
   */
  function getDistanceGreatCircle(lat1, lng1, lat2, lng2) {
    // if coordinates are the same, distance is zero (skip calculations)
    if (lat1 === lat2 && lng1 === lng2) return 0;
    var rLat1 = deg2rad(lat1);
    var rLat2 = deg2rad(lat2);
    var dLat = deg2rad(lat2 - lat1);
    var dLong = deg2rad(lng2 - lng1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Inverse Gudermannian formula to calculate the rhumb line distance between two points
   * @returns {number} Distance in meters.
   */
  function getDistanceRhumbLine(lat1, lng1, lat2, lng2) {
    // if coordinates are the same, distance is zero (skip calculations)
    if (lat1 === lat2 && lng1 === lng2) return 0;
    var rLat1 = deg2rad(lat1);
    var rLat2 = deg2rad(lat2);
    var dLat = deg2rad(lat2 - lat1);
    var dLong = deg2rad(lng2 - lng1);
    var dPhi = Math.log(Math.tan(Math.PI / 4 + rLat2 / 2) / Math.tan(Math.PI / 4 + rLat1 / 2));
    var q = Math.abs(dPhi) > 10e-12 ? dLat / dPhi : Math.cos(rLat1); // E-W course becomes ill-conditioned with 0/0

    // if dLong over 180° take shorter rhumb line across the anti-meridian:
    if (Math.abs(dLong) > Math.PI) {
      _readOnlyError("dLong");
    }
    var dist = Math.sqrt(dLat * dLat + q * q * dLong * dLong) * R;
    return dist;
  }

  /**
   * Convert length/distance from meters to specified units
   * @param {number} distance Distance in meters.
   * @param {Units} [units="m"] Target units.
   * @returns {number} Converted distance.
   */
  function metersConverter(distance, units) {
    if (units === void 0) {
      units = "m";
    }
    if (units === "m") return distance;
    switch (units) {
      case "km":
        return distance * 0.001;
      case "ft":
        return distance * 3.28084;
      case "yd":
        return distance * 1.0936;
      case "mi":
        return distance * 0.000621371;
      case "nm":
        return distance * 0.000539957;
      default:
        return distance;
    }
  }

  /**
   * Calculate the distance, bearing and direction between two coordinates.
   * 
   * Distance and bearing can use "great-circle" or "rhumb-line" formulas.
   * Great-Circle calculations use a spherical earth model (ignoring ellipsoidal effects) *which is accurate enough* for most purposes… 
   * In fact, the earth is very slightly ellipsoidal; using a spherical model gives errors typically up to ~0.3%.
   * 
   * Great Circle distance uses the ‘haversine’ formula to calculate distance between two points (also known as the ‘crow-line’) 
   * - that is, the shortest distance over the earth’s surface.
   * 
   * 
   * With 'great-circle' your current heading will vary as you follow a great circle path (orthodrome); 
   * The final heading will differ from the initial heading. This will provide initial heading.
   * 
   * A ‘Rhumb-Line’ (or loxodrome) is a path of constant bearing but are generally longer than great-circle (sometimes up to 30%)
   * 
   * @param {LatLng} start Coordinates of the first point (degrees).
   * @param {LatLng} end Coordinates of the second point (degrees).
   * @param {Object} [options] Optional parameters.
   * @param {Units} [options.units="m"] Units of the distance.
   * @param {number} [options.distancePrecision=0] Decimal places for distance (0-15). 
   * @param {Formula} [options.formula="great-circle"] Calculation formula ("great-circle" or "rhumb-line").
   * @param {number} [options.bearingPrecision=0] Decimal places for bearing (0-15).
   * @param {number} [options.directionPrecision=2] Direction precision (0 disables, 1=cardinal, 2=intercardinal, 3=secondary intercardinal).
   * @returns {Azimuth} Result object.
   * @throws {Error} If parameters are invalid.
   */
  var azimuth = function azimuth(start, end, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
      _ref$units = _ref.units,
      units = _ref$units === void 0 ? "m" : _ref$units,
      _ref$distancePrecisio = _ref.distancePrecision,
      distancePrecision = _ref$distancePrecisio === void 0 ? 0 : _ref$distancePrecisio,
      _ref$formula = _ref.formula,
      formula = _ref$formula === void 0 ? "great-circle" : _ref$formula,
      _ref$bearingPrecision = _ref.bearingPrecision,
      bearingPrecision = _ref$bearingPrecision === void 0 ? 0 : _ref$bearingPrecision,
      _ref$directionPrecisi = _ref.directionPrecision,
      directionPrecision = _ref$directionPrecisi === void 0 ? 2 : _ref$directionPrecisi;
    // Validate 'start' and 'end' parameters
    if (typeof start !== 'object' || start === null || typeof start.lat !== 'number' || typeof start.lng !== 'number') {
      throw new Error("First parameter must be an object with numeric 'lat' and 'lng' properties.");
    }
    if (typeof end !== 'object' || end === null || typeof end.lat !== 'number' || typeof end.lng !== 'number') {
      throw new Error("Second parameter must be an object with numeric 'lat' and 'lng' properties.");
    }

    // Validate coordinate ranges
    if (Math.abs(start.lat) > 90 || Math.abs(end.lat) > 90) {
      throw new Error('Latitude must be between -90 and 90 degrees.');
    }
    if (Math.abs(start.lng) > 180 || Math.abs(end.lng) > 180) {
      throw new Error('Longitude must be between -180 and 180 degrees.');
    }

    // Validate numeric options
    [[distancePrecision, 'distancePrecision'], [bearingPrecision, 'bearingPrecision'], [directionPrecision, 'directionPrecision']].forEach(function (_ref2) {
      var v = _ref2[0],
        name = _ref2[1];
      if (typeof v !== "number" || isNaN(v)) {
        throw new Error("Parameter '" + name + "' must be a valid number.");
      }
    });

    // Validate precisions rounding
    if (![distancePrecision, bearingPrecision].every(function (p) {
      return Number.isInteger(p) && p >= 0 && p <= 15;
    })) {
      throw new Error('Precision parameters must be integers between 0 and 15.');
    }

    // Validate output distance units
    if (!["m", "km", "ft", "yd", "mi", "nm"].includes(units)) {
      throw new Error('Units parameter type not supported!');
    }

    // Validate calculation formula type
    if (!["great-circle", "rhumb-line"].includes(formula)) {
      throw new Error('Calculation formula type parameter not supported!');
    }

    // Validate directionPrecision
    if (!Number.isInteger(directionPrecision) || directionPrecision < 0 || directionPrecision > 3) {
      throw new Error('Direction precision must be an integer between 0 and 3.');
    }

    // Create output object
    var output = {};

    // Add distance to the object
    var distance = round(metersConverter(formula === "rhumb-line" ? getDistanceRhumbLine(start.lat, start.lng, end.lat, end.lng) : getDistanceGreatCircle(start.lat, start.lng, end.lat, end.lng), units), distancePrecision);
    output.distance = distance;

    // Add units of measure to the object
    output.units = units;

    // Add bearing to the object
    var bearing = distance === 0 ? "" : round(formula === "rhumb-line" ? getBearingRhumbLine(start.lat, start.lng, end.lat, end.lng) : getBearingGreatCircle(start.lat, start.lng, end.lat, end.lng), bearingPrecision);
    output.bearing = bearing;
    output.formula = formula;

    // Add compass direction to the object
    if (directionPrecision !== 0) {
      output.direction = distance === 0 ? "" : getCompassDirection(bearing, directionPrecision);
    }
    return output;
  };

  return azimuth;

})();
