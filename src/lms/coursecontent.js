import React, { Component } from "react";
import {
  Card,
  List,
  Row,
  Col,
  Carousel,
  Collapse,
  Avatar,
  Empty,
  Tooltip,
  Typography,
  Divider,
  Button,
} from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import "../index.css";
import "../App.css";
import OverView from "./overview";
import defaultUser from "../styles/images/defaultuser.jpg";
import moment from "moment";
import { Link, withRouter } from "react-router-dom";
import gotomeeting from "../styles/images/gotomeeting.svg";
import zoom from "../styles/images/zoom.svg";
import others from "../styles/images/others.svg";
import {
  fetchCourseDetails,
  getCourseMembersList,
  getRecommendedVideos,
  getUserWatchedVideos,
  lmsJoinCourse,
  saveCourseTopic,
} from "./api";
import { connect } from "react-redux";
import Moment from "react-moment";
import ShowMoreText from "react-show-more-text";
import video from "../styles/images/default-video.jpg";
import Loader from "../common/loader";
import notify from "../shared/components/notification";

const { Panel } = Collapse;
const { Title, Paragraph } = Typography;
class CourseContent extends Component {
  state = {
    courseDetails: {},
    loading: false,
    selectedVideo: null,
    watchedVideos: [],
    IsRenderType: null,
    IsVideoSource: null,
    lstDocuments: [],
    IsChecked: false,
    Members: [],
    size: 10,
    page: 1,
    pageSize: 1,
    recommendedVideos: [],
    selectedTopicid: null,
    loadMore: true,
  };
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.loadCourseDetails();
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  componentDidUpdate(previewProps) {
    if (previewProps.match.params.id != this.props.match.params.id) {
      this.setState({ ...this.state, recommendedVideos: [] }, () => {
        this.loadCourseDetails();
      });
    }
  }
  loadCourseDetails = async () => {
    this.setState({ ...this.state, loading: true });
    const response = await fetchCourseDetails(
      this.props.match.params.id,
      this.props.profile?.Id
    );
    if (response.ok) {
      this.getUserWatchedVideos();
      response.data[0].LiveDetails = response.data[0].LiveDetails.filter((item) => {
        return moment(new Date(item.Date)).format('YYYY-MM-DDT00:00:00') == moment(new Date()).format('YYYY-MM-DDT00:00:00');
      });
      this.setState(
        {
          ...this.state,
          courseDetails: response.data[0],
          selectedVideo:
            response.data.length > 0 ? response.data[0].CourseVideo[0] : null,
          loading: false,
        },
        () => {
          if (this.state.courseDetails.IsMember) {
            this.getMembersList();
            this.getRecommendedVideos();
          }
        }
      );
    } else {
      this.setState({ ...this.state, loading: false }, () => {
        notify({
          message: "Error",
          type: "error",

          description: "Something went wrong",
        });
      });
    }
  };
  showMore = () => {
    let { pageSize } = this.state;
    pageSize += 1;
    this.setState({ ...this.state, pageSize }, () => {
      this.getMembersList();
    });
  };
  getMembersList = async () => {
    const response = await getCourseMembersList(
      this.props.match.params.id,
      this.state.pageSize,
      this.state.size
    );
    let { Members } = this.state;
    Members = Members.concat(response.data);
    if (response.ok) {
      this.setState({ ...this.state, Members });
    }
  };
  getRecommendedVideos = async () => {
    this.setState({ ...this.state, loading: true });
    const response = await getRecommendedVideos(
      this.props.match.params.id,
      this.state.page,
      this.state.size
    );
    let { recommendedVideos } = this.state;
    recommendedVideos = recommendedVideos.concat(response.data);
    if (response.ok) {
      this.setState({
        ...this.state,
        recommendedVideos,
        loading: false,
        loadMore: response.data.length === this.state.size,
      });
    } else {
      this.setState({ ...this.state, loading: false }, () => {
        notify({
          message: "Error",
          type: "error",

          description: "Something went wrong",
        });
      });
    }
  };
  getUserWatchedVideos = async () => {
    const response = await getUserWatchedVideos(
      this.props.match.params.id,
      this.props.profile?.Id
    );
    if (response.ok) {
      let { courseDetails } = this.state;
      courseDetails.CourseSections.forEach((item, index) => {
        item.Topics.forEach((topic) => {
          response.data.forEach((watchTopic) => {
            if (
              watchTopic.TopicId == topic.TopicId &&
              watchTopic.SectionId == item.SectionId
            ) {
              topic.IsChecked = true;
            }
          });
        });
      });

      this.setState({
        ...this.state,
        watchedVideos: response.data,
        courseDetails,
      });
    }
  };
  setVideoSource = async (section, item, indx, index) => {
    this.setState({ ...this.state, selectedTopicid: item.TopicId });
    const object = {
      CourseId: this.props.match.params.id,
      SectionId: section.SectionId,
      TopicId: item.TopicId,
      UserId: this.props?.profile?.Id,
      IsView: true,
      CreatedDate: new Date(),
    };
    const saveResponse = await saveCourseTopic(object);
    if (saveResponse.ok) {
      if (item.TopicType === "Video") {
        let { courseDetails } = this.state;
        courseDetails.CourseSections[indx].Topics[index].IsChecked = true;
        this.setState(
          {
            ...this.state,
            IsRenderType: item.TopicType,
            IsVideoSource: item.VideoSource,
            selectedVideo:
              item.VideoSource === "Upload" ? item.VideoUrl[0] : item.VideoUrl,
            courseDetails,
          },
          () => {
            this.getUserWatchedVideos();
            if (item.VideoSource === "Upload") {
              document.querySelector("video").play();
            }
          }
        );
      } else {
        this.setState({
          ...this.state,
          IsRenderType: item.TopicType,
          IsVideoSource: item.VideoSource,
          lstDocuments: item.lstDocuments,
        });
      }
    }
  };
  reloadCourse = (item) => {
    this.props.history.push(`/course/${item.CourseId}`);
  };
  joinCourse = async () => {
    this.setState({ ...this.state, loading: true });
    const obj = {
      UserId: this.props.profile?.Id,
      Firstname: this.props.profile?.FirstName,
      Lastname: this.props.profile?.LastName,
      Image: this.props.profile?.ProfilePic,
      Email: this.props.profile?.Email,
    };
    const joinResponse = await lmsJoinCourse(this.props.match.params.id, obj);
    if (joinResponse.ok) {
      this.loadCourseDetails();
    }
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
  loadMore() {
    if (this.state.loadMore && !this.state.loading) {
      let { page } = this.state;
      page += 1;
      this.setState({ ...this.state, page, loading: true }, () => {
        this.getRecommendedVideos();
      });
    }
  }

  render() {
    const { courseDetails, Members, size, recommendedVideos } = this.state;
    return (
      <>
        {Object.keys(courseDetails).length > 0 && (
          <div
            className="post-preview-box course-card"
            onScroll={this.handleScroll}
          >
            <Row gutter={24} className="py-16">
              <Col className="" xs={24} sm={16} md={16} lg={17}>
                <div className="card-background p-0 mb-12">
                  <div className="preview-image">
                    <Title
                      level={4}
                      className="p-12 semibold mb-4 text-primary"
                    >
                      {this.state.courseDetails.GroupName}
                    </Title>
                    <Carousel>
                      {courseDetails.CourseType === "Live Session" && (
                        <div className="px-12">
                          <div className="custom-card mb-16 mt-8">
                            {/* Gotomeeting */}
                            {courseDetails.UrlType === "GotoMeeting" &&
                              courseDetails.LiveDetails?.map((course, indx) => {
                                return (
                                  <>
                                  <span>{moment(course.Date).format('LLL')}</span>
                                  <Card
                                    className="start-gotomeeting"
                                    key={indx}
                                  >
                                    <Row align="middle" className="p-16">
                                      <Col
                                        xs={18}
                                        sm={18}
                                        md={18}
                                        lg={18}
                                        xl={18}
                                        xxl={18}
                                        className="pr-16"
                                      >
                                        <div>
                                          <img src={gotomeeting} />
                                        </div>
                                      </Col>
                                      <Col
                                        xs={6}
                                        sm={6}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                        xxl={6}
                                        className="text-right"
                                      >
                                        <Button
                                          type="dashed"
                                          key="console"
                                          disabled={new Date(course.Date) >= new Date()}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(course.Link);
                                          }}
                                        >
                                          Join Session
                                        </Button>
                                      </Col>
                                    </Row>
                                  </Card>
                                  </> 
                                );
                              })}
                            {/* Zoom */}
                            {courseDetails.UrlType === "Zoom" &&
                              courseDetails.LiveDetails?.map((course, indx) => {
                                return <>
                                <span className="zoomcard-date">{moment(course.Date).format('LLL')}</span>
                                <Card className="start-zoom" style={{marginBottom:'24'}} key={indx}>
                                  <Row align="middle" className="p-16 ">
                                    <Col
                                      xs={18}
                                      sm={18}
                                      md={18}
                                      lg={18}
                                      xl={18}
                                      xxl={18}
                                      className="pr-16"
                                    >
                                      <div>
                                        <img src={zoom} />
                                      </div>
                                    </Col>
                                    <Col
                                      xs={6}
                                      sm={6}
                                      md={6}
                                      lg={6}
                                      xl={6}
                                      xxl={6}
                                      className="text-right"
                                    >
                                      <Button
                                        type="dashed"
                                        key="console"
                                        disabled={new Date(course.Date) >= new Date()}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          window.open(course.Link);
                                        }}
                                      >
                                        Join Session
                                      </Button>
                                    </Col>
                                  </Row>
                                </Card>
                                </>
                              })}
                            {/* Others */}
                            {courseDetails.UrlType === "Others" &&
                              courseDetails.LiveDetails?.map((course, indx) => {
                                return <>
                                <span>{moment(course.Date).format('LLL')}</span>
                                <Card className="start-others" key={indx}>
                                  <Row align="middle" className="p-16">
                                    <Col
                                      xs={18}
                                      sm={18}
                                      md={18}
                                      lg={18}
                                      xl={18}
                                      xxl={18}
                                      className="pr-16"
                                    >
                                      <div>
                                        <img src={others} />
                                      </div>
                                    </Col>
                                    <Col
                                      xs={6}
                                      sm={6}
                                      md={6}
                                      lg={6}
                                      xl={6}
                                      xxl={6}
                                      className="text-right"
                                    >
                                      <Button
                                        type="dashed"
                                        key="console"
                                        disabled={new Date(course.Date) >= new Date()}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          window.open(course.Link);
                                        }}
                                      >
                                        Join Session
                                      </Button>
                                    </Col>
                                  </Row>
                                </Card>
                                </>
                              })}
                          </div>
                        </div>
                      )}
                      {courseDetails.CourseType === "Content" && (
                        <>
                          {!this.state.IsRenderType && (
                            <div className="lms-video" id="video_player">
                              <div className="video-container">
                                <video
                                  controls="false"
                                  class="video"
                                  key={this.state.selectedVideo}
                                >
                                  <source src={this.state.selectedVideo} />
                                </video>
                              </div>
                            </div>
                          )}
                          {this.state.IsRenderType === "Video" && (
                            <div className="lms-video " id="video_player">
                              {this.state.IsVideoSource == "Upload" && (
                                <div className="video-container">
                                  <video
                                    controls
                                    key={this.state.selectedVideo}
                                    class="video"
                                  >
                                    <source src={this.state.selectedVideo} />
                                  </video>
                                </div>
                              )}
                              {this.state.IsVideoSource == "YouTube" &&
                                this.state.selectedVideo && (
                                  <iframe
                                    width="100%"
                                    height="500"
                                    key={this.state.selectedVideo}
                                    src={
                                      this.state.selectedVideo
                                        .split("watch?v=")
                                        .join("embed/") + "?autoplay=1"
                                    }
                                    frameborder="0"
                                    allow="autoplay; encrypted-media"
                                    allowfullscreen
                                    X-Frame-Options={true}
                                  ></iframe>
                                )}
                              {this.state.IsVideoSource == "Vimeo" &&
                                this.state.selectedVideo && (
                                  <iframe
                                    width="100%"
                                    height="500"
                                    key={this.state.selectedVideo}
                                    src={`https://player.vimeo.com/video/${
                                      this.state.selectedVideo.split("/")[
                                        this.state.selectedVideo.split("/")
                                          .length - 1
                                      ]
                                    }?autoplay=1`}
                                    frameborder="0"
                                    allow="autoplay; encrypted-media"
                                    allowfullscreen
                                    X-Frame-Options={true}
                                  ></iframe>
                                )}
                            </div>
                          )}
                          {this.state.IsRenderType === "Document" && (
                            <div className="docs px-12">
                              <List
                                itemLayout="horizontal"
                                dataSource={this.state.lstDocuments}
                                renderItem={(item) => (
                                  <List.Item className="upload-preview">
                                    <List.Item.Meta
                                      avatar={[
                                        <span
                                          className={`doc-icons ${item.avatar}`}
                                        ></span>,
                                      ]}
                                      title={
                                        <a href={item.url}>{item.title}</a>
                                      }
                                      description={
                                        <div className="file-size f-12">
                                          {item.fileSize}
                                        </div>
                                      }
                                    />
                                    <a
                                      class="item-close"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(item.url);
                                      }}
                                      target="_blank"
                                    >
                                      <Tooltip title="Download">
                                        <span className="post-icons download-coloricon mt-6 ml-6"></span>
                                      </Tooltip>
                                    </a>
                                  </List.Item>
                                )}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </Carousel>
                  </div>
                  <div className="py-12">
                    <div className="px-12">
                      <p className="text-secondary f-14">
                        {this.state.courseDetails.Author[0].Firstname}{" "}
                        {this.state.courseDetails.Author[0].Lastname} |{" "}
                        {moment(this.state.courseDetails.CreatedDate).format(
                          "ll"
                        )}
                      </p>
                      <Paragraph className="text-primary mb-4">
                        <ShowMoreText lines={3} more="see more" less="see less">
                          {this.state.courseDetails.Description}
                        </ShowMoreText>
                      </Paragraph>
                    </div>
                    <Divider className="mt-0 mb-6" />
                    {!courseDetails.IsMember && (
                      <div className="mt-12 text-center">
                        <Button
                          type="primary"
                          key="console"
                          onClick={() => this.joinCourse()}
                        >
                          Join this course to view content
                        </Button>
                      </div>
                    )}
                    {courseDetails.IsMember && (
                      <div className="px-12">
                        <Title className="semibold mb-4 text-primary f-16">
                          Members List
                        </Title>
                        <div>
                          <Avatar.Group
                            maxCount={size - 1}
                            size="large"
                            maxStyle={{
                              color: "var(--primary)",
                              backgroundColor: "var(--secondary)",
                            }}
                          >
                            {Members.length > 0 &&
                              Members.map((user, index) => {
                                return (
                                  <Tooltip
                                    title={
                                      user.Firstname
                                        ? user.Firstname
                                        : user.FirstName
                                    }
                                    placement="top"
                                  >
                                    <Link
                                      to={
                                        this.props?.profile.Id == user.UserId
                                          ? "/profile/IsProfileTab"
                                          : "/profileview/" + user.UserId
                                      }
                                    >
                                      <Avatar
                                        src={user.Image || defaultUser}
                                        key={index}
                                        style={{
                                          backgroundColor: user.colorbc,
                                        }}
                                      ></Avatar>
                                    </Link>
                                  </Tooltip>
                                );
                              })}
                          </Avatar.Group>
                        </div>
                        {size > 9 && size < Members?.length && (
                          <div className="mt-12 text-center">
                            <Button
                              type="primary"
                              key="console"
                              onClick={() => this.showMore()}
                            >
                              See More
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {courseDetails.RefLinks?.length > 0 && (
                  <div className="custom-card">
                    <Card
                      title="Reference Links"
                      className="hobbies-card"
                      bordered={false}
                    >
                      {courseDetails.RefLinks?.map((link, index) => {
                        return (
                          link !== null && (
                            <a
                              href={link}
                              target="_blank"
                              className="tags"
                              key={index}
                            >
                              {link}
                            </a>
                          )
                        );
                      })}
                    </Card>
                  </div>
                )}
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    {!this.state.loading && courseDetails.IsMember && (
                      <OverView
                        courseid={this.props.match.params.id}
                        courseDetails={this.state.courseDetails}
                      />
                    )}
                  </Col>
                </Row>
              </Col>
              <Col className="p-0" xs={24} sm={8} md={8} lg={7}>
                <div className="custom-card video-card">
                  {courseDetails.IsMember && (
                    <Card title="Course Content" bordered={false}>
                      {this.state.courseDetails?.CourseSections?.length > 0 && (
                        <div className="height-scroll">
                          <Collapse
                            bordered={false}
                            defaultActiveKey={["0"]}
                            expandIcon={({ isActive }) => (
                              <CaretRightOutlined rotate={isActive ? 90 : 0} />
                            )}
                            className="site-collapse-custom-collapse"
                            expandIconPosition="right"
                          >
                            {this.state.courseDetails?.CourseSections?.map(
                              (section, indx) => (
                                <Panel
                                  key={indx}
                                  header={section.SectionName}
                                  key={indx}
                                  className="pb-0 course-content flot-left"
                                >
                                  <div>
                                    <List
                                      itemLayout="horizontal"
                                      dataSource={section.Topics}
                                      renderItem={(item, index) => (
                                        <List.Item
                                          className={
                                            this.state.selectedTopicid ===
                                            item.TopicId
                                              ? "active-topic"
                                              : ""
                                          }
                                          extra={
                                            item.TopicType === "Video" && (
                                              <span
                                                className={`icon ${
                                                  item.IsChecked
                                                    ? "playover-icon"
                                                    : "play-icon"
                                                }`}
                                                key={index}
                                              ></span>
                                            )
                                          }
                                        >
                                          <List.Item.Meta
                                            // title={
                                            //   <span
                                            //     onClick={() =>
                                            //       this.setVideoSource(
                                            //         section,
                                            //         item,
                                            //         indx,
                                            //         index
                                            //       )
                                            //     }
                                            //   >
                                            //     {index + 1}. {item.Title}
                                            //   </span>
                                            // }
                                            description={[
                                              <div className="f-12">
                                                <span
                                                  className="cursor-pointer"
                                                  onClick={() =>
                                                    this.setVideoSource(
                                                      section,
                                                      item,
                                                      indx,
                                                      index
                                                    )
                                                  }
                                                >
                                                  {index + 1}. {item.Title}
                                                </span>
                                              </div>,
                                              <div className="f-12">
                                                <span
                                                  className={`grp-type-icon ${
                                                    item.TopicType === "Video"
                                                      ? "video-play"
                                                      : "lessons"
                                                  }`}
                                                ></span>{" "}
                                                {item.Description.length > 25
                                                  ? `${item.Description.substring(
                                                      0,
                                                      45
                                                    )}...`
                                                  : item.Description}
                                              </div>,
                                            ]}
                                          />
                                        </List.Item>
                                      )}
                                    />
                                  </div>
                                </Panel>
                              )
                            )}
                          </Collapse>
                        </div>
                      )}
                      {this.state.courseDetails?.CourseSections?.length ==
                        0 && <Empty />}
                    </Card>
                  )}
                  {courseDetails.IsMember && (
                    <Card title="Recommended Videos" bordered={false}>
                      <List
                        itemLayout="horizontal"
                        dataSource={recommendedVideos}
                        renderItem={(item) => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={
                                <div
                                  className="video-recommended mb-8"
                                  id="video_player"
                                >
                                  {item.CourseVideo.length > 0 ? (
                                    <video>
                                      <source src={item.CourseVideo || video} />
                                    </video>
                                  ) : (
                                    <img
                                      src={video}
                                      style={{ width: "130px" }}
                                    />
                                  )}
                                </div>
                              }
                              title={
                                <Link onClick={() => this.reloadCourse(item)}>
                                  {item.CourseName}
                                </Link>
                              }
                              description={
                                <div className="f-12">
                                  <div>
                                    {item.Author[0].Firstname}{" "}
                                    {item.Author[0].Lastname}
                                  </div>
                                  <div>
                                    <span>{item.ViewCount} Views</span> .{" "}
                                    <span>
                                      {
                                        <Moment fromNow>
                                          {item.CreatedDate}
                                        </Moment>
                                      }
                                    </span>
                                  </div>
                                </div>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </Card>
                  )}
                  {this.state.loading && (
                    <Loader className="loader-top-middle" />
                  )}
                </div>
              </Col>
            </Row>
          </div>
        )}
      </>
    );
  }
}
const mapStateToProps = ({ oidc }) => {
  return { profile: oidc.profile };
};
export default withRouter(connect(mapStateToProps)(CourseContent));
