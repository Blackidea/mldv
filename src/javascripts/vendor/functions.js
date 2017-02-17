/* GLOBAL */
var DATA = {
	places: [
		'Мальдивы',
		'Шри-Ланка',
		'Доминикана',
		'Таиланд',
		'Сейшелы',
		'Филлипины',
		'ОАЭ',
		'Россия',
		'Китай',
		'Благовещенкс'
	],

	from: [
		'Москва',
		'Санкт-Петербург',
		'Абакан',
		'Актобе',
		'Алматы',
		'Архангельск',
		'Астрахань',
		'Барнаул',
		'Белгород',
		'Благовещенкс'
	]
}
/* GLOBAL END */

/* SLIDER */
var SLIDER = (function($) {
	var $slider = $('.js-init-slider'),
			isSlider = $slider.length,
			options = {
				dots: true,
				arrows: false,
				fade: true,
				autoplay: true,
				autoplaySpeed: 5000
			}

	return {
		initSlider: function() {
			$slider.slick(options);
		},

		init: function() {
			if(isSlider) {
				this.initSlider();
			}
		}
	}
})(jQuery)
/* SLIDER END */

/* FILTER */
var FILTER = (function($) {
	var $filter = $('.filter'),
			isFilter = $filter.length,
			$header = $('.header'),
			$checkbox = $filter.find('input[type=checkbox]'),
			$back = $filter.find('.filter__back'),
			$reset = $filter.find('.js-reset-filter'),
			$scroll = $filter.find('.filter__scroll'),
			$buttons = $filter.find('.filter__buttons'),
			$tabsList = $filter.closest('.tabs').find('.tabs__list'),
			$main = $('.main'),
			$content = $('.content'),
			$win = $(window),
			buttonsH = 85,
			apis = [],
			jScrollPane,
			jScrollPaneAPI,
			scrollInited = false;

		return {
			setHeight: function() {
				var w = window.innerWidth,
						h;
				if(w > 1024) {
					h = $win.height() - buttonsH - $tabsList.outerHeight() - 20 - $header.outerHeight();
				} else {
					h = $win.height() - buttonsH - $back.outerHeight() - 20 - $header.outerHeight();
				}
				$('.filter__scroll').css({
					'height': h + 'px'
				});
				this.initScroll();
			},

			initScroll: function() {
				apis = [];
				$('.filter__scroll').each(function() {
					var scrollPane = $(this).jScrollPane()
					apis.push(scrollPane.data().jsp);
				});
				scrollInited = true;
			},

			destroyScroll: function() {
				if(scrollInited) {
					console.log('destroy')
					$.each(apis, function(i, el) {
						el.destroy();
					});

					scrollInited = false;
				}
			},

			resetFilter: function() {
				$checkbox.prop('checked', false);
			},

			bindResetClick: function() {
				var self = this;
				$reset.on('click', function(e) {
					self.resetFilter();
					e.preventDefault();
				});
			},

			bindWindowResize: function() {
				var self = this;
				$win.on('resize', function() {
					self.setHeight();
				});
			},

			bindTabChanged: function() {
				var self = this;
				$win.on('tab-changed', function() {
					scrollInited = false;
					self.setHeight();
				});
			},

			init: function() {
				if(isFilter) {
					this.bindResetClick();
					this.bindWindowResize();
					this.setHeight();
					this.bindTabChanged();
				}
			}
		}
})(jQuery)
/* FILTER END */

/* TABS */
var TABS = (function($) {
	var $tabs = $('.js-init-tabs'),
			isTabs = $tabs.length,
			$link = $tabs.find('[data-tab]'),
			$content = $tabs.find('[data-content]');

		return {
			showTabContent: function($parent, id) {
				var $active = $parent.find('[data-content='+ id +']');
				if($parent.hasClass('slyde-effect')) {
					$active
						.addClass('active')
						.siblings('[data-content]')
						.removeClass('active');
				} else {
					$active
						.fadeIn()
						.siblings('[data-content]')
						.fadeOut(0);
				}
				$(window).trigger('tab-changed');
			},

			changeLinkState: function($activeLink) {
				var $active = $activeLink.closest('li');
				$active
					.addClass('active')
					.siblings()
					.removeClass('active');
			},

			bindLinkClick: function() {
				var self = this;
				$link.on('click', function(e) {
					var id = $(this).attr('data-tab'),
							$parent = $(this).closest('.js-init-tabs');
					self.changeLinkState($(this));
					self.showTabContent($parent, id);
					$(window).trigger('tab-change');

					e.preventDefault();
				});
			},

			init: function() {
				if(isTabs) {
					this.bindLinkClick();
				}
			}
		}
})(jQuery);
/* TABS END */

/* SIDEBAR */
var SIDEBAR = (function($) {
	var $sidebar = $('.sidebar'),
			$main = $('.main'),
			$win = $(window),
			stikyHeaderH = 49,
			sidebarOffset,
			topPoint,
			bottomPoint,
			isSlider = $sidebar.length,
			handler = false;

	return {
		setVariables: function() {
			sidebarOffset = $sidebar.offset().top;
			topPoint = sidebarOffset - stikyHeaderH;
			bottomPoint = $main.offset().top + $main.outerHeight() - $win.height() + stikyHeaderH;
		},

		bindWindowScroll: function() {
			if(!handler) {
				$win.on('scroll.sidebar-fix-position, touchmove, touchstart, touchend', function() {
					var scroll = $win.scrollTop();
					console.log(topPoint, bottomPoint);
					if(scroll >= topPoint) {
						$sidebar
							.removeClass('to-bottom')
							.addClass('to-top');
						$main.addClass('sidebar-is-fixed');

					} else {
						$sidebar.removeClass('to-top');
						$main.removeClass('sidebar-is-fixed');
					}

					if(scroll >= bottomPoint) {
						$sidebar
							.removeClass('to-top')
							.addClass('to-bottom');
					}
				});

				handler = true;
			}
		},

		unbindWindowScroll: function() {
			if(handler) {
				$sidebar
					.removeClass('to-top')
					.removeClass('to-bottom')
				$main.removeClass('sidebar-is-fixed');
				$win.off('scroll.sidebar-fix-position, touchmove, touchstart, touchend');
				handler = false;
			}
		},

		switchHandler: function() {
			var w = window.innerWidth;
			if(w >= 1024) {
				this.bindWindowScroll();
			} else {
				this.unbindWindowScroll();
			}
		},

		bindWindowResize: function() {
			var self = this;
			$win.on('resize view-changed', function() {
				topPoint = sidebarOffset - stikyHeaderH,
				bottomPoint = $main.offset().top + $main.outerHeight() - $win.height() + stikyHeaderH;
				self.switchHandler();
			});
		},

		init: function() {
			if(isSlider) {
				this.setVariables();
				this.switchHandler();
				this.bindWindowResize();
			}
		}
	}
})(jQuery)
/* SIDEBAR END */

/* RANGE */
var RANGE = (function($) {
	var $range = $('.js-init-range'),
			isRange = $range.length,
			$valueMin = $('.js-range-min'),
			$valueMax = $('.js-range-max'),
			options = {
	    	range: true,
	    	slide: function( event, ui ) {
	    		$valueMin.text(numberWithSpaces(ui['values'][0]));
	    		$valueMax.text(numberWithSpaces(ui['values'][1]));
	    	}
			}

	function numberWithSpaces(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	}
		
	return {
		getAdditionalOptions: function() {
			var min  = +$range.attr('data-min'),
					max  = +$range.attr('data-max'),
	  			step = +$range.attr('data-step'),
					val1 = +$range.attr('data-value1'),
	  			val2 = +$range.attr('data-value2');
	  	return {
	  		min: min,
	  		max: max,
	  		step: step,
	  		values: [ val1, val2 ]
	  	}
		},

		setAdditionalOptions: function(additionalOptions) {
			$.extend(options, additionalOptions);
		},

		setInitialValues: function(values) {
			$valueMin.text(numberWithSpaces(values[0]));
			$valueMax.text(numberWithSpaces(values[1]));
		},

		init: function() {
			if(isRange) {
				var additionalOptions = this.getAdditionalOptions();
				this.setAdditionalOptions(additionalOptions);
				this.setInitialValues(additionalOptions['values']);
				$range.slider(options);
				$range.trigger('slide')
			}
		}
	}
})(jQuery);
/* RANGE END */

/* STARS */
var STARS = (function($) {
	var $stars = $('.stars'),
			isStars = $stars.length,
			$radio = $stars.find('input');

	return {
		changeStarState: function($checkedRadio) {
			$checkedRadio
				.addClass('checked')
				.prevAll()
				.addClass('checked')
				.end()
				.nextAll()
				.removeClass('checked')
		},

		bindRadioChange: function() {
			var self = this;
			$radio.on('change', function() {
				var isChecked = $(this).is(':checked');
				if(isChecked) {
					self.changeStarState($(this));
				}
			});
		},

		init: function() {
			if(isStars) {
				this.bindRadioChange();
			}
		}
	}
})(jQuery)
/* STARS END */


/* SEARCH_AUTOCOMPLETE */
var SEARCH_AUTOCOMPLETE = (function($) {
	var $input = $('.js-init-autocomplete'),
			isInput = $input.length,
			jScrollPane,
			jScrollPaneAPI;

	var autocompleteOptions = {
		minLength: 0,
		autoFocus: true,

		open: function() {
			// set drop width
			var $drop = $(this).autocomplete('widget'),
					w = $(this).closest('.search__item').width();
			$drop.css('max-width', w + 'px');

			// init scrollpane
		  jScrollPane && jScrollPaneAPI.destroy();

		  $drop = $(this).autocomplete('widget');
		  $drop
		  	.find('li')
		    .wrapAll($('<div class="scroll-wrap"><div class="scroll-panel"></div></div>'));
		  $drop
		  	.prepend($('<div class="dropdown__triangle">'))

		  jScrollPane = $drop.find('.scroll-panel').jScrollPane();
		  jScrollPaneAPI = jScrollPane.data('jsp');
		},

		close: function(event, ui) {
			// destroy scrollpane
		  jScrollPaneAPI.destroy();
		  jScrollPane = undefined;
		}
	};

	return {
		getOptions: function() {
			return autocompleteOptions;
		},

		initAutocomplete: function() {
			var self = this;

			$input.each(function(i, el) {
				// get data
				var source = $(el).attr('data-source'),
						options = $.extend(self.getOptions(), {
							source: DATA[source]
						});
				// init
				$(el).autocomplete(options);
			})
		},

		bindInputFocus: function() {
			$input.on('focus', function() {
				$(this).autocomplete( "search", "" );
			});
		},

		bindWindowResize: function() {
			$(window).on('resize.autocomplete-hide', function() {
				$('.ui-autocomplete:visible').hide();
				var $drop = $('.ui-autocomplete'),
						w = $input.closest('.search__item').width();
				$drop.css('max-width', w + 'px');
			});
		},

		init: function() {
			if(isInput) {
				this.initAutocomplete();
				this.bindInputFocus();
				this.bindWindowResize();
			}
		}
	}
})(jQuery);
/* SEARCH_AUTOCOMPLETES END */

/* DROP */
var DROP = (function($) {
	return {
		showDrop: function($drop, $positionOf, center) {
			$drop
				.addClass('active')
				.position({
					of: $positionOf,
					my: center ? 'center top' : 'left top + 15',
					at: center ? 'center bottom' : 'left bottom',
					collision: 'fit'
				});
		},

		hideDrop: function($drop) {
			$drop.removeClass('active');
		}
	}
})(jQuery);
/* DROP END */

/* PEOPLE */
var PEOPLE = (function($, DROP) {
	var $input = $('.js-init-people'),
			isInput = $input.length,
			$people = $('.people-drop'),
			$plus = $people.find('.people__plus'),
			$minus = $people.find('.people__minus'),
			$value = $people.find('.people__value')
			open = false,
			cloned = false;

	return {
		buildValue: function() {
			numbers = $.map($value, function(el, i) {
				return $(el).find('.people__input').val();
			});

			return numbers[0] + " взрослых " + numbers[1] + " детей";
		},

		changeNumber: function($val, dir) {
			var value = +$val.val(),
					min = $val.attr('data-min'),
					max = $val.attr('data-max');

			if(dir === 'up') {
				value < max && $val.val(++value);
			} else if (dir === 'down') {
				value > min && $val.val(--value);
			}
		},

		changeValue: function() {
			var value = this.buildValue();
			$input.val(value);
		},

		bindInputFocus: function() {
			$input.on('focus', function() {
				DROP.showDrop($people, $(this));
				open = true;
			});
		},

		bindDocClick: function() {
			var self = this;

			$(document).on('click', function(e) {
				if(open) {
					var isInput = $(e.target).closest($input.closest('.search__item')).length,
							isDrop = $(e.target).closest($people).length;
					if(!isInput && !isDrop) {
						DROP.hideDrop($people);
						open = false;
						self.changeValue();
					}
				}
			})
		},

		bindPlusClick: function() {
			var self = this;

			$(document).on('click', '.people__plus', function() {
				var $val = $(this).closest('.people__item').find('.people__input');
				self.changeNumber($val, 'up');
			});
		},

		bindMinusClick: function() {
			var self = this;

			$(document).on('click', '.people__minus', function() {
				var $val = $(this).closest('.people__item').find('.people__input');
				self.changeNumber($val, 'down');
			});
		},

		cloneMobile: function() {
			$input.each(function(i, el) {
				var $clone = $people.clone(),
						$lastItem = $(el).closest('.search').find('.search__item:last');
				$clone.addClass('clone');
				$lastItem.after($clone);
			});
		},

		removeClonesDesctop: function() {
			$('.people-drop.clone').remove();
		},

		bindWindowResize: function() {
			var self = this;

			$(window).on('resize.people-clone', function() {
				var w = window.innerWidth;
				$('.people-drop:visible').not('.clone').removeClass('active');

				if(w < 768) {
					if(!cloned) {
						self.cloneMobile();
						cloned = true;
					}
				} else {
					if(cloned) {
						self.removeClonesDesctop();
						cloned = false;
					}
				}
			});
		},

		init: function() {
			if(isInput) {
				this.bindInputFocus();
				this.bindDocClick();
				this.bindPlusClick();
				this.bindMinusClick();
				this.bindWindowResize();
				$(window).trigger('resize.people-clone');
			}
		}
	}
})(jQuery, DROP);
/* PEOPLE END */

/* CALENDAR */
var CALENDAR = (function($, DROP) {
	var $input = $('.js-init-calendar'),
			isInput = $input.length,
			$calendar = $('.calendar-drop'),
			$datepicker = $calendar.find('.calendar__datepicker'),
			$nights = $calendar.find('.calendar__nights'),
			$plus = $calendar.find('.calendar__plus'),
			$minus = $calendar.find('.calendar__minus'),
			$toggle = $calendar.find('.calendar__toggle'),
			$button = $calendar.find('.calendar__button'),
			open = false,
			datepickerOptions = {
				numberOfMonths: 2
			},
			datepickerMobileOptions = {
				numberOfMonths: 1
			},
			months = ['янв.', 'фев.', 'мар.', 'апр.', 'мая', 'июня', 'июля', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.']
			mobile = false,
			desktop = false;

	return {
		bindInputFocus: function() {
			$input.on('focus', function() {
				DROP.showDrop($calendar, $(this), true);
				open = true;
			});
		},

		bindButtonClick: function() {
			var self = this;

			$button.on('click', function(e) {
				DROP.hideDrop($calendar);
				open = false;
				$input.val(self.buildValue());
				e.preventDefault();
			});
		},

		buildDatepickerStr: function() {
			var date = $datepicker.datepicker('getDate'),
					day = date.getDate(),
					month = months[date.getMonth()];
			return day + ' ' + month;
		},

		buildNightsStr: function() {
			return parseInt($nights.val());
		},

		buildToggleStr: function() {
			var $input = $toggle.find('input:checked'),
					value = $input.val();
			if(value === '1') {
				return '\u00B1 2'
			} else {
				return ''
			}
		},

		buildValue: function() {
			var value = this.buildDatepickerStr() + " на " + this.buildNightsStr() + " ночей " + this.buildToggleStr();
			return value;
		},

		initDatepicker: function() {
			$.datepicker.setDefaults($.datepicker.regional['ru']);
			var w = window.innerWidth;
			if(w < 768) {
				if(!mobile) {
					$datepicker.datepicker('widget').length && $datepicker.datepicker('destroy');
				 	$datepicker.datepicker(datepickerMobileOptions);
					mobile = true;
					desktop = false;
				}
			} else {
				if(!desktop) {
					$datepicker.datepicker('widget').length && $datepicker.datepicker('destroy');
					$datepicker.datepicker(datepickerOptions);
					desktop = true;
					mobile = false;
				}
			}
		},


		bindDocClick: function() {
			var self = this;

			$(document).on('click', function(e) {
				if(open) {
					var isInput = $(e.target).closest($input.closest('.search__item')).length,
							isDrop = $(e.target).closest($calendar).length,
							isNav = $(e.target).closest('.ui-datepicker-prev, .ui-datepicker-next').length;
					if(!isInput && !isDrop && !isNav) {
						DROP.hideDrop($calendar);
						open = false;
						$input.val(self.buildValue());
					}
				}
			})
		},

		changeNumber: function(dir) {
			var value = parseInt($nights.val()),
					min = $nights.attr('data-min'),
					max = $nights.attr('data-max');

			if(dir === 'up') {
				value < max && $nights.val(++value + ' ночей');
			} else if (dir === 'down') {
				value > min && $nights.val(--value + ' ночей');
			}
		},

		bindPlusClick: function() {
			var self = this;

			$plus.on('click', function() {
				self.changeNumber('up');
			});
		},

		bindMinusClick: function() {
			var self = this;

			$minus.on('click', function() {
				self.changeNumber('down');
			});
		},

		bindWindowResize: function() {
			var self = this;

			$(window).on('resize.calendar-hide', function() {
				self.initDatepicker();
				$('.calendar-drop:visible').removeClass('active');
			});
		},

		init: function() {
			this.initDatepicker();
			this.bindInputFocus();
			this.bindDocClick();
			this.bindPlusClick();
			this.bindMinusClick();
			this.bindWindowResize();
			this.bindButtonClick();
		}
	}
})(jQuery, DROP);
/* CALENDAR END */

/* MOBILE_SCREEN */
var MOBILE_SCREEN = (function($) {
	var $block = $('.js-mobile-screen'),
			isBlock = $block.length,
			$btn = $('.js-call-mobile-screen'),
			$close = $block.find('.js-close-mobile-screen');

  return {
  	bindCloseClick: function() {
  		$close.on('click', function(e) {
  			var $parent = $(this).closest($block);
  			$parent.removeClass('active');
  			e.preventDefault();
  		});
  	},

  	bindBtnClick: function() {
  		$btn.on('click', function(e) {
  			var href = $(this).attr('href'),
  					$screen = $(href);
  			$screen.toggleClass('active');
  			e.preventDefault();
  		});
  	},

  	init: function() {
  		if(isBlock) {
  			this.bindCloseClick();
  			this.bindBtnClick();
  		}
  	}
  }
})(jQuery)
/* BACK END */

/* SEARH_ICON */
var SEARCH_ICON = (function($) {
	var $icon = $('.search__icon, .search__arrow'),
			isIcon = $icon.length;

	return {
		bindIconClick: function() {
			$icon.on('click', function() {
				var $input = $(this).closest('.search__item').find('input');
				$input.trigger('focus');
			});
		},

		init: function() {
			if(isIcon) {
				this.bindIconClick();
			}
		}
	}
})(jQuery)
/* SEARH_ICON END */

/* SEARCH_RESET */
var SEARCH_RESET = (function($) {
	var $controls = $('.search__controls'),
			isControls = $controls.length,
			$reset = $controls.find('.search__reset'),
			$search = $('.search'),
			$input = $search.find('.search__input');

	return {
		bindResetClick: function() {
			$reset.on('click', function() {
				$input.val('');
				$('#input-adult').val('2');
				$('#input-child').val('0');
			});
		},

		init: function() {
			if(isControls) {
				this.bindResetClick();
			}
		}
	}
})(jQuery);
/* SEARCH_RESET */

/* placeholder */
function placeholder(objInputs){
	if (objInputs.length) objInputs.placeholder();
}
/* placeholder end */

/*-- LEXA --*/

//fix nav 

function fixedNav() {
	var $nav = $('.header__bottom'),
			$header = $('.header__top'),
			navHeight,
			headerHeight = $header.outerHeight(),
			inited = false;

	function init() {
		if (window.innerWidth > 767 && !inited) {

			$(window).on('scroll.fix-header', function() {
			   if ( $(window).scrollTop() >= headerHeight) { 
				  	$nav.addClass('header__bottom--fixed');
				  	navHeight = $nav.outerHeight();
				  	$('body').css('paddingTop', navHeight);
			   } else {
						$nav.removeClass('header__bottom--fixed');
						$('body').removeAttr('style');
			   }
			});
			inited = true;

		} else if(window.innerWidth <= 767 && inited) {

			$nav.removeClass('header__bottom--fixed');
			$(window).off('scroll.fix-header');
			inited = false;

		}
	}

	init();
	$(window).on('resize', init);
	
}

//country slider

function countrySlider() {
	var $slider = $('.country-slider');
	if ($slider.length) {
		$slider.slick({
			slidesToShow: 7,
			slidesToScroll: 1,
			dots: false,
			arrows: true,
			prevArrow: '<svg class="slick-prev"><use xlink:href="#arrow-left"></use></svg>',
			nextArrow: '<svg class="slick-next"><use xlink:href="#arrow-right"></use></svg>',
			responsive: [
			{
			  breakpoint: 1100,
			  settings: {
				slidesToShow: 6,
			  }
			},
			{
			  breakpoint: 960,
			  settings: {
				slidesToShow: 5,
			  }
			},
			{
			  breakpoint: 767,
			  settings: {
				slidesToShow: 4,
			  }
			},
			{
			  breakpoint: 650,
			  settings: {
				slidesToShow: 3,
			  }
			},
				{
			  breakpoint: 500,
			  settings: {
				slidesToShow: 2,
			  }
			},
				{
			  breakpoint: 400,
			  settings: {
				slidesToShow: 1,
			  }
			}
		  ]
		});
	}
}




//sort toggle 

function sortToggle() {
	var $sort = $('.js-sort'),
		isSort = $sort.length;
	if (isSort) {
		$sort.find('li').on('click', function(e){
			e.preventDefault();
			elem = $(this);
			if (!elem.hasClass('active')) {
				elem.addClass('active').siblings().removeClass('active');
			}
		});
	}
}

//view toggle 

function viewToggle() {
	var $toggle = $('.view-toggle'),
		$toggleContent = $('.catalog__list'),
		isToggle = $toggle.length,
		isToggleContent = $toggleContent.length;
	if (isToggle && isToggleContent) {
		$toggle.find('li').on('click', function(e){
			e.preventDefault();
			var $self = $(this),
				selfIndex = $self.index();
			if (!$self.hasClass('active')) {
				$self.addClass('active').siblings().removeClass('active');
				if (selfIndex == 0) {
					$toggleContent.removeClass('catalog__list--lines-view').addClass('catalog__list--tiles-view');
				} else if (selfIndex == 1) {
					$toggleContent.removeClass('catalog__list--tiles-view').addClass('catalog__list--lines-view');
				}
			}
			$(window).trigger('view-changed');
		});
	}
}

//category slider

function categorySlider() {
	var $slider = $('.category__list'),
		isSlider = $slider.length,
		isHandler = false;
	function addSlider() {
		if (!isHandler) {
			if (window.innerWidth < 767) {
				$slider.slick({
					slidesToShow: 1,
					slidesToScroll: 1,
					dots: false,
					arrows: false,
					centerMode: true
				});
				isHandler = true;
			}
		} else {
			if (window.innerWidth > 767) {
				$slider.slick('unslick');
				isHandler = false;
			}
		}
	}
	if (isSlider) {
		addSlider();
		$(window).on('resize', addSlider);
	}
}

//feedback slider 

function feedBackSlider() {
	var $slider = $('.feedback__list'),
		isSlider = $slider.length;
	if (isSlider) {
		$slider.slick({
			slidesToShow: 4,
			slidesToScroll: 1,
			arrows: false,
			dots: true,
			responsive: [
			{
			  breakpoint: 1024,
			  settings: {
				slidesToShow: 3
			  }
			},
			{
			  breakpoint: 767,
			  settings: {
				slidesToShow: 2
			  }
			},
			{
			  breakpoint: 480,
			  settings: {
				slidesToShow: 1
			  }
			}
		  ]
		});
	}
}

//news slider 

function newsSlider() {
	var $slider = $('.news__list'),
		isSlider = $slider.length,
		isHandler = false;
	function addSlider() {
		if (!isHandler) {
			if (window.innerWidth > 767) {
				$slider.slick({
					slidesToShow: 4,
					slidesToScroll: 1,
					arrows: false,
					dots: true,
					responsive: [
					{
					  breakpoint: 1024,
					  settings: {
						slidesToShow: 3
					  }
					}
				  ]
				});
				console.log('slick');
				isHandler = true;
			}
		} else {
			if (window.innerWidth < 767) {
				$slider.slick('unslick');
				isHandler = false;
				console.log('unslick');
			}
		}
	}
	if (isSlider) {
		addSlider();
		$(window).on('resize', addSlider);
	}
}

//footer nav 

function footerDrop() {
	var drop = $('.footer__mob-dropdown'),
		isDrop = drop.length;
	if (isDrop) {
		drop.find('.footer__title').on('click', function(){
			if (!drop.hasClass('active')) {
				drop.addClass('active');
				drop.find('.footer__nav-list').slideDown();
			} else {
				drop.removeClass('active');
				drop.find('.footer__nav-list').slideUp();
			}
		});
	}
}

//mob NAV 

function mobNav() {
	var $btn = $('.header__nav-btn'),
		isBtn = $btn.length,
		$menu = $('.nav__list'),
		isMenu = $menu.length;
	if (isBtn && isMenu) {
		$btn.on('click', function(){
			if (!$btn.hasClass('active')) {
				$btn.addClass('active');
				$menu.addClass('active');
			} else {
				$btn.removeClass('active');
				$menu.removeClass('active');
				$menu.find('.dropdown__box').removeClass('active');
			}
		});
	}
}

//mob subNav

function mobSubNav() {
	var $menu = $('.nav__list'),
		isMenu = $menu.length;
	if (isMenu) {
		if (window.innerWidth < 767) {
			$menu.find('.nav__list-item').on('click', function(){
				var $self = $(this),
					$selfDrop = $self.find('.dropdown__box');
				if (!$selfDrop.hasClass('active')) {
					$selfDrop.addClass('active');
					$self.siblings().find('.dropdown__box').removeClass('active');
				} else {
					$selfDrop.removeClass('active');
				}
			});
		}
	}
}

//subNav scroll 

function subNavScroll() {
	var $scrollBox = $('.scroll-wrapper'),
		isScrollBox = $scrollBox.length;
	if (isScrollBox) {
		if(window.innerWidth < 767) {
			$scrollBox.jScrollPane();
		}
	}
}

//subscribe fancybox 

function subscribeFancybox() {
	var $btn = $('.subscribe-button'),
		isBtn = $btn.length;
	if(isBtn) {
		$btn.on('click', function(e){
			e.preventDefault();
			var href = $(this).attr('data-href');
			$.fancybox({
				href: href,
				openEffect  : 'none',
				closeEffect : 'none',
				padding: ['109', '68', '109', '68'],
				overlayColor: '#000'
			});
		});
	}
}

/*-- LEXA END --*/


function phoneMask() {
	var $input = $('.js-phone-mask');
	if($input.length) {
		$input.mask("+7 (999) 999-99-99");
	}
}

function hideControls() {
	var $controls = $('.controls'),
			$footer = $('.footer'),
			$win = $(window);

	if($controls.length) {
		$win.on('scroll', function() {
			var scroll = $win.scrollTop();
			if(scroll > $footer.offset().top - $win.height()) {
				console.log('MORE')
				$controls.addClass('hidden');
			} else {
				$controls.removeClass('hidden');
			}
		});
	}
}

function currencyMob() {
	var $item = $('.header__currency');
	if ($item.length) {
		if (window.innerWidth < 767) {
			$item.find('.header__currency-link').on('click', function(){
				if (!$item.hasClass('active')) {
					$item.addClass('active');
				} else {
					$item.removeClass('active');
				}
			});
		}
	}
}

$(document).on('ready', function() {
	//IE9
	placeholder($('input[placeholder], textarea[placeholder]'));
	fixedNav();
	countrySlider();
	feedBackSlider();
	sortToggle();
	viewToggle();
	categorySlider();
	newsSlider();
	footerDrop();
	mobNav();
	mobSubNav();
	subNavScroll();
	subscribeFancybox();
	currencyMob();

	TABS.init();
	RANGE.init();
	STARS.init();
	FILTER.init();
	SLIDER.init();
	SEARCH_AUTOCOMPLETE.init();
	SEARCH_ICON.init();
	PEOPLE.init();
	CALENDAR.init();
	MOBILE_SCREEN.init();
	SEARCH_RESET.init();
	phoneMask();
	hideControls();
	SIDEBAR.init();
	
});
