# Accessible Tabs

[![Build Status](https://secure.travis-ci.org/<username>/flight-accessible-tabs.png)](http://travis-ci.org/<username>/flight-accessible-tabs)

A [Flight](https://github.com/flightjs/flight) component for generating an accessible tab component.

This project is concerned about determining the correct markup required to make tabs accessible, and
not to provide a tab component for general use. However feel free to take a poke through the code.

To get involved in the discussion around making tabs accessible, view the working demo

http://thatguynamedandy.github.io/accessible-tabs/

Some of the considerations taken into account are as follows

* The baseline non Javascript version of the code should display all of the tab content, with quick nav links to specific sections.
* Any ARIA roles should only be added when JavaScript is enabled, up until that point it is effectively not a tab.
* Tab controls should only be applied when there is more than one tab, otherwise it isn't really a tab.
* The ARIA attribute values can be used to drive the Javascript, and also used with the CSS to control visibility (CSS2.0 attribute selectors)
