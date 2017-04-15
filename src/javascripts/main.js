require('./libs/modal-popup')();
require('./libs/gallery-slider');
// THIS IS MOCK DATA, THE DATA SHOULD BE REPLACED WITH API CALL, OR SMTH LIKE THIS
require('./libs/calendar-price-charts')([
    [2792,9388,8845,6761,5835,5004,7555,9376,1084,2347,8932,9011,4693,6774,2014,1411,9594,4164,3906,631,2853,1746,4628,8792,7454,3308,6986,3320,865,4949,550],
    [6262,5933,9290,980,2275,2354,6829,7331,6528,1796,8196,3536,6148,7480,8902,156,5468,1327,3732,6389,7762,314,7811,2415,1731,5129,7375,6278],
    [927,3810,4908,5256,761,1398,572,6800,7303,4461,9336,7899,670,7470,2214,5722,2231,3494,5432,9273,9939,9107,719,5500,3614,6747,7591,197,3656,5631,5963],
    [164,1780,7626,7833,1365,3399,2968,287,1093,9557,7052,1335,9455,561,1083,6540,7214,179,5320,331,6757,3892,2439,993,6633,5929,6587,7920,4331,4301],
    [3557,7135,1897,1186,3119,832,2236,8919,4601,5848,8794,8691,8042,7077,1523,7524,4263,2863,2034,8472,7980,4244,2918,5240,712,2787,462,1488,6727,3285,4336],
    [4240,6391,2272,5611,8823,1641,7505,997,9976,6497,6192,1977,9041,9288,7977,9019,5415,6169,4942,1982,4338,3925,443,457,8868,1305,7066,8243,4822,6389],
    [8234,4471,7406,5710,8352,9792,6127,8721,556,5670,3795,8251,2885,7669,7162,1108,5722,7346,6015,8680,8410,6375,4280,9551,3271,5666,4673,773,899,7373],
    [5710,5240,3576,1205,4343,4200,822,830,4234,8434,8857,6838,7031,2813,8703,1631,7256,8941,1790,1185,8818,8484,1311,1248,8320,5190,5295,5500,1219,9685,3544],
    [9882,4695,4166,7968,2599,3950,6264,1115,4458,6467,6297,1017,2655,4127,3353,4863,371,5109,3304,1230,410,9886,7820,8024,234,4717,1889,3641,7089,9405],
    [5101,842,693,7996,8551,3262,3676,5094,7516,9443,1164,4125,3713,8691,5907,4180,3040,1973,8065,8023,7485,577,1058,929,5072,5946,2950,1636,1601,4726,863],
    [4479,3067,7658,2640,9363,4269,9071,6652,1668,1619,3214,5460,942,9828,5938,9665,9578,1861,4357,7926,8953,985,5161,4415,9677,5158,601,6909,6183,3554],
    [9016,944,6535,5691,3781,9380,9268,301,8769,4826,5943,5701,9893,6024,6056,8623,2027,9265,7137,7533,102,2650,4261,8304,9363,3262,6436,2421,6927,6647,534]
]);

// calendar-price-charts slider
const Swiper = require('swiper/dist/js/swiper.jquery');

new Swiper('.js-calendar-price-slider-container', {
    slidesPerView: 'auto',
    initialSlide: new Date().getMonth(),
    spaceBetween: 20,
    slideClass: 'calendar-price-charts__month',
    freeMode: true,
    nextButton: '.js-calendar-price__btn_next',
    prevButton: '.js-calendar-price__btn_prev'
});

// Other region slider

new Swiper('.js-otherRegions__slider', {
    slidesPerView: 1,
    spaceBetween: 20,
    nextButton: '.js-otherRegions__button_next',
    prevButton: '.js-otherRegions__button_prev'
});
$(function() {

    /* Выпадающие списки */
    $(".selectbox").each(function(){
        var wrapper = "<ul></ul>";

        // scrollable
        var data =  $(this).data();

        $(this).find('select').after(wrapper);
        $(this).find("option").each(function(){
            var ttext = $(this).text();
            var vval = $(this).val();
            var li = "<li data-val="+vval+">"+ttext+"</li>";
            $(this).parents(".selectbox").find("ul").append(li);
        });

        $(this).find("ul li").click(function(){
            var newval = $(this).data("val");
            $(this).parent().parent().find("select").val(newval);
            var inputval = $(this).parent().parent().find("select option[value="+newval+"]").text();
            $(this).parent().parent().find("input").val(inputval);
        });

        $(this).find("select").on("mousedown click", function(e){
            e.preventDefault();
            e.stopPropagation();
            this.blur();
            window.focus();
            $(this).parents(".selectbox").addClass("active");

            if (data.selectboxScrollable) {
                var itemsToShow = +data.itemsToShow || 10;
                var offsetHeight = 0;

                $(this).parent().find('li').slice(0, itemsToShow).each(function() {
                    offsetHeight += $(this).height();
                });

                var panel = $(this).parent().find('ul');

                panel.css({
                    overflow: 'hidden',
                    height: offsetHeight + 'px'
                });

                panel.addClass('scroll-pane');
            }

        });

        $(this).find("ul").click(function(){
            $(this).removeClass("active");
        });

        $("html").click(function(){
            $(".selectbox").removeClass("active");
        });
    });

});