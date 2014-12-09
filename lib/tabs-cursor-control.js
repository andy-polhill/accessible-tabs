define(function (require) {

  'use strict';

  var ACTIVE_CLASS = 'active';

  // Module dependencies
  var $ = require('jquery'),
      defineComponent = require('flight/lib/component');

  var keyCodes = {
    LEFT: 37,
    RIGHT: 39
  };

  return defineComponent(tabs);

  /**
  * Tabbed content
  * @constructor
  */
  function tabs() {

    /*jshint validthis:true */
    this.attributes({
      tabLinkSelector: 'a.js-tab',
      hiddenClass: 'js-hidden',
      panelSelector: '.tab-section',
      cookieName: 'currentTab'
    });

    /**
    * React to an event request to change a tab
    * @method selectTab
    */
    this.selectTab = function(evt) {
      this.changeTab($(evt.currentTarget));
      evt.preventDefault();
    };

    /**
    * React to an event request to change a tab
    * @param {Object} or {String} tabOrId of the tab to select
    * @method changeTab
    */
    this.changeTab = function(tabOrId) {

      var $tab;

      switch(typeof tabOrId) {
        case 'string':
          $tab = this.$tabs.filter('[aria-controls=' + tabOrId + ']');
          break;
        case 'object':
          $tab = tabOrId;
          break;
        default: //undefined
          $tab = this.$tabs.eq(0);
      }

      this.$tabs.removeClass(ACTIVE_CLASS);
      $tab.addClass(ACTIVE_CLASS);
      this.updateTabs();

      return $tab;
    };

    /**
    * Get the currently selected tab
    * @method getCurrentTab
    */
    this.getCurrentTab = function() {
      return this.$tabs.filter('.' + ACTIVE_CLASS)[0];
    };

    /**
    * Select the next tab in the sequence
    * @method nextTab
    */
    this.nextTab = function () {
      var proposedIndex = this.$tabs.index(this.getCurrentTab()) + 1,
          nextIndex = (proposedIndex < this.$tabs.length) ? proposedIndex : 0;
      this.changeTab(this.$tabs.eq(nextIndex)).focus();
    };

    /**
    * Select the previous tab in the sequence
    * @method prevTab
    */
    this.prevTab = function () {
      var proposedIndex = this.$tabs.index(this.getCurrentTab()) - 1,
          prevIndex = (proposedIndex < 0) ? this.$tabs.length - 1 : proposedIndex;
      this.changeTab(this.$tabs.eq(prevIndex)).focus();
    };

    /**
    * Normalize the state of each tab
    * @method updateTabs
    */
    this.updateTabs = function() {

      this.$tabs.each($.proxy(function (i, el) {

        var $tab = $(el),
            $panel = this.$panels.filter('#'+$tab.attr('aria-controls')),
            isActive = $tab.hasClass(ACTIVE_CLASS);

        $tab.attr({
          'aria-selected': (isActive ? 'true' : 'false'),
          'tabindex': (isActive ? '0' : '-1')
        });

        $panel.attr({
          'aria-hidden': (isActive ? 'false' : 'true'),
          'aria-expanded': (isActive ? 'true' : 'false')
        });

        $panel.toggleClass(this.attr.hiddenClass, !isActive);
      }, this));
    };

    /**
    * Add ARIA attributes to the markup
    * @method addAriattributes
    */
    this.addAriaAttributes = function() {

      this.$node.attr('role', 'tablist');

      this.$tabs.each($.proxy(function (i, el) {

        var $tab = $(el),
            tabId = $tab.attr('href').substr(1),
            linkId = 'tab-link-' + tabId,
            $panel = this.$panels.filter('#' + tabId);

        $tab.attr({
          'id': linkId,
          'role': 'tab',
          'aria-controls': tabId
        });

        $panel.attr({
          'aria-labelledby': linkId,
          'role': 'tabpanel'
        });

        $tab.removeAttr('href');

      },this));
    };

    /**
    * Keyboard accessibl controls
    * @method monitorKeyPress
    */
    this.monitorKeyPress = function (ev) {
      var keyCode = ev.which;

      switch (keyCode) {
        case keyCodes.LEFT: // Left
          this.prevTab();
          break;
        case keyCodes.RIGHT: // Right
          this.nextTab();
          break;
      }
    };

    /**
    * Initialize
    * @method init
    */
    this.after('initialize', function() {

      //selectors
      this.$tabs = this.select('tabLinkSelector');

      //panels exist outside of the component (perhaps questionnable)
      this.$panels = $(this.attr.panelSelector);

      //events
      this.on(this.$tabs, 'click', this.selectTab);
      this.on(this.$tabs, 'keydown', this.monitorKeyPress);

      //do stuff
      this.addAriaAttributes();
    });
  }

});
