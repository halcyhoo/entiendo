import React, { Component } from "react";
import Login from "./Login";
import Register from "./Register";
import PropTypes from "prop-types";

export default class LoginRegister extends Component {
  hideComponent = ()=>{
    this.animateContainer.className += " flip-out";
  }

  static propTypes = {
    history: PropTypes.object,
  }

  render(){
    return (
      <div className="container narrow content headerless">
        <div className="card card-shadow flip-transition" ref={(ref)=>this.animateContainer = ref}>
          <div className="row">
            <div className="col-sm-12">
              <h2 className="primary-color align-center">Entiendo</h2>
              <h4 className="align-center">Understanding Spanish</h4>
            </div>
          </div>
          <div className="spacer h20" />
          <div className="row">
            <div className="col-sm-5">
              <h6 className="align-center">Returning User</h6>
              <Login singleColumn={true} history={this.props.history} preunmount={this.hideComponent} />
            </div>
            <div className="col-sm-2 ">
              <h5 className="vertical-divider-wrapper"><span className="vertical-divider" /><span className="vertical-divider-content">Or</span></h5>
            </div>
            <div className="spacer h20 d-block d-sm-none" />
            <h4 className="align-center d-block d-sm-none">Or</h4>
            <div className="col-sm-5">
              <h6 className="align-center">New User</h6>
              <Register singleColumn={true} history={this.props.history} preunmount={this.hideComponent} />
            </div>
          </div>
        </div>

      </div>
    );
  }
}
