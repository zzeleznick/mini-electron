require('normalize.css/normalize.css');
require('styles/App.css');
require('styles/Main.css');
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
let yeomanImage = require('../images/yeoman.png');
const yeoman = (<img src={yeomanImage} alt="Yeoman Generator" />);
var products = [{
      id: 1,
      name: "Item name 1",
      rating: 5,
      price: 150
  },{
      id: 2,
      name: "Item name 2",
      rating: 4,
      price: 120
  },
  {
      id: 3,
      name: "Item name 3",
      rating: 3,
      price: 80
  }]

const fields = ["id", "name", "rating", "price"];
const descriptions  = ["Product ID", "Product Name", "Product Rating", "Product Price"];

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
    // console.log("Yooo", event.target.checked);
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
        <input type="checkbox" onChange={this.handleChange} checked={checked} value={"checkbox_" + index}/> { text }
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

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.onAddRow = this.onAddRow.bind(this);
    this.addRow = this.addRow.bind(this);
  }
  onAddRow(row) {
    console.log("ROW to be added", row);
  }
  addRow() {
    const idx = Math.round(Math.random() * 100);
    const rating = Math.round(1 + Math.random() * 4);
    var fakeRow = {
      id: idx,
      name: `Product ${idx}`,
      rating: rating,
      price: rating * 5
    };
    var err = this.refs.table.handleAddRowAtBegin(fakeRow);
    if(err){  // i.e: doesn't assign row key or unique row key
          console.log(err);
    }
    else { // add the new row to our primitive data store
      products.push(fakeRow);
    }
  }
  render() {
    const { onShow, onHide, main } = this.props;
    const indices = main.indices;
    const options = {defaultSortName : 'rating', defaultSortOrder : 'asc', onAddRow: this.onAddRow};
    const columnsMaker = (hiddenIndices) => { return fields.map( (el, idx) => {
      const primary = true ? idx == 0 : false;
       // console.log(descriptions[idx]);
       const hidden = hiddenIndices.indexOf(idx) != -1;
      return (<TableHeaderColumn key={idx} dataField={el} isKey={primary}
        dataAlign="center" dataSort={true} hidden={hidden}>
        { descriptions[idx] }
      </TableHeaderColumn>);
      });
    }
    return (
      <div className="index">
        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
        <BootstrapTable ref="table" data={products} options={options} insertRow={false}>
                  { columnsMaker(indices) }
        </BootstrapTable>
        <Panel showAction={onShow} hideAction={onHide} />
        <AddRowButton action={() => {this.addRow()} } />
      </div>
    );
  }
}

Main.defaultProps = {
};

export default Main;
