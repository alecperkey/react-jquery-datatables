var React = require('react');
var Table = require('./Table');
// var Pagination = require('./Pagination');
// var SelectField = require('./SelectField');
// var SearchField = require('./SearchField');

var DataMixin = require('./DataMixin');

var DataTable = React.createClass({

  mixins: [ DataMixin ],

  componentWillMount() {
    console.log('DataTable componentWillMount', this);
  },
  componentWillUnmount() {
    console.log('DataTable componentWillUnmount', this);
  },

  render() {
    console.log('DataTable render', this);
    var page = this.buildPage();

    return (
      <div className={this.props.className}>
        <Table
          className="table table-striped table-bordered table-hover dataTables-example"
          dataArray={page.data}
          columns={this.props.columns}
          keys={this.props.keys}
          buildRowOptions={this.props.buildRowOptions}
          sortBy={this.state.sortBy}
           />
      </div>
    );
  },
});

module.exports = DataTable;
