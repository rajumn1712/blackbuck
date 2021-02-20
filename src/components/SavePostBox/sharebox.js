import React, { Component } from "react";
import {
  Button,
  Menu,
  Modal,
  Card,
  Avatar,
  Dropdown,
  Checkbox,
  Tag,
  Divider,
  Image,
  Input,
  Tooltip,
  Upload,
  List,
  Alert,
  Select,Skeleton
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { TweenOneGroup } from "rc-tween-one";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Formik } from "formik";
import { savePost } from "../../shared/api/postsApi";
import { fetchUserGroups, fetchUserColleges } from "../../shared/api/apiServer";
import Loader from "../../common/loader";
import { uuidv4 } from "../../utils";
import notify from "../../shared/components/notification";
import defaultUser from "../../styles/images/defaultuser.jpg";
import defaultguser from '../../styles/images/default-cover.png';
const { Dragger } = Upload;
const { TextArea } = Input;
const { Meta } = Card;
const { Option } = Select;
const postsmenu = [
  {
    Heading: "Text",
    Url: "",
    CssSprite: "sharebox-icons text-icon",
    IsActive: false,
    Id: "Text",
  },
  {
    Heading: "Images",
    Url: "",
    CssSprite: "sharebox-icons photo-icon",
    IsActive: false,
    Id: "Images",
  },
  {
    Heading: "Audio",
    Url: "",
    CssSprite: "sharebox-icons audio-icon",
    IsActive: false,
    Id: "Audio",
  },
  {
    Heading: "Docs",
    Url: "",
    CssSprite: "sharebox-icons document-icon",
    IsActive: false,
    Id: "Docs",
  },
  {
    Heading: "Gif",
    Url: "",
    CssSprite: "sharebox-icons gif-icon",
    IsActive: false,
    Id: "Gif",
  },
  {
    Heading: "Video",
    Url: "",
    CssSprite: "sharebox-icons video-icon",
    IsActive: false,
    Id: "Video",
  },
];

const NewPostMenu = [
  {
    CssSprite: 'sharebox-icons photo-icon',
    Id: 'Images'
  },
  {
    CssSprite: 'sharebox-icons video-icon',
    Id: 'Video'
  },
  {
    CssSprite: 'sharebox-icons gif-icon',
    Id: 'Gif'
  },
  {
    CssSprite: 'sharebox-icons audio-icon',
    Id: 'Audio'
  },
  {
    CssSprite: 'sharebox-icons document-icon',
    Id: 'Docs'
  }
];
const fileTypes = {
  Images: ".jpg,.jpeg,.png",
  Video: ".mp4,.mpeg4,.mov,.flv,.avi,.mkv,.webm",
  Audio: ".mp3,.aac,.wma,.wav,.flac,.m4a",
  Gif: ".gif",
  Docs:
    ".doc,.docx,.ott,.rtf,.docm,.dot,.odt,.dotm,.md,.xls,.xlsx.,.csv",
};
class ShareBox extends Component {
  postObject;
  state = {
    visible: false,
    modal: "",
    tags: [],
    inputVisible: false,
    inputValue: "",
    uploadSources: [],
    post: { Title: "", Message: "", IsAnonymous: false },
    errors: null,
    fileUploading: false,
    isEdit: false,
    ddlValue: "Public",
    groupLu: [],
    collegeLu: [],
    CollgeName: " ",
    GroupName: ""
  };
  componentDidMount() {
    if (this.props.onRef) this.props.onRef(this);
  }
  createObject = (object) => {
    return {
      PostId: object ? object.id : uuidv4(),
      Type: "Text",
      PostType: object ? object.PostType : this.state.ddlValue,
      Message: object ? object.meassage : this.state.post.Message,
      Title: object ? object.title : this.state.post.Title,
      IsAnonymous: object ? object.IsAnonymous : this.state.post.IsAnonymous,
      ImageUrl: object ? (object.image ? object.image : null) : null,
      CreatedDate: object ? new Date(object.date) : null,
      UserDetails: {
        UserId: this.props.profile?.Id,
        Firstname: this.props.profile?.FirstName,
        Lastname: "",
        Image: this.props.profile?.ProfilePic,
        Email: this.props.profile?.Email,
      },
      Tags: object ? object.tags : [],
      Likes: [],
      Claps: [],
      whistiles: [],
      Comments: [],
      Loves: [],
      Group: {
        GroupId: this.props?.groupData ? this.props.groupData.GroupId : (object ? object.Group?.GroupId : null),
        GroupName: this.props?.groupData
          ? this.props.groupData.GroupName
          : (object ? object.Group?.GroupName : null),
        GroupImage: this.props?.groupData
          ? this.props.groupData.GroupImage
          : (object ? object.Group?.GroupImage : null),
      },
      Shares: [],
      CollegeId: object ? object.CollegeId : null,
      CollegeName: object ? object.CollegeName : null,
    };
  };

  editPost = (postObj) => {
    let { post } = this.state;
    post.Message = postObj.meassage;
    post.Title = postObj.title;
    post.IsAnonymous = postObj.IsAnonymous;
    this.setState(
      {
        ...this.state,
        uploadSources: postObj.image
          ? Array.isArray(postObj.image)
            ? postObj.image
            : [postObj.image]
          : [],
        isEdit: true,
        tags: postObj.tags,
        CollgeName: postObj.CollegeId,
        GroupName: postObj.Group?.GroupId,
        post,
        ddlValue: postObj.PostType ? postObj.PostType : 'Public',
      },
      () => {
        const object = {
          Text: "Text",
          Video: "Video",
          Gif: "Gif",
          Audio: "Audio",
          Image: "Images",
          Docs: "Docs"
        };
        this.openpopup(object[postObj.type], postObj);
      }
    );
  };
  uploadProps = {
    name: "file",
    multiple: false,
    action: process.env.REACT_APP_AUTHORITY + "/Home/UploadFile",
    onChange: (info) => {
      this.setState({ ...this.state, fileUploading: true });
      const { status } = info.file;
      if (status !== "uploading") {
      }
      if (status === "done") {
        if (this.postObject.Type == "Docs") {
          const avatar = info.file?.name
            ? info.file.name.substr(info.file.name.lastIndexOf(".") + 1)
            : "word";
          let response = {
            title: info.file.name,
            avatar,
            url: info.file.response[0],
            fileSize: info.file.size,
          };
          this.postObject.ImageUrl = this.postObject.ImageUrl
            ? this.postObject.ImageUrl.concat(response)
            : [response];
          this.setState({
            ...this.state,
            uploadSources: this.state.uploadSources
              ? this.state.uploadSources.concat(response)
              : [response],
          });
        } else {
          this.postObject.ImageUrl = this.postObject.ImageUrl
            ? this.postObject.ImageUrl.concat(info.file.response)
            : info.file.response;
          this.setState({
            ...this.state,
            uploadSources: this.state.uploadSources
              ? this.state.uploadSources.concat(info.file.response)
              : [info.file.response],
          });
        }

        notify({
          description: `${this.postObject.Type} uploaded successfully.`,
          message: "Upload",
        });
        this.setState({ ...this.state, fileUploading: false });
      } else if (status === "error") {
        notify({
          description: `${this.postObject.Type} upload failed.`,
          type: "error",
          message: "Upload",
        });
        this.setState({ ...this.state, fileUploading: false });
      } else if (status == undefined) {
        this.setState({ ...this.state, fileUploading: false });
      }
    },
    beforeUpload: (file, list) => {
      const fileMaxSize = 25 * 1000000;
      if (file.size > fileMaxSize) {
        notify({
          message: "Upload",
          description: `${this.postObject.Type} size does not exceed 25 MB`,
          type: "warning",
        });
      }
      return file.size <= fileMaxSize;
    },
  };
  openpopup = (modal, postObject) => {
    if (Object.keys(postObject ? postObject : []).length === 0)
      this.clearUploaddata();
    this.postObject = this.createObject(postObject);
    this.postObject.Type = modal === "Images" ? "Image" : modal;
    this.postObject.dupType = modal === "Images" ? "Image" : modal;
    this.setState({ visible: true, modal: modal }, () => {
      if (postObject) {
        this.setDdlValue(this.state.ddlValue);
      }
    });
  };
  renderByClickIcon = (modal)=>{
      this.clearData(modal);
    this.postObject = this.createObject();
    this.postObject.Type = modal === "Images" ? "Image" : modal;
    this.postObject.dupType = modal === "Images" ? "Image" : modal;
    this.setState({ modal: modal }, () => {
      this.renderUploadType(modal);
    });
  }
  popupOk = async (e) => {
    this.postObject.CreatedDate = this.postObject.CreatedDate
      ? this.postObject.CreatedDate
      : new Date();
    this.postObject.Tags = this.state.tags;
    this.postObject.ImageUrl =
      this.state.uploadSources.length == 0 ? [] : this.postObject.ImageUrl;
    this.postObject.Type =
      this.state.uploadSources.length == 0 ? "Text" : this.postObject.dupType;
    const isEdit = this.state.isEdit ? true : false;
    if (this.postObject.IsAnonymous) {
      this.postObject.UserDetails = {
        UserId: "",
        Firstname: "Anonymous",
        Lastname: "Anonymous",
        Image: null,
        Email: "Anonymous",
      };
    }
    const response = await savePost(this.postObject, this.state.isEdit);
    if (response.ok) {
      this.setState(
        {
          visible: false,
          isEdit: false,
          groupLu: [],
          collegeLu: []
        },
        () => {
          this.props.dataRefreshed(isEdit ? "Edit" : "Add");
          notify({
            description: isEdit
              ? "Post edited successfully"
              : "Posting completed successfully",
            message: "Post",
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
  clearUploaddata = () => {
    let { post } = this.state;
    post.IsAnonymous = false;
    post.Message = "";
    post.Title = "";
    this.setState({
      ...this.state,
      post,
      errors: null,
      tags: [],
      uploadSources: [],
      ddlValue: "Public",
      GroupName: ""
    });
  };
  clearData = (modal) => {
    const compareValue = modal === "Images" ? "Image" : 'Docs';
    this.setState({
      ...this.state,
      errors: null,
      uploadSources: this.postObject.Type === compareValue ? this.state.uploadSources : []
    });
  };
  handleCancel = (e) => {
    this.clearUploaddata();
    this.setState({
      visible: false,
      isEdit: false,
      inputVisible: false,
      groupLu: [],
      collegeLu: []
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
    this.setState({ inputValue: e.target.value });
  };
  handleInputConfirm = () => {
    let { inputValue } = this.state;
    if (!inputValue) {
      return;
    }
    let { tags } = this.state;
    if (!inputValue.startsWith("#")) {
      inputValue = "#" + inputValue;
    }
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

  forMap = (tag) => {
    const tagElem = (
      <Tag
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
      <span key={tag} style={{ display: "inline-block" }}>
        {tagElem}
      </span>
    );
  };
  renderUploadType = (type) => {
    const fileTypes = {
      Images: ".jpg,.jpeg,.png",
      Video: ".mp4,.mpeg4,.mov,.flv,.avi,.mkv,.webm",
      Audio: ".mp3,.aac,.wma,.wav,.flac,.m4a",
      Gif: ".gif",
      Docs:
        ".doc,.docx,.ott,.rtf,.docm,.dot,.odt,.dotm,.md,.xls,.xlsx.,.csv",
    };
    this.uploadProps = {
      ...this.uploadProps,
      accept: fileTypes[type],
      multiple: type === "Images" || type === "Docs" ? true : false,
    };
    const types = {
      Text: <div></div>,
      Images: (
        <div>
          {this.state.isEdit && <Dragger
            className="upload"
            {...this.uploadProps}
            onRemove={() => this.setState({ ...this.state, uploadSources: [] })}
            showUploadList={false}
          >
            <span className="sharebox-icons photo-upload"></span>
            <p className="ant-upload-text mt-8 mb-0">Upload Image</p>
          </Dragger>}
          {this.state.fileUploading &&  <Skeleton.Image className="upload-skelton" /> }
          {this.state.uploadSources?.map((image, indx) => (
            <div key={indx} className="mb-16 upload-preview">
              <Image src={image} />
              <a
                class="item-close"
                onClick={() => {
                  let uploadSources  = [...this.state.uploadSources];
                  uploadSources.splice(indx, 1);
                  this.postObject.ImageUrl.splice(indx, 1);
                  this.setState({ ...this.state, uploadSources:uploadSources });
                }}
              >
                <Tooltip title="Remove">
                  <span className="close-icon"></span>
                </Tooltip>
              </a>
            </div>
          ))}
        </div>
      ),
      Video: (
        <div>
          {this.state.isEdit && <Dragger
            className="upload"
            {...this.uploadProps}
            onRemove={() => this.setState({ ...this.state, uploadSources: [] })}
            showUploadList={false}
            disabled={this.state.fileUploading || this.state.uploadSources.length > 0}
          >
            <span className="sharebox-icons video-upload"></span>
            <p className="ant-upload-text mt-8 mb-0">Upload Video</p>
          </Dragger>}
          {this.state.fileUploading && <Loader className="loader-top-middle" />}
          {this.state.uploadSources?.map((image, indx) => (
            <div key={indx} className="mb-16 upload-preview">
              <video width="100%" controls controlsList="nodownload">
                <source src={image} />
              </video>
              <a
                class="item-close"
                onClick={() => {
                  this.postObject.ImageUrl = [];
                  this.setState({ ...this.state, uploadSources: [] })
                }
                }
              >
                <Tooltip title="Remove">
                  <span className="close-icon"></span>
                </Tooltip>
              </a>
            </div>
          ))}
        </div>
      ),
      Audio: (
        <div>
          {this.state.isEdit && <Dragger
            className="upload"
            {...this.uploadProps}
            onRemove={() => this.setState({ ...this.state, uploadSources: [] })}
            showUploadList={false}
            disabled={this.state.fileUploading || this.state.uploadSources.length > 0}
          >
            <span className="sharebox-icons audio-upload"></span>
            <p className="ant-upload-text mt-8 mb-0">Upload Audio</p>
          </Dragger>}
          {this.state.fileUploading && <Loader className="loader-top-middle" />}
          {this.state.uploadSources?.map((image, indx) => (
            <div key={indx} className="mb-16 upload-preview">
              <AudioPlayer
                src={image}
                onPlay={(e) => console.log("onPlay")}
                layout="horizontal-reverse"
              />
              <a
                class="item-close"
                onClick={() => {
                  this.postObject.ImageUrl = [];
                  this.setState({ ...this.state, uploadSources: [] })
                }
                }
                showUploadList={false}
              >
                <Tooltip title="Remove">
                  <span className="close-icon"></span>
                </Tooltip>
              </a>
            </div>
          ))}
        </div>
      ),
      Docs: (
        <div>
          {this.state.isEdit && <Dragger
            className="upload"
            {...this.uploadProps}
            onRemove={() => this.setState({ ...this.state, uploadSources: [] })}
            showUploadList={false}
          >
            <span className="sharebox-icons docs-upload"></span>
            <p className="ant-upload-text mt-8 mb-0">Upload Documents</p>
          </Dragger>}
          {this.state.fileUploading && <Loader className="loader-top-middle" />}
          <div className="docs mb-16">
            <List
              itemLayout="horizontal"
              dataSource={this.state.uploadSources}
              renderItem={(item, indx) => (
                <List.Item className="upload-preview">
                  <List.Item.Meta
                    avatar={[
                      <span className={`doc-icons ${item.avatar}`}></span>,
                    ]}
                    // avatar={item.avatar}
                    title={item.title}
                    description={
                      <div className="file-size f-12">{item.fileSize}</div>
                    }
                  />
                  <a
                    class="item-close"
                    onClick={() => {
                      let uploadSources  = [...this.state.uploadSources];
                  uploadSources.splice(indx, 1);
                  this.postObject.ImageUrl.splice(indx, 1);
                  this.setState({ ...this.state, uploadSources:uploadSources });
                    }}
                  >
                    <Tooltip title="Remove">
                      <span className="close-icon"></span>
                    </Tooltip>
                  </a>
                </List.Item>
              )}
            />
          </div>
        </div>
      ),
      Gif: (
        <div>
          {this.state.isEdit && <Dragger
            className="upload"
            {...this.uploadProps}
            onRemove={() => this.setState({ ...this.state, uploadSources: [] })}
            showUploadList={false}
            disabled={this.state.fileUploading || this.state.uploadSources.length > 0}
          >
            <span className="sharebox-icons gif-upload"></span>
            <p className="ant-upload-text mt-8 mb-0">Upload Gif</p>
          </Dragger>}
          {this.state.fileUploading && <Loader className="loader-top-middle" />}
          {this.state.uploadSources?.map((image, indx) => (
            <div key={indx} className="mb-16 upload-preview">
              <Image src={image} />
              <a
                class="item-close"
                onClick={() => {
                  this.postObject.ImageUrl = [];
                  this.setState({ ...this.state, uploadSources: [] })
                }
                }
              >
                <Tooltip title="Remove">
                  <span className="close-icon"></span>
                </Tooltip>
              </a>
            </div>
          ))}
        </div>
      ),
    };
    return type ? types[type] : null;
  };
  handleChange = ({ target }) => {
    let { post } = this.state;
    post[target.name] =
      target.type === "checkbox" ? target.checked : target.value;
    this.postObject[target.name] =
      target.type === "checkbox" ? target.checked : target.value;
    this.setState({ ...this.state, post });
  };
  validate = () => {
    let { errors, post } = this.state;
    errors = { validate: true };
    if (!post.Title) {
      errors.validate = false;
      if (!post.Title) {
        errors.Title = "Title is required";
      }
    }
    this.setState({ ...this.state, errors });
    return errors;
  };
  disablePostBtn = () => {
    return ((!this.postObject?.ImageUrl || (this.state.uploadSources.length == 0)) && !this.postObject?.Message) || ((this.state.ddlValue == "Groups" ? (!this.postObject.Group.GroupId) : (this.state.ddlValue == "College" ? !this.postObject.CollegeId : false)));
  };
  setDdlValue = (e, IsMenu) => {
    let text = e.item ? (e.item.node.innerText ? e.item.node.innerText : '') : e;
    let { groupLu, collegeLu, GroupName } = this.state;
    this.postObject.PostType = text
    this.setState({ ...this.state, ddlValue: text, GroupName: (IsMenu ? "" : GroupName) }, () => {
      if (text == 'Groups') {
        if (groupLu.length === 0)
          fetchUserGroups(
            this.props.userId ? this.props.userId : this.props?.profile?.Id,
            5000,
            0
          ).then((res) => {
            if (res.ok) {
              groupLu = res.data;
              this.setState({ ...this.state, groupLu });
            }
          })
      }
      if (text == 'College') {
        if (collegeLu.length === 0)
          fetchUserColleges(
          ).then((res) => {
            if (res.ok) {
              collegeLu = res.data;
              this.setState({ ...this.state, collegeLu });
            }
          })
      }
    }
    );
  }

  setFieldValue(value) {
    let { groupLu } = this.state;
    let GroupObject;
    GroupObject = groupLu.filter(item => item.id == value)
    this.postObject.Group.GroupImage = GroupObject[0]?.image;
    this.postObject.Group.GroupName = GroupObject[0]?.name;
    this.postObject.Group.GroupId = GroupObject[0]?.id;
    this.setState({ ...this.state, GroupName: value });
  }
  renderSelectCollegeItem = (item) => {
    return <div>
      <List.Item>
        <List.Item.Meta className="privacy-dropdown"
          avatar={<Avatar className="select-image" src={item.Image || defaultguser} />}
          title={<span>{item.name ? item.name : item.CollegeName}</span>}
          description={item.description ? <div className="f-12">{item.description}</div> : ''}
        />
      </List.Item>
    </div>
  }
  renderSelectItem = (item) => {
    return <div>
      <List.Item>
        <List.Item.Meta className="privacy-dropdown"
          avatar={<Avatar className="select-image" src={item.image || defaultguser} />}
          title={<span>{item.name ? item.name : item.Name}</span>}
          description={item.description ? <div className="f-12">{item.description}</div> : ''}
        />
      </List.Item>
    </div>
  }
  render() {
    const {
      tags,
      inputVisible,
      inputValue,
      visible,
      modal,
      isEdit,
      ddlValue,
      groupLu,
      collegeLu,
      GroupName
    } = this.state;
    const tagChild = tags?.map(this.forMap);
    const menu = (
      <Menu className="custom-dropdown more-opt">
        <Menu.Item key="0" onClick={(e) => this.setDdlValue(e, true)}><span className="grp-type-icon public"></span> Public</Menu.Item>
        <Menu.Item key="2" onClick={(e) => this.setDdlValue(e, true)}><span className="grp-type-icon friends"></span> Friends</Menu.Item>
        {/* <Menu.Item key="3" onClick={(e) => this.setDdlValue(e)}><span className="grp-type-icon college"></span> College</Menu.Item> */}
        {!this.props.groupData && <Menu.Item key="4" onClick={(e) => this.setDdlValue(e)}><span className="grp-type-icon groups"></span> Groups</Menu.Item>}
      </Menu>
    );
    const title = (
      <div className="d-flex justify-content-between addpost-user">
        <Meta
          avatar={
            <Avatar src={this.props.profile?.ProfilePic || defaultUser} />
          }
          title={<h4 className="mb-0">{this.props.profile?.FirstName}</h4>}
          description={
            <div className="mb-0 text-capitalize" id="typeLu">
              {!this.props.groupData && <Dropdown overlay={menu} trigger={["click"]}
                getPopupContainer={() => document.querySelector('#typeLu')}>
                <div
                  className="post-privacy"
                  style={{ color: "#9B9B9B", fontSize: 12 }}

                >
                  <span className="grp-type-icon public mr-4"></span>{ddlValue}
                  <span className="grp-type-icon down ml-4"></span>
                </div>
              </Dropdown>
              }
              {this.props.groupData &&
                this.props.groupData.GroupName
              }
            </div>
          }
        />
        <div className="mr-8 anonymous">
          <div>
            <span className="f-12" style={{ color: "var(--textlightcolor)" }}>
              Post as
            </span>
            <div className="f-14" style={{ marginTop: -6 }}>
              Anonymous
            </div>
          </div>
          <Checkbox
            onChange={this.handleChange}
            value={this.state.IsAnonymous}
            name="IsAnonymous"
            className="ml-16 anonymous-check"
          ></Checkbox>
        </div>
      </div>
    );

    return (
      <div className="share-box">
        <div className="share-input" onClick={() => this.openpopup('Text')}>
          <span className="icon sharepost-icon" />
          <span >Start a post</span>
        </div>
        {/* <ul className="justify-content-around mb-0">
          {postsmenu.map((menu) => {
            return (
              <li key={menu.Id}>
                <Link
                  className="icon-animation"
                  onClick={() => this.openpopup(menu.Id)}
                >
                  <span className={menu.CssSprite}></span>
                  <p className="text-hover mb-0">{menu.Heading}</p>
                </Link>
              </li>
            );
          })}
        </ul> */}
        <Modal
          className="share-popup"
          title={
            <div className="custom-modal-header">
              <h4>{isEdit ? "Edit" : "Create"} a Post</h4>
              <a>
                <span className="close-icon" onClick={this.handleCancel}></span>
              </a>
            </div>
          }
          className="custom-popup"
          visible={visible}
          onOk={this.handleOk}
          footer={[
            <div className="d-flex justify-content-between">
              {/* <Button key="back" onClick={this.handleCancel} className="btn-cancel">
                            Close
                        </Button> */}
              <Button
                disabled={this.disablePostBtn()}
                type="primary"
                onClick={() => this.popupOk()}
              >
                Post
              </Button>
            </div>,
          ]}
          destroyOnClose
        >
          <div className="mb-24">{title}</div>
          {!this.props.groupData && ddlValue == "Groups" && (isEdit ? groupLu?.length > 0 : true) && <div className="mb-24 custom-fields" id="grouplu">
            <Select
              defaultValue=""
              name="Group"
              value={GroupName}
              onChange={(value) =>
                this.setFieldValue(value)
              }
              optionLabelProp="label"
              getPopupContainer={() => document.querySelector('#grouplu')}
            >
              <Option value="" label="Select Group">Select Group</Option>
              {groupLu.map((item, index) => {
                return (
                  <Option key={index} value={item.id} label={item.name}>
                    {this.renderSelectItem(item)}
                  </Option>
                );
              })}
            </Select></div>}
          {/* {ddlValue == "College" && <div className="mb-24 custom-fields">
            <Select
              defaultValue=" "
              name="College"
              value={this.state.CollgeName}
              onChange={(value) =>
                this.setFieldValue(value, 'College')
              }
              optionLabelProp="label"
            >
              <Option value=" " label="Select College">Select College</Option>
              {collegeLu.map((item, index) => {
                return (
                  <Option key={index} value={item.CollegeId} label={item.CollegeName}>
                    {this.renderSelectCollegeItem(item)}
                  </Option>
                );
              })}
            </Select></div>} */}
          <div className="upload-image">
            <form>
              <div className="title-img">
                <TextArea
                  placeholder={`What's on Your Mind?`}
                  autoSize={{ minRows: 1, maxRows: 6 }}
                  style={{ resize: "none", fontWeight: "400" }}
                  name="Message"
                  onChange={this.handleChange}
                  value={this.state.post.Message}
                  required={true}
                  maxLength={1306}
                />
              </div>
              {/* <div className="caption-image">
                                <TextArea
                                    placeholder={`What's on Your Mind?`}
                                    autoSize={{ minRows: 1, maxRows: 6 }}
                                    style={{ resize: 'none',fontSize:'20px' }}
                                    name="Message"
                                    onChange={this.handleChange}
                                    value={this.state.post.Message}
                                    required={true}
                                />
                            </div> */}
            </form>
          </div>
          <Divider dashed />
          {/* TAGS */}
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
                placeholder="Add hashtag"
                ref={this.saveInputRef}
                type="text"
                size="small"
                maxLength="50"
                style={{ width: 78 }}
                value={inputValue}
                onChange={this.handleInputChange}
                onBlur={this.handleInputConfirm}
                onPressEnter={this.handleInputConfirm}
              />
            )}
            {!inputVisible && (
              <Tag onClick={this.showInput} className="site-tag-plus">
                <PlusOutlined /> Add hashtag
              </Tag>
            )}
          </div>
          {this.renderUploadType(modal)}
          {!this.state.isEdit && <ul className="share-list">
            {NewPostMenu.map(menu => {
              return <Dragger
              key={menu.Id}
              className="upload"
              {...this.uploadProps}
              accept={fileTypes[menu.Id]}
  multiple={menu.Id === "Images" || menu.Id === "Docs" ? true : false}
              onRemove={() => this.setState({ ...this.state, uploadSources: [] })}
              showUploadList={false}
            > 
              <li onClick={()=>this.renderByClickIcon(menu.Id)}>
                <span className={menu.CssSprite}></span>
              </li>
              </Dragger>
            })}
          </ul>}
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = ({ oidc }) => {
  return { profile: oidc.profile, user: oidc.user };
};
export default connect(mapStateToProps)(ShareBox);
