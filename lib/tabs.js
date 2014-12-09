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
      'tabSelector': '.tab',
      'listSelector': '.tabs',
      'activeTabClass': 'active-tab'
    });

    /**
    * Get the panel associated with a specific tab
    * @param {Object} $tab get panel for this tab
    * @method getPanel
    * @return {Object} the associated panel
    */
    this.getPanel = function($tab) {
      return this.$panels.filter('#'+$tab.attr('aria-controls'));
    };

    /**
    * Change tab from user click event
    * @param {Object} evt The triggering event
    * @method clickTab
    */
    this.clickTab = function(evt) {
      this.changeTab($(evt.currentTarget));
    };

    /**
    * Change tab
    * @param {Object} $targetTab reference to the new tab
    * @method changeTab
    */
    this.changeTab = function($targetTab) {
      var $currentTab = this.$tabs.filter('[aria-selected=true]'),
          $currentPanel = this.getPanel($currentTab),
          $targetPanel = this.getPanel($targetTab);

      if($currentTab) {
        $currentTab.removeClass(this.attr.activeTabClass);
        $currentTab.attr('aria-selected', 'false');
      }

      if($currentPanel) {
        $currentPanel.hide();
        $currentPanel.attr('aria-hidden','true');
      }

      $targetTab.addClass(this.attr.activeTabClass);
      $targetTab.attr('aria-selected', 'true');
      $targetPanel.show();
      $targetPanel.show().attr('aria-hidden','false');
    };

    /**
    * Initializes tab by linking it to it's panel with ARIA
    * @param {Number} index the index of the tab within the list
    * @param {Object} the tab in question (native object reference)
    * @method changeTab
    */
    this.initializeTab = function(index, element) {
      var $tab = $(element),
          $link = $tab.find('a'),
          panelId = $link.attr('href').replace('#', ''),
          $panel = this.getPanel($tab);

      $tab.attr('aria-controls', panelId);
      $panel.attr('aria-labelledby', $link.attr('id'));
    }

    /**
    * Initializes tabset
    * @method after:changeTab
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
