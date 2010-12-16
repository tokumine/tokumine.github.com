var po = org.polymaps;

var map = po.map()
    .container(document.getElementById("map").appendChild(po.svg("svg")))
    .add(po.interact())
    .add(po.hash())
    .center({lat: 38, lon: 126})
    .zoom(5);

map.add(po.image()
    .url(po.url("http://{S}tile.cloudmade.com"
    + "/1a1b06b230af4efdbb989ea99e9841af" // http://cloudmade.com/register
    + "/20760/256/{Z}/{X}/{Y}.png")
    .hosts(["a.", "b.", "c.", ""])));

map.add(po.image().url(po.url("http://109.74.206.82:8080/?x={X}&y={Y}&z={Z}")));

map.add(po.compass()
    .pan("none"));
