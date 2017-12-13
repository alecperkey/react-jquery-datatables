import React, { Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOMServer from 'react-dom/server';
const $ = require('jquery');
const dt = require('datatables.net'); // eslint-disable-line no-unused-vars
const buttons = require('datatables.net-buttons'); // eslint-disable-line no-unused-vars
const responsive = require('datatables.net-responsive'); // eslint-disable-line no-unused-vars
const responsiveBs = require('datatables.net-responsive'); // eslint-disable-line no-unused-vars
// const buttonStyles = require('datatables.net-buttons-dt/css/buttons.dataTables.css'); // eslint-disable-line no-unused-vars
// const defaultStyles = require('datatables.net-dt/css/jquery.dataTables.css'); // eslint-disable-line no-unused-vars
// const responsiveStyles = require('datatables.net-responsive-dt/css/responsive.dataTables.css'); // eslint-disable-line no-unused-vars
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import _ from 'lodash';

require('datatables.net-buttons/js/buttons.colVis.js'); // Column visibility
require('datatables.net-buttons/js/buttons.flash.js');  // Flash file export
require('datatables.net-buttons/js/buttons.html5.js');  // HTML 5 file export
require('datatables.net-buttons/js/buttons.print.js');  // Print view button

let simpleGet = key => data => data[key];
let keyGetter = keys => data => keys.map(key => data[key]);

let isEmpty = value => value == null || value === ''; // eslint-disable-line eqeqeq

let getCellValue =
  ({prop, defaultContent, render}, row) =>
    // Return `defaultContent` if the value is empty.
    !isEmpty(prop) && isEmpty(row[prop]) ? defaultContent : // eslint-disable-line no-nested-ternary
      // Use the render function for the value.
      render ? render(row[prop], row) :
        // Add Commas for Number formatting
        // addCommas ?
        // Otherwise just return the value.
        row[prop];

let getCellClass =
  ({prop, className}, row) =>
    !isEmpty(prop) && isEmpty(row[prop]) ? 'empty-cell' : // eslint-disable-line no-nested-ternary
      typeof className == 'function' ? className(row[prop], row) : // eslint-disable-line eqeqeq
        className;

// This function accepts an integer, and produces a piece of HTML that shows it nicely with
// some empty space at "thousand" markers.
// Note, these space are not spaces, if you copy paste, they will not be visible.
let valPrettyPrint = (orgVal) => {
    // Save after-comma text, if present
    const period = orgVal.indexOf('.');
    const frac = period >= 0 ? orgVal.substr(period) : '';
    // Work on input as an integer
    let val = '' + Math.trunc(orgVal);
    let res = '';
    while (val.length > 0) {
      res = val.substr(Math.max(0, val.length - 3), 3) + res;
      val = val.substr(0, val.length - 3);
      if (val.length > 0) {
        res = "<span class='thousandsSeparator'></span>" + res;
      }
    }
    // Add the saved after-period information
    res += frac;
    return res;
  };
// 2056776401.50 = 2,056,776,401.50
let addThousandsCommas = (n) => { // eslint-disable-line no-unused-vars
  n = n.toString();
  while (true) { // eslint-disable-line no-constant-condition
    let n2 = n.replace(/(\d)(\d{3})($|,|\.)/g, '$1,$2$3');
    if (n === n2) break;
    n = n2;
  }
  return n;
};

@connect(
    () => ({}),
  {pushState: push})

export default class DataTable extends Component {
  static propTypes = {
    keys: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string
    ]).isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      prop: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      render: PropTypes.func,
      sortable: PropTypes.bool,
      defaultContent: PropTypes.string,
      width: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      className: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
      ])
    })).isRequired,
    dataArray: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object
    ])).isRequired,
    buttons: PropTypes.array,
    buildRowOptions: PropTypes.func,
    pushState: PropTypes.func,
    // the id of the div into which the table will render
    targetId: PropTypes.string,
    // clickHandler: if this is present, datatable will look for any cells with the
    // class .dtClickAction.  If the cell is clicked, then it will pass back
    // data to the clickHandler as an option.  The way to pass data is as an
    // data-<foo> attribute on the html element. It's generally a good idea to
    // pass a data-action-name attribute so the clickHandler can check which action
    // it needs to fire (because there could be multiple types of handlers).
    clickHandler: PropTypes.func,
    sortBy: PropTypes.shape({
      prop: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      order: PropTypes.oneOf(['asc', 'desc'])
    })
  };
  static defaultProps = {
    buildRowOptions: () => ({}),
    sortBy: {},
  };

  constructor(props) {
    super(props);
    // console.log('Table constructor', this);
    this._headers = [];
    //  bind event handlers in the constructor so they are only bound once for every instance
    this.postRender = this.postRender.bind(this);
    this.getDTMarkup = this.getDTMarkup.bind(this);
  }


  componentDidMount() {
    this.postRender();
  }


  shouldComponentUpdate(nextProps) {
    // check if dataArray changes, if so implement componentDidMount code in componentDidUpdate
    const isEqualDataArray = _.isEqual(this.props.dataArray, nextProps.dataArray);
    return !isEqualDataArray;
  }

  componentDidUpdate() {
    // console.log('Table componentDidUpdate', this);
    this.postRender();
  }

  componentWillUnmount() {
    // console.log('Table componentWillUnmount', this);
  }

  getDTMarkup() {
    let {columns, keys, buildRowOptions, dataArray,
        buttons, pushState, sortBy, targetId, clickHandler, ...rest } // eslint-disable-line no-shadow
        = this.props;

    let headers = columns.map(
      (col, idx) =>
        <th
          ref={c => this._headers[idx] = c}
          key={idx}
          style={{width: col.width}}
          className={col.className}
          role="columnheader"
          scope="col">
          <span>{col.title}</span>
        </th>
    );
    let footers = columns.map(
      (col, idx) =>
        <th key={idx}>
        </th>
    );

    let getKeys = Array.isArray(keys) ? keyGetter(keys) : simpleGet(keys);
    // console.log('dataArray', dataArray);
    let rows = dataArray.map(
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
      <table id="dt" {...rest}>
        <thead>
        <tr>
          {headers}
        </tr>
        </thead>
        <tfoot>
        <tr>
          {footers}
        </tr>
        </tfoot>
        <tbody>
        {rows.length ? rows :
          <tr>
            <td colSpan={columns.length} className="text-center">No data</td>
          </tr>}
        </tbody>
      </table>
    );
  }

  postRender() {

    const targetId = this.props.targetId || 'dtContainer';

    $(`#${targetId}`).empty(); // eslint-disable-line no-shadow
    // console.log('post-processing', this);
    let {columns, sortBy, buttons, pushState, clickHandler} = this.props; // eslint-disable-line no-shadow
    let table = this.getDTMarkup();
    let container = this.refs.tableDiv;
    let renderedTable = ReactDOMServer.renderToStaticMarkup(table, container);
    if (buttons.indexOf('colvis')) {
      buttons[buttons.indexOf('colvis')] =
      {
        extend: 'colvis',
        text: 'Columns'
      };
    }
    $(`#${targetId}`).append(renderedTable);
    let jqueryTable = $(`#${targetId} table`);
    jqueryTable.DataTable({ // eslint-disable-line new-cap
      dom: '<"html5buttons"B>lTfgitp',
      buttons: buttons,
      'order': [[columns.findIndex((col) => col.prop === sortBy.prop), sortBy.order]],
      'pagingType': 'numbers',
      'bAutoWidth': false,
      'bDestroy': true,
      responsive: true,
      'initComplete': function formatTable() {
        this.api().cells('.pushState').every(function __pushState() {
          const cell = this;
          const anchor = $(cell.node()).find('a');
          const pusher = () => pushState(anchor.attr('href'));
          anchor.click(function __pushTheState(event) {
            event.preventDefault();
            pusher();
          });
        });
        if (clickHandler && typeof clickHandler === 'function') {
          this.api().cells('.dtClickAction').every(function __triggerAction() {
            const cell = this;
            const anchor = $(cell.node()).find('a');
            const cellData = anchor.data();
            anchor.click(function __actionOnClick(event) {
              event.preventDefault();
              clickHandler(cellData);
            });
          });
        }
      }
    });
  }

  render() {
    const targetId = this.props.targetId || 'dtContainer';

    // console.log('Table render', this);
    return (
      <div>
        <div ref="tableDiv" id={targetId} className="dtContainer"></div>
      </div>
    );
  }

}

module.exports = DataTable;