const azimuth = require('./azimuth.js');

const LONDON = {lat: 51.509865, lng: -0.118092};
const NEW_YORK = {lat: 40.730610, lng: -73.935242};

describe('Validation testing', () => {
    
    test('Validate Point', () => {
        expect(() => azimuth({})).toThrow('At least one point is missing!');
    });

    test('Validate Latitude', () => {
        expect(() => azimuth({ lat: 190, lng: 0 },NEW_YORK)).toThrow(Error);
    });

    test('Validate Longitude', () => {
        expect(() => azimuth({ lat: 0, lng: 100 },NEW_YORK)).toThrow(Error);
    });

    test('Validate Units', () => {
        expect(() => azimuth(LONDON, NEW_YORK, { units: "car" })).toThrow(Error);
    });

    test('Validate invalid Distance/Azimuth Precision Rounding', () => {
        expect(() => azimuth(LONDON, NEW_YORK, { distancePrecision: "car" })).toThrow(Error);
    });

    test('Validate exceeding Distance/Azimuth Precision Rounding', () => {
        expect(() => azimuth(LONDON, NEW_YORK, { distancePrecision: 50 })).toThrow(Error);
    });

    test('Validate invalid Compass Precision', () => {
        expect(() => azimuth(LONDON, NEW_YORK, { directionPrecision: 50 })).toThrow(Error);
    });

    test('Validate Calculation Formula', () => {
        expect(() => azimuth(LONDON, NEW_YORK, { formula: "car" })).toThrow(Error);
    });
});

describe('Results testing', () => {
    
    test('Validate Defaults', () => {
        expect(azimuth(LONDON, NEW_YORK)).toEqual({
            formula: "great-circle",
            distance: 5564893,
            units: "m",
            azimuth: 288,
            direction: "W"
        });
    });

    test('Validate Units', () => {
        expect(azimuth(LONDON, NEW_YORK, {"units": "yd"})).toEqual({
            formula: "great-circle",
            distance: 6085767,
            units: "yd",
            azimuth: 288,
            direction: "W"
        });
    });

    test('Validate Formula', () => {
        expect(azimuth(LONDON, NEW_YORK, {"formula":"rhumb-line"})).toEqual({
            formula: "rhumb-line",
            distance: 5788236,
            units: "m",
            azimuth: 258,
            direction: "W"
        });
    });

    test('Validate Distance Precision', () => {
        expect(azimuth(LONDON, NEW_YORK, {"distancePrecision":4})).toEqual({
            formula: "great-circle",
            distance: 5564892.6529,
            units: "m",
            azimuth: 288,
            direction: "W"
        });
    });

    test('Validate Azimuth Precision', () => {
        expect(azimuth(LONDON, NEW_YORK, {"azimuthPrecision":4})).toEqual({
            formula: "great-circle",
            distance: 5564893,
            units: "m",
            azimuth: 288.3081,
            direction: "W"
        });
    });
    
    test('Validate Azimuth Precision', () => {
        expect(azimuth(LONDON, NEW_YORK, {"directionPrecision":3})).toEqual({
            formula: "great-circle",
            distance: 5564893,
            units: "m",
            azimuth: 288,
            direction: "WNW"
        });
    });

    test('Validate No Azimuth Precision', () => {
        expect(azimuth(LONDON, NEW_YORK, {"directionPrecision":0})).toEqual({
            formula: "great-circle",
            distance: 5564893,
            units: "m",
            azimuth: 288
        });
    });
    
});