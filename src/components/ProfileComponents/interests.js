import React, { Component } from "react";
import { Card, Avatar, List, Input, Modal, Tooltip, Select, Row, Col, Form } from "antd";
import { Link } from "react-router-dom";
import { store } from "../../store";
import "../../index.css";
import "../../App.css";
import CommonModal from "./CommonModal";
import notify from "../../shared/components/notification";
import {
  fetchInterestsLu,
  saveInterest,
  deleteInterest,
} from "../../shared/api/apiServer";
import { connect } from "react-redux";

const { Search } = Input;
const { Option } = Select;

class Interests extends Component {
  state = {
    interests: this.props.interests ? this.props.interests : [],
    interestsLu: [],
    lstInterests: [],
    visible: false,
    search: "",
    page: 1,
    pageSize: 10,
    loadMore: true,
    loading: true,
    count: 0,
    saveObject: {
      UserId: this.props?.profile?.Id,
      Interests: [],
      UserDetails: {
        UserId: this.props.profile?.Id,
        Firstname: this.props.profile?.FirstName,
        Lastname: "",
        Image: this.props.profile?.ProfilePic,
        Email: this.props.profile?.FirstName,
      },
    },
  };
  componentDidMount() {
    this.fetchInterestsLu(10, 0);
  }
  setFieldValue = (value) => {
    let { saveObject, interestsLu, lstInterests } = this.state;
    saveObject.Interests = [];
    value.forEach(item => {
      interestsLu.forEach(obj => {
        if (item === obj.InterestId) {
          saveObject.Interests.push(obj)
        }
      })
    })
    lstInterests = value;
    this.setState({ ...this.state, saveObject, lstInterests });
  }
  renderSelectItem = (item) => {
    return <div>
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar className="select-image" src={item.Image} />}
          title={<span>{item.Name}</span>}
        />
      </List.Item>
    </div>
  }
  fetchInterestsLu = (take, skip) => {
    this.setState({ ...this.state, loading: true });
    fetchInterestsLu(take, skip).then((res) => {
      if (res.ok) {
        let { interestsLu, interests } = this.state;
        interestsLu = interestsLu.concat(res.data);
        this.setState(
          {
            ...this.state,
            loading: false,
            interestsLu: interestsLu,
            loadMore: res.data.length === this.state.pageSize,
          },
          () => {
            interests.forEach((val) => {
              this.handleInterest(val);
            });
          }
        );
      }
    });
  };

  showModal = (e) => {
    e.preventDefault();
    this.setState(
      {
        visible: true,
        interestsLu: [],
        lstInterests: [],
        saveObject: {
          UserId: this.props?.profile?.Id,
          Interests: [],
          UserDetails: {
            UserId: this.props.profile?.Id,
            Firstname: this.props.profile?.FirstName,
            Lastname: "",
            Image: this.props.profile?.ProfilePic,
            Email: this.props.profile?.FirstName,
          },
        },
      },
      () => {
        this.fetchInterestsLu(10, 0);
      }
    );
  };
  handleOk = async (e) => {
    const response = await saveInterest(this.state.saveObject);
    if (response.ok) {
      this.setState(
        {
          visible: false,
          interests: this.state.saveObject.Interests,
        },
        () => {
          notify({
            description: "Interests added successfully",
            message: "Interests",
          });
          this.props.callback(true);
        }
      );
    } else {
      notify({
        description: "Something went wrong :)",
        message: "Error",
        type: "error",
      });
    }
  };
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };
  handleSearch = (e) => {
    let keyword = e.target.value;
    this.setState({ search: keyword });
  };
  handleInterest = (item) => {
    let { interestsLu, saveObject, lstInterests } = this.state;
    interestsLu.forEach((interest) => {
      if (item.InterestId == interest.InterestId) {
        saveObject.Interests.push(item);
        lstInterests.push(item?.InterestId);
      }
    });

    this.setState({
      ...this.state,
      interestsLu: interestsLu,
      saveObject: saveObject,
      lstInterests: lstInterests
    });
  };
  handleRemove = (item) => {
    let { interestsLu, saveObject } = this.state;
    interestsLu.forEach((interest) => {
      if (item.InterestId == interest.InterestId) {
        saveObject.Interests.splice(saveObject.Interests.indexOf(item), 1);
      }
    });

    this.setState({ ...this.state, interestsLu: interestsLu });
  };
  deleteInterest = async (item) => {
    const response = await deleteInterest(
      this.props?.profile?.Id,
      item.InterestId
    );
    if (response.ok) {
      this.handleRemove(item);
      let { interests } = this.state;
      interests = interests.filter((obj) => {
        return obj.InterestId !== item.InterestId;
      });
      this.setState(
        {
          ...this.state,
          visible: false,
          interests: interests,
        },
        () => {
          notify({
            description: "Interest Deleted successfully",
            message: "Interests",
          });
        }
      );
    } else {
      notify({
        description: "Something went wrong :)",
        message: "Error",
        type: "error",
      });
    }
  };
  render() {
    const { user } = store.getState().oidc;
    const { interests, visible, interestsLu, saveObject, lstInterests } = this.state;

    const interesetsList = interestsLu
      .filter((item) => {
        if (this.state.search == null) {
          return item;
        } else if (
          item.Name.toLowerCase().includes(this.state.search.toLowerCase())
        ) {
          return item;
        }
      })
      .map((item, index) => {
        return (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item.Image} />}
              title={
                <div className="d-flex align-items-center">
                  <span className="overflow-text">{item.Name}</span>
                </div>
              }
            />
            <Link
              className="f-12 list-link"
              onClick={() => (item.IsInterest ? "" : this.handleInterest(item))}
            >
              {item.IsInterest ? "Interested" : "Interest"}
            </Link>
            <Link
              className="f-12 list-link ml-16 text-red"
              onClick={(e) => this.handleRemove(item)}
            >
              Remove
            </Link>
          </List.Item>
        );
      });

    return (
      <div className="custom-card interests-popup">
        <Card
          title="Interests"
          bordered={false}
          extra={
            !this.props.IsHideAction ? (
              <Tooltip title="Add">
                <Link onClick={this.showModal}>
                  <span className="icons add" />
                </Link>
              </Tooltip>
            ) : null
          }
        >
          <List
            className="p-12"
            grid={{ gutter: 16, column: 2 }}
            itemLayout="horizontal"
            dataSource={interests}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.Image} />}
                  title={
                    <div className="d-flex align-items-center">
                      <span className="overflow-text">{item.Name}</span>
                    </div>
                  }
                />
                {!this.props.IsHideAction && (
                  <span
                    className="close-icon"
                    onClick={() => this.deleteInterest(item)}
                  ></span>
                )}
              </List.Item>
            )}
          />
        </Card>
        <CommonModal
          className="custom-popup modal-interest"
          visible={visible}
          title="Interests"
          cancel={this.handleCancel}
          saved={this.handleOk}
          destroyOnClose
        >
          <div>
            <div className="modal-search p-16">

              <Form layout="vertical" >
                <Select
                  defaultValue=""
                  name="Invitations"
                  value={lstInterests}
                  optionLabelProp="label"
                  mode="multiple"
                  placeholder="Select Interests"
                  style={{ width: '100%' }}
                  onChange={(value) =>
                    this.setFieldValue(value)
                  }
                >
                  {interestsLu.map((item, index) => {
                    return (
                      <Option key={index} value={item.InterestId} label={item.Name}>
                        {this.renderSelectItem(item)}
                      </Option>
                    );
                  })}
                </Select>
              </Form>
            </div>
          </div>
        </CommonModal>
      </div>
    );
  }
}
const mapStateToProps = ({ oidc }) => {
  return { profile: oidc.profile };
};
export default connect(mapStateToProps)(Interests);
