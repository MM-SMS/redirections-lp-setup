var regionName = "";
var cityName = "";
var countryName = "";
async function getURLParameter() {
   data = await $.get(
      "https://ipinfo.io",
      function (response) {
         /*$("#ip").html("IP: " + response.ip);
         $("#address").html("Location: " + response.city + ", " + response.region);
         $("#details").html(JSON.stringify(response, null, 4))*/
         ;
         console.log("Location: " + response.city + ", " + response.region);
         return response;
      },
      "jsonp"
   );
   countryName = await data.country;
   regionName = await data.region;
   cityName = await data.city;
   $(".countryName").html(countryName); // класс для спана, куда будет засунут текст из переменной 
   $(".regionName").html(regionName); // класс для спана, куда будет засунут текст из переменной
   $(".cityName").html(cityName); // класс для спана, куда будет засунут текст из переменной
}
getURLParameter();