define(function (require) {

  'use strict';

  var KEY_CODES = {
    LEFT: 37,
    RIGHT: 39
  };

  /**
   * Module dependencies
   */
  var defineComponent = require('flight/lib/component'),
      Tabs = require('lib/tabs');

  /**
   * Module exports
   * Extends default tab component and adds alternative keyboard controls
   */
  return Tabs.mixin(tabsCursor);

  /**
   * Module function
   */
  function tabsCursor() {

    /**
     * Switches to the next tab in sequence, or overlaps to first tab
     * @method nextTab
     */
    this.nextTab = function () {
      var proposedIdx = this.$tabs.index(this.getCurrentTab()) + 1,
          nextIdx = (proposedIdx < this.$tabs.length) ? proposedIdx : 0;
      this.changeTab(this.$tabs.eq(nextIdx)).focus();
    };

    /**
     * Switches to the previous tab in sequence, or overlaps to last tab
     * @method prevTab
     */
    this.prevTab = function () {
      var proposedIdx = this.$tabs.index(this.getCurrentTab()) - 1,
          prevIdx = (proposedIdx < 0) ? this.$tabs.length - 1 : proposedIdx;
      this.changeTab(this.$tabs.eq(prevIdx)).focus();
    };

    /**
     * Monitors keyboard input
     * @param {Object} keydown event
     * @method monitorKeydown
     */
    this.monitorKeydown = function (evt) {
      var keyCode = evt.which;

      switch (keyCode) {
        case KEY_CODES.LEFT: // Left
          this.prevTab();
          break;
        case KEY_CODES.RIGHT: // Right
          this.nextTab();
          break;
      }
    };

    /**
     * Puts active tab into index and remove other tabs
     * @method after:changeTab
     */
    this.after('changeTab', function ($targetTab) {
      this.$tabs.attr('tabindex', '-1');
      $targetTab.attr('tabindex', '0');
    });

    /**
     * Adds additional keyboard control listeners
     * @method after:initialize
     */
    this.after('initialize', function () {
      this.on(this.$tabs, 'keydown', this.monitorKeydown);
    });
  }

});
