### Jquery DataTables (DataTables.net) with React

*** Work in progress PRs encouraged ***
[proof of concept](https://github.com/alecperkey/react-hot-boilerplate/blob/master/README.md)

>>>Most of the time you should stay within React's "faked browser" world since it's more performant and easier to reason about. However, sometimes you simply need to access the underlying API, perhaps to work with a third-party library like a jQuery plugin. React provides escape hatches for you to use the underlying DOM API directly.

>>>(ref: https://facebook.github.io/react/docs/working-with-the-browser.html)

### How it works: the React Lifecyle approach for jQuery DataTables

see [Table.js](https://github.com/alecperkey/react-jquery-datatables/blob/master/src/Table.js)

1. componentWillMount | get data from source & set it to the state variable with setState
2. initial render | generate table markup using the props you provided
3. componentDidMount | initialise as jQuery DataTable [here](https://github.com/alecperkey/react-jquery-datatables/blob/master/src/Table.js#L121)
-- Not invoked on the server-rendering? ( SSR may needs some solution. Suggestions? )
4. optional: componentShouldUpdate | logic to determine if you do/don't want to re-render depending on differences changes in props and state.
5. componentWillUpdate
-- (a) persist any config which might be lost from DataTable instance (What might this be? Not sure yet.)
-- (b) destroy table
6. Re-render is called, same as step 2
7. componentDidUpdate, initialize the new table created in step 6, potentially with persisted DataTables-specific config from 5(a)
8. componentWillUnmount, destroy table

There are problems still associated with browser DOM manipulation (invariant violations, unable to find child n of element, etc)

I'm looking into these resources to solve these: 
 - https://facebook.github.io/react/docs/working-with-the-browser.html
 - https://facebook.github.io/react/docs/more-about-refs.html
 - https://github.com/ryanflorence/react-training/blob/gh-pages/code/Dialog/Dialog.js
 - https://gist.github.com/petehunt/7882164
 - http://facebook.github.io/react/tips/use-react-with-other-libraries.html


###Warning

Many have warned jQuery DataTables and React shouldn't be used together as both are trying to manipulate the DOM and it can cause conflicts. 

If you understand React lifecycle hook methods & are not changing the underlying data too often (i.e. not inline editing like its Google sheets, polling async data sources etc), it might not be a problem.

Still, if the underlying data is constantly being updated with many rows, it will probably be a performance bottleneck for these use cases.

Angular DataTables is quite nice as an alternative.

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

Forked from (React Data Components)[https://github.com/carlosrocha/react-data-components]

The default implementation includes a filter for case insensitive global search,
pagination and page size.

```javascript
import React, {Component, PropTypes} from 'react';
import { DataTable } from 'react-jquery-datatables';

var columns = [
  { title: 'Name', prop: 'name'  },
  { title: 'City', prop: 'city' },
  { title: 'Address', prop: 'address' },
  { title: 'Phone', prop: 'phone' }
];

var data = [
  { name: 'name value', city: 'city value', address: 'address value', phone: 'phone value' }
  // It also supports arrays
  // [ 'name value', 'city value', 'address value', 'phone value' ]
];

React.render((
    <DataTable
      className="container"
      keys={[ 'name', 'address' ]}
      columns={columns}
      initialData={data}
      initialPageLength={5}
      initialSortBy={{ prop: 'city', order: 'descending' }}
      pageLengthOptions={[ 5, 20, 50 ]}
    />
  ), document.body);
```

See [complete example tbd](#)

## DataMixin options

#### `keys: Array<string> | string`
Properties that make each row unique, e.g. an id.

#### `columns: Array<ColumnOption>`
See `Table` column options.

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

#### `width: string | number`
