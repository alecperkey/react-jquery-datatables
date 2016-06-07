# react-jquery-datatables

[![Build Status](https://travis-ci.org/carlosrocha/react-jquery-datatables.svg?branch=master)](https://travis-ci.org/alecperkey/react-jquery-datatables)

## Getting started

```sh
npm install react-jquery-datatables --save
```

Styles (tbd)

If you are using Webpack and the `css-loader` you can also require the css
with `require('react-jquery-datatables/css/datatables.min.css')`.

### Using the default implementation

The default implementation includes a filter for case insensitive global search,
pagination and page size.

```javascript
import React, {Component, PropTypes} from 'react';
import { DataTable } from 'react-jquery-datatables';

export default class MyTable extends Component {

  static propTypes = {
    accountSummaries: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    loadData: PropTypes.func.isRequired
  };
  
  componentWillMount() {
  
    const data = this.props.loadData();
    
    /** get some initial config data like
    {
        columns: [
          { title: 'Name', prop: 'name'  },
          { title: 'City', prop: 'city' },
          { title: 'Address', prop: 'address' },
          { title: 'Phone', prop: 'phone' }
        ],
        data = [
          { name: 'name value', city: 'city value', address: 'address value', phone: 'phone value' }
          // It also supports arrays
          // [ 'name value', 'city value', 'address value', 'phone value' ]
        ];
    }
    **/
  }


React.render((
    <DataTable
      className="container"
      keys={[ 'name', 'address' ]}
      columns={columns}
      initialData={data}
      initialPageLength={5}
      initialSortBy={{ prop: 'city', order: 'descending' }}
    />
  ), document.body);
```

See [complete example](example/table/main.js), see [Flux example](example/flux/).

## DataMixin options

#### `keys: Array<string> | string`
Properties that make each row unique, e.g. an id.

#### `columns: Array<ColumnOption>`
See `Table` column options.

#### `pageLengthOptions: Array<number>`

#### `initialData: Array<object | Array<any>>`

#### `initialPageLength: number`

#### `initialSortBy: { prop: string | number, order: string }`

## Table column options

#### `title: string`
The title to display on the header.

#### `prop: string | number`
The name of the property or index on the data.

#### `render: (val: any, row: any) => any`
Function to render a different component.

#### `className: string | (val: any, row: any) => string`
Class name for the td.

#### `defaultContent: string`

#### `sortable: boolean`

#### `width: string | number`
