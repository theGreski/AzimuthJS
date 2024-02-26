(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.azimuth = factory());
}(this, (function () {
    const R = 6371009;

    Number.prototype.round = function (value = 0) {
        const num = new Number(this.valueOf());
        return +(Math.round(num + "e+" + value)  + "e-" + value);
    };

    function deg2rad(d) { return (d * (Math.PI / 180)); }

    function degrees(n) { return (n * (180 / Math.PI)); }

    function getBearingRhumbLine(lat1, lng1, lat2, lng2) {
        
        // if coordinates are the same, distance is zero (skip calculations)
        if (lat1 === lat2 && lng1 === lng2) return 0;
    
        const rLat1 = deg2rad(lat1);
        const rLat2 = deg2rad(lat2);
        let dLong = deg2rad(lng2 - lng1);
                    
        const dPhi = Math.log( Math.tan( Math.PI / 4 + rLat2  / 2) / Math.tan(Math.PI / 4 + rLat1 / 2));
        
        if (Math.abs(dLong) > Math.PI) {
            if (dLong > 0)
                dLong = -(2 * Math.PI - dLong);
            else
                dLong = (2 * Math.PI + dLong);
        }
        const radians = Math.atan2(dLong, dPhi);
        const brng =  (degrees(radians) + 360) % 360; // in degrees
    
        return brng;
        
    }

    function getBearingGreatCircle(lat1, lng1, lat2, lng2) {

        const rLat1 = deg2rad(lat1);
        const rLat2 = deg2rad(lat2);
        const dLong = deg2rad(lng2 - lng1);
    
        const y = Math.sin(dLong) * Math.cos(rLat2);
        const x = Math.cos(rLat1) * Math.sin(rLat2) -
                  Math.sin(rLat1) * Math.cos(rLat2) * Math.cos(dLong);
        const radians = Math.atan2(y, x);
        const brng = (degrees(radians) + 360) % 360; // in degrees
    
        return brng;
    
    }

    function getCompassDirection(degrees, precision) {
    
        if (isNaN(degrees) || isNaN(precision)) {
            throw new Error('Parameter is not a number!');
        }
    
        if (degrees < 0 || degrees > 360) {
            throw new Error('Parameter outside of range!');
        }
    
        if (precision < 1 || precision > 3) {
            throw new Error('Parameter outside of range!');
        }
    
        // Set default percision list
        const    directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        
        // Default precision number of directions
        // cardinal directions
        let maxDirections = 4;
    
        // Intercardinal directions
        if (precision === 2) {
            maxDirections = 8;
        }
        // secondary intercardinal direction
        if (precision === 3) {
            maxDirections = 16; // Lenght of the list of directions
        }
        
        let unitAngle = 360 / maxDirections;
        
        let indexMultiplier = directions.length / maxDirections;
    
    
        let index = Math.round(degrees / unitAngle) * indexMultiplier;
        
        // If over the last direction, display first
        if (index >= directions.length) index = 0;
    
        return directions[index];
    
    }

    function getDistanceGreatCircle(lat1, lng1, lat2, lng2) {

        // if coordinates are the same, distance is zero (skip calculations)
        if (lat1 === lat2 && lng1 === lng2) return 0;
    
        const rLat1 = deg2rad(lat1);         // Latitude1 in radians
        const rLat2 = deg2rad(lat2);         // Latitude2 in radians
        const dLat  = deg2rad(lat1 - lat2); // Latitude difference in radians
        const dLong = deg2rad(lng1 - lng2); // Longitude difference in radians
    
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rLat1) * Math.cos(rLat2) * 
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        return (R * c);
    }

    function getDistanceRhumbLine(lat1, lng1, lat2, lng2) {

        // if coordinates are the same, distance is zero (skip calculations)
        if (lat1 === lat2 && lng1 === lng2) return 0;
    
        const rLat1 = deg2rad(lat1);         // Latitude1 in radians
        const rLat2 = deg2rad(lat2);         // Latitude2 in radians
        const dLat  = deg2rad(lat1 - lat2); // Latitude difference in radians
        let dLong = deg2rad(lng1 - lng2); // Longitude difference in radians
    
        const dPhi = Math.log(Math.tan(Math.PI / 4 + rLat2 / 2) / Math.tan(Math.PI / 4 + rLat1 / 2));
        const q = Math.abs(dPhi) > 10e-12 ? dLat / dPhi : Math.cos(rLat1); // E-W course becomes ill-conditioned with 0/0
    
        // if dLon over 180° take shorter rhumb line across the anti-meridian:
        if (Math.abs(dLong) > Math.PI) {
            if (dLong > 0)
                dLong = -(2 * Math.PI - dLong);
            else
                dLong = (2 * Math.PI + dLong);
        }
    
        const dist = Math.sqrt(dLat * dLat + q * q * dLong * dLong) * R;
    
        return dist;
    
    }

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

    const azimuth = function (lat1, lng1, lat2, lng2, {units = "m", distancePrecision = 0, formula = "great-circle", bearingPrecision = 0, directionPrecision = 2} = {}) {
    
        // Validate parameters
        if (isNaN(lat1) || isNaN(lat2) || isNaN(lng1) || isNaN(lng2) || isNaN(bearingPrecision) || isNaN(directionPrecision)) {
            throw new Error('Latitude/Longitude parameter is not a number!');
        }
    
        // Validate coordinates
        if (Math.abs(lat1) > 90 || Math.abs(lat2) > 90 || Math.abs(lng1) > 180 || Math.abs(lng2) > 180) {
            throw new Error('Latitude/Longitude parameter exceeding maximal value!');
        }
    
        // Validate precisions rounding
        if (isNaN(distancePrecision) || isNaN(bearingPrecision) || distancePrecision > 15 || bearingPrecision > 15) {
            throw new Error('Precision parameter is not a number or exceeds it\'s maximum value of 15!');
        }
    
        // Validate output distance units
        if (!["m", "km", "ft", "yd", "mi", "nm"].includes(units)) {
            throw new Error('Units parameter type not supported!');
        }
    
        // Validate calculation formula type
        if (!["great-circle", "rhumb-line"].includes(formula)) {
            throw new Error('Calculation formula type parameter not supported!');
        }
        
        // Create output object
        let output = {};
    
        // Add distance to the object
        const distance = metersConverter(formula === "rhumb-line" ? getDistanceRhumbLine(lat1, lng1, lat2, lng2) : getDistanceGreatCircle(lat1, lng1, lat2, lng2), units).round(distancePrecision);
        output.distance = distance;
    
        // Add units of measure to the object
        output.units = units;
        
        // Add bearing to the object
        const bearing = distance === 0 ? "" : (formula === "rhumb-line" ? getBearingRhumbLine(lat1, lng1, lat2, lng2) : getBearingGreatCircle(lat1, lng1, lat2, lng2)).round(bearingPrecision)
        output.bearing = bearing;
        
        output.formula = formula;
    
        // Add compass direction to the object
        if (directionPrecision !== 0) {
            output.direction = distance === 0 ? "" : getCompassDirection(bearing, directionPrecision);
        }
    
        return output; 
    
    }

    return azimuth;

})));