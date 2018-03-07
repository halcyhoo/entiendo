import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import axios from "axios";

import Functions from "./Functions";
import Config from "./config";

import Home from "./components/Home";
import Header from "./components/Header";
import LoginRegister from "./components/LoginRegister";


import "./index.css";
import "./main.css";
import "bootstrap/dist/css/bootstrap.css";

class App extends Component {
  state = {
    sessionId: null,
    modals: {
      password: false,
      login: false,
    }
  }

  componentDidMount() {
    const sessionId = Functions.cookies.get("sessionId");
    axios.get(Config.server+"session?sessionId="+sessionId)
    .then(()=>{
      this.setState({sessionId: sessionId});

    }).catch(()=>{
      Functions.cookies.clear("sessionId");
      this.setState({sessionId: "Invalid"});
    });

  }

  passwordModalOpen = (e) => {
    e.preventDefault();
    this.setState((prevState)=>{
      let modalStates = prevState.modals;
      modalStates.password = true;
      return {modals: modalStates};
    });
  }

  passwordModalClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState((prevState)=>{
      let modalStates = prevState.modals;
      modalStates.password = false;
      return {modals: modalStates};
    });
  }

  render() {
    const year = new Date().getFullYear();
    if(this.state.sessionId === null){
      return (
        <div className="App">
          <div className="container content headerless loading">
            <div className="loading-spinner">
              <h2>Loading...</h2>
            </div>

          </div>
          <footer>
            <div className="copyright">
              © {year} - Halcy Webster
            </div>
          </footer>
        </div>
      );
    }else{
      let sessionId = this.state.sessionId;
      if(this.state.sessionId === "Invalid"){
        sessionId = false;
      }
      return (
        <BrowserRouter>
          <div className="App">
              <Switch>
                <Route path="/login" component={LoginRegister}/>
                <Route render={(r)=>(
                  sessionId ?
                  (<div><Header router={r} /><Home modals={this.state.modals} sessionId={this.state.sessionId} passwordModalClose={this.passwordModalClose} passwordModalOpen={this.passwordModalOpen}/></div>)
                  :
                  <Redirect to="/login" />
                )} />

              </Switch>
              <footer>
                <div className="copyright">
                  © {year} - Halcy Webster
                </div>
              </footer>

          </div>
        </BrowserRouter>
      );
    }
  }
}

export default App;
