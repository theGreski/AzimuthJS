// minified on https://www.digitalocean.com/community/tools/minify
// Validated on https://validatejavascript.com/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.azimuth = factory());
}(this, (function () {

    /**
     * @typedef {Object} Azimuth
     * @property {number} distance Distance in units provided
     * @property {string} units Units of the distance
     * @property {number} azimuth Angle azimuth from point 1 to point 2
     * @property {string} formula Method used to calculate azimuth
     * @property {string} direction    Compass direction from point 1 to point 2
     */
    /**
     * @typedef {Object} Coordinates
     * @property {number} lat Latitude
     * @property {number} lng Longitude
     */
    /**
     * @typedef {"m" | "km" | "ft" | "yd" | "mi" | "nm"} Units
     */
    /**
     * @typedef {"great-circle" | "rhumb-line"} Formula
     */

    /**
     * Mean radius of earth in meters used for calculations.
     * A globally-average value is usually considered to be 6,371 kilometres (3,959 mi) with a 0.3% variability
     * @type {Number}
     * @const
     */
    const R = 6371009;

    /**
     * Rounding a number to a specific number of decimal places
     * @param {number} value
     * @returns {number}
     */
    Number.prototype.round = function (value = 0) {
        const num = new Number(this.valueOf());
        return +(Math.round(num + "e+" + value)  + "e-" + value);
    };

    /**
     * Decimal degrees to radians
     * @param {number} d
     * @returns {number}
     */
    function deg2rad(d) { return (d * (Math.PI / 180)); }

    /**
     * Radians to degrees
     * @param {number} r
     * @returns {number}
     */
    function rad2deg(r) { return (r * (180 / Math.PI)); }

    /**
     * Calculate azimuth using rhumb line formula
     */
    function calculateAzimuthRhumbLine(lat1, lng1, lat2, lng2) {
        
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
        const brng =  (rad2deg(radians) + 360) % 360;
    
        return brng;
        
    }

    /**
     * Get azimuth using great circle formula
     */
    function calculateAzimuthGreatCircle(lat1, lng1, lat2, lng2) {

        if (lat1 === lat2 && lng1 === lng2) return 0;

        const rLat1 = deg2rad(lat1);
        const rLat2 = deg2rad(lat2);
        const dLong = deg2rad(lng2 - lng1);
    
        const y = Math.sin(dLong) * Math.cos(rLat2);
        const x = Math.cos(rLat1) * Math.sin(rLat2) -
                  Math.sin(rLat1) * Math.cos(rLat2) * Math.cos(dLong);
        const radians = Math.atan2(y, x);
        const brng = (rad2deg(radians) + 360) % 360; // in degrees
    
        return brng;
    
    }

    /**
     * Convert degrees to compass direction
     * @param {number} degrees 
     * @param {number} precision 
     * @returns {string}
     */
    function convertToCompassDirection(degrees, precision) {
    
        if (isNaN(degrees) || isNaN(precision)) {
            throw new Error('Parameter is not a number!');
        }
    
        if (degrees < 0 || degrees > 360) {
            throw new Error('Parameter outside of range!');
        }
    
        if (precision < 1 || precision > 3) {
            throw new Error('Parameter outside of range!');
        }
    
        const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        
        // Cardinal directions
        let maxDirections = 4;
    
        // Intercardinal directions (default)
        if (precision == 2) {
            maxDirections = 8;
        }
        
        // secondary intercardinal direction
        if (precision == 3) {
            maxDirections = 16; // Must match the lenght of the list of directions
        }
        
        const unitAngle = 360 / maxDirections;
        
        const indexMultiplier = directions.length / maxDirections;
    
        let index = Math.round(degrees / unitAngle) * indexMultiplier;
        
        // If over the last direction, display first
        if (index >= directions.length) index = 0;
    
        return directions[index];
    
    }

    /**
     * Havesine formula to calculate the great-circle distance between two points
     * @param {number} lat1     In degrees
     * @param {number} lng1     In degrees
     * @param {number} lat2     In degrees
     * @param {number} lng2     In degrees
     * @returns {number}
     */
    function getDistanceGreatCircle(lat1, lng1, lat2, lng2) {

        if (lat1 === lat2 && lng1 === lng2) return 0;
    
        const rLat1 = deg2rad(lat1);
        const rLat2 = deg2rad(lat2);
        const dLat  = deg2rad(lat1 - lat2);
        const dLong = deg2rad(lng1 - lng2);
    
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rLat1) * Math.cos(rLat2) * 
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        return (R * c);
    }

    /**
     * Inverse Gudermannian formula to calculate the great-circle distance between two points
     * @param {number} lat1     In degrees
     * @param {number} lng1     In degrees
     * @param {number} lat2     In degrees
     * @param {number} lng2     In degrees
     * @returns {number}
     */
    function getDistanceRhumbLine(lat1, lng1, lat2, lng2) {

        if (lat1 === lat2 && lng1 === lng2) return 0;
    
        const rLat1 = deg2rad(lat1);
        const rLat2 = deg2rad(lat2);
        const dLat  = deg2rad(lat1 - lat2);
        let dLong = deg2rad(lng1 - lng2);
    
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

    /**
     * Convert length/distance from base unit (meters)
     * @param {number} distance 
     * @param {Units} units 
     * @returns {number}
     */
    function unitsConverter(distance, units="m") {
        
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

    /**
     * Calculate the distance, azimuth and direction between two coordinates.
     * 
     * Distance and azimuth can use "Great-Circle" or "Rhumb line" formulas.
     * Great Circle calculations on the basis of a spherical earth (ignoring ellipsoidal effects) *which is accurate enough* for most purposes… 
     * In fact, the earth is very slightly ellipsoidal; using a spherical model gives errors typically up to 0.3%.
     * 
     * Great Circle distance uses the ‘haversine’ formula to calculate distance between two points (also known as the ‘crow-line’) 
     * - that is, the shortest distance over the earth’s surface.
     * 
     * 
     * With 'great-circle' your current heading will vary as you follow a great circle path (orthodrome); 
     * The final heading will differ from the initial heading. This will provide initial heading.
     * A ‘rhumb line’ (or loxodrome) is a path of constant azimuth but are generally longer than great-circle (sometimes up to 30%)
     * 
     * @param {Coordinates} pointA                           Coordinates of starting point
     * @param {Coordinates} pointB                           Coordinates of destination point
     * @param {Object} options
     * @param {Units} [options.units="m"]                    Units of the distance; Default "m" meters. Accepts only:
     *                                                          "m" for meters, 
     *                                                          "km" for kilometers, 
     *                                                          "ft" for foots, 
     *                                                          "yd" for yards, 
     *                                                          "mi" for miles, 
     *                                                          "nm" for nautical miles
     * @param {number} [options.distancePrecision=0]         Number of decimal places for distance; Default 0; 
     * @param {Formula} [options.formula="great-circle"]     Formula of calculation; Accepts only "great-circle" and "rhumb-line"; Default "great-circle";
     * @param {number} [options.azimuthPrecision=0]          Number of decimal places for azimuth degrees; Default 0;
     * @param {number} [options.directionPrecision=2]        Direction precision; Accepts only 0, 1, 2 and 3; 0 disables the parameter; Default 2;
     * @returns {Azimuth}
     * @throws {Error}
     */
    const azimuth = function (pointA, pointB, {units = "m", distancePrecision = 0, formula = "great-circle", azimuthPrecision = 0, directionPrecision = 2} = {}) {
        
        // Validate coordinates
        [pointA,pointB].forEach((e)=>{
            if (!e.hasOwnProperty("lat") || !e.hasOwnProperty("lng")) {
                throw new Error('Latitude/Longitude property missing!');
            }
            if (isNaN(e.lat) || isNaN(e.lng)) {
                throw new Error('Latitude/Longitude property must be a number!');
            }
            if (Math.abs(e.lat) > 90 || Math.abs(e.lng) > 180) {
                throw new Error('Latitude/Longitude property exceeding maximal value!');
            }
        })
        
        // Validate output distance units
        if (!["m", "km", "ft", "yd", "mi", "nm"].includes(units)) {
            throw new Error('Units parameter type not supported!');
        }
        
        // Validate precisions rounding
        if (isNaN(distancePrecision) || isNaN(azimuthPrecision) || distancePrecision > 15 || azimuthPrecision > 15) {
            throw new Error('Precision parameter is not a number or exceeds it\'s maximum value of 15!');
        }
        
        // Validate calculation formula type
        if (!["great-circle", "rhumb-line"].includes(formula)) {
            throw new Error('Calculation formula type parameter not supported!');
        }
        
        // Validate compass precision
        if (![0, 1, 2, 3, "0", "1", "2", "3"].includes(directionPrecision)) {
            throw new Error('Compass precision parameter not supported!');
        }
        
        let output = {};
        
        const distance = unitsConverter(formula === "rhumb-line" ? getDistanceRhumbLine(pointA.lat, pointA.lng, pointB.lat, pointB.lng) : getDistanceGreatCircle(pointA.lat, pointA.lng, pointB.lat, pointB.lng), units).round(distancePrecision);
        output.distance = distance;
        
        output.units = units;
        
        const azimuth = distance === 0 ? "" : (formula === "rhumb-line" ? calculateAzimuthRhumbLine(pointA.lat, pointA.lng, pointB.lat, pointB.lng) : calculateAzimuthGreatCircle(pointA.lat, pointA.lng, pointB.lat, pointB.lng)).round(azimuthPrecision)
        output.azimuth = azimuth;
        
        output.formula = formula;
        
        if (directionPrecision != 0) {
            output.direction = distance === 0 ? "" : convertToCompassDirection(azimuth, directionPrecision);
        }
    
        return output; 
    
    }

    return azimuth;

})));