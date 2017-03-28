require('./libs/modal-popup')();

const Swiper = require('swiper/dist/js/swiper.jquery');

$(() => {

    const mainHotelSlider = new Swiper('.js-main-hotel-slider', {
        onSlideChangeEnd(s) {
            const current = $('.js-main-hotel-slider .swiper-slide').eq(s.realIndex);
            const currentVideo = current.children('.js-main-hotel-slider__video')[0];

            // stop all videos
            Array.from(document.querySelectorAll('.js-main-hotel-slider__video_active')).forEach(el => {
                el.pause();
                el.classList.remove('js-main-hotel-slider__video_active');
            });

            // play current video
            if (currentVideo) {
                currentVideo.play();
                currentVideo.classList.add('js-main-hotel-slider__video_active');
            }
        }
    });

    const thumbsHotelSlider = new Swiper('.js-thumbs-hotel-slider', {
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        slideToClickedSlide: true
    });

    mainHotelSlider.params.control = thumbsHotelSlider;
    thumbsHotelSlider.params.control = mainHotelSlider;
});