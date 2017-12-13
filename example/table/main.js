var React = require('react');
var ReactDOM = require('react-dom');

// var { DataTable } = require('react-data-components');
// import { DataTable } from 'components';

import DataTable from '../react-jquery-datatables/Table';
var d3 = require('d3');

const propTypes = {
};

class TableInstance extends Component {

  constructor(props) {
    super(props);
    this.handleTableClick = this.handleTableClick.bind(this);
    this.buildTable = this.buildTable.bind(this);
  }

  // GENERIC URL LINK RENDERER
  renderUrl(val, row) {
    return (<a title={`Value: ${val}`} href={`/baseurl/${val}`}>
      <span
        style={{
          display: 'inline-block',
          width: 92,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {`Value: ${val}`}
      </span>
    </a>);
  }

  renderCity(val, row) {
    if (!val) return (
      <span>{``}</span>
    );
    else
      return (
        <a
          href="#"
          data-action-name={'linkCity'}
          data-city-name={row.key}
        >
          Click city
      </a>
      );
  }

  renderMapUrl(val, row) {
    <a href={`https://www.google.com/maps?q=${row['LAT']},${row['LON']}`}>
      Google Maps
    </a>;
  }

  handleTableClick(dataAttrs) {
    switch (dataAttrs.actionName) {
      case 'ALERT_CITY':
        alert(dataAttrs.cityName)
      default:
        console.error(
          new Error('No handler for table action: ' + dataAttrs.actionName));
        return undefined;
    }
  }

  buildTable(data) {
    var tableColumns = [
      { title: 'Name', prop: 'NAME', className: 'pushState' },
      { title: 'City', prop: 'CITY', className: 'dtClickAction' },
      { title: 'Street address', prop: 'STREET ADDRESS' },
      { title: 'Phone', prop: 'PHONE NUMBER', defaultContent: '<no phone>' },
      { title: 'Map', render: renderMapUrl, className: 'text-center' }
    ];


    return (
      <DataTable
        className="container"
        keys={['NAME', 'OUTLET TYPE', 'STREET ADDRESS']}
        columns={tableColumns}
        clickHandler={this.handleTableClick}
        dataArray={tableData}
        initialPageLength={5}
        sortBy={{ prop: 'CITY', order: 'desc' }}
        buttons={[
          'copy',
          'csv',
          'excel',
          {
            extend: 'pdf',
            orientation: 'landscape',
            pageSize: 'LEGAL',
            footer: true,
            filename: `Custom-Report-Filename`,
            message: `extra message here`,
            download: 'open'
          },
          'print',
          'colvis']}
        pageLengthOptions={[5, 20, 50]}
      />
    );
  }

  render() {

    const tableData = d3.csv('/sample_data.csv', function (error, rows) {
      return rows;
    });

    if (tableData.length > 0) {

      return (
        <div>
          {this.buildTable(tableData, accountName)}
          <CoveragePremiumModal
            showModal={showCoveragePremiumModal}
            close={this.closeCoveragePremiumModal}
            onSubmit={this.handlePremiumSubmit}
            submitting={submittingDetails} />
        </div>
    }

    return (
      <div>Loading csv data....</div>
    );
  }

  export default TableInstance;

