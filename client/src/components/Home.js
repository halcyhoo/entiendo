import React, { Component } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Confetti from "react-dom-confetti";


import Functions from "../Functions";
import Config from "../config";
import Question from "./Question";
import ProgressButton from "./ProgressButton";
import modalStyles from "../modalStyles";

Modal.setAppElement(document.getElementById("root"));

export default class Home extends Component {

  constructor(props){
    super(props);
    this.state = {
      modals: this.props.modals,
      sessionId: this.props.sessionId,
      fireConfetti: false,
      userData: null,
      key: Math.random(),
      inputFields: {
        firstName: "",
        lastName: "",
        email: "",
      },
    };
  }

  static propTypes = {
    modals: PropTypes.object,
    passwordModalClose: PropTypes.func,
    passwordModalOpen: PropTypes.func,
    toastrHandler: PropTypes.func,
    sessionId: PropTypes.string,
  }

  componentDidMount = () => {
    const sessionId = Functions.cookies.get("sessionId");
    axios.get(Config.server+"users?sessionId="+sessionId)
    .then((response)=>{
      this.setState({userData: response.data});
      this.setState({inputFields: {
        firstName: response.data.firstName?response.data.firstName:"",
        lastName: response.data.lastName?response.data.lastName:"",
        email: response.data.email?response.data.email:"",
      }});

    }).catch((error)=>{
      if(error.response){
        this.toastr(error.response.data.message, {autoClose: false, type: "error"});
      }else{
        this.toastr("Session Verification Client Error", {autoClose: false, type: "error"});
      }

    });

    navigator.getUserMedia({audio: true}, () => {
      this.setState({micReady: true});
    }, ()=>{
      this.props.toastrHandler("Please enable the microphone", {type: "error"});
    });
  }

  toastr = (message, options) => toast(message, options);

  updateAccount = (e) => {
    e.preventDefault();
    axios.post(Config.server+"users/"+this.state.userData._id+"?sessionId="+this.state.sessionId,
    {
      firstName: this.state.inputFields.firstName,
      lastName: this.state.inputFields.lastName,
      email: this.state.inputFields.email,
    })
    .then((response)=>{
      if(response.data.message){
        this.toastr(response.data.message, {autoClose: true, type: "success"});
      }

    }).catch((error)=>{
      if(error.response){
        this.toastr(error.response.data.message, {autoClose: false, type: "error"});
      }else{
        this.toastr("Update Account Client Error", {autoClose: false, type: "error"});
      }

    });
  }

  updateUser = () => {
    const sessionId = Functions.cookies.get("sessionId");
    axios.get(Config.server+"users?sessionId="+sessionId)
    .then((response)=>{
      this.setState({userData: response.data});
      this.setState({inputFields: {
        firstName: response.data.firstName?response.data.firstName:"",
        lastName: response.data.lastName?response.data.lastName:"",
        email: response.data.email?response.data.email:"",
      }});

    }).catch((error)=>{
      if(error.response){
        this.toastr(error.response.data.message, {autoClose: false, type: "error"});
      }else{
        this.toastr("Session Verification Client Error", {autoClose: false, type: "error"});
      }

    });
  }

  levelUp = (e) => {
    e.preventDefault();
    const sessionId = Functions.cookies.get("sessionId");
    axios.post(Config.server+"users/"+this.state.userData._id+"/levelup?sessionId="+sessionId)
    .then(()=>{
      this.setState({fireConfetti: true});
      this.updateUser();
      this.setState({key: Math.random()});
      this.setState({fireConfetti: false});
    }).catch((error)=>{
      this.setState({fireConfetti: false});
      if(error.response){
        this.toastr(error.response.data.message, {autoClose: false, type: "error"});
      }else{
        this.toastr("Client Error", {autoClose: false, type: "error"});
      }

    });
  }

  inputChangeHandler = (e) => {
    const input = e.currentTarget,
          inputId = input.id;
    this.setState((prevState)=>{
      prevState.inputFields[inputId] = input.value;
      return prevState;
    });
  }

  render(){
    if(this.state.sessionId === null){
      return (
        <div className="loading-spinner">
          <h2>Loading...</h2>
        </div>
      );
    }else{
      let successRate,
          nextLevelPercent = 0;

      if(this.state.userData){
        if(this.state.userData.totalAnswers){
          successRate = Math.round(this.state.userData.successAnswers / this.state.userData.totalAnswers * 100);
        }else{
          successRate = 0;
        }
        nextLevelPercent = this.state.userData.levelPoints / this.state.userData.nextLevel.pointsRequired;
      }

      const confettiConfig = {
        angle: 50,
        spread: 60,
        startVelocity: 30,
        elementCount: 60,
        decay: 0.95
      }

      return (
        <div className="container content">
          <ToastContainer />
          <div className="row">
            <div className="col-sm-6">
              <div className="card">
                {this.state.micReady?<Question key={this.state.key} updateUser={this.updateUser} userData={this.state.userData} toastrHandler={this.toastr}/>:<div><h2>Please enable the microphone in your browser</h2></div>}

              </div>
            </div>
            <div className="col-sm-6">
              <div className="card">
                <h2>Stats</h2>
                <div className="row d-none">
                  <div className="col-sm-6">
                    {this.state.userData?<h4>Level: {this.state.userData.level}</h4>:<div className="skeleton-loader wide"/>}
                    {this.state.userData?<h4>Level Points: {this.state.userData.levelPoints}</h4>:<div className="skeleton-loader wide"/>}
                    {this.state.userData?<ProgressButton ref={button => {this.progressButtonRef = button;}} levelUpHandler={this.levelUp} className="extra-class" progress={nextLevelPercent}>Level Up</ProgressButton>:<div className="skeleton-loader short"/>}
                    <Confetti active={this.state.fireConfetti} config={ confettiConfig }/>
                  </div>
                  <div className="col-sm-6">
                    {this.state.userData?<h4>Success Rate: {successRate}%</h4>:<div className="skeleton-loader wide"/>}
                    {this.state.userData?<h4>Total Points: {this.state.userData.totalPoints}</h4>:<div className="skeleton-loader wide"/>}
                  </div>
                </div>
                <div className="d-block-sm">
                  {this.state.userData?<h4>Success Rate: {successRate}%</h4>:<div className="skeleton-loader wide"/>}
                  {this.state.userData?<h4>Total Points: {this.state.userData.totalPoints}</h4>:<div className="skeleton-loader wide"/>}
                  {this.state.userData?<h4>Level: {this.state.userData.level}</h4>:<div className="skeleton-loader wide"/>}
                  {this.state.userData?<h4>Level Points: {this.state.userData.levelPoints}</h4>:<div className="skeleton-loader wide"/>}
                  {this.state.userData?<ProgressButton ref={button => {this.progressButtonRef = button;}} levelUpHandler={this.levelUp} className="extra-class" progress={nextLevelPercent}>Level Up</ProgressButton>:<div className="skeleton-loader short"/>}
                  <Confetti active={this.state.fireConfetti} config={ confettiConfig }/>
                </div>

              </div>
              <div className="card">
                <h2>Account Info</h2>
                <form onSubmit={this.updateAccount}>
                  <div className="row">
                    {this.state.userData?<div className="col-sm-6 form-group"><input type="text" name="firstName" id="firstName" className="form-control labeled" onChange={this.inputChangeHandler} value={this.state.inputFields.firstName} placeholder="First Name" /><label htmlFor="firstName">First Name</label></div>:<div className="col-sm-6 form-group"><div className="skeleton-loader wide"/></div>}
                    {this.state.userData?<div className="col-sm-6 form-group"><input type="text" name="lastName" id="lastName" className="form-control labeled" onChange={this.inputChangeHandler} value={this.state.inputFields.lastName} placeholder="Last Name" /><label htmlFor="lastName">Last Name</label></div>:<div className="col-sm-6 form-group"><div className="skeleton-loader wide"/></div>}
                  </div>


                  {this.state.userData?<div className="form-group"><input type="email" name="email" id="email" className="form-control labeled" onChange={this.inputChangeHandler} value={this.state.inputFields.email} placeholder="Email" /><label htmlFor="email">Email</label></div>:<div className="skeleton-loader wide"/>}

                  <div className="clearfix"></div>
                  <div className="spacer h20"></div>
                  <div>
                    <button type="submit" className="btn btn-primary">Save</button>
                    <button className="btn btn-link" onClick={this.props.passwordModalOpen}>Change Password</button>
                    <Modal
                      isOpen={this.state.modals.password}
                      onRequestClose={this.props.passwordModalClose}
                      contentLabel="Change Password"
                      style={modalStyles}
                      >
                      <div className="modal-head">
                        <h5 className="modal-title">Change Password</h5>
                        <button className="close" onClick={this.props.passwordModalClose}>&times;</button>
                      </div>
                      <div className="modal-body">
                        <form>
                          <div className="row">
                            <div className="col-sm-6">
                              <div className="form-group">
                                <input type="password" id="new-password" className="form-control labeled" name="password" placeholder="New Password"/>
                                <label htmlFor="new-password">New Password</label>
                              </div>
                            </div>
                            <div className="col-sm-6">
                              <div className="form-group">
                                <input type="password" id="confirm-new-password" className="form-control labeled" name="confirm-password" placeholder="Confirm Password"/>
                                <label htmlFor="confirm-new-password">Confirm Password</label>
                              </div>
                            </div>
                          </div>
                          <div className="modal-buttons">
                            <button type="submit" className="btn btn-primary">Save</button>
                            <button onClick={this.props.passwordModalClose} className="btn btn-secondary">Cancel</button>
                          </div>
                        </form>
                      </div>
                    </Modal>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
