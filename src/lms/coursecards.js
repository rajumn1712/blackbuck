import {
  Card,
  Col,
  Row,
  Tabs,
  Empty,
  Typography,
  Avatar,
  Tooltip,
} from "antd";
import React, { Component } from "react";
import photography from "../styles/images/default-cover.png";
import defaultUser from "../styles/images/defaultuser.jpg";
import { Link } from "react-router-dom";
import { fetchUserCourses } from "./api";
import { connect } from "react-redux";
import Loader from "../common/loader";

const { Meta } = Card;
const { TabPane } = Tabs;
const { Paragraph } = Typography;

class CourseCards extends Component {
  state = {
    courses: [],
    recentCourses: [],
    loading: true,
    page: 1,
    pageSize: 50,
  };
  componentDidMount() {
    this.loadCourses("1");
    if (this.props.onRef)
            this.props.onRef(this);
  }
  loadCourses = async (key) => {
    key = key == "1" ? "courses" : "recentCourses";
    const _emptyKey = key == "1" ? "recentCourses" : "courses";
    this.setState({ ...this.state, [_emptyKey]: [], loading: true });
    const response = await fetchUserCourses(
      this.props.profile.Id,
      this.state.page,
      this.state.pageSize,
      key
    );
    if (response.ok) {
      this.setState({ ...this.state, [key]: response.data, loading: false });
    } else {
      this.setState({ ...this.state, loading: false });
    }
  };
  renderCard = (card, key) => {};
  render() {
    return (
      <div className="custom-card">
        <Tabs
          defaultActiveKey="1"
          className="profile-tabs"
          onTabClick={(key) => {
            this.loadCourses(key);
          }}
        >
          <TabPane tab="My Courses" key="1">
            <Card bordered={false}>
              <div className="px-12 pt-12 pb-8">
                <Row gutter={16}>
                  {this.state.courses?.map((course, indx) => (
                    <Col key={indx} xs={24} md={12} lg={8}>
                      <Card
                        className="card-item"
                        cover={
                          <>
                          <img
                            alt="photography"
                            src={course.image.length > 0 ? course.image : photography}
                          />
                          {course.CourseType === 'Live Session' && <span className="live-btn">LIVE</span>}
                          </>
                        }
                      >
                        <Meta
                          title={
                            <Link
                              to={"course/" + course.id}
                              className="text-primary"
                            >
                              {course.name}
                            </Link>
                          }
                          description={
                            <div className="coursecard-cont">
                              <div>
                                <Paragraph
                                  ellipsis={{ rows: 2 }}
                                  className="f-14 text-primary mb-8" style={{height: '42px'}}
                                >
                                  {course.description}
                                </Paragraph>
                                {course.CourseType === 'Content' && <div className="justify-content-between">
                                  <span className="mr-4 f-12 text-secondary">
                                    {course.sections} Sections
                                  </span> |
                                  <span className="mx-4 f-12 text-secondary">
                                    {course.videos} Videos
                                  </span>|
                                  <span className="ml-4 f-12 text-secondary">
                                    {course.members.length} Members
                                  </span>
                                </div>}
                                {course.CourseType === 'Live Session' && <div className="justify-content-between">
                                <span className="ml-4 f-12 text-secondary">
                                    {course.members.length} Members
                                  </span>
                                  </div>}
                              </div>
                              {/* <Avatar.Group
                                className="group-member mt-12"
                                maxCount={5}
                                size="large"
                                maxStyle={{
                                  color: "var(--black)",
                                  backgroundColor: "#fde3cf",
                                  fontWeight: "bold",
                                }}
                              >
                                  {course.members.concat(course.AdminUsers)?.map((member,index)=>{
                                     return <Tooltip title={member.Firstname} key={index}>
                                         <Avatar src={member.image || defaultUser}/>
                                     </Tooltip>
                                  })} */}
                                {/* <Avatar src={defaultUser} />
                                <Avatar
                                  style={{ backgroundColor: "var(--primary)" }}
                                >
                                  K
                                </Avatar>
                                <Tooltip title="Ant User" placement="top">
                                  <Avatar
                                    style={{ backgroundColor: "#87d068" }}
                                    icon={<img src={defaultUser} />}
                                  />
                                </Tooltip>
                                <Avatar
                                  style={{ backgroundColor: "#1890ff" }}
                                  icon={<img src={defaultUser} />}
                                /> */}
                              {/* </Avatar.Group> */}
                            </div>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
              {this.state.loading && <Loader className="loader-top-middle" />}
              {!this.state.loading &&
                this.state.courses.length === 0 &&
                this.state.recentCourses.length === 0 && <Empty />}
            </Card>
          </TabPane>
          <TabPane tab="Recent Uploads" key="2">
            <Card bordered={false}>
              <div className="px-12 pt-12 pb-8">
                <Row gutter={16}>
                  {this.state.recentCourses?.map((course, indx) => (
                    <Col key={indx} xs={24} md={12} lg={8}>
                      <Card
                        className="card-item card-height"
                        cover={
                          <>
                          <img
                            alt="photography"
                            src={course.image.length > 0 ? course.image : photography}
                          />
                          {course.CourseType === 'Live Session' && <span className="live-btn">LIVE</span>}
                          </>
                        }
                        actions={
                          [
                            // <Button>Join Course</Button>
                          ]
                        }
                      >
                        <Meta
                          title={
                            <Link
                              to={"course/" + course.id}
                              className="text-primary"
                            >
                              {course.name}
                            </Link>
                          }
                          description={
                            <div>
                              <Paragraph
                                  ellipsis={{ rows: 2 }}
                                  className="f-14 text-primary mb-8" style={{height: '42px'}}
                                >
                                  {course.description}
                                </Paragraph>
                              {course.CourseType === 'Content' && <div className="justify-content-between">
                                  <span className="mr-4 f-12 text-secondary">
                                    {course.sections} Sections
                                  </span> |
                                  <span className="mx-4 f-12 text-secondary">
                                    {course.videos} Videos
                                  </span>|
                                  <span className="ml-4 f-12 text-secondary">
                                    {course.members.length} Members
                                  </span>
                                </div>}
                                {course.CourseType === 'Live Session' && <div className="justify-content-between">
                                <span className="ml-4 f-12 text-secondary">
                                    {course.members.length} Members
                                  </span>
                                  </div>}
                            </div>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
              {this.state.loading && <Loader className="loader-top-middle" />}
              {!this.state.loading &&
                this.state.courses.length === 0 &&
                this.state.recentCourses.length === 0 && <Empty />}
            </Card>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
const mapStateToProps = ({ oidc }) => {
  return { profile: oidc.profile };
};
export default connect(mapStateToProps)(CourseCards);
