import React, { Component } from "react";
import { Card, Avatar, List, Input,Modal } from "antd";
import { Link } from "react-router-dom";
import { store } from "../../store";
import "../../index.css";
import "../../App.css";
import CommonModal from "./CommonModal";
import notify from "../../shared/components/notification";
import { fetchInterestsLu, saveInterest, deleteInterest } from '../../shared/api/apiServer';
import { connect } from 'react-redux';

const { Search } = Input;

class Interests extends Component {
  state = {
    interests: this.props.interests,
    interestsLu: [],
    visible: false,
    search: '',
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
    }
  };
  componentDidMount() {
    this.fetchInterestsLu(10, 0);
  }
  fetchInterestsLu = (take, skip) => {
    this.setState({ ...this.state, loading: true });
    fetchInterestsLu(take, skip)
      .then(res => {
        if (res.ok) {
          let { interestsLu, interests } = this.state;
          interestsLu = interestsLu.concat(res.data)
          this.setState({ ...this.state, loading: false, interestsLu: interestsLu, loadMore: res.data.length === this.state.pageSize }, () => {
            interests.forEach(val => {
              this.handleInterest(val);
            });
          })
        }
      })
  }

  showModal = (e) => {
    e.preventDefault();
    this.setState({
      visible: true,
    });
  };
  handleOk = async (e) => {
    const response = await saveInterest(this.state.saveObject);
    if (response.ok) {
      this.setState({
        visible: false,
        interests: this.state.saveObject.Interests,
      }, () => {
        notify({ description: "Interests added successfully", message: "Interests" })
      });
    } else {
      notify({ description: "Something went wrong :)", message: "Error", type: 'error' })
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
    let { interestsLu, saveObject } = this.state;
    interestsLu.forEach(interest => {
      if (item.InterestId == interest.InterestId) {
        interest.IsInterest = true;
        saveObject.Interests.push(item);
      }
    });

    this.setState({ ...this.state, interestsLu: interestsLu, saveObject: saveObject })

  };
  handleRemove = (item) => {
    let { interestsLu, saveObject } = this.state;
    interestsLu.forEach(interest => {
      if (item.InterestId == interest.InterestId) {
        interest.IsInterest = false;
        saveObject.Interests.splice(saveObject.Interests.indexOf(item), 1);
      }
    });

    this.setState({ ...this.state, interestsLu: interestsLu })
  };
  deleteInterest = async (item) => {
    const response = await deleteInterest(this.props?.profile?.Id, item.InterestId);
    if (response.ok) {
      this.handleRemove(item);
      let { interests } = this.state;
      interests = interests.filter(obj => {
        return obj.InterestId !== item.InterestId;
      })
      this.setState({
        ...this.state,
        visible: false,
        interests: interests
      }, () => {
        notify({ description: "Interest Deleted successfully", message: "Interests" })
      });
    } else {
      notify({ description: "Something went wrong :)", message: "Error", type: 'error' })
    }
  };
  render() {
    const { user } = store.getState().oidc;
    const { interests, visible, interestsLu } = this.state;

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
            <Link className="f-12 list-link" onClick={() => item.IsInterest ? '' : this.handleInterest(item)}>
              {item.IsInterest ? 'Intersted' : 'Interest'}
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
              <Link onClick={this.showModal}>
                <span className="icons add" />
              </Link>
            ) : null
          }
        >
          <List className="p-12"
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
                /><span className="close-icon" onClick={() => this.deleteInterest(item)}></span>
              </List.Item>
            )}
          />
        </Card>
        <Modal
          className="custom-popup modal-interest"
          visible={visible}
          title="Interests"
          cancel={this.handleCancel}
          saved={this.handleOk}
          destroyOnClose
        >
          <div>
            <div className="modal-search py-16">
              <Search
                className="header-searchbar"
                placeholder="Search Interests"
                onChange={(e) => this.handleSearch(e)}
              />
            </div>
            <div className="custom-card p-16 bg-white">
              <List itemLayout="horizontal">{interesetsList}</List>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = ({ oidc }) => {
  return { profile: oidc.profile }
}
export default connect(mapStateToProps)(Interests);
