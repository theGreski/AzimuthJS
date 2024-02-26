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

    function rad2deg(r) { return (r * (180 / Math.PI)); }

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

    function calculateAzimuthGreatCircle(lat1, lng1, lat2, lng2) {

        const rLat1 = deg2rad(lat1);
        const rLat2 = deg2rad(lat2);
        const dLong = deg2rad(lng2 - lng1);
    
        const y = Math.sin(dLong) * Math.cos(rLat2);
        const x = Math.cos(rLat1) * Math.sin(rLat2) -
                  Math.sin(rLat1) * Math.cos(rLat2) * Math.cos(dLong);
        const radians = Math.atan2(y, x);
        const brng = (rad2deg(radians) + 360) % 360;
    
        return brng;
    
    }

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
        
        let maxDirections = 4;
    
        if (precision == 2) {
            maxDirections = 8;
        }
        
        if (precision == 3) {
            maxDirections = 16;
        }
        
        const unitAngle = 360 / maxDirections;
        
        const indexMultiplier = directions.length / maxDirections;
    
    
        let index = Math.round(degrees / unitAngle) * indexMultiplier;
        
        if (index >= directions.length) index = 0;
    
        return directions[index];
    
    }

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

    function getDistanceRhumbLine(lat1, lng1, lat2, lng2) {

        if (lat1 === lat2 && lng1 === lng2) return 0;
    
        const rLat1 = deg2rad(lat1);
        const rLat2 = deg2rad(lat2);
        const dLat  = deg2rad(lat1 - lat2);
        let dLong = deg2rad(lng1 - lng2);
    
        const dPhi = Math.log(Math.tan(Math.PI / 4 + rLat2 / 2) / Math.tan(Math.PI / 4 + rLat1 / 2));
        const q = Math.abs(dPhi) > 10e-12 ? dLat / dPhi : Math.cos(rLat1);
    
        if (Math.abs(dLong) > Math.PI) {
            if (dLong > 0)
                dLong = -(2 * Math.PI - dLong);
            else
                dLong = (2 * Math.PI + dLong);
        }
    
        const dist = Math.sqrt(dLat * dLat + q * q * dLong * dLong) * R;
    
        return dist;
    
    }

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

    const azimuth = function (pointA, pointB, {units = "m", distancePrecision = 0, formula = "great-circle", azimuthPrecision = 0, directionPrecision = 2} = {}) {
        
        [pointA,pointB].forEach((e)=>{
            if (!e.hasOwnProperty("lat") || !e.hasOwnProperty("lng")) {
                throw new Error('Latitude/Longitude property missing!');
            }
            if (isNaN(e.lat) || isNaN(e.lng)) {
                throw new Error('Latitude/Longitude property must be a number!');
            }
            if (Math.abs(e.lat) > 90 || Math.abs(pointA.lng) > 180) {
                throw new Error('Latitude/Longitude property exceeding maximal value!');
            }
        })
        
        if (!["m", "km", "ft", "yd", "mi", "nm"].includes(units)) {
            throw new Error('Units parameter type not supported!');
        }
        
        if (isNaN(distancePrecision) || isNaN(azimuthPrecision) || distancePrecision > 15 || azimuthPrecision > 15) {
            throw new Error('Precision parameter is not a number or exceeds it\'s maximum value of 15!');
        }
        
        if (!["great-circle", "rhumb-line"].includes(formula)) {
            throw new Error('Calculation formula type parameter not supported!');
        }
        
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