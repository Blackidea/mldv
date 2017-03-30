
// slider
const Swiper = require('swiper/dist/js/swiper.jquery');

$(() => {
    const mainHotelSlider = new Swiper('.js-main-gallery-slider', {
        nextButton: '.js-main-gallery-slider__button_next',
        prevButton: '.js-main-gallery-slider__button_prev',
        onSlideChangeEnd(s) {
            const current = $('.js-main-gallery-slider .swiper-slide').eq(s.realIndex);
            const currentVideo = current.children('.js-main-gallery-slider__video')[0];

            // stop all videos
            Array.from(document.querySelectorAll('.js-main-gallery-slider__video_active')).forEach(el => {
                el.pause();
                el.classList.remove('js-main-gallery-slider__video_active');
            });

            // play current video
            if (currentVideo) {
                currentVideo.play();
                currentVideo.classList.add('js-main-gallery-slider__video_active');
            }
        }
    });

    const thumbsHotelSlider = new Swiper('.js-thumbs-gallery-slider', {
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        slideToClickedSlide: true,
        nextButton: '.js-thumbs-gallery-slider__button_next',
        prevButton: '.js-thumbs-gallery-slider__button_prev'
    });

    mainHotelSlider.params.control = thumbsHotelSlider;
    thumbsHotelSlider.params.control = mainHotelSlider;
});