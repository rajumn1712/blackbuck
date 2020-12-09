import React, { Component } from "react";
import { Card, Tag, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { TweenOneGroup } from "rc-tween-one";
import { Link } from "react-router-dom";
import "../../index.css";
import "../../App.css";
import CommonModal from "./CommonModal";
import { saveHobbies } from "../../shared/api/apiServer";
import notify from "../../shared/components/notification";

class Hobbies extends Component {
  state = {
    hobbies: this.props.hobbies ? this.props.hobbies.split(",") : [],
    tags: [],
    inputVisible: false,
    inputValue: "",
    visible: false,
    saveObj: { Name: "" },
  };

  showModal = (e) => {
    e.preventDefault();
    let { tags } = this.state;
    tags = this.props.hobbies ? this.props.hobbies.split(",") : [];
    this.setState({
      visible: true,
      tags,
    });
  };
  handleOk = (e) => {
    let { saveObj, tags } = this.state;
    saveObj.Name = tags.toString();
    this.setState({ saveObj: saveObj });
    saveHobbies(this.props.userid, this.state.saveObj).then((res) => {
      this.setState(
        {
          visible: false,
        },
        () => {
          notify({
            description: "Hobbies saved successfully",
            message: "Hobbies",
          });
          this.props.callback(true);
        }
      );
    });
  };
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter((tag) => tag !== removedTag);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e) => {
    this.setState({
      inputValue: e.target.value,
    });
  };
  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: "",
    });
  };

  saveInputRef = (input) => {
    this.input = input;
  };

  forMap = (tag, index) => {
    const tagElem = (
      <Tag
        key={index}
        closable
        onClose={(e) => {
          e.preventDefault();
          this.handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span
        className="hobbies-tag"
        key={index}
        style={{ display: "inline-block" }}
      >
        {tagElem}
      </span>
    );
  };
  render() {
    const { hobbies, tags, inputVisible, inputValue, visible } = this.state;
    const tagChild = tags?.map(this.forMap);
    return (
      <div className="custom-card">
        <Card
          title="Hobbies"
          className="hobbies-card"
          bordered={false}
          extra={
            !this.props.IsHideAction ? (
              <Link onClick={this.showModal}>
                <span className="icons edit" />
              </Link>
            ) : null
          }
        >
          {hobbies &&
            hobbies.map((hobby, index) => {
              return (
                <Tag className="tags" key={index}>
                  {hobby}
                </Tag>
              );
            })}
        </Card>
        <CommonModal
          className="custom-popup"
          visible={visible}
          title="Hobbies"
          disable={tags.length == 0}
          cancel={this.handleCancel}
          saved={this.handleOk}
        >
          <div className="tags">
            <div style={{ margin: 10 }}>
              <TweenOneGroup
                enter={{
                  scale: 0.8,
                  opacity: 0,
                  type: "from",
                  duration: 100,
                  onComplete: (e) => {
                    e.target.style = "";
                  },
                }}
                leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                appear={false}
              >
                {tagChild}
              </TweenOneGroup>
            </div>
            {inputVisible && (
              <Input
                ref={this.saveInputRef}
                type="text"
                size="small"
                style={{ width: 78 }}
                value={inputValue}
                onChange={this.handleInputChange}
                onBlur={this.handleInputConfirm}
                onPressEnter={this.handleInputConfirm}
              />
            )}
            {!inputVisible && (
              <Tag onClick={this.showInput} className="site-tag-plus">
                <PlusOutlined /> Enter Hobbies
              </Tag>
            )}
          </div>
        </CommonModal>
      </div>
    );
  }
}
export default Hobbies;
