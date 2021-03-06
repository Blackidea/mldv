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
    'Благовещенск'
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
    'Благовещенск'
  ],
  
  babyage: [
    '> 1 года',
    '1 год',
    '2 года',
    '3 года',
    '4 года',
    '5 лет',
    '6 лет',
    '7 лет'
  ],
  
  adults: [
    '1 взрослый',
    '2 взрослых',
    '3 взрослых',
    '4 взрослых',
    '5 взрослых',
    '6 взрослых',
    '7 взрослых'
  ],
  
  babies: [
    '1 ребенок',
    '2 детей',
    '3 детей',
    '4 детей',
    '5 детей',
    '6 детей',
    '7 детей'
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
      sliders = [];

  $range.each(function() {
    var $item = $(this),
        isRange = $item.length,
        $parent = $item.parent(),
        $valueMin = $parent.find('.js-range-min'),
        $valueMax = $parent.find('.js-range-max'),
        options = {
            range: true,
            slide: function( event, ui ) {
                $valueMin.text(numberWithSpaces(ui['values'][0]));
                $valueMax.text(numberWithSpaces(ui['values'][1]));
            }
        };

    sliders.push({
        range: $item,
        isRange: isRange,
        valueMin: $valueMin,
        valueMax: $valueMax,
        options: options
    })
  });

  function numberWithSpaces(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
    
  return {
    getAdditionalOptions: function(slider) {
      var min  = +slider.range.attr('data-min'),
          max  = +slider.range.attr('data-max'),
          step = +slider.range.attr('data-step'),
          val1 = +slider.range.attr('data-value1'),
          val2 = +slider.range.attr('data-value2');
      return {
        min: min,
        max: max,
        step: step,
        values: [ val1, val2 ]
      }
    },

    setAdditionalOptions: function(additionalOptions, slider) {
      $.extend(slider.options, additionalOptions);
    },

    setInitialValues: function(values, slider) {
      slider.valueMin.text(numberWithSpaces(values[0]));
      slider.valueMax.text(numberWithSpaces(values[1]));
    },

    init: function() {
      sliders.forEach(function(slider) {
        if (slider.isRange) {
          var additionalOptions = RANGE.getAdditionalOptions(slider);
          RANGE.setAdditionalOptions(additionalOptions, slider);
          RANGE.setInitialValues(additionalOptions['values'], slider);
          slider.range.slider(slider.options);
          slider.range.trigger('slide')
        }
      });
    }
  }
})(jQuery);
/* RANGE END */

var SIDEBAR_FILTER_DROPDOWN = (function($) {
  $('.js-filter__item_dropdown').on('click', '.js-filter__title', function(e) {
    e.preventDefault();

    var $parent = $(this).parent();
    $parent.find('.js-filter__content').slideToggle(function() {
        $parent.toggleClass('filter__item_dropdown_active');
    });

  });
})(jQuery);

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
    if (window.innerWidth > 960 && !inited) {

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

    } else if(window.innerWidth <= 960 && inited) {

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
          $toggleContent.children().each(function(i, el) {
            el.style.order = i + 1;
          });
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

function regionCountrySlider() {
  var $slider = $('.regionCountry__inner'),
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

// feedback slider 

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
  regionCountrySlider();
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
  // SIDEBAR.init();
  
});


$('.js-focus-calendar-field').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    $(this).find('input').focus();
});

$(document).ready(function(){
  // $('.sliderMain').slick({
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   arrows: false,
  //   fade: true,
  //   asNavFor: '.sliderMain-nav',
  //   responsive: [
  //       {
  //         breakpoint: 767,
  //         settings: {
  //           slidesToShow:1,
  //           arrows: true,
  //           prevArrow: '<div class="sliderMain-nav__arrow __left"><svg><use xlink:href="#arrow-left"></svg></div>',
  //           nextArrow: '<div class="sliderMain-nav__arrow __right"><svg><use xlink:href="#arrow-right"></svg></div>'
  //         }
  //       }
  //     ]
  // });
  // $('.sliderMain-nav').slick({
  //   slidesToShow: 6,
  //   slidesToScroll: 1,
  //   asNavFor: '.sliderMain',
  //   dots: false,
  //   centerMode: false,
  //   arrows: true,
  //   prevArrow: '<div class="sliderMain-nav__arrow __left"><svg><use xlink:href="#arrow-left"></svg></div>',
  //   nextArrow: '<div class="sliderMain-nav__arrow __right"><svg><use xlink:href="#arrow-right"></svg></div>',
  //   infinite: false,
  //   focusOnSelect: true
  //
  // });
  // $('.sliderMain-nav a').click(function(e){
  //   e.preventDefault();
  // });

  //
  // // for calendar-price
  // var maxCalendarPrice = 10000;
  // var minCalendarPrice = 1000;
  //
  // function getRandomInt(minCalendarPrice, maxCalendarPrice) {
  //   return Math.floor(Math.random() * (maxCalendarPrice - minCalendarPrice)) + minCalendarPrice;
  // }
  //
  // function calendarPrice(){
  //   var calendarPriceHash = {};
  //   var calendarPriceMonths = [
  //     'январь',
  //     'февраль',
  //     'март',
  //     'апрель',
  //     'май',
  //     'июнь',
  //     'июль',
  //     'август',
  //     'сентябрь',
  //     'октябрь',
  //     'ноябрь',
  //     'декабрь'
  //   ];
  //   $.each(calendarPriceMonths, function(index, month) {
  //     $('.calendarSlider').append('<div class="calendar-charts calendarIndex-'+ index +'"></div>');
  //     console.log(month);
  //     for (var i = 1; i <= 30; i++) {
  //         var randomCalendarPrice = getRandomInt(minCalendarPrice, maxCalendarPrice);
  //         console.log(randomCalendarPrice);
  //         var calendarPriceHeight = (randomCalendarPrice / maxCalendarPrice) * 100;
  //         calendarPriceHash[i] = calendarPriceHeight;
  //         $('.calendarIndex-' + index).append('<div class="calendar-charts__item"><div class="calendar-charts__column" style="height:' + calendarPriceHeight +'%;"></div><div class="calendar-charts__number">'+ i +'</div></div>');
  //
  //     };
  //     $('.calendarIndex-' + index).append('<p class="calendar-charts__month">'+ month +'</p>');
  //   });
  //
  //   console.log(calendarPriceHash);
  //   $('.calendarSlider').slick({
  //     slidesToShow: 1,
  //     slidesToScroll: 1,
  //     prevArrow: '<div class="calendarSlider__arrow __left"><svg><use xlink:href="#arrow-left"></svg></div>',
  //     nextArrow: '<div class="calendarSlider__arrow __right"><svg><use xlink:href="#arrow-right"></svg></div>',
  //     centerMode: false,
  //     infinite: false,
  //     fade: false,
  //     asNavFor: ''
  //   });
  // }
  // calendarPrice();
  $('#hotelsTabs').tabs();
  $('#checkoutTabs').tabs();
  $('#payAnOrderTabs').tabs();

  // Обработка клика (след таб)
  $('.js-checkout-next-tab').click(function(e) {
      e.preventDefault();
      const href = $(this).attr('href');
      const link = $(`#checkoutTabs>ul`).find(`a[href="${href}"]`)[0];
      link.click();

      $('html, body').animate({ scrollTop: 0 }, 200);
  });

});
function mapPrice() {
    // debugger;
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 11,

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(1.979990, 73.535506), // New York

        // How you would like to style the map. 
        // This is where you would paste any style found on Snazzy Maps.
        styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}]
    };

    // Get the HTML DOM element that will contain your map 
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('mapPrice');

    // Create the Google Map using our element and options defined above
    var map = new google.maps.Map(mapElement, mapOptions);

    var marker1 = {
      'lat': '1.979990',
      'lang': '73.535506',
      'title': 'testTitle'
    };
    var marker2 = {
      'lat': '1.981047',
      'lang': '73.535559',
      'title': 'testTitle'
    };
    var marker3 = {
      'lat': '1.975831',
      'lang': '73.536821',
      'title': 'testTitle'
    };
    var marker4 = {
      'lat': '1.980980',
      'lang': '73.535727',
      'title': 'testTitle'
    };

    var markers = [
      marker1,
      marker2,
      marker3,
      marker4
    ];

    var marker;
    // var ibLabel;

    $.each(markers, function(index, value){
      console.log(value.lat);
      console.log(value.lang);
      console.log(value.title);


      ///label start
      // var labelText = value.title;

      // var myOptionsMarker = {
      //    content: labelText
      //   ,boxStyle: {
      //      border: "1px solid black"
      //     ,textAlign: "center"
      //     ,fontSize: "8pt"
      //     ,width: "50px"
      //    }
      //   ,disableAutoPan: true
      //   ,pixelOffset: new google.maps.Size(-25, 0)
      //   ,position: new google.maps.LatLng(parseFloat(value.lat), parseFloat(value.lang))
      //   ,closeBoxURL: ""
      //   ,isHidden: false
      //   ,pane: "mapPane"
      //   ,enableEventPropagation: true
      // };

      // ibLabel = new InfoBox(myOptionsMarker);
      // ibLabel.open(map);
      ///label end

      marker = new RichMarker({
          position: new google.maps.LatLng(parseFloat(value.lat), parseFloat(value.lang)),
          map: map,
          flat: true,
          draggable: false,
          content: '<div class="infoWindowMarker">' +
                '<svg>' +
                  '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#markersMap"></use>' +
                '</svg><span>test</span>' +
              '</div>'
          });


    });



    var contentString = '<li class="infoWindow __big">' +
                '<div class="infoWindowCard"><a href="#">' +
                     '<div class="infoWindowCard__img-box"><img src="images/card-image/card-image-01.jpg" alt=""><span class="infoWindowCard__price">от 5 500 USD</span><span class="infoWindowCard__offer">Спец. предложений: 5</span></div>' +
                    '<div class="infoWindowCard__content"><span class="infoWindowCard__country">Мальдивы</span>' +
                      '<div class="infoWindowCard__title"><span class="infoWindowCard__rating">5' +
                          '<svg class="infoWindowCard__rating-star">' +
                            '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#star-fill"></use>' +
                          '</svg></span>' +
                        '<h3>Kurumba Village</h3>' +
                      '</div>' +
                      '<div class="infoWindowCard__description-box"><span class="infoWindowCard__description">' +
                          '<svg class="infoWindowCard__description-icon">' +
                            '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#night"></use>' +
                          '</svg>                      7 ночей на двоих</span><span class="infoWindowCard__description">' +
                          '<svg class="infoWindowCard__description-icon">' +
                            '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#calendar"></use>' +
                          '</svg>                      с 25.09 - по 10.10</span><span class="infoWindowCard__description">' +
                          '<svg class="infoWindowCard__description-icon">' +
                            '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#food"></use>' +
                          '</svg>                      завтраки и обеды</span></div>' +
                      '<div class="infoWindowCard__tag-box"><span class="infoWindowCard__tag">эксклюзив</span><span class="infoWindowCard__tag">семейный отдых</span><span class="infoWindowCard__tag">LUXE  коллекция</span><span class="infoWindowCard__tag">экономичный отдых</span></div>' +
                    '</div></a></div>' +
              '</li>';
    // var infowindow = new google.maps.InfoWindow({
    //   content: contentString
    // });
    ////info start
    var myOptions = {
       content: contentString
      ,disableAutoPan: false
      ,maxWidth: 0
      ,pixelOffset: new google.maps.Size(-140, 0)
      ,zIndex: null
      ,boxStyle: {
        background: ""
        ,opacity: 1
        ,width: "280px"
        ,'border-radius':'12px'
       }
      ,closeBoxMargin: "10px 2px 2px 2px"
      ,closeBoxURL: ""
      ,infoBoxClearance: new google.maps.Size(1, 1)
      ,isHidden: false
      ,pane: "floatPane"
      ,enableEventPropagation: false
    };


    function toggleVisible(marker) {
        marker.setVisible(!marker.getVisible());
    }

    google.maps.event.addListener(marker, "click", function (e) {
      ib.open(map, this);
      toggleVisible(this);
      console.log('click success');
    });



    var ib = new InfoBox(myOptions);

    // ib.open(map, marker);
    ////info end



    // google.maps.event.addListener(map, 'click', function() {
    //   ib.close();
    // });

    // Let's also add a marker while we're at it

}





function mapContacts() {
    // debugger;
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 11,

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(55.757307, 37.632860), // New York

        // How you would like to style the map. 
        // This is where you would paste any style found on Snazzy Maps.
        styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}]
    };

    // Get the HTML DOM element that will contain your map 
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('contacts-map');

    // Create the Google Map using our element and options defined above
    var map = new google.maps.Map(mapElement, mapOptions);

    // Let's also add a marker while we're at it
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(55.757307, 37.632860),
        map: map,
        title: 'Snazzy!'
    });

}

if ($('#contacts-map').length > 0) {
    mapContacts();
}









$("#checkoutTabs").submit(function(e){
    e.preventDefault();
    
    // AJAX REQUEST
    
    return false;
});








  $('#hotelsTabs').tabs();
  // $( '#hotelsTabs' ).on( "tabsload", mapPrice() );

  ///Error with Jquery Tabs and Google Maps - gray background and not load maps , Than i call function after click init Maps
  $('#map-link').click(function(){
    mapPrice();
  });
  $('#sliderFeedback').click(function(){
    // feedBackSlider();
    
    $('.feedback__list2').slick({
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
    console.log("click for init feedBackSlider success");
  });
  // $('.holidayCreate__selectors select').selectmenu({ icons:{ button:"ui-icon-circle-minus" }});


  //// slider for Numbers on Hotels page
  function sliderNumbers(){
    $('#sliderNumbers').slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      dots: false,
      touchMove: false,
      centerMode: false,
      prevArrow: '<div class="holidayCreate__slider__arrow __left"><svg><use xlink:href="#arrow-left"></svg></div>',                 
      nextArrow: '<div class="holidayCreate__slider__arrow __right"><svg><use xlink:href="#arrow-right"></svg></div>',  
      infinite: false,
      focusOnSelect: false,
      responsive: [
        {
          breakpoint: 1220,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 960,
          settings: 'unslick'
        }
      ]
    });
  }
  function sliderNumber(){
    $('.sliderNumber').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: false,
      centerMode: false,
      prevArrow: '<div class="numbersSlider__arrow __left"><svg><use xlink:href="#arrow-left"></svg></div>',                 
      nextArrow: '<div class="numbersSlider__arrow __right"><svg><use xlink:href="#arrow-right"></svg></div>',                 
      infinite: false,
      focusOnSelect: false,
      responsive: [
        {
          breakpoint: 767,
          settings: {
            arrows: false
          }
        }
      ]
    });
  }
  $('.numbersSlider__form').click(function(){
    $(this).parent().siblings().find('.numbersSlider__checkbox').removeClass('checkboxActive');
    $(this).find('.numbersSlider__checkbox').toggleClass('checkboxActive');
    if ( $('.numbersSlider__checkbox').hasClass('checkboxActive') ) {
      $('.numberResult').addClass('active');
    } else {
      $('.numberResult').removeClass('active');
    }
  });



  //// slider for #sliderHotelsAround
  function sliderHotelsAround(){
    $('.sliderHotelsAround').slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows: false,
      dots: true,
      responsive: [
      {
        breakpoint: 1220,
        settings: {
        slidesToShow: 3
        }
      },
      {
        breakpoint: 960,
        settings: 'unslick'
      }
      ]
    });
  }

  //// slider for #sliderHotelsAround
  function sliderHotelsSimilar(){
    $('.sliderHotelsSimilar').slick({
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

  /// hide and show content in hotelsArticle
  function hotelsArticleShow(){
    $('.hotelsArticle__button').click(function(e){
      e.preventDefault();
      var btn = $(this),
          currentBlock = btn.parent(),
          content = $(currentBlock).find('.hotelsArticle__content');

      if (content.hasClass('active')) {
          btn.text('Подробнее');
      } else {
          btn.text('Свернуть');
      }

      content.toggleClass('active');
      $(currentBlock).find('.hotelsArticle__blockOpacity').toggle(function() {
        btn.blur();
      });
    });
  }

  function showWishList(){
    $('.js-wishlist').click(function(){      
      if ( $(window).width() > 960 ) {
        $('.popup__wishlist').show();
      } else {
        $('.hotelsAddtofavorite').click();
      }
    });
    $('.popup__close').click(function(){
      $('.popup__wishlist').hide();
    });
  }
  function showCompare(){
    $('.js-compare').click(function(){      
      $('.popup__compare').show();
    });
    $('.popup__close').click(function(){
      $('.popup__compare').hide();
    });
  }
  function showBonusDetail(){
    $('.hotelsBonus__column').click(function(e){
      if ( $(window).width() > 960 ) {
        e.preventDefault();
      } else {
        $('.hotelsBonusdetail').click();
        $('.js-discount-for-accommodation-popup .hotelsBonus__hover').remove();
        var bonusDetail = $(this).find('.hotelsBonus__hover');
        bonusDetail.clone().insertAfter('.js-discount-for-accommodation-popup .modal-popup__header');
        $('.js-discount-for-accommodation-popup .hotelsBonus__hover').addClass('popup');
      }
    });
  }


  function mapCatalog() {
    // debugger;
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 11,

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(1.979990, 73.535506), // New York

        // How you would like to style the map. 
        // This is where you would paste any style found on Snazzy Maps.
        styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}]
    };

    // Get the HTML DOM element that will contain your map 
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('mapCatalog');

    // Create the Google Map using our element and options defined above
    var map = new google.maps.Map(mapElement, mapOptions);

    var marker1 = {
      'lat': '1.979990',
      'lang': '73.535506',
      'title': 'testTitle'
    };
    var marker2 = {
      'lat': '1.981047',
      'lang': '73.535559',
      'title': 'testTitle'
    };
    var marker3 = {
      'lat': '1.975831',
      'lang': '73.536821',
      'title': 'testTitle'
    };
    var marker4 = {
      'lat': '1.980980',
      'lang': '73.535727',
      'title': 'testTitle'
    };
    
    var markers = [
      marker1,
      marker2,
      marker3,
      marker4
    ];

    var marker;
    // var ibLabel;

    $.each(markers, function(index, value){
      console.log(value.lat);
      console.log(value.lang);
      console.log(value.title);


      ///label start
      // var labelText = value.title;

      // var myOptionsMarker = {
      //    content: labelText
      //   ,boxStyle: {
      //      border: "1px solid black"
      //     ,textAlign: "center"
      //     ,fontSize: "8pt"
      //     ,width: "50px"
      //    }
      //   ,disableAutoPan: true
      //   ,pixelOffset: new google.maps.Size(-25, 0)
      //   ,position: new google.maps.LatLng(parseFloat(value.lat), parseFloat(value.lang))
      //   ,closeBoxURL: ""
      //   ,isHidden: false
      //   ,pane: "mapPane"
      //   ,enableEventPropagation: true
      // };

      // ibLabel = new InfoBox(myOptionsMarker);
      // ibLabel.open(map);
      ///label end

      marker = new RichMarker({
          position: new google.maps.LatLng(parseFloat(value.lat), parseFloat(value.lang)),
          map: map,
          flat: true,
          draggable: false,          
          content: '<div class="infoWindowMarker">' +
                '<svg>' +
                  '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#markersMap"></use>' +
                '</svg><span>test</span>' +
              '</div>'
          });

      
    });

    

    var contentString = '<li class="infoWindow __big">' +
                '<div class="infoWindowCard"><a href="#">' +
                     '<div class="infoWindowCard__img-box"><img src="images/card-image/card-image-01.jpg" alt=""><span class="infoWindowCard__price">от 5 500 USD</span><span class="infoWindowCard__offer">Спец. предложений: 5</span></div>' +
                    '<div class="infoWindowCard__content"><span class="infoWindowCard__country">Мальдивы</span>' +
                      '<div class="infoWindowCard__title"><span class="infoWindowCard__rating">5' +
                          '<svg class="infoWindowCard__rating-star">' +
                            '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#star-fill"></use>' +
                          '</svg></span>' +
                        '<h3>Kurumba Village</h3>' +
                      '</div>' +
                      '<div class="infoWindowCard__description-box"><span class="infoWindowCard__description">' +
                          '<svg class="infoWindowCard__description-icon">' +
                            '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#night"></use>' +
                          '</svg>                      7 ночей на двоих</span><span class="infoWindowCard__description">' +
                          '<svg class="infoWindowCard__description-icon">' +
                            '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#calendar"></use>' +
                          '</svg>                      с 25.09 - по 10.10</span><span class="infoWindowCard__description">' +
                          '<svg class="infoWindowCard__description-icon">' +
                            '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#food"></use>' +
                          '</svg>                      завтраки и обеды</span></div>' +
                      '<div class="infoWindowCard__tag-box"><span class="infoWindowCard__tag">эксклюзив</span><span class="infoWindowCard__tag">семейный отдых</span><span class="infoWindowCard__tag">LUXE  коллекция</span><span class="infoWindowCard__tag">экономичный отдых</span></div>' +
                    '</div></a></div>' +
              '</li>';
    // var infowindow = new google.maps.InfoWindow({
    //   content: contentString
    // });
    ////info start
    var myOptions = {
       content: contentString
      ,disableAutoPan: false
      ,maxWidth: 0
      ,pixelOffset: new google.maps.Size(-140, 0)
      ,zIndex: null
      ,boxStyle: { 
        background: ""
        ,opacity: 1
        ,width: "280px"
        ,'border-radius':'12px'
       }
      ,closeBoxMargin: "10px 2px 2px 2px"
      ,closeBoxURL: ""
      ,infoBoxClearance: new google.maps.Size(1, 1)
      ,isHidden: false
      ,pane: "floatPane"
      ,enableEventPropagation: false
    };


    function toggleVisible(marker) {
        marker.setVisible(!marker.getVisible());
    }

    google.maps.event.addListener(marker, "click", function (e) {
      ib.open(map, this);
      toggleVisible(this);
      console.log('click success');
    });

    

    var ib = new InfoBox(myOptions);

    // ib.open(map, marker);
    ////info end

    

    // google.maps.event.addListener(map, 'click', function() {
    //   ib.close();
    // });

    // Let's also add a marker while we're at it
 
  }


  function specialOffersMap() {
    // debugger;
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 11,

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(1.979990, 73.535506), // New York

        // How you would like to style the map. 
        // This is where you would paste any style found on Snazzy Maps.
        styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}]
    };

    // Get the HTML DOM element that will contain your map 
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('specialOffers__map');

    // Create the Google Map using our element and options defined above
    var map = new google.maps.Map(mapElement, mapOptions);

    var marker1 = {
      'lat': '1.979990',
      'lang': '73.535506',
      'title': 'testTitle'
    };
    var marker2 = {
      'lat': '1.981047',
      'lang': '73.535559',
      'title': 'testTitle'
    };
    var marker3 = {
      'lat': '1.975831',
      'lang': '73.536821',
      'title': 'testTitle'
    };
    var marker4 = {
      'lat': '1.980980',
      'lang': '73.535727',
      'title': 'testTitle'
    };
    
    var markers = [
      marker1,
      marker2,
      marker3,
      marker4
    ];

    var marker;
    // var ibLabel;

    $.each(markers, function(index, value){
      console.log(value.lat);
      console.log(value.lang);
      console.log(value.title);


      ///label start
      // var labelText = value.title;

      // var myOptionsMarker = {
      //    content: labelText
      //   ,boxStyle: {
      //      border: "1px solid black"
      //     ,textAlign: "center"
      //     ,fontSize: "8pt"
      //     ,width: "50px"
      //    }
      //   ,disableAutoPan: true
      //   ,pixelOffset: new google.maps.Size(-25, 0)
      //   ,position: new google.maps.LatLng(parseFloat(value.lat), parseFloat(value.lang))
      //   ,closeBoxURL: ""
      //   ,isHidden: false
      //   ,pane: "mapPane"
      //   ,enableEventPropagation: true
      // };

      // ibLabel = new InfoBox(myOptionsMarker);
      // ibLabel.open(map);
      ///label end

      marker = new RichMarker({
          position: new google.maps.LatLng(parseFloat(value.lat), parseFloat(value.lang)),
          map: map,
          flat: true,
          draggable: false,          
          content: '<div class="infoWindowMarker">' +
                '<svg>' +
                  '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#markersMap"></use>' +
                '</svg><span>test</span>' +
              '</div>'
          });

      
    });

    

    var contentString = '<li class="infoWindow __big">' +
                '<div class="infoWindowCard"><a href="#">' +
                     '<div class="infoWindowCard__img-box"><img src="images/card-image/card-image-01.jpg" alt=""><span class="infoWindowCard__price">от 5 500 USD</span><span class="infoWindowCard__offer">Спец. предложений: 5</span></div>' +
                    '<div class="infoWindowCard__content"><span class="infoWindowCard__country">Мальдивы</span>' +
                      '<div class="infoWindowCard__title"><span class="infoWindowCard__rating">5' +
                          '<svg class="infoWindowCard__rating-star">' +
                            '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#star-fill"></use>' +
                          '</svg></span>' +
                        '<h3>Kurumba Village</h3>' +
                      '</div>' +
                      '<div class="infoWindowCard__description-box"><span class="infoWindowCard__description">' +
                          '<svg class="infoWindowCard__description-icon">' +
                            '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#night"></use>' +
                          '</svg>                      7 ночей на двоих</span><span class="infoWindowCard__description">' +
                          '<svg class="infoWindowCard__description-icon">' +
                            '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#calendar"></use>' +
                          '</svg>                      с 25.09 - по 10.10</span><span class="infoWindowCard__description">' +
                          '<svg class="infoWindowCard__description-icon">' +
                            '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#food"></use>' +
                          '</svg>                      завтраки и обеды</span></div>' +
                      '<div class="infoWindowCard__tag-box"><span class="infoWindowCard__tag">эксклюзив</span><span class="infoWindowCard__tag">семейный отдых</span><span class="infoWindowCard__tag">LUXE  коллекция</span><span class="infoWindowCard__tag">экономичный отдых</span></div>' +
                    '</div></a></div>' +
              '</li>';
    // var infowindow = new google.maps.InfoWindow({
    //   content: contentString
    // });
    ////info start
    var myOptions = {
       content: contentString
      ,disableAutoPan: false
      ,maxWidth: 0
      ,pixelOffset: new google.maps.Size(-140, 0)
      ,zIndex: null
      ,boxStyle: { 
        background: ""
        ,opacity: 1
        ,width: "280px"
        ,'border-radius':'12px'
       }
      ,closeBoxMargin: "10px 2px 2px 2px"
      ,closeBoxURL: ""
      ,infoBoxClearance: new google.maps.Size(1, 1)
      ,isHidden: false
      ,pane: "floatPane"
      ,enableEventPropagation: false
    };


    function toggleVisible(marker) {
        marker.setVisible(!marker.getVisible());
    }

    google.maps.event.addListener(marker, "click", function (e) {
      ib.open(map, this);
      toggleVisible(this);
      console.log('click success');
    });

    

    var ib = new InfoBox(myOptions);

    // ib.open(map, marker);
    ////info end

    

    // google.maps.event.addListener(map, 'click', function() {
    //   ib.close();
    // });

    // Let's also add a marker while we're at it
 
  }

  function showHotelsOnMap(){
    $('#js-showHotelsOnMap').click(function(){
      $('.catalog__list').hide();
      $('.js-showHotelsOnMap__inner').show();
      mapCatalog();
    });
    $('#js-tilesView').click(function(){
      $('.catalog__list').css({'display' : 'flex'});
      $('.js-showHotelsOnMap__inner').hide();
    });
    $('#js-linesView').click(function(){
      $('.catalog__list').css({'display' : 'flex'});
      $('.js-showHotelsOnMap__inner').hide();
    });
  }


  /// slider for other regions
  function otherRegionsSlider(){
    $('.otherRegionsSlider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: false,
      touchMove: false,
      centerMode: false,
      prevArrow: '<div class="holidayCreate__slider__arrow __left"><svg><use xlink:href="#arrow-left"></svg></div>',                 
      nextArrow: '<div class="holidayCreate__slider__arrow __right"><svg><use xlink:href="#arrow-right"></svg></div>',  
      infinite: false,
      focusOnSelect: false,
      responsive: [
        {
          breakpoint: 767,
          settings: {
            arrows: false
          }
      }]
    });
  }

  /// drop for tabs
  $('.js-countryTabs').click(function() {
    var btn = $(this),
        next = btn.next();

    if (!$(next).hasClass('countryTabs__block')) {
      return;
    }

    btn.toggleClass('active');
    $(next).slideToggle();
  });

  /// drop for tabs
  $('.hotelsTabsDrop-1').click(function(){
    if(!$(this).hasClass('active')) {
      $('#hotelsTabs-1').slideDown();
      $(this).addClass('active');
      console.log('show Tab');
      
    }
    else{
      $('#hotelsTabs-1').slideUp();
      $(this).removeClass('active');
      console.log('hide Tab');
    }  
    
  });
  $('.hotelsTabsDrop-2').click(function(){
    if(!$(this).hasClass('active')) {
      $('#hotelsTabs-2').show();
      $(this).addClass('active');
      mapPrice();
      console.log('show Tab2');
      
    }
    else{
      $('#hotelsTabs-2').slideUp();
      $(this).removeClass('active');
      console.log('hide Tab2');
    }  
    
  });
  
  $('.hotelsTabsDrop-3').click(function(){
    if(!$(this).hasClass('active')) {
      $('#hotelsTabs-3').slideDown();
      $(this).addClass('active');
      
      console.log('show Tab');
      
    }
    else{
      $('#hotelsTabs-3').slideUp();
      $(this).removeClass('active');
    }  
    
  });
  $('.hotelsTabsDrop-4').click(function(){

    if(!$(this).hasClass('active')) {
      $('#hotelsTabs-4').slideDown();
      $(this).addClass('active');
      
    }
    else{
      $('#hotelsTabs-4').slideUp();
      $(this).removeClass('active');
    }  
    
  });
  function holidayCreateFilterMob(){

    var filterBlock = $('.holidayCreate__filter');
    
   
    if (!filterBlock.hasClass('active')){
      filterBlock.addClass('active');
      filterBlock.toggle('slide');
      fixscreen();
    }
    else{
      filterBlock.removeClass('active');
      filterBlock.toggle('slide');
      unfixscreen();
    }
  }

  function hotelsTourFilterMob(){

    var filterBlock = $('.hotelsTours__filterMob');

    if (!filterBlock.hasClass('active')){
      filterBlock.addClass('active');
      filterBlock.toggle('slide');
    }
    else{
      filterBlock.removeClass('active');
      filterBlock.toggle('slide');
    }
  }

  $('.filter__buttonMob').click(holidayCreateFilterMob);

  $('.js-close-filterMob').click(function(e){
    e.preventDefault();
    holidayCreateFilterMob();
  });

  $('.hotelsToursfilter__buttonMob').click(hotelsTourFilterMob);

  $('.js-close-hotelsTours__filterMob').click(function(e){
      e.preventDefault();
      hotelsTourFilterMob();
  });

function countryTabs(){
    $('#countryTabs').tabs();
  }

  function signupOrSigninTabs() {
    $('.js-signup-or-signin-popup').tabs({ fx: { opacity: 'toggle' }});
  }

//upload file for agents page
  function getUploadFileName (str){
    if (str.lastIndexOf('\\')){
        var i = str.lastIndexOf('\\')+1;
    }
    else{
        var i = str.lastIndexOf('/')+1;
    }
    var filename = str.slice(i);
    var uploaded = document.getElementById("uploadfilename");
    uploaded.innerHTML = filename;
  }

  if(document.querySelector('.file_upload input[type="file"]')) {
    document.querySelector('.file_upload input[type="file"]').addEventListener('change', function () {
      getUploadFileName(this.value);
    });
  }

//map for contacts page
  function contactsMap () {
    var contactsMapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(55.757178, 37.632226), // Moscow
        styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}]
    };
    var contactsMapElement = document.getElementById('contacts-map');
    var contactsMap = new google.maps.Map(contactsMapElement, contactsMapOptions);
    var contactsImage = {
          url: 'images/contacts_marker.svg',
          size: new google.maps.Size(40, 52),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(20, 34)
        };
    var contactsMarker =  new google.maps.Marker({
          position: {lat: 55.757178, lng: 37.632226},
          map: contactsMap,
          icon: contactsImage
        });
  }

// Открытие второго попапа
$('.modal-popup [data-modal-popup]').click(function(){
  $(this).parents('.modal-popup').hide();
});

// Вход в ЛК
$('.signup-or-signin-popup__form button').click(function(e){
  e.stopPropagation();
  $(this).parents('.modal-popup').hide();
  $('.nav__sign-enter').hide();
  $('.nav__sign-entered').show();
});

// Выход из ЛК
$('.nav__sign-link--exit').click(function(e){
  e.preventDefault();
  $('.nav__sign-entered').hide();
  $('.nav__sign-enter').show();
});

// Кнопка скролла вверх в мобиле
$(".footer__scrolltop").click(function(e){
   e.preventDefault();
    $("html, body").animate({ scrollTop: "0"}, 1000);
});

// Добавление людей в форме
$(document).ready(function(){
  $('.search__add-count .search__people').click(function(){
    if ( $(this).hasClass('search__people_adult') ) {
      $(this).parent().siblings('.search__chosen-count').find('.search__people:first-child').clone(true).prependTo($(this).parent().siblings('.search__chosen-count'));
      var adultcount = $(this).parent().siblings('.search__chosen-count').find('.search__people_adult').length;
      $(this).parent().siblings('[name="adults"]').val(adultcount);
    } else {
      var babycount = $(this).parent().siblings('.search__chosen-count').find('.search__baby-count').text();
      babycount ++;
      if (babycount > 7) {babycount = 7}
      $(this).parent().siblings('.search__chosen-count').find('.search__baby-count').text(babycount);
      $(this).parent().siblings('[name="babies"]').val(babycount);
    }
  });
});

// Удаление людей в форме
$(document).ready(function(){
  $('.search__people-delete').click(function(){
    if ( $(this).parent().hasClass('search__people_adult') ) {
      var adultcount = $(this).parent().siblings('.search__people_adult').length;
      $(this).parent().siblings('[name="adults"]').val(adultcount);
      $(this).parent().remove();
    } else {
      var babycount = $(this).siblings('.search__baby-count').text();
      babycount --;
      if (babycount < 0) {babycount = 0}
      $(this).siblings('.search__baby-count').text(babycount);
      $(this).parent().siblings('[name="babies"]').val(babycount);
    }
  });
});


// Проверка email
$("form.short-form button").click(function(e){
  e.preventDefault();
  function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }
  if ( isEmail($(this).siblings('input[name="email"]').val()) === false || !$(this).siblings('input[name="email"]').val() ) {
    return false;
  } else {
    $(this).siblings('.subscribe-button').click();
    setTimeout(function(){
      $(this).parent().submit();
    }, 3000);
  }
});

/* Выпадающие списки */
$(function() {

  /* Выпадающие списки */
    $(".selectbox").each(function(){
        var wrapper = "<ul></ul>";

        var selectbox = $(this);
        // scrollable
        var data =  $(this).data();

        selectbox.find('select').after(wrapper);
        selectbox.find("option").each(function(){
            var ttext = $(this).text();
            var vval = $(this).val();
            var li = "<li data-val="+vval+">"+ttext+"</li>";
            selectbox.find("ul").append(li);
        });

        selectbox.find("li").click(function(){

            var newval = $(this).data("val");
            selectbox.find("select").val(newval);

            var inputval = $(this).parent().parent().find("select option[value="+newval+"]").text();
            selectbox.find("input").val(inputval);
        });

        $(this).find("select").on("mousedown click", function(e){
            e.preventDefault();
            e.stopPropagation();
            this.blur();
            window.focus();
            selectbox.addClass("active");

            if (data.selectboxScrollable) {
                var itemsToShow = +data.itemsToShow || 10;
                var offsetHeight = 0;

                selectbox.find('li').slice(0, itemsToShow).each(function() {
                    offsetHeight += $(this).height();
                });

                var panel = $(this).parent().find('ul');

                panel.css({
                    overflow: 'hidden',
                    height: offsetHeight + 'px'
                });

                panel.addClass('scroll-pane');
                panel.jScrollPane();
            }

        });

        selectbox.find("ul").click(function(){
            $(this).removeClass("active");
        });

        $("html").click(function(){
            $(".selectbox").removeClass("active");
        });
    });

});


function cloneTouristForm() {
    $('.js-personal-area__tourists-add').on('click', function (e) {
        e.preventDefault();
        var touristsContainer = $('.js-personal-area-tourists'),
            tourists = touristsContainer.find('.js-personal-area-tourist'),
            tourist = $(tourists[tourists.length - 1]);

        var nextTourist = tourist.clone(true, true),
            title = nextTourist.find('.personal-area-tourist__title');

        // increment title number
        var nextTitle = title.text().replace(/\d+/, Number(title.text().match(/\d+/)[0]) + 1);
        title.text(nextTitle);

        // clear fields
        nextTourist
            .find('form')
            .find('input')
            .not(':input[type=button], :input[type=submit], :input[type=hidden]')
            .val('')
            .removeAttr('checked')
            .removeAttr('selected');

        // disable controls button
        nextTourist.find('.js-personal-area-tourist__button_save').prop('disabled', true);
        nextTourist.find('.js-personal-area-tourist__button_delete').prop('disabled', true);

        // append to container
        nextTourist.css('display', 'none');
        nextTourist.appendTo(touristsContainer);
        nextTourist.slideToggle();
    });
}


// Фиксировать экран для самописных модальных окон
function fixscreen() {
  window.scroll = $(window).scrollTop();
  $("body").css('top', -scroll + 'px').toggleClass('noscroll');
}

function unfixscreen() {
  $("body").css('top', "0").toggleClass('noscroll');
  $(window).scrollTop(scroll);
}

// INTERACTIVE STARS
$('.js-interactive-stars').on('click', '.js-interactive-stars__star', function() {
    var star = $(this),
        activeStar = star.parent().children('.interactive-stars__star_checked');

    $(activeStar).removeClass('interactive-stars__star_checked');

    star.addClass('interactive-stars__star_checked');
    star.children('.js-interactive-stars__field')[0].checked = true;
});

// TOURIST FORM, ENABLE SAVE BUTTON
$('.js-personal-area-tourists').on('change', 'form', function() {
    var saveBtn = $(this).parent().find('.js-personal-area-tourist__button_save');

    if (saveBtn.prop('disabled')) {
        saveBtn.prop('disabled', false);
    }
});

// TOURIST FORM, SAVE
$('.js-personal-area-tourists').on('click', '.js-personal-area-tourist__button_save', function(e) {
    e.preventDefault();

    var saveBtn = $(this),
        deleteBtn = saveBtn.closest('.js-personal-area-tourist').find('.js-personal-area-tourist__button_delete'),
        form = saveBtn.closest('.js-personal-area-tourist').find('form');

    // VALIDATION
    var emptyInputs = form.find('input').filter(function() {
        return !this.value;
    });

    if (emptyInputs.length > 0) {
        return false;
    }

    // AJAX REQUEST
    alert('saved');

    // ENABLE DELETE BUTTON
    deleteBtn.prop('disabled', false);

    // DISABLE SAVE BUTTON
    saveBtn.prop('disabled', true);
});

// TOURIST FORM, DELETE
$('.js-personal-area-tourists').on('click', '.js-personal-area-tourist__button_delete', function(e) {
    e.preventDefault();
    var tourist = $(this).closest('.js-personal-area-tourist');

    // AJAX REQUEST

    // HIDE ELEMENT
    tourist.hide(500);
});


// Экскурсии
$('.countryTabs__sortingLink').click(function(e){
  e.preventDefault();
  var exctab = $(this).data('exctab');
  var excursion = $('.countryTabs__excursion[data-excursion="'+exctab+'"]');
  excursion.siblings('.countryTabs__excursion').removeClass('active');
  excursion.addClass('active');
});



  cloneTouristForm();
  sliderNumbers();
  sliderNumber();
  sliderHotelsAround();
  sliderHotelsSimilar();
  countryTabs();
  signupOrSigninTabs();
  hotelsArticleShow();
  showWishList();
  showCompare();
  showBonusDetail();
  showHotelsOnMap();
  otherRegionsSlider();
  specialOffersMap();
  contactsMap();