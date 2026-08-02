# Part 1 


## Explaining FOUC Prevention
For preventing the Flash of Unstyled Content, I have a function at the start of my HTML page that is contained within a script tag. Inside that script tag, I have a saved local storage that sets the data theme based on what is saved. This allows the html file to prevent the flash of unstyled content.

# Web Component: Weather Widget (Part 2)
Tag name: <weather-widget>
Attributes: Temperature, accepts data in Celsius; Wind Speed, accepts data in km/h.
End Point: https://open-meteo.com/
Usage: 
Temperature: 'weather.temperature' C
Wind Speed: 'weather.windspeed' km/h