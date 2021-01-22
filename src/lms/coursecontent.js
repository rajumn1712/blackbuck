import React, { Component } from "react";
import { Card, List, Row, Col, Carousel, Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import "../index.css";
import "../App.css";
import OverView from "./overview";
import {
  fetchCourseDetails,
  getUserWatchedVideos,
  saveCourseTopic,
} from "./api";
import { connect } from "react-redux";
const { Panel } = Collapse;
class CourseContent extends Component {
  state = {
    courseDetails: {},
    loading: true,
    selectedVideo: null,
    watchedVideos: [],
    IsRenderType: null,
    IsVideoSource: null,
    lstDocuments:[]
  };
  componentDidMount() {
    this.loadCourseDetails();
    this.getUserWatchedVideos();
  }
  loadCourseDetails = async () => {
    const response = await fetchCourseDetails(this.props.match.params.id);
    if (response.ok) {
      this.setState({
        ...this.state,
        courseDetails: response.data[0],
        selectedVideo:
          response.data.length > 0 ? response.data[0].CourseVideo[0] : null,
        loading: false,
      });
    }
  };
  getUserWatchedVideos = async () => {
    const response = await getUserWatchedVideos(
      this.props.match.params.id,
      this.props.profile?.Id
    );
    if (response.ok) {
      this.setState({ ...this.state, watchedVideos: response.data });
    }
  };
  setVideoSource = async (section, item) => {
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
        this.setState(
          {
            ...this.state,
            IsRenderType: item.TopicType,
            IsVideoSource: item.VideoSource,
            selectedVideo: item.VideoSource==='Upload' ? item.VideoUrl[0] : item.VideoUrl,
          },
          () => {
            this.getUserWatchedVideos();
            if(item.VideoSource === "Upload"){
              document.querySelector("video").play();
            }
            
          }
        );
      } else {
        this.setState({
          ...this.state,
          IsRenderType: item.TopicType,
          IsVideoSource: item.VideoSource,
          lstDocuments:item.lstDocuments
        });
      }
    }
  };

  comaprevalues = (section, item) => {
    let { watchedVideos } = this.state;
    for (const i in watchedVideos) {
      if (
        watchedVideos[i].SectionId === section.SectionId &&
        watchedVideos[i].TopicId === item.TopicId
      ) {
        console.log(true);
      } else {
        console.log(false);
      }
    }
  };

  render() {
    return (
      <div className="post-preview-box course-card">
        <Row gutter={24} className="py-16">
          <Col className="" xs={24} sm={16} md={16} lg={17}>
            <div className="preview-image">
              <Carousel>
                
                  {!this.state.IsRenderType && (<div className="lms-video mb-8" id="video_player">
                    <video controls key={this.state.selectedVideo}>
                      <source src={this.state.selectedVideo} />
                    </video></div>
                  )}
                  {this.state.IsRenderType === "Video" && (
                    <div className="lms-video mb-8" id="video_player">
                      {this.state.IsVideoSource == "Upload" && (
                        <video controls key={this.state.selectedVideo}>
                          <source src={this.state.selectedVideo} />
                        </video>
                      )}
                      {this.state.IsVideoSource == "YouTube" &&
                        this.state.selectedVideo && (
                          <iframe
                          width="640"
                          height="360"
                          key={this.state.selectedVideo}
                            src={this.state.selectedVideo
                              .split("watch?v=")
                              .join("embed/")}
                            frameborder="0"
                            allowfullscreen
                            X-Frame-Options={true}
                          ></iframe>
                        )}
                      {this.state.IsVideoSource == "Vimeo" &&
                        this.state.selectedVideo && (
                          <iframe
                          width="640"
                          height="360"
                          key={this.state.selectedVideo}
                            src={`https://player.vimeo.com/video/${
                              this.state.selectedVideo.split("/")[
                                this.state.selectedVideo.split("/").length - 1
                              ]
                            }`}
                            frameborder="0"
                            allowfullscreen
                            X-Frame-Options={true}
                          ></iframe>
                        )}
                    </div>
                  )}
                  {this.state.IsRenderType === 'Document' && <div className="docs px-0">
                  <List
                  itemLayout="horizontal"
                  dataSource={this.state.lstDocuments}
                  renderItem={(item) => (
                    <List.Item
                      onClick={(ev) => {
                        ev.stopPropagation();
                        window.open(item.url, "_blank");
                      }}
                      style={{ cursor: "pointer" }}
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
                  }
                
              </Carousel>
            </div>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                {!this.state.loading && (
                  <OverView
                    courseid={this.props.match.params.id}
                    courseDetails={this.state.courseDetails}
                  />
                )}
              </Col>
            </Row>

            {/* <Tabs defaultActiveKey="1"
                            className="group-tabs profile-tabs">
                            <TabPane tab="Overview" key="1">
                                <Row gutter={16}>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <OverView />
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="Q&A" key="2">
                                <Row gutter={16}>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <div>
                                        <QandA />
                                    </div>
                                    </Col>
                                </Row>
                            </TabPane> */}
            {/* <TabPane tab="Comments" key="3">
                                <Row gutter={16}>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>

                                    </Col>
                                </Row>
                            </TabPane> */}
            {/* </Tabs>*/}
          </Col>
          <Col className="p-0" xs={24} sm={8} md={8} lg={7}>
            <div className="custom-card video-card">
              <Card title="Course Content" bordered={false}>
                <div className="height-scroll">
                  <Collapse
                    bordered={false}
                    defaultActiveKey={["1"]}
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
                          <div className="panel-subtext px-16">
                            <span>{section.Topics.length}</span>{" "}
                            <span>Videos</span>{" "}
                          </div>
                          <div>
                            <List
                              itemLayout="horizontal"
                              dataSource={section.Topics}
                              renderItem={(item, indx) => (
                                <List.Item
                                  extra={
                                    <span
                                      className="icon playover-icon"
                                      key={indx}
                                    ></span>
                                  }
                                >
                                  <List.Item.Meta
                                    title={
                                      <a
                                        onClick={() =>
                                          this.setVideoSource(section, item)
                                        }
                                      >
                                        {indx + 1}. {item.Title}
                                      </a>
                                    }
                                    description={
                                      <div className="f-12">
                                        <span className={`grp-type-icon ${item.TopicType === 'Video' ? 'video-play' : 'lessons'}`}></span>{" "}
                                        {item.Description}
                                      </div>
                                    }
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
              </Card>
              <Card title="Recommended Video" bordered={false}></Card>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
const mapStateToProps = ({ oidc }) => {
  return { profile: oidc.profile };
};
export default connect(mapStateToProps)(CourseContent);
