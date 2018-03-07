import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import Functions from "../Functions";
import Config from "../config";
import responsiveVoice from "../responsiveVoice";

export default class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      voiceState: "loading",
      micReady: false,
      questionData: null,
      failureContent: "",
    };
  }

  static propTypes = {
    userData: PropTypes.object,
    toastrHandler: PropTypes.func,
    updateUser: PropTypes.func,
    listener: PropTypes.object,
  }

  static defaultProps = {
    listener: new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)()
  }


  componentDidMount = ()=>{
    this.props.listener.lang = "en-US";
    this.props.listener.interimResults = false;
    this.props.listener.maxAlternatives = 5;
    this.getNewQuestion();

    this.props.listener.onresult = (event) => {
      if(this.state.voiceState == "listen"){
        this.setState({voiceState: "processing"});
        const sessionId = Functions.cookies.get("sessionId");
        axios.post(Config.server+"questions/"+this.state.questionData.id+"/?sessionId="+sessionId,
        {
          answer: event.results[0][0].transcript
        })
        .then((response)=>{
          this.props.updateUser();
          if(response.data.questionSuccess){
            this.props.toastrHandler("Correct! Let's get you another question", {type: "success", autoClose: 2500});
            setTimeout(()=>{
              return this.getNewQuestion();
            }, 2000);
          }else{
            this.props.toastrHandler("Sorry, that's not right.", {type: "error", autoClose: 2500});
            this.setState({failureContent: (
              <div className="failure-content">
                <p>The phrase in Spanish was {`"${this.state.questionData.es}"`}. It can be translated to {`"${response.data.questionData.en[0]}"`}</p>
                <button onClick={this.getNewQuestion} className="btn btn-primary">Next Question</button>
              </div>
            )});
          }


        })
        .catch((error)=>{
          if(error.response){
            this.props.toastrHandler(error.response.data.message, {autoClose: false, type: "error"});
          }else{
            this.props.toastrHandler("Client Error", {autoClose: false, type: "error"});
          }
        });
      }

    }
  }

  getNewQuestion = () => {
    this.setState({voiceState: "loading"});
    const sessionId = Functions.cookies.get("sessionId");
    this.setState({failureContent: ""});
    axios.get(Config.server+"questions/?sessionId="+sessionId)
    .then((response)=>{
      this.setState({questionData: response.data});
      this.setState({voiceState: "speaking"});
      if(responsiveVoice.voiceSupport()) {
        responsiveVoice.speak(this.state.questionData.es, "Spanish Female", {
          rate: .9,
          onstart: ()=>{
            this.props.listener.stop();
          },
          onend: ()=>{
            this.setState({voiceState: "listen"});
            this.props.listener.start();
          },
        });
      }
    })
    .catch((error)=>{
      if(error.response){
        this.props.toastrHandler(error.response.data.message, {autoClose: false, type: "error"});
      }else{
        this.props.toastrHandler("Client Error", {autoClose: false, type: "error"});
      }
    })
  }

  buttonClick = (e) => {
    e.preventDefault;
    if(this.state.voiceState == "listen"){
      this.setState({voiceState: "speaking"});
      if(responsiveVoice.voiceSupport()) {
        responsiveVoice.speak(this.state.questionData.es, "Spanish Female", {
          rate: .9,
          onstart: ()=>{
            this.props.listener.stop();
          },
          onend: ()=>{
            this.setState({voiceState: "listen"});
            this.props.listener.start();
          },
        });
      }
    }
  }

  render() {
    let questionStatus;
    switch(this.state.voiceState){
      case "speaking":
        questionStatus = "Speaking";
        break;
      case "listen":
        questionStatus = "Listening";
        break;
      case "processing":
        questionStatus = "Processing";
        break;
      default:
        questionStatus = "Loading";
        break;
    }


    return (
      <div className="question">
        <h4 className="question-status">Question status: <span>{questionStatus}</span></h4>
        <button className={`${this.state.voiceState} big-button`} onClick={this.buttonClick}>
          <div className="speakerWrapper">
            <svg version="1.2" className="speaker-base" baseProfile="tiny" id="" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="300 0 300 460" >
              <g>
                <path d="M535.6,418c-7.8,0-17.4-5.3-27-14.9L424.7,325H327c-6.3,0-12-4.9-12-11.2V196.2c0-6.3,5.6-11.2,12-11.2h97.7l83.9-78.2 c9.6-9.6,18.9-14.9,26.7-14.9c7.9,0,12.6,5.5,12.6,14.4v297.3c0,4.4-1,8-3.2,10.6C542.5,416.7,539.5,418,535.6,418 C535.6,418,535.6,418,535.6,418z"/>
                <path d="M535.6,92.4c7.6,0,12.4,5.4,12.4,14v297.3c0,8.6-4.7,14-12.4,14c-7.7,0-17.1-5.2-26.7-14.7l-83.8-77.8l-0.3-0.1h-0.4H327 c-6.1,0-11-5.2-11-11.2V196.2c0-6.1,4.9-11.2,11-11.2h97.5h0.4l0.3-0.1L509,107C518.5,97.5,528,92.4,535.6,92.4 M535.6,91.4 c-7.2,0-16.8,4.4-27.3,14.9L424.5,184H327c-6.6,0-12,5.6-12,12.2v117.5c0,6.6,5.4,12.2,12,12.2h97.5l83.8,77.8 c10.5,10.5,20.1,14.9,27.3,14.9c8.2,0,13.4-5.8,13.4-15.1c0-17.4,0-279.9,0-297.3C549,97.1,543.8,91.4,535.6,91.4L535.6,91.4z"/>
              </g>
            </svg>
            <svg version="1.2" baseProfile="tiny" className="levels" id="" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="170 80 260 360" >
              <g className="level1">
                <path d="M171.9,200.5c16,39.2,16,79.6,0,119c-3,7.3,3.2,16.8,10.5,18.5c8.7,2,15.3-2.7,18.5-10.5c17.5-42.8,17.5-92.1,0-134.9 c-3.1-7.5-10-12.8-18.5-10.5C175.2,184,168.8,193,171.9,200.5L171.9,200.5z"/>
              </g>
              <g className="level2">
                <path d="M227.9,153.7c24.5,51.4,30.2,111.6,16.4,166.7c-4.1,16.2-9.6,31.8-16.4,45.9c-3.5,7.3-2,16.2,5.4,20.5 c6.5,3.8,17,2,20.5-5.4c28.2-59.3,35.5-126.9,19.2-190.7c-4.6-18-11.2-35.5-19.2-52.3c-3.5-7.3-14-9.2-20.5-5.4 C225.8,137.5,224.4,146.3,227.9,153.7L227.9,153.7z"/>
              </g>
              <g className="level3">
                <path d="M283.2,103c11.3,19.6,19.5,37.5,26.3,58.3c3.5,10.6,6.5,21.4,8.9,32.4c1.1,5.1,2.1,10.1,3,15.2c0.5,2.7,0.9,5.4,1.3,8.1 c0.5,3.1,0.2,1.6,0.1,0.9c0.2,1.9,0.5,3.8,0.7,5.7c2.4,21.6,2.7,43.4,0.8,65c-0.2,2.4-0.4,4.9-0.7,7.3c-0.2,1.6-0.4,3.2-0.6,4.9 c0,0.2-0.4,2.9-0.1,0.9c-0.8,5.7-1.7,11.3-2.8,16.9c-2.1,11-4.8,21.8-8,32.6c-7.3,24-16.1,44.2-28.8,66.1c-4.1,7-1.6,16.4,5.4,20.5 c7,4.1,16.4,1.6,20.5-5.4c47.2-81.4,59.1-180.9,31.8-271c-7.7-25.5-18.5-50.2-31.8-73.3c-4.1-7-13.6-9.5-20.5-5.4 C281.6,86.6,279.2,96,283.2,103L283.2,103z"/>
              </g>
            </svg>
          </div>
          <div className="clearfix" />
          <div className="loadingWrapper">
            Loading...
          </div>
          <div className="listenWrapper">
            Again
          </div>
          <div className="processWrapper">
            Checking...
          </div>

        </button>
        {this.state.failureContent}
      </div>
    );
  }
}
