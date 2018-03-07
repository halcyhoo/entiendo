import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Functions from "../Functions";
import Config from "../config";

export default class Login extends Component {
  static propTypes = {
    singleColumn: PropTypes.bool,
    history: PropTypes.object,
    preunmount: PropTypes.func,
  }

  static defaultProps = {
    singleColumn: false
  }

  handleSumbit = (e) =>{
    e.preventDefault();
    const form = e.currentTarget,
          email = form.querySelector("input[name='email']").value,
          password = form.querySelector("input[name='password']").value;
    const toastId = this.toastr("Proccessing...", {autoClose: false, type: "info"});
    axios.post(Config.server+"login", {email: email, password: password})
    .then((response)=>{
      toast.update(toastId, {type: "success", autoClose: true, render: "Success!"})
      Functions.cookies.set("sessionId", response.data.sessionId, 14);
      setTimeout(()=>{
        this.props.preunmount();
        setTimeout(()=>{
          window.location= Config.baseurl+"home";
        }, 250);
      }, 1000);

    }).catch((error)=>{
      if(error.response){
        toast.update(toastId, {type: "error", autoClose: true, render: error.response.data.message});
      }else{
        toast.update(toastId, {type: "error", autoClose: true, render: "Client Error"});
      }

    });

  }

  toastr = (message, options) => toast(message, options);

  render(){
    return (
      <div>
        <ToastContainer />
        <form onSubmit={this.handleSumbit}>
          <div className="row">
            <div className={this.props.singleColumn?"col-sm-12":"col-sm-6"}>
              <div className="form-group">
                <input type="email" className="form-control labeled" id="login-email" name="email" placeholder="Email" />
                <label htmlFor="login-email">Email</label>
              </div>
            </div>

            <div className={this.props.singleColumn?"col-sm-12":"col-sm-6"}>
              <div className="form-group">
                <input type="password" className="form-control labeled" id="login-password" name="password" placeholder="Password" />
                <label htmlFor="login-password">Password</label>
              </div>
            </div>
          </div>
          <div className="spacer h20" />
          <button type="submit" className="btn btn-primary btn-block">Login</button>
        </form>
      </div>
    );
  }
}
