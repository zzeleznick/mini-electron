require('normalize.css/normalize.css');
require('styles/App.css');
require('styles/Main.css');
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import SubscribeComponent from './SubscribeComponent';


let yeomanImage = require('../images/yeoman.png');
const yeoman = (<img src={yeomanImage} alt='Yeoman Generator' />);
var products = [{
      id: 1,
      name: 'Item name 1',
      rating: 5,
      price: 150
  },{
      id: 2,
      name: 'Item name 2',
      rating: 4,
      price: 120
  },
  {
      id: 3,
      name: 'Item name 3',
      rating: 3,
      price: 80
  }]

const fields = ['id', 'name', 'rating', 'price'];
const descriptions  = ['Product ID', 'Product Name', 'Product Rating', 'Product Price'];
const firebaseRef = firebase.database().ref('/results');
var productIDs = [];

class CheckboxElement extends React.Component {
  constructor(props) {
    super(props);
    const {checked } = this.props;
    this.state = {
      checked: checked
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    // console.log('Yooo', event.target.checked);
    const {index, handleShow, handleHide} = this.props;
    const active =  event.target.checked;
    this.setState({ checked: active});
    if (active) {
      handleShow(index);
    }
    else {
      handleHide(index);
    }
  }
  render() {
    const { text, index } = this.props;
    const { checked } = this.state;
    return (
      <label>
        <input type='checkbox' onChange={this.handleChange} checked={checked} value={'checkbox_' + index}/> { text }
      </label>
    );
  }
}

const makeToggleElements = (showAction, hideAction) => { return fields.map( (el, idx) => {
       const checked = true ? idx != 3 : false;
       // console.log(descriptions[idx]);
      return (<li key={idx}>
        <CheckboxElement checked={checked} index={idx} text={el}
            handleShow={showAction} handleHide={hideAction} />
      </li>);
    });
}

class Panel extends React.Component {
  render() {
    const {showAction, hideAction} = this.props;
    return (
      <div>
       <ul>
        { makeToggleElements(showAction, hideAction) }
        </ul>
      </div>
    );
  }
}

class AddRowButton extends React.Component {
  render() {
    const {action} = this.props;
    return (
      <button onClick={action}> Click Me </button>
    );
  }
}

const makeFakeRow = () => {
    const idx = Math.round(Math.random() * 100);
    const rating = Math.round(1 + Math.random() * 4);
    return {
      id: idx,
      name: `Product ${idx}`,
      rating: rating,
      price: rating * 30
    }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.onAddRow = this.onAddRow.bind(this);
    this.addRow = this.addRow.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.updateRows = this.updateRows.bind(this);
    this.state  = {'init': false, 'rows': products};
  }
  onAddRow(row) {
    console.log('ROW to be added', row);
  }
  onPageChange(idx, pageSize) {
    const startingRow = 1 + (idx - 1) * pageSize
    const endingRow = Math.min(startingRow + pageSize, 100)
    console.log('Showing Results', startingRow, ' - ', endingRow);
  }

  addRow(data = undefined, start = false) {
    return // DO not call this function
    var row = null;
    if (data == undefined) {
      row = makeFakeRow()
    }
    else {
      row = data;
    }
    // Add Row with has funky behavior with multiple methods
    const insertFn = start == true ? this.refs.table.handleAddRowAtBegin
                      : this.refs.table.handleAddRow;
    var err = insertFn(row);
    if(err){  // i.e: doesn't assign row key or unique row key
          console.log(err);
    }
    else { // add the new row to our primitive data store
      products.push(row);
    }
  }
  updateRows(rows) {
    this.setState({'rows': rows});
  }
  componentDidMount() {
    // child added also get the initial data
    console.warn('Listener Activated');
    const {init} = this.state;
    const updateRows = this.updateRows;
    // const addTableRow = this.addRow // add row is jank
    firebaseRef.on('child_added', function(snapshot, prevChildKey) {
        if (!init) {
          console.log('No init yet');
          return
        }
        var item = snapshot.val();
        const idx = item['id'];
        if (productIDs.indexOf(idx) == -1) {
          // not added, add the product
          const err = null // addTableRow(item, false);
          if (err) { console.error('ERROR', err)}
          else {
            productIDs.push(idx);
            products.push(item);
            updateRows(products);
            console.log('New item', item);
          }
        }
    });
    firebaseRef.on('child_removed', function(snapshot) {
      var item = snapshot.val();
      var idx = null;
      try
         { idx = item['id'];}
      catch(err) { console.warn('ERROR', err); }
      if (idx == null) {
        console.warn('Child has no id key', item);
        return
      }
      const pos = productIDs.indexOf(idx);
      if ( pos != -1) {
        productIDs = productIDs.slice(0, pos).concat(productIDs.slice(pos+1));
        products = products.slice(0, pos).concat(products.slice(pos+1));
        updateRows(products);
      }
    });
  }
  componentWillUnmount() {
    firebaseRef.off();
  }
  componentWillMount(){
    products = []; // reset from initial
    firebaseRef.once('value', function(snapshot) {
      console.log('FB once activated');
      snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        const idx = item['id'];
        if (productIDs.indexOf(idx) == -1) {
          // not added, add the product
          productIDs.push(idx);
          products.push(item);
        }
      })
      console.log('FB once De-activated');
    });
    this.setState({'rows': products});
    this.setState({ init: true });
  }
  render() {
    const { onShow, onHide, main } = this.props;
    const indices = main.indices;
    const options = {defaultSortName : 'id', defaultSortOrder : 'asc',
          paginationShowsTotal: false, page: 1,
          onAddRow: this.onAddRow, onPageChange: this.onPageChange};
    const columnsMaker = (hiddenIndices) => { return fields.map( (el, idx) => {
      const primary = true ? idx == 0 : false;
       // console.log(descriptions[idx]);
       const hidden = hiddenIndices.indexOf(idx) != -1;
      return (<TableHeaderColumn key={idx} dataField={el} isKey={primary}
        dataAlign='center' dataSort={true} hidden={hidden}>
        { descriptions[idx] }
      </TableHeaderColumn>);
      });
    }
    const {rows} = this.state;
    const button = <AddRowButton action={() => {this.addRow()} } />
    return (
      <div className='index'>
        <div className='notice'>Please edit <code>src/components/Main.js</code> to get started!</div>
        <BootstrapTable ref='table' data={rows} options={options} pagination={true}>
                  { columnsMaker(indices) }
        </BootstrapTable>
        <Panel showAction={onShow} hideAction={onHide} />
      </div>
    );
  }
}

Main.defaultProps = {
};

export default Main;
