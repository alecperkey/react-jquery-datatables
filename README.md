### Jquery DataTables (DataTables.net) with React

#### From popular demand I have made this somewhat more understandable with a jsfiddle demo. https://jsfiddle.net/alecperkey/69z2wepo/94908/

I don't know much about making NPM packages, so the minified bundle is ~500kb. Enabling DataTables.net plugins (various themes, buttons, pdfmaker, etc) as configuration options would be great, but I have other stuff to do for now. Hopefully someone will make pure react components with all the features DataTables.net provides

*** Work in progress PRs encouraged ***
[proof of concept](https://github.com/alecperkey/react-hot-boilerplate/blob/master/README.md)

>>>Most of the time you should stay within React's "faked browser" world since it's more performant and easier to reason about. However, sometimes you simply need to access the underlying API, perhaps to work with a third-party library like a jQuery plugin. React provides escape hatches for you to use the underlying DOM API directly.

>>>(ref: https://facebook.github.io/react/docs/working-with-the-browser.html)

### How it works: the React Lifecyle approach for jQuery DataTables

see [Table.js](https://github.com/alecperkey/react-jquery-datatables/blob/master/src/Table.js) if you want to understand the internals.

Basically each column can have a unique renderer for full cell customization, and each row can have unique classNames. 
Internally, Table.js uses ReactDOM.renderToStaticMarkup to make the table, and then jQuery.DataTable is a function which jQuerifies it. If any rows have classnames of `pushState` or `dtClickAction`, the cells in those rows will have handlers attached to them after the jQuerification of the table.

`pushState` classed cells with anchor tags will have their default href anchor tag behavior prevented, and instead use `{push} from 'react-router-redux'` to navigate around (if you can use react-router-redux) without the whole page refreshing like a normal anchor tag would.

`dtClickAction` allows more flexibility. 
The DataTable accepts a prop `clickHandler`: if this is present, datatable will look for any rows with the
class `.dtClickAction`.  If any of the cells has an anchor tag with `data-<foo>` attribute(s), and is clicked, then it will pass back to the clickHandler the values of such dataAttrs. Different cells might have different dataAttrs, and so the clickHandler in the [jsfiddle](https://jsfiddle.net/alecperkey/69z2wepo/94908/) shows a switch statement approach for handling multiple dtClickAction types.

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
with `require('react-jquery-datatables/css/datatables.min.css')`. I'm  not sure how to include the styles in this package properly, as each user may prefer different styles and use different bundling methods.

### Using the default implementation

Forked from (React Data Components)[https://github.com/carlosrocha/react-data-components]

The default implementation includes a filter for case insensitive global search,
pagination and page size.
