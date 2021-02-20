import { Card, Col, Row, Tabs, Empty, Typography, Skeleton } from "antd";
import React, { Component, createRef } from "react";
import photography from "../styles/images/default-cover.png";
import { Link, withRouter } from "react-router-dom";
import { fetchUserCourses } from "./api";
import { connect } from "react-redux";
import Loader from "../common/loader";
import OwlCarousel from "react-owl-carousel2";
import "react-owl-carousel2/src/owl.carousel.css";
import "react-owl-carousel2/src/owl.theme.default.css";
import Moment from "react-moment";
import AllCourses from "./allCourses";

const { Meta } = Card;
const { TabPane } = Tabs;
const { Paragraph } = Typography;

const options = {
  margin: 10,
  responsiveClass: true,
  responsive: {
    0: {
      items: 2,
    },

    575: {
      items: 2,
    },

    768: {
      items: 3,
    },

    992: {
      items: 3,
    },
  },
};

class CourseCards extends Component {
  OnGoingSlider = createRef(null);
  PreviousSlider = createRef(null);
  UpcomingSlider = createRef(null);
  state = {
    courses: [],
    recentCourses: [],
    loadMore: true,
    loading: false,
    page: 1,
    pageSize: 5,
    allCourses: {}
  };
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.loadCourses("1");
    if (this.props.onRef) this.props.onRef(this);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  loadCourses = async (key) => {
    // key = key == "1" ? "recentCourses" : "courses";
    // const _emptyKey = key == "1" ? "recentCourses" : "courses";
    this.setState({ ...this.state, loading: true });
    if (key === '2') {
      const response = await fetchUserCourses(
        this.props.profile.Id,
        this.state.page,
        this.state.pageSize,
        'courses'
      );
      let { courses } = this.state;
      courses = courses.concat(response.data);
      if (response.ok) {
        this.setState({
          ...this.state,
          courses,
          loading: false,
          loadMore: response.data.length === this.state.pageSize
        });
      } else {
        this.setState({ ...this.state, loading: false });
      }
    } else {
      // const response = await getAllLMS();
      // if(response.ok){
      //   let {allCourses} = this.state;
      //   allCourses = response.data.reduce((list,object)=>{
      //     list[object.Type] = list[object.Type] || [];
      //     list[object.Type].push(object);
      //     return list;
      //   },{});
      //   this.setState({ ...this.state, allCourses, loading: false });
      // }else{
      //   this.setState({ ...this.state, loading: false });
      // }
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
        this.loadCourses('2');
      });
    }
  }
  render() {
    return (
      <div className="custom-card lms-page">
        <Tabs
          defaultActiveKey="1"
          className="profile-tabs"
          onTabClick={(key) => {
            this.loadCourses(key);
          }}
        >
          <TabPane tab="All" key="1">
            <AllCourses type="ongoing" title="Live/OnGoing Courses" />
            <AllCourses type="upcoming" title="UpComing Courses" />
            <AllCourses type="previous" title="Previous Courses" />
            <AllCourses type="mockinterviews" title="Mock Interviews" />
            <AllCourses type="webinars" title="Webinar's" />
            <AllCourses type="workshops" title="Workshops" />
            <AllCourses type="courseslive" title="Courses" />
          </TabPane>
          <TabPane tab="My Courses" key="2">
            <div className="">
              {this.state.courses?.map((course, indx) => (
                <Card
                  className="card-item vertical-card"
                  onClick={() => { this.props.history.push("course/" + course.id) }}
                  cover={
                    <>
                      <img
                        alt="photography"
                        src={
                          course.image.length > 0
                            ? course.image
                            : photography
                        }
                      />
                      {course.CourseType === "Live Session" && (
                        <span className="live-btn">LIVE</span>
                      )}
                    </>
                  }
                >
                  <Meta
                    title={
                      <Link
                        to=""
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
                            className="f-14 text-primary mb-8"
                            style={{ height: "42px" }}
                          >
                            {course.description}
                          </Paragraph>
                          {course.CourseType === "Live Session" && (
                            <Paragraph className="job-ldate f-12 text-secondary ">
                              Starts on{" "}
                              <span className="semibold text-primary f-14">
                                <Moment format="MM/DD/YYYY">
                                  {course.LiveDate}
                                </Moment>
                              </span>
                            </Paragraph>
                          )}
                          {course.CourseType === "Content" && (
                            <Paragraph className="job-ldate f-12 text-secondary">
                              Created on{" "}
                              <span className="semibold text-primary f-14">
                                <Moment format="MM/DD/YYYY">
                                  {course.CreatedDate}
                                </Moment>
                              </span>
                            </Paragraph>
                          )}

                          {course.CourseType === "Content" && (
                            <div className="justify-content-between">
                              <span className="mr-4 f-12 text-secondary">
                                {course.sections} Sections
                                    </span>{" "}
                                    |
                              <span className="mx-4 f-12 text-secondary">
                                {course.videos}{" "}
                                {`${course.videos === 1 ? "Video" : "Videos"
                                  }`}
                              </span>{" "}
                                    |
                              <span className="ml-4 f-12 text-secondary">
                                {
                                  course.members.concat(course.AdminUsers)
                                    .length
                                }{" "}
                                      Members
                                    </span>
                            </div>
                          )}
                          {course.CourseType === "Live Session" && (
                            <div className="justify-content-between">
                              <span className="ml-4 f-12 text-secondary">
                                {
                                  course.members.concat(course.AdminUsers)
                                    .length
                                }{" "}
                                      Members
                                    </span>
                            </div>
                          )}
                        </div>
                      </div>
                    }
                  />
                </Card>
              ))}
            </div>
            {this.state.loading && <Row gutter={8}>
              <Col xs={24} md={24} className="">
                <div className="cards-list-skelton lms-card-skelton vertical-card">
                  <Skeleton.Image active shape='square' />
                  <div className="">
                    <Skeleton active paragraph={{ rows: 2 }} />
                    <Skeleton.Button active shape='square' />
                    <Skeleton active paragraph={{ rows: 0 }} />
                  </div>
                </div>
              </Col>
            </Row>}
            {/* {this.state.loading && <Loader className="loader-top-middle" />} */}
            {!this.state.loading &&
              this.state.courses.length === 0 &&
              this.state.recentCourses.length === 0 && <Empty />}

          </TabPane>
        </Tabs>
      </div>
    );
  }
}
const mapStateToProps = ({ oidc }) => {
  return { profile: oidc.profile };
};
export default connect(mapStateToProps)(withRouter(CourseCards));
