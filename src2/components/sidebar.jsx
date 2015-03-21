var React = require('react');
var Button = require('react-bootstrap').Button;

var Sidebar = React.createClass({
  getInitialState: function() {
    return {
      closed: this.props.closed,
      data: this.props.data
    };
  },
  _generate_content: function() {
    if(this.props.closed) {
      return <span className="glyphicon glyphicon-th">Hello</span>
    } else {
      var SidebarItems = this.state.data.map(function(item) {
        return <Button>{item}</Button>;
      });
      return <div>
        <h1>Jógaadmin</h1>
        {SidebarItems}
      </div>
    }
  },
  render: function() {
    var is_closed_class = 'col-xs-3';
    if(this.props.closed) {
      is_closed_class += ' is_closed';
    }
    var Content = this._generate_content();
    return <div className={is_closed_class}>{Content}</div>

  }
});

module.exports = Sidebar;
