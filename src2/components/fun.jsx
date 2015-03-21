var React = require('react');

var List = React.createClass({
  getInitialState: function() {
    return {data: this.props.data};
  },
  render: function() {
    var listItems = this.state.data.map(function(item) {
      return <li>{item}</li>;
    });
    return <ul>{listItems}</ul>
  }
});

module.exports = List;
