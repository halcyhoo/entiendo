import React, { Component } from "react";
import PropTypes from "prop-types";
import Functions from "../Functions";

export default class Header extends Component {
  static propTypes = {
    router: PropTypes.object,
  };

  handleLogOut=()=>{
    Functions.cookies.clear("sessionId");
    this.props.router.history.push("/login");
  }
  render(){
    return (
      <header className="container-fluid">
        <div className="row">
          <div className="col-8">
            <h1 className="title">
              Entiendo
            </h1>
          </div>
          <div className="col-4">
            <button onClick={this.handleLogOut} className="login float-right btn btn-outline-primary btn-sm">Log Out</button>
          </div>
        </div>
      </header>
    );
  }
}
