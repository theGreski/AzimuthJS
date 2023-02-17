/**
 * Calculate the distance, bearing and direction between two coordinates
 * @param {number} startLatitude 		Starting point latitude
 * @param {number} startLongitude 		Starting point longitude
 * @param {number} endLatitude 			Ending point latitude
 * @param {number} endLongitude 		Ending point longitude
 * @param {number} bearingPrecision  	Degree precision rounding; Default 0;
 * @param {number} directionPrecision  	Direction precision; Accepts only 0, 1, 2 and 3; 0 disables the parameter; Default 1;
 * @returns {Object}
 */
function calcDistanceBearing(startLatitude, startLongitude, endLatitude, endLongitude, bearingPrecision = 0, directionPrecision = 0) {
	
	const R = 6371000; // radius of earth in meters

	// Numeric degrees to radians
	function deg2rad(d) { return d * (Math.PI / 180); }
				
	function degrees(n) { return n * (180 / Math.PI); }
				
	function getBearing(startLatitude, startLongitude, endLatitude, endLongitude) {
		startLatitude = deg2rad(startLatitude);
		startLongitude = deg2rad(startLongitude);
		endLatitude = deg2rad(endLatitude);
		endLongitude = deg2rad(endLongitude);
				
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

	// 
	const dLat  = deg2rad(startLatitude - endLatitude);
	const dLong = deg2rad(startLongitude - endLongitude);

	const a = 
			Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(rad(startLatitude)) * Math.cos(rad(startLatitude)) * 
			Math.sin(dLong/2) * Math.sin(dLong/2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	

	// Create output object
	var output = {};

	
	// Distance in meters
	output.distance = R * c;
	
	const bearing = roundNumber(getBearing(startLatitude, startLongitude, endLatitude, endLongitude), bearingPrecision);
	output.bearing = bearing;

	if (directionPrecision != 0) {
		output.direction = getDirection(bearing, directionPrecision);
	}


	return output;

}
