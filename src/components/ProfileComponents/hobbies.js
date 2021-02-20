import React, { Component } from "react";
import { Card, Tag, Input, Tooltip, Select, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { TweenOneGroup } from "rc-tween-one";
import { Link } from "react-router-dom";
import "../../index.css";
import "../../App.css";
import CommonModal from "./CommonModal";
import { saveHobbies } from "../../shared/api/apiServer";
import notify from "../../shared/components/notification";
import Loader from "../../common/loader";

class Hobbies extends Component {
  state = {
    hobbies: this.props.hobbies,
    tags: [],
    inputVisible: false,
    inputValue: "",
    visible: false,
    saveObj: { Name: [] },
    loading: false,
  };

  showModal = (e) => {
    e.preventDefault();
    let { tags } = this.state;
    tags = this.props.hobbies;
    this.setState({
      visible: true,
      tags,
    });
  };
  handleOk = async (e) => {
    this.setState({ ...this.state, loading: true });
    let { saveObj, tags, hobbies } = this.state;
    saveObj.Name = tags;
    this.setState({ saveObj: saveObj });
    const savehobbies = await saveHobbies(this.props.userid, this.state.saveObj)
    if (savehobbies.ok) {
      this.setState(
        {
          loading: false,
          visible: false,
        },
        () => {
          notify({
            description: `Hobbies ${hobbies?.length > 0 ? 'edited' : 'saved'} successfully`,
            message: "Hobbies",
          });
          this.props.callback(true);
        }
      );
    } else {
      this.setState(
        {
          ...this.state,
          loading: false,
        },
        () => {
          notify({
            description: 'Something went wrong',
            message: "Error",
            type: 'error'
          });
        }
      );
    }
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

  handleInputChange = (value) => {
    this.setState({
      inputValue: value,
    });
  };
  handleInputConfirm = (value) => {
    const inputValue = value;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputValue: "",
    });
  };

  saveInputRef = (input) => {
    this.input = input;
  };
  tagRender = (props) => {
    const { label, closable, onClose } = props;
    return (
      <Tag closable={closable} onClose={onClose}>
        {label}
      </Tag>
    );
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
          className="hobbies-card capitalize"
          bordered={false}
          extra={
            !this.props.IsHideAction ? (
              <Tooltip title={hobbies?.length > 0 ? 'Edit' : 'Add'}>
                <Link onClick={this.showModal}>
                  <span
                    className={`icons ${hobbies?.length > 0 ? "edit" : "add"}`}
                  />
                </Link>
              </Tooltip>
            ) : null
          }
        >
          {hobbies?.length > 0 ? (
            hobbies.map((hobby, index) => {
              return (
                <Tag className="tags" key={index}>
                  {hobby}
                </Tag>
              );
            })
          ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
        </Card>
        <CommonModal
          className="custom-popup custom-fields multi-select"
          visible={visible}
          title="Hobbies"
          disable={tags?.length == 0}
          cancel={this.handleCancel}
          saved={this.handleOk}
        >
          {/* {this.state.loading && <Loader className="loader-top-middle" />}
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
          </div> */}
          <Select

            mode="tags"
            style={{ width: "100%" }}
            placeholder="Enter Hobbies"
            value={tags}
            onSelect={this.handleInputConfirm}
            onDeselect={this.handleClose}
          ></Select>
        </CommonModal>
      </div>
    );
  }
}
export default Hobbies;
