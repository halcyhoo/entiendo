import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ProgressButton extends Component {
  constructor(props){
    super(props);
  }

  static propTypes = {
    levelUpHandler: PropTypes.func,
    className: PropTypes.string,
    progress: PropTypes.number,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
      ])
  }

  componentDidMount = () => {
    this.progressButton.querySelector(".btn-progress-bar").setAttribute("style",`width: ${this.props.progress*100}%`);
    this.progressButton.querySelector(".btn-progress-bar").style.width = `width: ${this.props.progress*100}%`;
  }

  componentWillReceiveProps = () => {
    this.progressButton.querySelector(".btn-progress-bar").setAttribute("style",`width: ${this.props.progress*100}%`);
    this.progressButton.querySelector(".btn-progress-bar").style.width = `width: ${this.props.progress*100}%`;
  }

  render () {

    let complete = "";
    if(this.props.progress == 1){
      complete = " complete";
    }
    return (
      <button onClick={this.props.levelUpHandler} className={`btn btn-progress ${this.props.className} ${complete}`} ref={progress => {this.progressButton = progress}}><span className="btn-progress-bar"></span><span className="btn-progresss-contents">{this.props.children}</span></button>
    );
  }
}
