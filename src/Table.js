import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
const $ = require('jquery');
const dt = require('datatables.net-bs');
const buttons = require('datatables.net-buttons-bs');

require('datatables.net-buttons/js/buttons.colVis.js'); // Column visibility
require('datatables.net-buttons/js/buttons.html5.js');  // HTML 5 file export
require('datatables.net-buttons/js/buttons.flash.js');  // Flash file export
require('datatables.net-buttons/js/buttons.print.js');  // Print view button

let simpleGet = key => data => data[key];
let keyGetter = keys => data => keys.map(key => data[key]);

let isEmpty = value => value == null || value === '';

let getCellValue =
  ({ prop, defaultContent, render }, row) =>
    // Return `defaultContent` if the value is empty.
    !isEmpty(prop) && isEmpty(row[prop]) ? defaultContent :
      // Use the render function for the value.
      render ? render(row[prop], row) :
      // Otherwise just return the value.
      row[prop];

let getCellClass =
  ({ prop, className }, row) =>
    !isEmpty(prop) && isEmpty(row[prop]) ? 'empty-cell' :
      typeof className == 'function' ? className(row[prop], row) :
      className;

export default class Table extends Component {

  constructor(props) {
    super(props);
    console.log('Table constructor', this);
    this._headers = [];

    //  bind event handlers in the constructor so they are only bound once for every instance
  }

  static defaultProps = {
    buildRowOptions: () => ({}),
    sortBy: {},
  };
  static propTypes = {
    keys: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]).isRequired,

    columns: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      prop: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      render: PropTypes.func,
      sortable: PropTypes.bool,
      defaultContent: PropTypes.string,
      width: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      className: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
      ]),
    })).isRequired,

    dataArray: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ])).isRequired,

    buildRowOptions: PropTypes.func,

    sortBy: PropTypes.shape({
      prop: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      order: PropTypes.oneOf([ 'ascending', 'descending' ]),
    }),

    onSort: PropTypes.func,
  };

  componentDidMount() {
    console.log('Table componentDidMount', this);
    let { columns, dataArray, className } = this.props;
    let self = this;

    let table = this.getDTMarkup();
    console.log('ReactDOM', ReactDOM);
    let dtContainer = this.refs.dtContainer;
    let renderedTable = ReactDOMServer.renderToStaticMarkup(table, dtContainer);
    console.log('dtContainer', dtContainer);


    console.log('renderedTable', renderedTable);

    // let jqueryTable = $(table);
    // let tableString = '<table class="';
    // tableString += className;
    // tableString += '"><thead><tr>';
    // columns.forEach(function addHeader(col) {
    //   tableString += ('<th>' + col.title + '</th>');
    // });
    // tableString += '</tr></thead><tbody></tbody></table>';

    // let jqueryTable = $(tableString);


    $('#dtContainer').append(renderedTable);
    let jqueryTable = $('#dt');
    console.log('jqueryTable', jqueryTable);

    // console.log('dtContainer', dtContainer);

    // let initColumns = columns.map((col, idx) => {
    //   let rCol = {};
    //   rCol['data'] = col.prop;
    //   return rCol;
    // });
    //
    // console.log('dataArray', dataArray);
    // console.log('initColumns', initColumns);

    jqueryTable.DataTable({ // eslint-disable-line new-cap
      // "data": dataArray,
      // "columns": initColumns,
      dom: '<"html5buttons"B>lTfgitp',
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ],
      "pagingType": 'numbers',
      "bAutoWidth": false,
      "bDestroy": true,
      "fnDrawCallback": function() {
        console.log('datatables fnDrawCallback');
        // self.forceUpdate();
      }
    });

  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('Table shouldComponentUpdate', this);
    console.log('nextProps', nextProps);
    console.log('nextState', nextState);

    // check if dataArray changes, if so implement componentDidMount code in componentWillUpdate
    return false;
  }

  componentWillUnmount() {
    console.log('Table componentWillUnmount', this);
  }

  getDTMarkup() {
    console.log('Table getDTMarkup', this);

    let { columns, keys, buildRowOptions, sortBy, onSort } = this.props;

    let headers = columns.map((col, idx) => {

      return (
        <th
          ref={c => this._headers[idx] = c}
          key={idx}
          style={{width: col.width}}
          role="columnheader"
          scope="col" >
          <span>{col.title}</span>
        </th>
      );
    });

    let getKeys = Array.isArray(keys) ? keyGetter(keys) : simpleGet(keys);
    let rows = this.props.dataArray.map(
      row =>
        <tr key={getKeys(row)} {...buildRowOptions(row)}>
          {columns.map(
            (col, i) =>
              <td key={i} className={getCellClass(col, row)}>
                {getCellValue(col, row)}
              </td>
          )}
        </tr>
    );

    return (
      <table id="dt" {...this.props}>
        <thead>
          <tr>
            {headers}
          </tr>
        </thead>
        <tbody>
          {rows.length ? rows :
            <tr>
              <td colSpan={columns.length} className="text-center">No data</td>
            </tr>}
        </tbody>
      </table>
    );
  }

  render() {
    console.log('Table render', this);
    return (
      <div>
        <div ref="dtContainer" id="dtContainer"></div>
      </div>
    );
  }

}
