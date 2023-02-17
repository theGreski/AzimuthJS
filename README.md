## Summary
AzimuthJS is a small, stand-alone script to calculate distance, azimuth and bearing between two points (given the latitude/longitude of those points).

South latitudes are negative, east longitudes are positive

#### Usage
The azimuth function accepts coordinates of two points. Optionally precision of azimuth degrees

```javascript
autosize(latitude1, longitude1, latitude2, longitude2)
```

The output will look like this:
```javascript
{
    distance: 12,
    azimuth: 123,
    bearing: "NE"
}
```

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php)
