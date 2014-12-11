define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var defineComponent = require('flight/lib/component'),
      $ = require('jquery');

  /**
   * Module exports
   */

  return defineComponent(tabs);

  /**
   * Module function
   */

  function tabs() {

    this.attributes({
      'panelSelector': '.panel',
      'tabSelector': '.tab a',
      'listSelector': '.tabs'
    });

    /**
     * Get the current active tab
     * @method getCurrentTab
     * @return {Object} the current active tab
     */
    this.getCurrentTab = function () {
      return this.$tabs.filter('[aria-selected=true]');
    };

    /**
     * Get the panel associated with a specific tab
     * @param {Object} $tab get panel for this tab
     * @method getPanel
     * @return {Object} the associated panel
     */
    this.getPanel = function ($tab) {
      return this.$panels.filter('#'+$tab.attr('aria-controls'));
    };

    /**
     * Change tab from user click event
     * @param {Object} evt The triggering event
     * @method clickTab
     */
    this.clickTab = function (evt) {
      this.changeTab($(evt.currentTarget)).focus();
      evt.preventDefault();
    };

    /**
     * Change tab
     * @param {Object} $targetTab reference to the new tab
     * @method changeTab
     * @return {Object} the targetted tab
     */
    this.changeTab = function ($targetTab) {
      var $targetPanel = this.getPanel($targetTab),
          $currentTab = this.getCurrentTab(),
          $currentPanel = this.getPanel($currentTab);

      if($currentTab) {
        $currentTab.attr('aria-selected', 'false');
      }

      if($currentPanel) {
        $currentPanel.attr('aria-hidden','true');
      }

      $targetTab.attr('aria-selected', 'true');
      $targetPanel.attr('aria-hidden','false');

      return $targetTab;
    };

    /**
     * Initializes tab by linking it to it's panel with ARIA
     * @param {Number} index the index of the tab within the list
     * @param {Object} the tab in question (native object reference)
     * @method initializeTab
     */
    this.initializeTab = function (index, element) {
      var $tab = $(element),
          panelId = $tab.attr('href').replace('#', ''),
          $panel = this.getPanel($tab);

      $tab.attr('aria-controls', panelId);
      $panel.attr('aria-labelledby', $tab.attr('id'));
    };

    /**
     * Initializes tabset
     * @method after:initialize
     */
    this.after('initialize', function () {
      this.$list = this.select('listSelector');
      this.$tabs = this.select('tabSelector');
      this.$panels = this.select('panelSelector');

      //Static aria roles
      this.$list.attr('role', 'tablist');
      this.$tabs.attr({
        'role': 'tab',
        'aria-selected': 'false'
      });

      this.$panels.attr({
        'role': 'tabpanel',
        'aria-hidden': 'true'
      });

      //Dynamic aria roles per tab
      this.$tabs.each($.proxy(this.initializeTab, this));

      this.on(this.$tabs, 'click', this.clickTab);

      //select first tab
      this.changeTab(this.$tabs.eq(0));
    });
  }

});
