var azimuth = require('./azimuth.js');

const LONDON = {lat: 51.509865, lng: -0.118092};
const NEW_YORK = {lat: 40.730610, lng: -73.935242};

describe('Validation tests', () => {
    test('Validate Point', () => {
        expect(azimuth({})).toThrowError(Error);
    });

    test('Validate Latitude', () => {
        expect(azimuth({ lat: 190, lng: 0 })).toThrowError(Error);
    });

    test('Validate Longitude', () => {
        expect(azimuth({ lat: 0, lng: 100 })).toThrowError(expected);
    });

    test('Validate Units', () => {
        expect(azimuth(LONDON, NEW_YORK, { units: "car" })).toThrowError(expected);
    });

    test('Validate invalid Distance/Azimuth Precision Rounding', () => {
        expect(azimuth(LONDON, NEW_YORK, { distancePrecision: "car" })).toThrowError(expected);
    });

    test('Validate exceeding Distance/Azimuth Precision Rounding', () => {
        expect(azimuth(LONDON, NEW_YORK, { distancePrecision: 50 })).toThrowError(expected);
    });

    test('Validate invalid Compass Precision', () => {
        expect(azimuth(LONDON, NEW_YORK, { directionPrecision: 50 })).toThrowError(expected);
    });

    test('Validate Calculation Formula', () => {
        expect(azimuth(LONDON, NEW_YORK, { formula: "car" })).toThrowError(expected);
    });
});

describe('Validation tests', () => {
    
    test('Validate Defaults', () => {
        expect(azimuth(LONDON, NEW_YORK)).toEqual({
            formula: "great-circle",
            distance: 5564892.653,
            units: "mi",
            azimuth: 258.049,
            direction: "W"
        });
    });

    test('Validate Units', () => {
        expect(azimuth(LONDON, NEW_YORK, {"units": "yd"})).toEqual({
            formula: "great-circle",
            distance: 5564892.653,
            units: "mi",
            azimuth: 258.049,
            direction: "W"
        });
    });

});