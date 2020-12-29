import React, { Component } from "react";
import {
  Row,
  Col,
  Tabs,
  Card,
  Avatar,
  Tooltip,
  Slider,
  List,
  Button,
  message,
  Upload,
  Image,
  Input,
  Typography,
  Checkbox,
  Descriptions,
  Divider,
  Menu,
  Dropdown,
} from "antd";
import PrivateInvite from "./PrivateInvite";
import Ads from "../components/ads";
import Postings from "../shared/postings/index";
import "./groupstyle.css";
import PadLock from "../styles/images/padlock.svg";
import GroupAbout from "../shared/components/groupabout";
import Media from "../shared/components/media";
import Tags from "../components/ProfileComponents/tags";
import CommonModal from "../components/ProfileComponents/CommonModal";
import {
  profileDetail,
  joinGroup,
  saveGroupImage,
  editGroup,
  getAdminFriends,
  saveInvitations,
  cancelGroupRequest,
  deleteUserGroup,
  saveAdminUsers,
  fetchUserFriends,
  getMembers
} from "../shared/api/apiServer";
import { connect } from "react-redux";
import { profileSuccess } from "../reducers/auth";
import notify from "../shared/components/notification";
import ImgCrop from "antd-img-crop";
import defaultguser from "../styles/images/default-cover.png";
import defaultUser from "../styles/images/defaultuser.jpg";
import Loader from "../common/loader";
import defaultCover from "../styles/images/defaultcover.png";
import CreateGroup from "./creategroup";
import { apiClient } from "../shared/api/clients";
let GroupEditObj = {};
const { Search } = Input;
const { TabPane } = Tabs;
const data = [{ title: "Jhon Se" }];
const { Title } = Typography;
class Group extends Component {
  imageObject = {};
  state = {
    groupData: {},
    isProfilePic: false,
    disabled: false,
    visible: false,
    visibleEditgroup: false,
    loading: true,
    search: null,
    friendsLu: [],
    userFndsLu: [],
    saveObj: {
      GroupId: this.props?.match?.params.id,
      Invitations: [],
    },
    saveAdminObj: {
      GroupId: this.props?.match?.params.id,
      AdminUsers: [],
    },
    tabkey: "1",
    imageLoader: false
  };
  onSearch = (e) => {
    let keyword = e.target ? e.target.value : e;
    this.setState({ search: keyword });
  };

  onChange = (e, item, index) => {
    let Obj = {
      UserName: this.props?.profile.FirstName,
      FriendId: item.UserId,
      Image: this.props?.profile.ProfilePic,
    };
    let { saveObj } = this.state;
    item.IsChecked = e.target ? e.target.checked : e;
    if (item.IsChecked) saveObj.Invitations.push(Obj);
    else saveObj.Invitations.splice(saveObj.Invitations.indexOf(Obj), 1);
    this.setState({ ...this.state, saveObj })
  };
  onAdminChange = (e, item, index) => {
    let Obj = {
      UserId: item.UserId,
      Firstname: item.Firstname,
      Lastname: item.Lastname,
      Image: item.Image,
      Email: item.Email
    };
    let { saveAdminObj } = this.state;
    item.IsChecked = e.target ? e.target.checked : e;
    if (item.IsChecked) saveAdminObj.AdminUsers.push(Obj);
    else saveAdminObj.AdminUsers.splice(saveAdminObj.AdminUsers.indexOf(Obj), 1);
    this.setState({ ...this.state, saveAdminObj })
  };
  handleDisabledChange = (disabled) => {
    this.setState({ disabled });
  };
  handleBeforUpload = (file) => {
    const isJPG = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJPG) {
      message.error("You can only upload JPG or PNG file!");
      return false;
    } else {
      return true;
    }
  };
  handleImageOk = () => {
    this.setState({ ...this.state, imageLoader: true })
    const imageType = this.state.isProfilePic ? "ProfilePic" : "CoverPic";
    saveGroupImage(
      this.props?.match?.params.id,
      imageType,
      this.imageObject
    ).then((res) => {
      this.imageObject = {};
      this.getGroupData();
      this.setState({ ...this.state, imageLoader: false }, () => {
        notify({
          description: `${this.state.isProfilePic ? "Profil picture" : "Cover picture"
            } uploaded successfully.`,
          message: "Upload",
        });
      })
    });
  };
  uploadProps = {
    name: "file",
    multiple: false,
    fileList: [],
    customRequest: ({ file }) => {
      let formData = new FormData();
      formData.append(
        "file",
        file,
        file.name +
        `${this.state.isProfilePic ? "groupprofile_" : "groupcover_"}${this.props?.profile?.Id
        }`
      );
      apiClient
        .post(process.env.REACT_APP_AUTHORITY + "/Home/UploadFile", formData)
        .then((res) => {
          if (res.ok) {
            this.imageObject.ImageUrl = res.data[0];
            this.handleImageOk();
          }
          else {
            notify({
              message: "Error",
              description: 'Something went wrong',
              type: 'error'
            })
          }
        });
    },

    // action: process.env.REACT_APP_AUTHORITY + "/Home/UploadFile",
    // onChange: ({ file }) => {
    //   const { status } = file;
    //   if (status !== "uploading") {
    //     this.imageObject.ImageUrl = file.response[0];
    //     this.handleImageOk();
    //   }
    //   if (status === "done") {
    //     message.success(
    //       `${this.state.isProfilePic ? "Profil picture" : "Cover picture"
    //       } uploaded successfully.`
    //     );
    //   } else if (status === "error") {
    //     message.error(`File upload failed.`);
    //   }
    // },
  };
  editGroup = (group) => {
    GroupEditObj = group;
    this.setState({
      visibleEditgroup: true,
    });
  };
  addAdmin = (group) => {
    this.setState(
      {
        visibleAddAdmin: true,
        userFndsLu: [],
        loading: true,
        search: null
      },
      () => {
        this.getUserFriends();
      }
    );
  }
  leaveGroup = async (group) => {
    const joinResponse = await cancelGroupRequest(
      group.GroupId,
      this.props?.profile?.Id
    );
    if (joinResponse.ok) {
      notify({
        message: "Leave group",
        description: "Group left done successfully",
      });
      this.props.profile.Groups =
        this.props.profile.Groups >= 1 ? this.props.profile.Groups - 1 : 0;
      this.props.upadateProfile(this.props.profile);
      this.props.history.push("/group");
    } else {
      notify({
        message: "Error",
        description: "Something went wrong :)",
        type: "error",
      });
    }
  };
  deleteGroup = async (group) => {
    const joinResponse = await deleteUserGroup(
      group.GroupId,
    );
    if (joinResponse.ok) {
      notify({
        message: "Delete group",
        description: "Group deleted successfully",
      });
      this.props.profile.Groups =
        this.props.profile.Groups >= 1 ? this.props.profile.Groups - 1 : 0;
      this.props.upadateProfile(this.props.profile);
      this.props.history.push("/group");
    } else {
      notify({
        message: "Error",
        description: "Something went wrong :)",
        type: "error",
      });
    }
  };
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
          item.type === "Private" ? "Request sent" : "Joined to group",
      });
      if (item.type !== "Private") {
        this.props.history.push("/profile/IsProfileGroupsTab");
        this.props.profile.Groups =
          (this.props.profile.Groups ? this.props.profile.Groups : 0) + 1;
        this.props.updateProfile(this.props.profile);
      }
    } else {
      notify({
        message: "Error",
        description: "Something went wrong :)",
        type: "error",
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
    } else {
      notify({
        message: "Error",
        description: "Something went wrong :)",
        type: "error",
      });
    }
  }

  componentDidMount() {
    this.getGroupData();
  }
  getGroupData = () => {
    let { groupData } = this.state;
    editGroup(
      this.props?.match?.params.id,
      this.props?.profile.Id,
      "GroupView"
    ).then((res) => {
      groupData = res.data[0];
      groupData.IsAdmin = res.data[0].IsGroupAdmin;
      this.setState({ ...this.state, groupData });
    });
  };
  refreshSave = () => {
    this.getGroupData();
  };
  showModal = () => {
    this.setState(
      {
        visible: true,
        friendsLu: [],
        loading: true,
      },
      () => {
        this.getAdminFriends();
      }
    );
  };
  getAdminFriends = () => {
    let { friendsLu, groupData } = this.state;
    getAdminFriends(this.props?.profile?.Id, groupData?.GroupId).then((res) => {
      this.setState({
        ...this.state,
        friendsLu: res.data,
        loading: false,
      });
    });
  };
  getUserFriends = () => {
    let { userFndsLu, groupData } = this.state;
    getMembers(groupData.GroupId, this.props.profile?.Id, groupData.Members, 0).then(res => {
      this.setState({
        ...this.state,
        userFndsLu: res.data[0].Members,
        loading: false,
      });
    });
  };
  handleOk = async (e) => {
    this.setState({ ...this.state, loading: true });
    this.state.saveObj.CreatdDate = new Date();
    const response = await saveInvitations(this.state.saveObj);
    if (response.ok) {
      this.setState(
        {
          visible: false,
          loading: false,
        },
        () => {
          notify({
            description: "Invitations added successfully",
            message: "Invitations",
          });
        }
      );
    } else {
      this.setState({
        ...this.state,
        loading: false,
      });

      notify({
        description: "Something went wrong :)",
        message: "Error",
        type: "error",
      });
    }
  };
  saveAdmin = async (e) => {
    this.setState({ ...this.state, loading: true });
    const response = await saveAdminUsers(this.state.saveAdminObj);
    if (response.ok) {
      this.setState(
        {
          visibleAddAdmin: false,
          loading: false,
          search: null,
        },
        () => {
          notify({
            description: "Admins added successfully",
            message: "Admins",
          });
        }
      );
    } else {
      this.setState({
        ...this.state,
        loading: false,
      });

      notify({
        description: "Something went wrong :)",
        message: "Error",
        type: "error",
      });
    }
  };
  handleCancel = (e) => {
    GroupEditObj = {};
    this.setState({
      visible: false,
      visibleEditgroup: false,
      visibleAddAdmin: false,
      search: null
    });
  };
  saveGroup = () => {
    this.creategroup.handleSave();
  };
  handleDomNavigate = (navigate) => {
    navigate.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

  render() {
    const menu = (
      <Menu className="dropdown-align">
        <Menu.Item key="0">
          <a>
            <span className="post-icons post-icon mr-4"></span> Share in a post
          </a>
        </Menu.Item>
        <Menu.Item key="1">
          <a>
            <span className="post-icons sendmessage-icon"></span> Send in a
            message
          </a>
        </Menu.Item>
        <Menu.Item key="2">
          <a>
            <span className="post-icons sharenow-icon"></span> Copy link
          </a>
        </Menu.Item>
      </Menu>
    );
    const menu1 = (
      <Menu className="dropdown-align">
        {/* <Menu.Item key="0">
                    <a><span className="post-icons settings-icon"></span> Update your settings</a>
                </Menu.Item> please don't delete */}
        <Menu.Item key="1">
          {!this.state.groupData?.IsAdmin && !this.state.groupData?.IsSystem && (
            <a onClick={() => this.leaveGroup(this.state.groupData)}>
              <span className="post-icons Leavegroup-icon"></span> Leave this
              group
            </a>
          )}
          {this.state.groupData?.IsAdmin && (
            <a onClick={() => this.editGroup(this.state.groupData)}>
              <span className="post-icons edit-icon"></span> Edit group
            </a>
          )}
          {this.state.groupData?.IsAdmin && (<a onClick={() => this.addAdmin(this.state.groupData)}>
            <span className="post-icons add-admin"></span> Add admins
          </a>)}
        </Menu.Item>
        {/* <Menu.Item key="2">
                    <a><span className="post-icons groupshare-icon"></span> Unfollow Group</a>
                </Menu.Item> please don't delete*/}
      </Menu>
    );
    function onChange(e) {
      console.log(`checked = ${e.target.checked}`);
    }
    const operations = (
      <div className="mb-8 mr-12 share-option">
        {/* <button type="primary" className=""><Dropdown overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    <span className="post-icons groupshare-icon m-0"></span>
                </a>
            </Dropdown></button>  please don't delete*/}
        <button className="">
          <Dropdown overlay={menu1} trigger={["click"]}>
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              {(this.state.groupData?.IsAdmin || (!this.state.groupData?.IsAdmin && !this.state.groupData?.IsSystem)) && <span className="icons h-more-icon m-0"></span>}
            </a>
          </Dropdown>
        </button>
      </div>
    );
    const {
      groupData,
      disabled,
      visible,
      friendsLu,
      loading,
      visibleEditgroup,
      tabkey,
      visibleAddAdmin,
      userFndsLu,
      imageLoader
    } = this.state;
    const friendsData = friendsLu
      .filter((item) => {
        if (this.state.search == null) {
          return item;
        } else if (
          item.Firstname.toLowerCase().includes(this.state.search.toLowerCase())
        ) {
          return item;
        }
      })
      .map((item, index) => {
        return (
          <List.Item key={index} onClick={(e) => this.onChange(item.IsChecked ? false : true, item, index)}>
            <List.Item.Meta
              avatar={<Avatar src={item.Image || defaultUser} />}
              title={item.Firstname}
            />
            <Checkbox
              value={item.IsChecked}
              checked={item.IsChecked}
            ></Checkbox>
          </List.Item>
        );
      });
    const adminsData = userFndsLu
      .filter((item) => {
        if (this.state.search == null) {
          return item;
        } else if (
          item.Firstname.toLowerCase().includes(this.state.search.toLowerCase())
        ) {
          return item;
        }
      })
      .map((item, index) => {
        return (
          <List.Item key={index} onClick={(e) => this.onAdminChange(item.IsChecked ? false : true, item, index)}>
            <List.Item.Meta
              avatar={<Avatar src={item.Image || defaultUser} />}
              title={item.Firstname}
            />
            <Checkbox
              value={item.IsChecked}
              checked={item.IsChecked}
            ></Checkbox>
          </List.Item>
        );
      });
    return groupData ? (
      <div className="main">
        <Row gutter={16}>
          <Col xs={24} sm={16} md={16} lg={18} xl={18}>
            <div className="coverpage">
              <img
                className="center-focus"
                src={groupData.GroupCoverPic || defaultCover}
                alt="profilecover"
              />
              <span className="padlock">
                <img src={PadLock} />
              </span>
              <ImgCrop
                aspect={6 / 2}
                grid={true}
                beforeCrop={this.handleBeforUpload}
                cropperProps={{
                  cropSize: { width: 1000, height: 400 },
                  cropShape: "round",
                }}
              >
                <Upload {...this.uploadProps}>
                  {groupData.IsGroupAdmin && (
                    <Tooltip title="Change Coverphoto">
                      <a
                        className="editpost"
                        onClick={() => this.setState({ isProfilePic: false })}
                      >
                        <span className="left-menu camera-icon" />
                      </a>
                    </Tooltip>
                  )}
                </Upload>
              </ImgCrop>
            </div>

            <div className="user-statistic pb-0">
              <div className="left-statistic group-leftext">
                <Title className="mb-0" level={5}>
                  {groupData.GroupName}
                </Title>
                <div className="f-12">{groupData.Type} Group</div>
              </div>
              <Card className="group-banner w-btn">
                <List
                  itemLayout="horizontal"
                  dataSource={[{}]}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <div className="img-container">
                            {" "}
                            <ImgCrop
                              shape="round"
                              beforeCrop={this.handleBeforUpload}
                            >
                              <Upload {...this.uploadProps} disabled={!groupData?.IsGroupAdmin}>
                                {imageLoader && <Loader className="loader-top-middle" />}
                                <Avatar onClick={() =>
                                  this.setState({ isProfilePic: true })
                                }
                                  src={groupData?.GroupImage || defaultguser}
                                />
                                {groupData?.IsGroupAdmin && (
                                  <Tooltip placement="top" title="Change Photo">
                                    <a
                                      className="img-camera"
                                      onClick={() =>
                                        this.setState({ isProfilePic: true })
                                      }
                                    >
                                      <span className="left-menu camera-icon" />{" "}
                                    </a>
                                  </Tooltip>
                                )}
                              </Upload>
                            </ImgCrop>{" "}
                          </div>
                        }
                      // title={<a href="https://ant.design">{item.title}</a>}

                      // description={<div className="f-12">{item.Type}</div>}
                      />
                      {/* {!groupData.IsMember && <div className="btn-position"><span className="text-center mt-8 mr-16"><span className="f-20 fw-400">{item.Members}</span> Members</span>
                                                <Button type="primary" onClick={() => this.joinGroup(item)}>Invite</Button>
                                            </div>} */}
                    </List.Item>
                  )}
                />
              </Card>
              <CommonModal
                visible={visible}
                title="Invite Friends to This Group"
                cancel={this.handleCancel}
                saved={this.handleOk}
                className="invite-search"
              >
                {loading && <Loader className="loader-middle" />}
                {visible && <Search
                  className="header-searchbar mb-16"
                  placeholder="Search"
                  onChange={(e) => this.onSearch(e)}
                  onSearch={(event) => this.onSearch(event)}
                />}
                <div className="f-16 fw-400 my-8">Suggested</div>
                <div className="frnds-scroll">

                  <List itemLayout="horizontal">{friendsData}</List>
                </div>
              </CommonModal>
              <CommonModal
                className="creategroup-popup"
                visible={visibleEditgroup}
                title="Edit group"
                cancel={this.handleCancel}
                saved={this.saveGroup}
              >
                {visibleEditgroup && (
                  <CreateGroup
                    Type={"Edit"}
                    GroupId={GroupEditObj.GroupId}
                    handleCancel={this.handleCancel}
                    onRef={(creategroup) => (this.creategroup = creategroup)}
                    refreshSave={() => this.refreshSave()}
                  />
                )}
              </CommonModal>
              <CommonModal
                className="creategroup-popup"
                visible={visibleAddAdmin}
                title="Add Admin"
                cancel={this.handleCancel}
                saved={this.saveAdmin}
              >
                {loading && <Loader className="loader-middle" />}
                {visibleAddAdmin && <Search
                  className="header-searchbar mb-16"
                  placeholder="Search"
                  onChange={(e) => this.onSearch(e)}
                  onSearch={(event) => this.onSearch(event)}
                />}
                <div className="">
                  <div className="f-16 fw-400 my-16">Suggested</div>
                  <List itemLayout="horizontal">{adminsData}</List>
                </div>
              </CommonModal>
              <div className="right-statistic group-right mt-12 mx-12">
                {groupData.Members > 0 && (
                  <span className="text-center mt-4 mr-8">
                    <span className="f-20 mt-4 fw-400">
                      {groupData.Members}
                    </span>{" "}
                    Members
                  </span>
                )}
                <Button className="mr-8" type="primary" onClick={this.showModal}>
                  <span className="icons add-white"></span> Invite
                </Button>
                {!groupData.IsGroupMember && <Button type="primary" onClick={() => this.joinGroup(groupData)}>
                  Join
                </Button>}
                {!groupData.IsGroupMember && groupData.requestJoin === "request" && <Button type="primary" onClick={() => this.cancelGroupRequest(groupData)}>
                  Cancel Request
                </Button>
                }
              </div>
            </div>
            {/* <div className=""><Divider className="m-0" /></div> */}
            <Tabs
              defaultActiveKey="1"
              className="profile-tabs"
              tabBarExtraContent={operations}
              onChange={(e) => this.setState({ ...this.state, tabkey: e })}
            >
              <TabPane tab="About" key="3">
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <GroupAbout aboutData={groupData} />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Posts" key="1">
                <Row gutter={16}>
                  {groupData?.IsGroupAdmin && <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                    <Tags />
                    <PrivateInvite />
                  </Col>
                  }
                  <Col xs={24} sm={groupData?.IsGroupAdmin ? 16 : 24} md={groupData?.IsGroupAdmin ? 16 : 24} lg={groupData?.IsGroupAdmin ? 16 : 24} xl={groupData?.IsGroupAdmin ? 16 : 24}>
                    {groupData?.GroupId && tabkey == "1" && (
                      <Postings
                        sharebox={true}
                        friendsSuggestions={false}
                        postingsType="group"
                        groupData={groupData}
                      />
                    )}
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Media" key="2">
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Media groupData={groupData} />
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Col>
          <Col xs={24} sm={8} md={8} lg={6} xl={6}>
            <Ads />
          </Col>
        </Row>
      </div>
    ) : null;
  }
}

const mapStateToProps = ({ oidc }) => {
  return { user: oidc.user, profile: oidc.profile };
};
const mapDispatchToProps = (dispatch) => {
  return {
    upadateProfile: (info) => {
      dispatch(profileSuccess(info));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Group);
