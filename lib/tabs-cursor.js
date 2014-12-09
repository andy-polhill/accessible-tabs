define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var defineComponent = require('flight/lib/component'),
      Tabs = require('tabs');

  /**
   * Module exports
   */

  return Tabs.mixin(tabsCursor);

  /**
   * Module function
   */

  function tabsCursor() {

    this.attr({

    });

    this.after('initialize', function () {

    });
  }

});
