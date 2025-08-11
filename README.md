# AzimuthJS
![GitHub](https://img.shields.io/github/license/theGreski/AzimuthJS)  ![GitHub](https://img.shields.io/github/languages/top/theGreski/AzimuthJS)

AzimuthJS is a small, stand-alone script/module to calculate distance, azimuth and direction between two points (given the latitude/longitude of those points).

South latitudes are negative, east longitudes are positive.

## Installation
Link `azimuth.min.js` in your HTML :

**Load exact version:**  Latest version is ![GitHub](https://img.shields.io/github/v/release/theGreski/AzimuthJS?style=plastic&label=)
```html
<script src="https://cdn.jsdelivr.net/gh/theGreski/AzimuthJS@2.0.1/dist/azimuth.min.js"></script>
```

**Load a version range instead of an exact version:**
```html
<script src="https://cdn.jsdelivr.net/gh/theGreski/AzimuthJS@2.0/dist/azimuth.min.js"></script>
```

**Omit the version completely and use "latest" to load the latest one (not recommended for production usage):**
```html
<script src="https://cdn.jsdelivr.net/gh/theGreski/AzimuthJS@latest/dist/azimuth.min.js"></script>
```

**Load module in JS:**
```javascript
const azimuth = require('https://cdn.jsdelivr.net/gh/theGreski/AzimuthJS@latest/dist/azimuth.min.js');
```

**Load ESM module:**
```javascript
import azimuth from 'https://cdn.jsdelivr.net/gh/theGreski/AzimuthJS@latest/dist/azimuth.min.js';
```

**Node.js ESM:**
```javascript
import azimuth from 'azimuthjs';
```

## Usage
The azimuth function accepts coordinates of two points ({lat: latitude, lng: longitude}, {lat: latitude, lng: longitude}). For example London to New York:

```javascript
azimuth({lat: 51.509865, lng: -0.118092}, {lat: 40.730610, lng: -73.935242})
```

The output will look like this:
```javascript
{
    distance: 55648932,
    units: "m",
    bearing: 258,
    formula: "great-circle",
    direction: "W"
}
```

Or wrap aroud try catch block to find any validation isues:

```javascript
try {
  azimuth({lat: 9999, lng: -200}, {lat: "abc", lng: null}, null)
} catch (e) {
  console.error(e)
}
```

## Options

You can configure the following options:

- [`units`](#units)
- [`formula`](#formula)
- [`distancePrecision`](#distanceprecision)
- [`bearingPrecision`](#azimuthprecision)
- [`directionPrecision`](#directionprecision)

Here's an example specyfying all available options:

```javascript
azimuth({lat: 51.509865, lng: -0.118092}, {lat: 40.730610, lng: -73.935242},  
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

### `Parameters`

| Option | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| units | string | A string indicating units of the distance. Supported units are:  
`m`, `km`, `ft`, `yd`, `mi`, `nm` | "m" |
| formula | string | Calculation formula. Supported types are:  
`great-circle`, `rhumb-line` | "great-circle" |
| distancePrecision | number | Rounding precision for distance.  
Between `0` and `15`. | 0 |
| bearingPrecision | number | Rounding precision for bearing.  
Between `0` and `15`. | 0 |
| directionPrecision | number | Precision for compass direction. Supported types are:  
`0` no directions,  
`1` Cardinal directions (N, E, S, W),  
`2` Intercardinal directions (N, NE, E, SE, S, SW, W, NW),  
`3` Secondary intercardinal directions (N, NNE, NE, ENE, E, ESE, SE, SSE, S, SSW, SW, WSW, W, WNW, NW, NNW) | 2 |



### `units`

A string indicating units of the distance.

Accepts only:

  `m` for meters,  
  `km` for kilometers,  
  `ft` for feet,  
  `yd` for yards,  
  `mi` for miles,  
  `nm` for nautical miles 

- **Default**: `m`


### `formula`

A string indicating calculation formula.

Accepts only:
  `great-circle` for Great Circle,
  `rhumb-line` for straight line

- **Default**: `great-circle`


### `distancePrecision`

A number indicating number of rounding decimal places (precision) for distance measure.

- **Default**: `0`


### `bearingPrecision`

A number indicating number of rounding decimal places (precision) for bearing measure.

- **Default**: `0`


### `directionPrecision`

A number indicating precision for compass direction measure.

Accepts only:

  `0` No compass direction,  
  `1` Cardinal directions (N, E, S, W)  
  `2` Intercardinal directions (N, NE, E, SE, S, SW, W, NW)  
  `3` Secondary intercardinal directions (N, NNE, NE, ENE, E, ESE, SE, SSE, S, SSW, SW, WSW, W, WNW, NW, NNW)

- **Default**: `2`




Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php)
