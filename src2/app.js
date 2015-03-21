var React = require('react');
var BT = require('react-bootstrap');
var List = require('./components/fun.jsx');
var Sidebar = require('./components/sidebar.jsx');

var colors = ["Red","Green","Blue","Yellow","Black","White","Orange"];
var sidebarClosed = false;

/** @jsx React.DOM */
React.render(<Sidebar closed={sidebarClosed} data={colors} />, document.getElementById('sidebar'));

React.render(<List data={colors} />, document.getElementById('main'));
