import React, { Component } from "react";
import {
  Card, Button,
  Avatar,
  Typography,
  Tooltip,
  Input,
  Tag,
  Empty,
  Tabs,
  Spin,
  Modal,
  List,
  Skeleton
} from "antd";
import SideAction from "../components/postings/Actions/SideActions";
import Comments from "../components/postings/Comments/Comments";
import CommentAction from "../components/postings/Actions/CommentAction";
import ShareAction from "../components/postings/Actions/ShareActions";
import EmojiAction from "../components/postings/Actions/EmojiActions";

import zoom from '../../styles/images/zoom.jpg';
import live_session from '../../styles/images/live_session.png';
import {
  deletePost,
  fetchPostReactions,
  getPosts,
  saveActions,
  saveUserPosts,
  reportContent,
  pinUserPost
} from "../api/postsApi";
import FriendSuggestions from "../components/friendSuggestion";
import ShareBox from "../../components/SavePostBox/sharebox";
import Moment from "react-moment";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Loader from "../../common/loader";
import defaultUser from "../../styles/images/defaultuser.jpg";
import PostCardModal from "../components/postings/PostModal";
import notify from "../components/notification";
import { uuidv4 } from "../../utils";
import VisSenseFactory from "vissense";
import { postUpdation, updateSearchValue } from "../../reducers/auth";
import ShowMoreText from "react-show-more-text";
import { joinGroupNew, getIsFriend, sendFirendRequest, sendNotification } from "../api/apiServer";
import AllStories from "../components/stories";
const VisSense = VisSenseFactory(window);
const { Meta } = Card;
const { Paragraph } = Typography;
const { TabPane } = Tabs;
const { Title } = Typography;
let postObj = { tags: [], userdetails: {} };
class Postings extends Component {
  state = {
    allPosts: [],
    value: "",
    submitting: false,
    loading: true,
    commentselection: [],
    page: 1,
    pageSize: 5,
    showModal: false,
    reactionsLoading: false,
    loadMore: true,
    descriptionSelection: [],
    object: {},
    postEditData: {},
    IsYouSendRequest: false,
    IsFriend: false,
    RequestType: null
  };
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.loadPosts();
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    if (window.location.href.indexOf('search') < 0) {
      this.props.updateSearch()
    }

  }
  componentDidUpdate(prevProps) {
    if (prevProps.match?.params.key !== this.props.match?.params.key || prevProps.id !== this.props.id) {
      this.setState({ ...this.state, page: 1, allPosts: [] }, () => {
        this.loadPosts();
      })
    }
  }
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
    if (this.state.loadMore && !this.state.loading) {
      let { page } = this.state;
      page += 1;
      this.setState({ ...this.state, page, loading: true }, () => {
        this.loadPosts();
      });
    }
  }
  async loadPosts(isFromSave) {
    this.setState({ ...this.state, loading: true });
    const posts = await getPosts(
      this.props.userId ? this.props.userId : this.props?.profile?.Id,
      this.state.page,
      this.state.pageSize,
      this.props.postingsType,
      this.props.groupData?.GroupId,
      this.props.id,
      this.props.match?.params?.key,
      this.props.match?.params?.type,
    );
    let { allPosts } = this.state;
    if (!isFromSave) {
      allPosts = allPosts.concat(posts.data);
    } else {
      allPosts = posts.data;
    }
    if (posts.ok) {
      this.setState(
        {
          ...this.state,
          loading: false,
          allPosts,
          loadMore: posts.data.length === this.state.pageSize,
          commentselection: [],
        },
        () => {
          this.stopAudio();
          const videoElements = document.querySelectorAll("video");
          for (const i in videoElements) {
            if (typeof videoElements[i] == "object") {
              this.enableVideoAutoPlay(videoElements[i]);
            }
          }
          for (const k in allPosts) {
            if (allPosts[k].commentsCount > 0) {
              this.showComment(allPosts[k]);
            }
          }
        }
      );
    }
  }
  stopAudio = () => {
    const audioElemets = document.querySelectorAll("audio");
    for (const i in audioElemets) {
      if (typeof audioElemets[i] == "object") {
        audioElemets[i].pause();
      }
    }
  };

  enableVideoAutoPlay(myVideo) {
    var videoElementArea = VisSense(myVideo);
    var monitorBuilder = VisSense.VisMon.Builder(videoElementArea);
    monitorBuilder.on("fullyvisible", function () {
      myVideo.play(); // start playing the video (or keep playing)
    });
    monitorBuilder.on("hidden", function () {
      myVideo.pause();
    });
    var videoVisibilityMonitor = monitorBuilder.build();
    videoVisibilityMonitor.start();
  }
  titleAvatar = (user, date, isShareCard, mainUser, isGroup, post_type) => {
    const _key = isShareCard ? "share" : (isGroup ? "group" : "normal")
    const elements = {
      share: <span className="overflow-text text-secondary"> <Link
        to={
          this.props?.profile.Id == user.UserId
            ? "/profile/IsProfileTab"
            : "/profileview/" + user.UserId
        }
      ><span className="post-title">{user.Firstname}</span></Link> {isShareCard && <> Shared <Link
        to={"/profileview/" + mainUser.UserId}
      ><span className="post-title">{mainUser.Firstname}</span></Link> Post </>} </span>,
      group: <span className="overflow-text text-secondary"><Link
        to={
          this.props?.profile.Id == user?.UserId
            ? "/profile/IsProfileTab"
            : "/profileview/" + user?.UserId
        }
      ><span className="post-title">{user?.Firstname}</span></Link>{post_type === "Course" && " Added a course"}{<><span className="icon repost-icon mr-0 repost-arrow"></span><Link
        to={"/groupview/" + (mainUser.groupDetails ? (mainUser.groupDetails.GroupId) : mainUser?.GroupId)}
      ><span className="post-title">{mainUser?.Firstname}</span></Link></>}</span>,
      normal: <span className="overflow-text text-secondary"> <Link
        to={
          this.props?.profile.Id == user.UserId
            ? "/profile/IsProfileTab"
            : "/profileview/" + user.UserId
        }
      ><span className="post-title">{user.Firstname}</span></Link> </span>
    }
    return (
      <Meta
        avatar={<Avatar src={user.Image || defaultUser} />}
        title={
          elements[_key]
        }
        description={<Moment fromNow>{date}</Moment>}
      />

    );
  };
  closed = () => {
    this.setState({ showModal: false });
  };
  showModal = (post) => {
    postObj = post;
    this.setState({ showModal: true });
  };
  handleEvent = async (e, name, post) => {
    switch (name) {
      case "Delete":
        Modal.confirm({
          title: "Confirm",
          icon: "",
          content: "Are you sure want to delete post?",
          okText: "Ok",
          cancelText: "Cancel",
          onOk: () => this.deletePost(post),
        });
        //this.deletePost(post);
        break;
      case "Edit":
        this.editPost(post);
        break;
      case "Save Post":
        const obj = {
          Id: uuidv4(),
          PostId: post.id,
          UserId: this.props?.profile?.Id,
          CreatedDate: new Date(),
        };
        const saveResponse = await saveUserPosts(obj);
        if (saveResponse.ok) {
          notify({
            description: "Post saved in 'Saved Posts'",
            message: "Post save",
          });
        } else {
          notify({
            description: "Something went wrong'",
            message: "Error",
            type: "error",
          });
        }
        break;
      case "Report Post":
        const object = {
          ReportId: uuidv4(),
          ReferenceId: post.id,
          ReportUsers: [{
            "UserId": this.props?.profile?.Id,
            "Firstname": this.props?.profile?.FirstName,
            "Lastname": this.props?.profile?.LastName,
            "Email": this.props?.profile?.Email,
            "Image": this.props?.profile?.ProfilePic
          }],
          CreatedDate: new Date(),
          ReportType: "Posts"
        };
        const reportResponse = await reportContent(object);
        if (reportResponse.ok) {
          this.updatePost(post, 'IsReported', true)
          notify({
            description: "Post reported successfully",
            message: "Post Report",
          });
        } else {
          notify({
            description: "Something went wrong'",
            message: "Error",
            type: "error",
          });
        }
        break;
      case "Add Friend":
        this.addFriend(post);
        break;
      case "Pin Post":
        if (!post.IsPin) {
          const pinObject = {
            "PostId": post.id,
            "UserId": this.props?.profile?.Id,
            "IsPin": true,
          };
          const pinResponse = await pinUserPost(pinObject);
          if (pinResponse.ok) {
            notify({
              description: "Post pin  done successfully",
              message: "Pin Post",
            });
          } else {
            notify({
              description: "Something went wrong'",
              message: "Error",
              type: "error",
            });
          }
        }
        else {
          notify({
            description: "Post pin already done",
            message: "Pin Post",
          });
        }
        break;
      default:
        break;
    }
  };
  addFriend = async (post) => {
    const obj = {
      "UserId": this.props?.profile?.Id,
      "Firstname": this.props?.profile?.FirstName,
      "Lastname": this.props?.profile?.LastName,
      "Image": this.props?.profile?.ProfilePic,
      "Email": this.props?.profile?.Email,
      "Type": "request",
      "CreatedDate": new Date()
    }
    sendFirendRequest(post?.userdetails.UserId, obj).then(() => {
      this.checkWhetherFriendOrNot(post)
      sendNotification({ to: post?.userdetails.UserId, message: `${this.props?.profile?.FirstName} sent you friend request`, from: this.props?.profile?.Id });
      notify({ message: "Friend request", description: "Request sent successfully" });
    })
  }
  checkWhetherFriendOrNot = (post) => {
    if (post.userdetails.UserId)
      getIsFriend(this.props.profile?.Id, post?.userdetails.UserId).then(res => {
        let { IsFriend, IsYouSendRequest, RequestType } = this.state;
        IsFriend = res.data[0]?.IsFriend;
        IsYouSendRequest = res.data[0]?.IsYouSendRequest;
        RequestType = res.data[0]?.type
        this.setState({ ...this.state, IsFriend, IsYouSendRequest, RequestType });
      })
  }
  editPost = (post) => {
    this.sharebox.editPost(JSON.parse(JSON.stringify(post)));
    //json added for deep copy
  };
  handleCancel = () => {
    this.setState({ postEditData: {} });
  };
  dataRefreshed = (type) => {
    this.loadPosts(true);
    if (type === "Add")
      this.props.upadateProfile(this.props.profile, "Increment");
  };
  renderPostImages = (imageObj, type) => {
    const _result = {
      Image: () => {
        if (typeof imageObj != "string") {
          return (
            <div style={{ width: "100%", position: "relative" }}>
              <div class="images">
                {imageObj.map((image, index) => {
                  return (
                    <>
                      {index <= 3 ? (
                        <div
                          key={index}
                          className={
                            index === 0
                              ? "image-box single"
                              : "image-box img-" +
                              (imageObj.length <= 4 ? imageObj.length : 4)
                          }
                        >
                          <img src={image.Name || image} />
                        </div>
                      ) : null}
                    </>
                  );
                })}
                {imageObj.length > 4 ? (
                  <span class="more-images">+{imageObj.length - 4}</span>
                ) : null}
              </div>
            </div>
          );
        } else {
          return (
            <div style={{ width: "100%", position: "relative" }}>
              <div class="images">
                <div className={"image-box single"}>
                  <img src={imageObj} />
                </div>
              </div>
            </div>
          );
        }
      },
      Video: () => {
        return (
          <div className="video-post cursor-pointer">
            <video width="100%" controls controlsList="nodownload" muted>
              <source src={imageObj} />
            </video>
            {/* <div className="play"></div> */}
          </div>
        );
      },
      Text: () => {
        return null;
      },
      Docs: () => {
        return (
          <div className="docs">
            <List
              itemLayout="horizontal"
              dataSource={imageObj}
              renderItem={(item) => (
                <List.Item
                  onClick={(ev) => {
                    ev.stopPropagation();
                    window.open(item.url, "_blank");
                  }}
                  className="cursor-pointer"
                >
                  <List.Item.Meta
                    avatar={[
                      <span className={`doc-icons ${item.avatar}`}></span>,
                    ]}
                    title={item.title}
                    description={
                      <div className="file-size f-12">{item.fileSize}</div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        );
      },
      Audio: () => {
        return (
          <div
            style={{ width: "100%", position: "relative" }}
            onClick={() => this.stopAudio()}
            className="cursor-pointer"
          >
            <div class="audio">
              <AudioPlayer
                src={imageObj}
                onPlay={(e) => console.log("onPlay")}
                layout="horizontal-reverse"
              />
            </div>
          </div>
        );
      },
      Gif: () => {
        return (
          <div style={{ width: "100%", position: "relative" }}>
            <div class="images">
              <div className={"image-box gif"}>
                <img src={imageObj} />
              </div>
            </div>
          </div>
        );
      },
    };

    return imageObj ? (_result[type] ? _result[type]() : null) : null;
  };
  handleActions = async (event, type, post) => {
    event.stopPropagation();
    type = type === "Whistles" ? "Whistiles" : type;
    type = type === "Love" ? "Loves" : type;
    const { Id, ProfilePic, FirstName, Email, LastName } = this.props.profile;
    const saveObj = {
      UserId: Id,
      Firstname: FirstName,
      Lastname: LastName,
      Image: ProfilePic,
      Email: Email,
      Type: type,
    };
    const saveResponse = await saveActions(post.id, saveObj);
    if (saveResponse.ok) {
      let { allPosts } = this.state;
      for (let i in allPosts) {
        if (allPosts[i].id === post.id) {
          if (allPosts[i].IsUserLikes && type == allPosts[i].UserLikesType) {
            const _type = allPosts[i].UserLikesType
              ? allPosts[i].UserLikesType.toLowerCase()
              : "likes";
            if (allPosts[i][_type] > 0) {
              allPosts[i][_type] = allPosts[i][_type] - 1;
              allPosts[i].UserLikesType = null;
            }
            allPosts[i].IsUserLikes = !allPosts[i].IsUserLikes;
          } else {
            if (allPosts[i].IsUserLikes) {
              const _type = allPosts[i].UserLikesType.toLowerCase();
              allPosts[i][_type] = allPosts[i][_type] - 1;
            } else {
              allPosts[i].IsUserLikes = !allPosts[i].IsUserLikes;
            }
            allPosts[i][type.toLowerCase()] = allPosts[i][type.toLowerCase()]
              ? allPosts[i][type.toLowerCase()] + 1
              : 1;
            allPosts[i].UserLikesType = type;
          }
          postObj = allPosts[i]; //added for re usablity code
        }
      }
      this.setState({ ...this.state, allPosts });
    } else {
      notify({
        message: "Error",
        description: "Something went wrong :)",
        type: "error",
      });
    }
  };
  fetchCardActions = (post, fndDetail) => {
    const ownerActions = [
      {
        action: "Edit",
        icons: "post-icons edit-icon",
        subTitle: "Edit your post",
      },
      {
        action: "Delete",
        icons: "post-icons delete-icon",
        subTitle: "Delete your post",
      },
    ];
    const groupActions = [
      {
        action: "Delete",
        icons: "post-icons delete-icon",
        subTitle: "Delete your post",
      },
    ];
    const actionsList = [
      {
        action: "Save Post",
        icons: "post-icons savepost-icon",
        subTitle: "Save this item for later",
      },
      {
        action: "Report Post",
        icons: "post-icons report-icon",
        subTitle: "Report this item",
      },
      // {
      //   action: "Turn on Notifications",
      //   icons: "post-icons notify-icon",
      //   subTitle: "Keep notify from this user",
      // },
    ];
    if (this.props.postingsType === "saved") {
      return [
        {
          action: "Delete",
          icons: "post-icons delete-icon",
          subTitle: "Delete from saved posts",
        },
      ];
    }
    const SuperAdminList = [
      {
        action: "Pin Post",
        icons: "post-icons pinpost-icon",
        subTitle: "Pin this item for later",
      },
    ];
    let result =
      post.userdetails.UserId === this.props.profile.Id
        ? ownerActions.concat(actionsList)
        : this.props.postingsType === "group" && this.props.groupData?.IsAdmin
          ? groupActions.concat(actionsList)
          : actionsList;
    if (post.userdetails.UserId !== this.props.profile.Id && post.userdetails.UserId) {
      result = fndDetail && !fndDetail.IsFriend ? ((fndDetail.IsYouSendRequest && fndDetail.RequestType) ? result.concat([{
        action: "Request Sent",
        icons: "post-icons requestsent-grey",
        subTitle: "Friend Request Sent",
      }]) : result.concat([{
        action: "Add Friend",
        icons: "post-icons addfriend-icon-grey",
        subTitle: "To send friend request",
      }])) : result;
    }
    result = (this.props.profile.Role == "Super Admin" && post.userdetails.UserId == this.props.profile.Id) ? result.concat(SuperAdminList) : result;
    result = (post.IsReported || this.props.postingsType == "user" || post.userdetails.UserId === this.props.profile.Id) ? result.filter(action => action.action !== "Report Post") : result;
    return result;
  };
  deletePost = (post) => {
    if (this.props?.onPostDelete) {
      this.props.onPostDelete(post);
    } else {
      deletePost(post.id, this.props?.profile?.Id).then(() => {
        let { allPosts } = this.state;
        allPosts = allPosts.filter((item) => item.id !== post.id);
        this.setState({ ...this.state, allPosts, showModal: false });
        notify({ message: "Delete", description: "Post deleted successfully" });
        this.props.upadateProfile(this.props.profile, "Decrement");
      });
    }
  };
  fetchPostReactions = async (id) => {
    this.setState({ ...this.state, reactionsLoading: true });
    let actions = {};
    const reactionsResponse = await fetchPostReactions(id);
    if (reactionsResponse.ok) {
      const data = reactionsResponse.data[0].Likes;
      actions = {
        Likes: data.filter((item) => item.Type === "Likes"),
        Claps: data.filter((item) => item.Type === "Claps"),
        Loves: data.filter((item) => item.Type === "Loves"),
        Whistiles: data.filter((item) => item.Type === "Whistiles"),
        PostActions: data.filter(
          (item) =>
            item.Type === "Likes" ||
            item.Type === "Claps" ||
            item.Type === "Loves" ||
            item.Type === "Whistiles"
        ),
      };
      this.setState({ reactionsLoading: false, postReactions: actions });
    }
  };
  renderShareCard = (post) => {
    let { IsFriend, IsYouSendRequest, RequestType } = this.state;
    return <Card title={this.titleAvatar(post.userdetails, post.date, true, post.Shares[0], false, post.PostType)}
      bordered={true}
      extra={
        <SideAction
          checkFriend={() => this.checkWhetherFriendOrNot(post)}
          clickedEvent={(event, name) =>
            this.handleEvent(event, name, post)
          }
          actionsList={(IsFriend || IsYouSendRequest || RequestType) ? this.fetchCardActions(post, { IsFriend: IsFriend, IsYouSendRequest: IsYouSendRequest, RequestType: RequestType }) : this.fetchCardActions(post)}
        />
      }
      actions={[
        <EmojiAction
          IsUserLikes={post.IsUserLikes}
          key="emoji"
          mystate={post}
          clickedEvent={(event, name) =>
            this.handleActions(event, name, post)
          }
        />,
        <CommentAction
          key="comment"
          clickedEvent={() => this.showComment(post)}
        />,
        <ShareAction post={post} key="share" url={`${process.env.REACT_APP_HOSTURL}post/${post.id}`} imgUrl={post.image} />
      ]}>
      {post.PostType === "Course" ? this.renderCourseCard(post) : <Card
        className="m-12 mt-0 mb-0" title={this.titleAvatar(post.Shares[0], post.Shares[0]?.CreatedDate, false, { ...post.Shares[0]?.groupDetails ? post.Shares[0]?.groupDetails : post.Group, Firstname: post.Shares[0]?.groupDetails ? post.Shares[0]?.groupDetails?.GroupName : post.Group?.GroupName }, (post.Group?.GroupId ? true : false), post.PostType)}
      >
        {/* <Title level={5} className="post-title">{post.title}</Title> */}
        <Paragraph className="post-desc">
          <ShowMoreText lines={3} more="see more" less="see less">
            {post.meassage}
          </ShowMoreText>
          {post.tags != null && post.tags?.length > 0 && (
            <div className="post-tag">
              {post.tags?.map((tag, index) => {
                return (
                  <>
                    {tag != undefined && tag != null && (
                      <Tag key={index}>
                        <Link to={`search/${(tag?.Name || tag).replace("#", "")}/Tags`}>{`${(tag?.Name || tag).startsWith("#") ? "" : "#"
                          }${tag?.Name || tag || ""}`}</Link>
                      </Tag>
                    )}
                  </>
                );
              })}
            </div>
          )}
        </Paragraph>

        <Card.Meta
          className="post-image"
          avatar={
            <div onClick={post.type !== 'text' && post.type !== 'Docs' ? () => this.showModal(post) : ''}>
              {this.renderPostImages(post.image, post.type, post)}
            </div>
          }
        ></Card.Meta>

      </Card>
      } <div className="d-flex justify-content-between mx-16 pt-8 pb-16">
        {
          <span onMouseEnter={() => this.fetchPostReactions(post.id)}>
            <ul className="card-actions-count pl-0">
              {post.likes > 0 && (
                <Tooltip
                  overlayClassName="like-tabs"
                  title={
                    <div>
                      {this.state.reactionsLoading ? (
                        <Spin />
                      ) : (
                          <div className="likes-counters">
                            <h4>Likes</h4>
                            {this.state.postReactions?.Likes?.map(
                              (item, indx) => (
                                <p key={indx}>{item.Firstname}</p>
                              )
                            )}{" "}
                          </div>
                        )}{" "}
                    </div>
                  }
                >
                  <li>
                    <span className="counter-icon likes cursor-pointer"></span>
                  </li>
                </Tooltip>
              )}
              {post.loves > 0 && (
                <Tooltip
                  overlayClassName="like-tabs"
                  title={
                    <div>
                      {this.state.reactionsLoading ? (
                        <Spin />
                      ) : (
                          <div className="likes-counters">
                            <h4>Loves</h4>{" "}
                            {this.state.postReactions?.Loves?.map(
                              (item, indx) => (
                                <p key={indx}>{item.Firstname}</p>
                              )
                            )}{" "}
                          </div>
                        )}{" "}
                    </div>
                  }
                >
                  <li>
                    <span className="counter-icon loves cursor-pointer"></span>
                  </li>
                </Tooltip>
              )}
              {post.claps > 0 && (
                <Tooltip
                  overlayClassName="like-tabs"
                  title={
                    <div>
                      {this.state.reactionsLoading ? (
                        <Spin />
                      ) : (
                          <div className="likes-counters">
                            <h4>Claps</h4>
                            {this.state.postReactions?.Claps?.map(
                              (item, indx) => (
                                <p key={indx}>{item.Firstname}</p>
                              )
                            )}{" "}
                          </div>
                        )}
                    </div>
                  }
                >
                  <li>
                    <span className="counter-icon claps cursor-pointer"></span>
                  </li>
                </Tooltip>
              )}
              {post.whistiles > 0 && (
                <Tooltip
                  overlayClassName="like-tabs"
                  title={
                    <div>
                      {this.state.reactionsLoading ? (
                        <Spin />
                      ) : (
                          <div className="likes-counters">
                            <h4>Whistles</h4>{" "}
                            {this.state.postReactions?.Whistiles?.map(
                              (item, indx) => (
                                <p key={indx}>{item.Firstname}</p>
                              )
                            )}{" "}
                          </div>
                        )}
                    </div>
                  }
                >
                  <li>
                    <span className="counter-icon whistles cursor-pointer"></span>
                  </li>
                </Tooltip>
              )}
              {(post.loves || 0) +
                (post.claps || 0) +
                (post.whistiles || 0) +
                (post.likes || 0) >
                0 && (
                  <Tooltip
                    overlayClassName="like-tabs"
                    title={
                      <div className="likes-counters">
                        {this.state.reactionsLoading ? (
                          <Spin />
                        ) : (
                            <div>
                              {" "}
                              {this.state.postReactions?.PostActions?.map(
                                (item, indx) => (
                                  <p key={indx}>{item.Firstname}</p>
                                )
                              )}{" "}
                            </div>
                          )}
                      </div>
                    }
                  >
                    {" "}
                    <li>
                      <a>
                        {" "}
                        {(post.loves || 0) +
                          (post.claps || 0) +
                          (post.whistiles || 0) +
                          (post.likes || 0)}
                      </a>
                    </li>
                  </Tooltip>
                )}
            </ul>
          </span>
        }
        <ul className="card-actions-count">
          {/* {(post.likes != null && post?.likes != 0) && <li><span></span>{post.likes} <span> Likes</span></li>} */}
          {post.commentsCount != null && (
            <li
              className="mr-0 cursor-pointer"
              onClick={() => this.showComment(post)}
            >
              <span></span>
              {post.commentsCount} <span> Comments</span>
            </li>
          )}
          {/* <li><span></span>2 <span> Shares</span></li> */}
        </ul>
      </div>
    </Card>
  }
  renderCommonCard = (post) => {
    let { IsFriend, IsYouSendRequest, RequestType } = this.state;
    return <Card
      title={this.titleAvatar(post.userdetails, post.date, false, { ...post.Group, Firstname: post.Group?.GroupName, }, (post.Group?.GroupId ? true : false), post.PostType)}
      bordered={true}
      extra={
        <SideAction
          checkFriend={() => this.checkWhetherFriendOrNot(post)}
          clickedEvent={(event, name) =>
            this.handleEvent(event, name, post)
          }
          actionsList={(IsFriend || IsYouSendRequest || RequestType) ? this.fetchCardActions(post, { IsFriend: IsFriend, IsYouSendRequest: IsYouSendRequest, RequestType: RequestType }) : this.fetchCardActions(post)}
        />
      }
      actions={[
        <EmojiAction
          IsUserLikes={post.IsUserLikes}
          key="emoji"
          mystate={post}
          clickedEvent={(event, name) =>
            this.handleActions(event, name, post)
          }
        />,
        <CommentAction
          key="comment"
          clickedEvent={() => this.showComment(post)}
        />,
        <ShareAction post={post} key="share" url={`${process.env.REACT_APP_HOSTURL}post/${post.id}`} imgUrl={post.image} />
      ]}
    // cover={<div onClick={() => this.showModal(post)}>{this.renderPostImages(post.image, post.type, post)}</div>}
    >
      {/* <Title level={5} className="post-title">{post.title}</Title> */}

      {post.PostType === "Course" ? this.renderCourseCard(post) : <><Paragraph className="post-desc">
        <ShowMoreText lines={3} more="see more" less="see less">
          {post.meassage}
        </ShowMoreText>
        {post.tags != null && post.tags?.length > 0 && (
          <div className="post-tag">
            {post.tags?.map((tag, index) => {
              return (
                <>
                  {tag != undefined && tag != null && (
                    <Tag key={index}>
                      <Link to={`search/${(tag?.Name || tag).replace("#", "")}/Tags`}>{`${(tag?.Name || tag).startsWith("#") ? "" : "#"
                        }${tag?.Name || tag || ""}`}</Link>
                    </Tag>
                  )}
                </>
              );
            })}
          </div>
        )}
      </Paragraph>

        <Card.Meta
          className="post-image"
          avatar={
            <div onClick={post.type !== 'text' && post.type !== 'Docs' ? () => this.showModal(post) : ''}>
              {this.renderPostImages(post.image, post.type, post)}
            </div>
          }
        ></Card.Meta>
      </>}
      <div className="d-flex justify-content-between mx-16 pt-8 pb-12">
        {
          <span onMouseEnter={() => this.fetchPostReactions(post.id)}>
            <ul className="card-actions-count pl-0">
              {post.likes > 0 && (
                <Tooltip
                  overlayClassName="like-tabs"
                  title={
                    <div>
                      {this.state.reactionsLoading ? (
                        <Spin />
                      ) : (
                          <div className="likes-counters">
                            <h4>Likes</h4>
                            {this.state.postReactions?.Likes?.map(
                              (item, indx) => (
                                <p key={indx}>{item.Firstname}</p>
                              )
                            )}{" "}
                          </div>
                        )}{" "}
                    </div>
                  }
                >
                  <li>
                    <span className="counter-icon likes cursor-pointer"></span>
                  </li>
                </Tooltip>
              )}
              {post.loves > 0 && (
                <Tooltip
                  overlayClassName="like-tabs"
                  title={
                    <div>
                      {this.state.reactionsLoading ? (
                        <Spin />
                      ) : (
                          <div className="likes-counters">
                            <h4>Loves</h4>{" "}
                            {this.state.postReactions?.Loves?.map(
                              (item, indx) => (
                                <p key={indx}>{item.Firstname}</p>
                              )
                            )}{" "}
                          </div>
                        )}{" "}
                    </div>
                  }
                >
                  <li>
                    <span className="counter-icon loves cursor-pointer"></span>
                  </li>
                </Tooltip>
              )}
              {post.claps > 0 && (
                <Tooltip
                  overlayClassName="like-tabs"
                  title={
                    <div>
                      {this.state.reactionsLoading ? (
                        <Spin />
                      ) : (
                          <div className="likes-counters">
                            <h4>Claps</h4>
                            {this.state.postReactions?.Claps?.map(
                              (item, indx) => (
                                <p key={indx}>{item.Firstname}</p>
                              )
                            )}{" "}
                          </div>
                        )}
                    </div>
                  }
                >
                  <li>
                    <span className="counter-icon claps cursor-pointer"></span>
                  </li>
                </Tooltip>
              )}
              {post.whistiles > 0 && (
                <Tooltip
                  overlayClassName="like-tabs"
                  title={
                    <div>
                      {this.state.reactionsLoading ? (
                        <Spin />
                      ) : (
                          <div className="likes-counters">
                            <h4>Whistles</h4>{" "}
                            {this.state.postReactions?.Whistiles?.map(
                              (item, indx) => (
                                <p key={indx}>{item.Firstname}</p>
                              )
                            )}{" "}
                          </div>
                        )}
                    </div>
                  }
                >
                  <li>
                    <span className="counter-icon whistles cursor-pointer"></span>
                  </li>
                </Tooltip>
              )}
              {(post.loves || 0) +
                (post.claps || 0) +
                (post.whistiles || 0) +
                (post.likes || 0) >
                0 && (
                  <Tooltip
                    overlayClassName="like-tabs"
                    title={
                      <div className="likes-counters">
                        {this.state.reactionsLoading ? (
                          <Spin />
                        ) : (
                            <div>
                              {" "}
                              {this.state.postReactions?.PostActions?.map(
                                (item, indx) => (
                                  <p key={indx}>{item.Firstname}</p>
                                )
                              )}{" "}
                            </div>
                          )}
                      </div>
                    }
                  >
                    {" "}
                    <li>
                      <a>
                        {" "}
                        {(post.loves || 0) +
                          (post.claps || 0) +
                          (post.whistiles || 0) +
                          (post.likes || 0)}
                      </a>
                    </li>
                  </Tooltip>
                )}
            </ul>
          </span>
        }
        <ul className="card-actions-count">
          {/* {(post.likes != null && post?.likes != 0) && <li><span></span>{post.likes} <span> Likes</span></li>} */}
          {post.commentsCount != null && (
            <li
              className="mr-0 cursor-pointer"
              onClick={() => this.showComment(post)}
            >
              <span></span>
              {post.commentsCount} <span> Comments</span>
            </li>
          )}
          {/* <li><span></span>2 <span> Shares</span></li> */}
        </ul>
      </div>
    </Card>
  }
  renderCourseCard = (post) => {
    const liveIcon = {
      Zoom: zoom,
      GotoMeeting: live_session,
      Others: live_session
    }
    return <>{post.CourseType === "Live Session" ? <div className="livecourse-card mx-16">
      <div className="p-relative">
        <img onClick={() => { window.open(process.env.REACT_APP_HOSTURL + `course/${post.CourseId}`, "_blank") }} width="100%" height="240" src={liveIcon[post.UrlType]} className="zoom-img" />
        <div className="live-btn-hover d-flex align-items-center">
          <a className="f-24 semibold" onClick={() => { window.open(process.env.REACT_APP_HOSTURL + `course/${post.CourseId}`, "_blank") }}>Join Live Session</a>
        </div>
      </div>
      <div className="course-create p-12 d-flex xs-flex-col justify-between">
        <div className="d-flex align-items-center">
          <Avatar src={post.Author !== null ? post.Author[0].Image : defaultUser} className="mr-8" />
          <p className="m-0 f-14">{post.Author !== null && `${post.Author[0]?.Firstname} ${post.Author[0]?.Lastname}`}</p>
        </div>
        <div className="livecourse-date py-8 px-16">
          <Moment className="f-16 semibold mr-16 text-primary" format={"DD/MM/YYYY HH:MM"}>{post.LiveDate}</Moment>
          <Moment className="f-16 semibold text-secondary" fromNow>{post.LiveDate}</Moment>
        </div>
        {/* <Button type="primary" onClick={() => { window.open(post.Link, "_blank") }}>Join Live</Button> */}
      </div>
    </div> : <div className="livecourse-card mx-16">
        {post.type === "Video" && <video width="100%" controls controlsList="nodownload" muted className="coursevideo-card">
          <source src={post.image[0]} />
        </video>}
        <div className="course-create p-12">
          <Title level={5} className="mb-4 text-dark">{post.title}</Title>
          <ShowMoreText lines={3} more="see more" less="see less" className="text-primary">
            {post.meassage}
          </ShowMoreText>
          <div className="course-create d-flex mt-16 justify-between">
            <div className="d-flex align-items-center">
              <Avatar src={post.Author !== null ? post.Author[0].Image : defaultUser} className="mr-8" />
              <p className="m-0 f-14">{post.Author !== null && `${post.Author[0]?.Firstname} ${post.Author[0]?.Lastname}`}</p>
            </div>
            <Button type="primary" onClick={() => this.joinCourse(post.CourseId)}>Join Course</Button>
          </div>
        </div>
      </div>}</>
  }
  renderPost = (post) => {
    return (
      <div
        className={`post-card ${this.state.commentselection.indexOf(post.id) > -1
          ? "comment-show"
          : ""
          }`}
      >
        {post.Shares && post.Shares.length !== 0 ? this.renderShareCard(post) : this.renderCommonCard(post)}
        {/* {this.renderCourseCard(post)} */}
        {this.state.commentselection.indexOf(post.id) > -1 && (
          <Comments
            onUpdate={(prop, value) => {
              this.updatePost(post, prop, value);
            }}
            count={post.commentsCount}
            postId={post.id}
            object={this.state.object}
            userId={post.userdetails?.UserId}
          />
        )}
        {/* {post.type !== 'text' && <PostCardModal postData={postObj} visible={this.state.showModal} closed={() => this.closed()} handleEvent={(e, name, post) => this.handleEvent(e, name, post)} handleActions={(event, type, post) => this.handleActions(event, type, post)} updatePost={(event, type, post) => this.updatePost(event, type, post)} />} */}
      </div>
    );
  };
  showComment = (post) => {
    const { commentselection } = this.state;
    const idx = commentselection.indexOf(post.id);
    if (idx > -1) {
      commentselection.splice(idx, 1);
    } else {
      commentselection.push(post.id);
    }
    this.setState({ ...this.state, commentselection });
  };
  updatePost = (post, prop, value, object) => {
    let { allPosts } = this.state;
    for (let i in allPosts) {
      if (allPosts[i].id === post.id) {
        allPosts[i][prop] = value;
      }
    }
    if (object) {
      this.setState({ ...this.state, allPosts, object: object });
    } else {
      this.setState({ ...this.state, allPosts });
    }
  };
  seeMore = (post) => {
    let { descriptionSelection } = this.state;
    const idx = descriptionSelection.indexOf(post.id);
    if (idx > -1) {
      descriptionSelection.splice(idx, 1);
    } else {
      descriptionSelection.push(post.id);
    }
    this.setState({ ...this.state, descriptionSelection });
  };
  joinCourse = (id) => {
    const obj = {
      "UserId": this.props?.profile?.Id,
      "Firstname": this.props?.profile?.FirstName,
      "Lastname": this.props?.profile?.LastName,
      "Email": this.props?.profile?.Email,
      "Image": this.props?.profile?.ProfilePic
    }
    joinGroupNew(id, obj).then(res => {
      if (res.ok) {
        notify({ message: "Join Course", description: "You have joined to course" });
      } else {
        notify({ message: "Join Course", description: JSON.stringify(res.originalError), type: "error" });
      }
    })
  }
  render() {
    return (
      <div onScroll={this.handleScroll}>
        {this.props.stories && <AllStories/>}
        {this.props.sharebox && (
          <ShareBox
            dataRefreshed={(type) => this.dataRefreshed(type)}
            onRef={(sharebox) => (this.sharebox = sharebox)}
            handleCancel={() => this.handleCancel()}
            groupData={this.props.groupData ? this.props.groupData : null}
          />
        )}
        {this.props.friendsSuggestions && <FriendSuggestions />}
        {this.state.allPosts?.map((post, indx) => this.renderPost(post))}
        {this.state.loading && <div className="post-card-skelton" >
          <div className="post-card-header-skelton">
            <Skeleton.Avatar active shape='circle' />
            <Skeleton active paragraph={{ rows: 1 }} />
          </div>
          <div className="post-card-body-skelton">
            <Skeleton.Avatar active shape='square' />
          </div>
          <div className="post-card-footer-skelton d-flex">
            <Skeleton.Button active shape='square' />
            <Skeleton.Button active shape='square' />
            <Skeleton.Button active shape='square' />
          </div>
        </div>}
        {!this.state.loading &&
          (!this.state.allPosts || this.state.allPosts?.length == 0) && (
            <Empty />
          )}
        <PostCardModal
          postData={postObj}
          visible={this.state.showModal}
          closed={() => this.closed()}
          handleEvent={(e, name, post) => this.handleEvent(e, name, post)}
          handleActions={(event, type, post) =>
            this.handleActions(event, type, post)
          }
          updatePost={(event, type, post, object) => {
            this.updatePost(event, type, post, object);
          }}
          fetchCardActions={(post) => this.fetchCardActions(post)}
        />

      </div>
    );
  }
}
const mapStateToProps = ({ oidc }) => {
  return { profile: oidc.profile };
};
const mapDispatchToProps = (dispatch) => {
  return {
    upadateProfile: (info, type) => {
      dispatch(postUpdation(info, type));
    },
    updateSearch: () => {
      dispatch(updateSearchValue(null));
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Postings);
