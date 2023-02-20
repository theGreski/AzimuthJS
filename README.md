# Summary
AzimuthJS is a small, stand-alone script to calculate distance, azimuth and bearing between two points (given the latitude/longitude of those points).

South latitudes are negative, east longitudes are positive

## Usage
The azimuth function accepts coordinates of two points (latitude1, longitude1, latitude2, longitude2). For example London to New York:

```javascript
azimuth(51.509865, -0.118092, 40.730610, -73.935242)
```

The output will look like this:
```javascript
{
    distance: 55648932,
    units: "m",
    bearing: 258,
    direction: "W"
}
```

## Options

You can configure th following options:

- [`units`](#units)
- [`distancePrecision`](#distanceprecision)

Here's an example specyfyimg all available options:

```javascript
azimuth(51.509865, -0.118092, 40.730610, -73.935242, "mi", 3, 3, 2)
```

The output will look like this:
```javascript
{
    distance: 5564892.653,
    units: "mi",
    bearing: 258.049,
    direction: "W"
}
```


### `units`

A string indicating units of the distance.

Accepts only:

  `m` for meters,  
  `km` for kilometers,  
  `ft` for foots,  
  `yd` for yards,  
  `mi` for miles,  
  `nm` for nautical miles 
  
- **Default**: `m`.


Complete list of all parameters, including optional

  * `latitude1`  - Latitude of the first point, mandatory, number
  * `longitude1` - Longitude of the first point, mandatory, number
  * `latitude2`  - Latitude of the second point, mandatory, number
  * `longitude2` - Longitude of the second point, mandatory, number
  * `units`      - Units of the distance. Accepts only:

    "m" for meters,  
    "km" for kilometers,  
    "ft" for foots,  
    "yd" for yards,  
    "mi" for miles,  
    "nm" for nautical miles 
    Optional. Default is meters.
  * `distancePrecision`  - Number of decimal places for distance; Optional. Default is 0; 
  * `bearingPrecision`   - Number of decimal places for azimuth degrees; Optional. Default 0;
  * `directionPrecision` - Compass direction precision; Accepts only:

    0 - No compass dirction,  
    1 - Cardinal directions (N, E, S, W)  
    2 - Intercardinal directions (N, NE, E, SE, S, SW, W, NW)  
    3 - Secondary intercardinal directions (N, NNE, NE, ENE, E, ESE, SE, SSE, S, SSW, SW, WSW, W, WNW, NW, NNW)  
    Optional. Default is 1.


Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php)
