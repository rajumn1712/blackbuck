import React, { Component } from "react";
import { Card, List, Row, Col, Carousel, Collapse, Avatar, Empty, Tooltip,Typography } from "antd";
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
const data = [
  {
    title: 'A musical and visual delight! ',
  }
]
const { Title, Paragraph } = Typography;
class CourseContent extends Component {
  state = {
    courseDetails: {},
    loading: true,
    selectedVideo: null,
    watchedVideos: [],
    IsRenderType: null,
    IsVideoSource: null,
    lstDocuments: [],
    IsChecked: false
  };
  componentDidMount() {
    this.loadCourseDetails();
  }
  loadCourseDetails = async () => {
    const response = await fetchCourseDetails(this.props.match.params.id);
    if (response.ok) {
      this.getUserWatchedVideos();
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
      let { courseDetails } = this.state;
      courseDetails.CourseSections.forEach((item, index) => {
        item.Topics.forEach(topic => {
          response.data.forEach(watchTopic => {
            if (watchTopic.TopicId == topic.TopicId && watchTopic.SectionId == item.SectionId) {
              topic.IsChecked = true;
            }
          });
        });
      });

      this.setState({ ...this.state, watchedVideos: response.data, courseDetails });
    }
  };
  setVideoSource = async (section, item, indx, index) => {
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
            selectedVideo: item.VideoSource === 'Upload' ? item.VideoUrl[0] : item.VideoUrl,
            courseDetails
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
          lstDocuments: item.lstDocuments
        });
      }
    }
  };

  render() {
    return (
      <div className="post-preview-box course-card">
        <Row gutter={24} className="py-16">
          <Col className="" xs={24} sm={16} md={16} lg={17}>
            <div className="preview-image">
            <Title level={4} className="semibold mb-4 text-primary">
                dfghjk
            </Title>
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
                            .join("embed/") + '?autoplay=1'}
                          frameborder="0"
                          allow='autoplay; encrypted-media'
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
                          src={`https://player.vimeo.com/video/${this.state.selectedVideo.split("/")[
                            this.state.selectedVideo.split("/").length - 1
                          ]
                            }?autoplay=1`}
                          frameborder="0"
                          allow='autoplay; encrypted-media'
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
                      className="upload-preview"
                      >
                        <List.Item.Meta
                          avatar={[
                            <span className={`doc-icons ${item.avatar}`}></span>,
                          ]}
                          title={<a href={item.url}>{item.title}</a>}
                          description={
                            <div className="file-size f-12">{item.fileSize}</div>
                          }
                        />
                        <a
                    class="item-close"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(item.url)
                    }}
                    target="_blank"
                  >
                    <Tooltip title="Download">
                      <span className="post-icons download-coloricon"></span>
                    </Tooltip>
                  </a>
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
          </Col>
          <Col className="p-0" xs={24} sm={8} md={8} lg={7}>
            <div className="custom-card video-card">
              <Card title="Course Content" bordered={false}>
                {this.state.courseDetails?.CourseSections?.length > 0 && <div className="height-scroll">
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
                          <div>
                            <List
                              itemLayout="horizontal"
                              dataSource={section.Topics}
                              renderItem={(item, index) => (
                                <List.Item
                                  extra={
                                    item.TopicType === 'Video' && <span
                                      className={`icon ${item.IsChecked ? 'playover-icon' : 'play-icon'}`}
                                      key={index}
                                    ></span>
                                  }
                                >
                                  <List.Item.Meta
                                    title={
                                      <a
                                        onClick={() =>
                                          this.setVideoSource(section, item, indx, index)
                                        }
                                      >
                                        {index + 1}. {item.Title}
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
                </div>}
                {this.state.courseDetails?.CourseSections?.length == 0 && <Empty />}
              </Card>
              <Card title="Recommended Video" bordered={false}>         
                <List
                  itemLayout="horizontal"
                  dataSource={data}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<div className="video-recommended mb-8" id="video_player">
                        <video controls key={this.state.selectedVideo}>
                          <source src={this.state.selectedVideo} />
                        </video></div>}
                        title={<a href="https://ant.design">{item.title}</a>}
                        description={<div className="f-12"><div>Computer Course</div><div><span>124k Views</span> . <span>1 Month ago</span></div></div>}
                      />
                    </List.Item>
                  )}
                />


              </Card>
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
