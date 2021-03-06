import React, { Component } from "react";
import { Button, Card, Avatar, List, Empty, Row, Col, Skeleton } from "antd";
import notify from "./notification";
import { apiClient } from "../api/clients";
import { Link } from "react-router-dom";
import {
  cancelGroupRequest,
  fetchGroupSuggestions,
  joinGroup,
} from "../api/apiServer";
import { connect } from "react-redux";
import { profileSuccess } from "../../reducers/auth";
import CommonModal from "../../components/ProfileComponents/CommonModal";
import defaultUser from "../../styles/images/defaultuser.jpg";
import creategroup from "../../group/creategroup";
import CreateGroup from "../../group/creategroup";
import Loader from "../../common/loader";
import defaultguser from "../../styles/images/default-cover.png";
import SideAction from '../components/postings/Actions/SideActions';
const { Meta } = Card;

class Groups extends Component {
  showModal = (e) => {
    e.preventDefault();
    this.setState({
      visible: true,
    });
  };
  state = {
    data: [],
    loading: true,
    page: 1,
    pageSize: this.props.displayas ? 18 : 5,
    size: 0,
    loadMore: true,
  };
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };
  handleScroll = () => {
    const windowHeight =
      "innerHeight" in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = Math.ceil(windowHeight + window.pageYOffset);
    if (windowBottom >= docHeight) {
      this.loadMore();
    } else {
    }
  };
  loadMore(e) {
    if (this.state.loadMore) {
      let { page } = this.state;
      page += 1;
      this.setState({ ...this.state, page, loading: true }, () => {
        this.getAllGroups();
      });
    }
  }
  joinGroup = async (item) => {
    const obj = {
      UserId: this.props?.profile?.Id,
      Firstname: this.props?.profile?.FirstName,
      Lastname: this.props?.profile?.LastName,
      Image: this.props?.profile?.ProfilePic,
      Email: this.props?.profile?.Email,
    };
    if (item.type == "Private") {
      obj.Type = "request";
    }
    const joinResponse = await joinGroup(item.id, obj);
    if (joinResponse.ok) {
      notify({
        message: "Group join",
        description:
          item.type === "Private" ? "Request sent" : "Joined successfully",
      });
      if (item.type !== "Private") {
        this.props.profile.Groups =
          (this.props.profile.Groups ? this.props.profile.Groups : 0) + 1;
        this.props.updateProfile(this.props.profile);
      }
      this.updateGroup(item);
    } else {
      notify({
        message: "Error",
        description: "Something went wrong :)",
        type: "error",
      });
    }
  };
  newGroup = () => { };
  updateGroup(item) {
    let { data } = this.state;
    if (item.type === "Private") {
      for (const i in data) {
        let _item = data[i];
        if (_item.id === item.id) {
          _item.requestJoin = _item.requestJoin ? null : "request";
        }
      }
      this.setState({ ...this.state, data });
    } else {
      let { data } = this.state;
      data = data.filter(ite => item.id !== ite.id);
      this.setState({ ...this.state, data });
    }
  }
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.getAllGroups();
  }
  loadGroups = (take) => {
    let { page, pageSize } = this.state;
    page = page + 1;
    pageSize = take;
    this.setState({ ...this.state, page, pageSize, loading: true }, () => {
      this.getAllGroups();
    });
  };
  getAllGroups = async () => {
    const response = await fetchGroupSuggestions(
      this.props.userId ? this.props.userId : this.props?.profile?.Id,
      this.state.page,
      this.state.pageSize
    );
    if (response.ok) {
      let { data, size } = this.state;
      this.setState({
        loading: false,
        data: data.concat(response.data),
        size: response.data?.length,
        loadMore: response.data.length === this.state.pageSize,
      });
    }
  };
  async cancelGroupRequest(item) {
    const joinResponse = await cancelGroupRequest(
      item.id,
      this.props?.profile?.Id
    );
    if (joinResponse.ok) {
      notify({ message: "Group Request", description: "Request cancelled" });
      this.updateGroup(item);
    } else {
      notify({
        message: "Error",
        description: "Something went wrong :)",
        type: "error",
      });
    }
  }
  saveGroup = () => {
    this.creategroup.handleSave();
  };
  render() {
    const { visible, size, loading } = this.state;
    return this.props.displayas ? (<div className="group-page m-0 mb-6"><Row gutter={16} className="">
      {this.state.data.length > 0 &&
        this.state.data?.map((group, index) => {
          return (
            <Col className="mb-12" xs={24} md={12} lg={8} xl={8} xxl={6}>
              {group.type === "Private" && <div className="group-private-icon">
                <span class="icons-small lock-icon" style={{ transform: 'scale(1.6)' }}></span>
              </div>}
              {loading && <div className="groupcard-skelton" >
                <Skeleton.Image active shape='square' />
                <Skeleton.Avatar active shape='circle' />
                <Skeleton active paragraph={{ rows: 1 }} />
                <Skeleton.Button active shape='square' />
              </div>
              }
              <Card
                key={index}
                cover={
                  <span className="custom-group-cards">
                    <img
                      className="obj-fit group-banner"
                      src={group.groupCoverPic || defaultguser}
                    />
                    <img
                      className="obj-fit group-icons"
                      src={group.image || defaultguser}
                    />
                  </span>
                }
                actions={[
                  group.requestJoin === "request" ? (
                    <Link
                      className="text-center f-12 list-link"
                      onClick={() => this.cancelGroupRequest(group)}
                    >
                      Cancel request
                    </Link>
                  ) : (
                      <Link
                        className="text-center f-12 list-link"
                        onClick={() => this.joinGroup(group)}
                      >
                        Join
                      </Link>
                    )
                ]}
              >

                <Meta
                  title={
                    <Link
                      to={"/groupview/" + group.id}
                      className="post-title"
                    >
                      {group.name}
                    </Link>
                  }
                  description={
                    <div>
                      <div className="mb-4 f-12 text-overflow">
                        {group.description}
                      </div>
                      <div
                        className="d-flex align-items-center f-12"
                        style={{ position: "relative" }}
                      >
                        {group.members > 0 && (
                          <span className="pr-4">
                            <span>
                              {group.members ? group.members : ""}
                            </span>{" "}
                            {group.members > 1 ? "Members" : "Member"}
                          </span>
                        )}
                        {" "}|{" "}
                        <span className="pl-4">
                          <span className="mr-4">{group.postsCount ? group.postsCount : 0}</span>
                          Posts
                        </span>
                      </div>
                    </div>
                  }
                />
              </Card>
              {group.IsGroupAdmin && (
                <span className="card-options-right">
                  <SideAction
                    horclass="icons more"
                    clickedEvent={(event, name) =>
                      this.handleEvent(event, name, group)
                    }
                  // actionsList={ownerActions}
                  />
                </span>
              )}
            </Col>
          );
        })}
      {this.state.data.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </Row></div>) : (
        <div className="custom-card sub-text card-scroll">
          <Card
            title="Groups"
            className="skelton-list"
            bordered={true}
            extra={<Link to="/profile/IsProfileGroupsTab">View all</Link>}
            actions={[
              <Button type="primary" onClick={this.showModal}>
                Create a Group
            </Button>,
            ]}
          >
            {loading && <div className="overlay-skelton">
              <div className="h-card-list-skelton">
                <Skeleton avatar paragraph={{ rows: 1 }} />
                <Skeleton.Button active size="small" shape="square" />
              </div>
              <div className="h-card-list-skelton">
                <Skeleton avatar paragraph={{ rows: 1 }} />
                <Skeleton.Button active size="small" shape="square" />
              </div>
              <div className="h-card-list-skelton">
                <Skeleton avatar paragraph={{ rows: 1 }} />
                <Skeleton.Button active size="small" shape="square" />
              </div>
              <div className="h-card-list-skelton">
                <Skeleton avatar paragraph={{ rows: 1 }} />
                <Skeleton.Button active size="small" shape="square" />
              </div>
            </div>}
            <List
              itemLayout="horizontal"
              split={false}
              dataSource={this.state.data}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.image || defaultUser} />}
                    title={
                      <div className="d-flex align-items-center mr-16">
                        <span className="overflow-text" title={item.name}>
                          {<Link
                            to={"/groupview/" + item.id}
                            className="post-title"
                          >
                            {item.name}
                          </Link>}
                          {item.type == "Private" && (
                            <span className="icons-small lock-icon ml-4" />
                          )}
                        </span>
                      </div>
                    }
                    description={
                      <div>
                        <div className="overflow-text">{item.description}</div>
                        <div className="text-overflow">
                          <span>
                            <span className="mr-4">{item.members}</span>
                            {item.members > 1 ? "Members" : "Member"}
                          </span>{" "}
                        |{" "}
                          <span>
                            <span className="mr-4">{item.postsCount ? item.postsCount : 0}</span>
                          Posts
                        </span>
                        </div>
                      </div>
                    }
                  />
                  {item.requestJoin === "request" ? (
                    <Link
                      className="ml-8 f-12 list-link ml-16"
                      onClick={() => this.cancelGroupRequest(item)}
                    >
                      Cancel request
                    </Link>
                  ) : (
                      <Link
                        className="text-center f-12 list-link"
                        onClick={() => this.joinGroup(item)}
                      >
                        Join
                      </Link>
                    )}
                </List.Item>
              )}
            />
            <div className="text-center">
              {size >= 5 && (
                <a className="more-comments" onClick={() => this.loadGroups(5)}>
                  View more groups
                </a>
              )}
            </div>
          </Card>
          <CommonModal
            className="creategroup-popup"
            visible={visible}
            title="Create group"
            cancel={this.handleCancel}
            saved={this.saveGroup}
          // isHideFooter={true}
          >
            {visible && (
              <CreateGroup
                Type={"Add"}
                handleCancel={this.handleCancel}
                onRef={(creategroup) => (this.creategroup = creategroup)}
              />
            )}
          </CommonModal>
        </div>
      );
  }
}

const mapStateToProps = ({ oidc }) => {
  return { profile: oidc.profile };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateProfile: (info) => {
      dispatch(profileSuccess(info));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Groups);
