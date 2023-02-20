# AzimuthJS
![GitHub](https://img.shields.io/github/license/grekowski/AzimuthJS)  ![GitHub](https://img.shields.io/github/languages/top/grekowski/AzimuthJS)

AzimuthJS is a small, stand-alone script to calculate distance, azimuth and bearing between two points (given the latitude/longitude of those points).

South latitudes are negative, east longitudes are positive.

## Installation
Link `azimuth.min.js` in your HTML :

**Load exact version:**
```html
<script src="https://cdn.jsdelivr.net/gh/grekowski/AzimuthJS@1.1.0/dist/azimuth.min.js"></script>
```

**Load a version range instead of an exact version:**
```html
<script src="https://cdn.jsdelivr.net/gh/grekowski/AzimuthJS@1.1/dist/azimuth.min.js"></script>
```

**Omit the version completely and use "latest" to load the latest one (not recommended for production usage):**
```html
<script src="https://cdn.jsdelivr.net/gh/grekowski/AzimuthJS@latest/dist/azimuth.min.js"></script>
```


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
    method: "great-circle",
    direction: "W"
}
```

Or wrap aroud try catch block to find any validation isues:

```javascript
try {
  azimuth(9999, -200, "abc", null)
} catch (e) {
  console.error(e)
}
```

## Options

You can configure the following options:

- [`units`](#units)
- [`formula`](#formula)
- [`distancePrecision`](#distanceprecision)
- [`bearingPrecision`](#bearingprecision)
- [`directionPrecision`](#directionprecision)

Here's an example specyfying all available options:

```javascript
azimuth(51.509865, -0.118092, 40.730610, -73.935242,  
  {  
    units: "mi",  
    formula: "great-circle",  
    distancePrecision: 3,  
    bearingPrecision: 3,  
    directionPrecision: 2  
  }  
)
```

The output will look like this:
```javascript
{
    formula: "great-circle",
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

- **Default**: `m`


### `methodformula`

A string indicating calculation methodformula.

Accepts only:
  `great-circle` for Great Circle,
  `rhumb-line` for straight line

- **Default**: `great-circle`


### `distancePrecision`

A number indicating number of rounding decimal places (precision) for distance measeure.

- **Default**: `0`


### `bearingPrecision`

A number indicating number of rounding decimal places (precision) for bearing measeure.

- **Default**: `0`


### `directionPrecision`

A number indicating precision for compas direction measeure.

Accepts only:

  `0` No compass direction,  
  `1` Cardinal directions (N, E, S, W)  
  `2` Intercardinal directions (N, NE, E, SE, S, SW, W, NW)  
  `3` Secondary intercardinal directions (N, NNE, NE, ENE, E, ESE, SE, SSE, S, SSW, SW, WSW, W, WNW, NW, NNW)

- **Default**: `1`




Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php)
