
$("#my-menu").mmenu({
    "offCanvas": {
            "zposition": "front",
            "pageSelector": "#my-wrapper"
     },
     "extensions": [
                  "pagedim-black",
                  "theme-dark",
                  "effect-panels-zoom",
                  "effect-listitems-drop"
               ]

     
  });
var API = $("#my-menu").data("mmenu");
$("#menu_button").click(function(){
  API.open();
});