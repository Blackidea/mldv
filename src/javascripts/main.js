'use strict';

//menu aside init
// require('jquery.mmenu');

// var form = require('./libs/form.js');
// var aside_menu = require('./libs/aside_menu.js');
// require('jquery/dist/jquery.min.js');
require('jquery-ui/ui/widgets/tabs');
$('#tabs').tabs();



// menu for testJob
function gmobileMenu() { 
  
  if($('.b-header__nav').hasClass('nav-invisible')){
    $('.b-header__nav').slideDown();
    $('.b-header__nav').addClass('nav-visible');
    $('.b-header__nav').removeClass('nav-invisible');
    
  }
  else {
    $('.b-header__nav').slideUp();
    $('.b-header__nav').removeClass('nav-visible');
    $('.b-header__nav').addClass('nav-invisible');
    
  }
  
}

$('.navbar__collapse').click(function(e){
  e.preventDefault();

  gmobileMenu();
});

$('#testbutton').click(function(e){
  e.preventDefault();
  $.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated' + animationName);
        });
    }
  });
  $('.b-about__title').animateCss('slideInRight').hide(200);

});
function openMenu(e) {
  e.preventDefault();

  $.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName  ).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName );
        });
    }
  });
  $('.aside_menu').addClass('visible').removeClass('invisible');
}
function closeMenu(e) {
  e.preventDefault();

  $.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName ).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName );
        });
    }
  });
  $('.aside_menu').addClass('invisible').removeClass('visible');

  
}
$('#openbutton').click( openMenu );
$('#closebutton').click( closeMenu );
  
//////////////////////
$(window).scroll(function() {
  if ($(this).scrollTop() > 1){
    $('header').addClass("l-header__white");
  }
  else{
    $('header').removeClass("l-header__white");
  }
});

///////////////////////



// require('magnific-popup');
// $('.js-popup').magnificPopup({
//   type:'inline',
//   midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
// });

$('nav > a').bind("click", function(e){
	var anchor = $(this);
	$('html, body').stop().animate({
	scrollTop: $(anchor.attr('href')).offset().top
	}, 1000);
	e.preventDefault();
});
//commonjs
// var tabs = require('tabs');
//
// //or directly include the script and 'tabs' will be global
//
// // make it tabbable!
// var container=document.querySelector('.tab-container')
// tabs(container);
