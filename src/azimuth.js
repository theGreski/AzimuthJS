/**
 * @typedef {"m" | "km" | "ft" | "yd" | "mi" | "nm"} Units
 */

/**
 * Calculate the distance, bearing and direction between two coordinates.
 * 
 * Distance calculations on the basis of a spherical earth (ignoring ellipsoidal effects) *which is accurate enough* for most purposes… 
 * In fact, the earth is very slightly ellipsoidal; using a spherical model gives errors typically up to 0.3%.
 * 
 * It uses the ‘haversine’ formula to calculate the great-circle distance between two points (also known as the ‘crow-line’) 
 * - that is, the shortest distance over the earth’s surface.
 * 
 * @param {number} lat1 					latitude of the first point
 * @param {number} lng1 					longitude of the first point
 * @param {number} lat2 					latitude of the second point
 * @param {number} lng2 					longitude of the second point
 * @param {number} [distancePrecision=0]	Number of decimal places for distance; Default is 0;
 * @param {Units} [units="m"] 				Units of the distance; Default "m" meters. Accepts only:
 * 												"m" for meters, 
 * 												"km" for kilometers, 
 * 												"ft" for foots, 
 * 												"yd" for yards, 
 * 												"mi" for miles, 
 * 												"nm" for nautical miles
 * @param {number} bearingPrecision  		Number of decimal places for azimuth degrees; Default 0;
 * @param {number} directionPrecision  		Direction precision; Accepts only 0, 1, 2 and 3; 0 disables the parameter; Default 1;
 * @returns {Object}	azimuth
 * @returns {number}	azimuth.distance	Distance in units provided
 * @returns {string}	azimuth.units		Units of the distance
 * @returns {number}	azimuth.bearing		Angle bearing from point 1 to point 2
 * @returns {string}	azimuth.direction	Compass direction from point 1 to point 2
 * @throws {Error} 							
 */
export default function azimuth(lat1, lng1, lat2, lng2, distancePrecision = 0, units="m", bearingPrecision = 0, directionPrecision = 1) {
	
	// Validate parameters
	if (isNaN(lat1) || isNaN(lat2) || isNaN(lng1) || isNaN(lng2) || isNaN(bearingPrecision) || isNaN(directionPrecision)) {
		throw new Error('Parameter is not a number!');
	}

	// Validate coordinates
	if (Math.abs(lat1) > 90 || Math.abs(lat2) > 90 || Math.abs(lng1) > 180 || Math.abs(lng2) > 180) {
		throw new Error('Parameter exceeding maximal value!');
	}

	// Validate units

	// Validate precisions

	/**
	 * Mean radius of earth in meters used for calculations.
	 * 
	 * A globally-average value is usually considered to be 6,371 kilometres (3,959 mi) with a 0.3% variability
	 * 
	 * @type {number}
	 * @const
	 */
	const R = 6371009;

	/**
	 * Numeric degrees to radians
	 * @param {number} d 
	 * @returns {number}
	 */
	function deg2rad(d) { return (d * Math.PI / 180); }
				
	function degrees(n) { return n * (180 / Math.PI); }

	function roundNumber(number, precision=0) { return +(Math.round(number + "e+" + precision)  + "e-" + precision); }
	
	Number.prototype.round = function (value = 0) {
		let num = new Number(this.valueOf());
		return +(Math.round(num + "e+" + value)  + "e-" + value);
	};

	function getBearing(lat1, lng1, lat2, lng2) {
		startLatitude = deg2rad(lat1);
		startLongitude = deg2rad(lng1);
		endLatitude = deg2rad(lat2);
		endLongitude = deg2rad(lng2);
				
		var dLong = endLongitude - startLongitude;
					
		var dPhi = Math.log(Math.tan(endLatitude / 2.0 + Math.PI / 4.0) / Math.tan(startLatitude / 2.0 + Math.PI / 4.0));
		if (Math.abs(dLong) > Math.PI) {
			if (dLong > 0.0)
				dLong = -(2.0 * Math.PI - dLong);
			else
				dLong = (2.0 * Math.PI + dLong);
		}
					
		return (degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
	}

	function getDirection(degrees, precision) {
		

		if (isNaN(degrees) || isNaN(precision)) {
			throw new Error('Parameter is not a number!');
			return;
		}

		if (degrees < 0 || degrees > 360) {
			throw new Error('Parameter outside of range!');
			return;
		}

		if (precision < 1 || precision > 3) {
			throw new Error('Parameter outside of range!');
			return;
		}


		// cardinal directions
		if (precision == 1) {
			
			var degrees_of_rotation = 360 / 4;
			var nTo = degrees_of_rotation / 2;
			var eTo = nTo + degrees_of_rotation;
			var sTo = eTo + degrees_of_rotation;
			var wTo = sTo + degrees_of_rotation;
			
			if (degrees <= nTo) return "N";
			if (degrees <= eTo) return "E";
			if (degrees <= sTo) return "S";
			if (degrees <= wTo) return "W";
			if (degrees >  wTo) return "N";
		}

		// Intercardinal directions
		if (precision == 2) {

			var degrees_of_rotation = 360 / 8;
			var nTo = degrees_of_rotation / 2;
			var neTo = nTo + degrees_of_rotation;
			var eTo = neTo + degrees_of_rotation;
			var seTo = eTo + degrees_of_rotation;
			var sTo = seTo + degrees_of_rotation;
			var swTo = sTo + degrees_of_rotation;
			var wTo = swTo + degrees_of_rotation;
			var nwTo = wTo + degrees_of_rotation;

			if (degrees <= nTo) return "N";
			if (degrees >  nTo  && degrees <= neTo) return "NE";
			if (degrees >  neTo && degrees <= eTo)  return "E";
			if (degrees >  eTo  && degrees <= seTo) return "SE";
			if (degrees >  seTo && degrees <= sTo)  return "S";
			if (degrees >  sTo  && degrees <= swTo) return "SW";
			if (degrees >  swTo && degrees <= wTo)  return "W";
			if (degrees >  wTo  && degrees <= nwTo) return "NW";
			if (degrees >  nwTo) return "N";
		}

		// secondary intercardinal direction
		if (precision == 3) {

			var degrees_of_rotation = 360 / 16;
			var nTo   = degrees_of_rotation / 2;
			var nneTo = nTo +   degrees_of_rotation;
			var neTo  = nneTo + degrees_of_rotation;
			var eneTo = neTo +  degrees_of_rotation;
			var eTo   = eneTo + degrees_of_rotation;
			var eseTo = eTo +   degrees_of_rotation;
			var seTo  = eseTo + degrees_of_rotation;
			var sseTo = seTo +  degrees_of_rotation;
			var sTo   = sseTo + degrees_of_rotation;
			var sswTo = sTo +   degrees_of_rotation;
			var swTo  = sswTo + degrees_of_rotation;
			var wswTo = swTo +  degrees_of_rotation;
			var wTo   = wswTo + degrees_of_rotation;
			var wwTo  = wTo +   degrees_of_rotation;
			var nwTo  = wwTo +  degrees_of_rotation;
			var nnwTo = nwTo +  degrees_of_rotation;

			if (degrees <= nTo)   return "N";
			if (degrees <= nneTo) return "NNE";
			if (degrees <= neTo)  return "NE";
			if (degrees <= eneTo) return "ENE";
			if (degrees <= eTo)   return "E";
			if (degrees <= eseTo) return "ESE";
			if (degrees <= seTo)  return "SE";
			if (degrees <= sseTo) return "SSE";
			if (degrees <= sTo)   return "S";
			if (degrees <= sswTo) return "SSW";
			if (degrees <= swTo)  return "SW";
			if (degrees <= wswTo) return "WSW";
			if (degrees <= wTo)   return "W";
			if (degrees <= wnwTo) return "WNW";
			if (degrees <= nwTo)  return "NW";
			if (degrees <= nnwTo) return "NNW";
			if (degrees >  nnwTo) return "N";

		}

		return "";
	}
	
	/**
	 * Havesine formula to calculate the great-circle distance between two points
	 * @param {number} lat1 	In degrees
	 * @param {number} lng1 	In degrees
	 * @param {number} lat2 	In degrees
	 * @param {number} lng2 	In degrees
	 * @param {Units} units 
	 * @returns {number}
	 */
	function getDistance(lat1, lng1, lat2, lng2, units) {

		const rLat1	= deg2rad(lat1); 		// Latitude1 in radians
		const rLat2	= deg2rad(lat2); 		// Latitude2 in radians
		const dLat  = deg2rad(lat1 - lat2); // Latitude difference in radians
		const dLong = deg2rad(lng1 - lng2); // Longitude difference in radians

		const a = 
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(rLat1) * Math.cos(rLat2) * 
			Math.sin(dLong / 2) * Math.sin(dLong / 2);
		
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		// TODO: add suport for various units and precision rounding

		return metersConverter((R * c), units);
	}

	/**
	 * Convert length/distance from base unit (meters)
	 * @param {number} distance 
	 * @param {Units} units 
	 * @returns {number}
	 */
	function metersConverter(distance, units="m") {
		
		if (units === "m") return distance;

		switch(units) {
			case("km"):
				return (distance * 0.001);
				break;
			case("ft"):
				return (distance * 3.28084);
				break;
			case("yd"):
				return (distance * 1.0936);
				break;
			case("mi"):
				return (distance * 0.000621371);
				break;
			case("nm"):
				return (distance * 0.000539957);
				break;
			default:
				return distance;
				break;
		}
		
	}

	

	
	

	// Create output object
	let output = {};

	//console.log(getDistance(lat1, lng1, lat2, lng2).round(2));

	// Distance in meters
	output.distance = getDistance(lat1, lng1, lat2, lng2).round(distancePrecision);

	output.units = units;
	
	const bearing = roundNumber(getBearing(lat1, lng1, lat2, lng2), bearingPrecision);
	output.bearing = bearing;

	if (directionPrecision !== 0) {
		output.direction = getDirection(bearing, directionPrecision);
	}


	return output; 

}