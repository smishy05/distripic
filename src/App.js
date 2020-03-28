import React, { Component } from 'react';
import './App.css';
//import web3 from './web3';

const IPFS = require('ipfs-http-client');

const ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

class App extends Component {
  state = {
    ipfsHash: null,
    buffer:''
  };
  captureFile = async(event) => {
    event.stopPropagation()
    event.preventDefault()
    var file;
    file = event.target.files[0]
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    // await this.setState({ read: reader.result });
    reader.onloadend = () => this.convertToBuffer(reader)
  };

  convertToBuffer = async(reader) => {
    //file is converted to a buffer for upload to IPFS
    const buffer = await IPFS.Buffer.from(reader.result);
    //set this buffer -using es6 syntax
    this.setState({buffer});
  };
  // onSubmit = async (event) => {
  //   event.preventDefault();
  //   // var x;

  //   const content = await Buffer.from('ABC')
  //   const results = await ipfs.add(content)
  //   await this.setState({ ipfsHash: 'aaa'})
  //   const hash = results[0].hash // "Qm...WW"
    
  // };

  onSubmit = async (event) => {
    event.preventDefault();
    const content = this.state.buffer
    // var x;
    try{
      console.log("Reached 1a ====>", Buffer.isBuffer(content));    
      
        await ipfs.add(content, (error, result) => {
        if (error || !result) {
          console.log("Error=>", error);
        }
        else {
          console.log("Success!");
          this.setState({ ipfsHash: result[0].hash});
          console.log("Reached 2");
        }
      });
      console.log("Reached 1");
    }
    catch (error) {
      console.log("Reached 3");
      return error;
    }
  };

render() {
  return (
    <div className="App">
      <header className="App-header">
        <h1> IPFS Dapp</h1>
      </header>
      <hr />
      <h3> Choose file to send to IPFS </h3>
        <form onSubmit={this.onSubmit}>
          <input type="file" onChange={this.captureFile}/>
          <button type="submit"> Send it </button>
        </form>
      <hr/>
      <table >
        <thead>
          <tr>
            <th>Sl No</th>
            <th>Values</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>IPFS Hash 1</td>
            <td>{this.state.ipfsHash}</td>
          </tr>
          </tbody>
      </table>
    </div>);
  }
}
export default App;