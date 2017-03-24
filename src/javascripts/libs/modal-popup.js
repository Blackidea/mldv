/**
 * Handling SHOW / CLOSE modal-popup
 *
 * @param FADE_DURATION (number) - A number determining how long the popup will showing/closing
 * @param OPEN_BUTTON_CLASS {string} - A class of an element which should to open popup when click on it
 * @param CLOSE_BUTTON_CLASS {string} -  A class of an element which will close popup (X icon in popup header)
 * @param DATA_TARGET_ATTRIBUTE {string} - A name of data-attribute
 *
 * example of usage:
 * 1. Add to an element class "OPEN_BUTTON_CLASS"  (.js-open-modal-popup by default)
 * 2. Add to the element data attribute "DATA_TARGET_ATTRIBUTE" ('modal-popup') by default
 *    it should contains an unique ID or CLASS of target popup
 *
 * <button class="js-open-modal-popup" data-modal-popup=".js-an-awesome-popup">Open an awesome popup</button>
 */
module.exports = () => {
  const FADE_DURATION = 250;
  const OPEN_BUTTON_CLASS = '.js-open-modal-popup';
  const CLOSE_BUTTON_CLASS = '.js-modal-popup__close';
  const DATA_TARGET_ATTRIBUTE = 'modal-popup';

  const show = (el) => {
      if (!el || !el.hasClass(DATA_TARGET_ATTRIBUTE)) return;
      el.fadeIn(FADE_DURATION);
  };

  const hide = (e) => {
      e.preventDefault();
      if (!e.data.popup) return;

      e.data.popup.fadeOut(FADE_DURATION);

      const target = $(e.currentTarget);
      target.off('click', hide);
  };

  // initialize
  $(OPEN_BUTTON_CLASS).on('click', (e) => {
      e.preventDefault();

      const target = $(e.currentTarget);
      const popup = $(target.data(DATA_TARGET_ATTRIBUTE));
      const closeBtn = popup.find(CLOSE_BUTTON_CLASS);

      if (!popup) return false;
      show(popup);

      if (!closeBtn) return false;
      closeBtn.on('click', { popup }, hide);
  });
};