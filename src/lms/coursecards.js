import { Card, Col, Row, Tabs, Empty, Typography } from "antd";
import React, { Component, createRef } from "react";
import photography from "../styles/images/default-cover.png";
import { Link } from "react-router-dom";
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
    loadMore:true,
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
      let {courses} = this.state;
      courses = courses.concat(response.data);
      if (response.ok) {
        this.setState({ ...this.state, 
          courses,
          loading: false,
          loadMore: response.data.length === this.state.pageSize });
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
            {/* <Card bordered={false} title="Live/Ongoing">
              <div className="px-12 pt-12 pb-8">
                {this.state.allCourses['OnGoing']?.length > 4 && <><Link
                  className="more-frnd-btn left"
                  onClick={(e) => {
                    e.preventDefault();
                    this.OnGoingSlider.current.prev();
                  }}
                >
                  <span className="icon left-arrow mr-0"></span>
                </Link>
                <Link
                  className="more-frnd-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    this.OnGoingSlider.current.next();
                  }}
                >
                  <span className="icon right-arrow mr-0"></span>
                </Link></>}
                <OwlCarousel items={3} options={options} autoWidth={true} ref={this.OnGoingSlider} key={`carousel_${this.state.allCourses['OnGoing']?.length}`}>
                  {this.state.allCourses['OnGoing']?.map((course, indx) => (
                    <div className="course-list-item" key={indx}>
                      <Card
                        bordered={false}
                        className="card-item"
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
                              to={"course/" + course.id}
                              className="text-primary"
                            >
                              {course.name}
                            </Link>
                          }
                          description={
                            <div className="coursecard-cont">
                              <Paragraph className="f-12 semibold text-secondary text-uppercase">
                                    Starts On{" "}
                                    <span className="semibold text-primary f-16 d-block">
                                      <Moment format="MM/DD/YYYY">
                                        {course.startDate}
                                      </Moment>
                                    </span>
                                  </Paragraph>
                              <div>
                                <Paragraph
                                  ellipsis={{ rows: 2 }}
                                  className="f-14 text-primary mb-8"
                                  style={{ height: "42px" }}
                                >
                                  {course.description}
                                </Paragraph>
                                <div className="justify-content-between">
                                    <span className="ml-4 f-12 text-secondary">
                                      {
                                        course.members
                                      }{" "}
                                      Members
                                    </span>
                                  </div>
                              </div>
                            </div>
                          }
                        />
                      </Card>
                    </div>
                  ))}
                </OwlCarousel>
              </div>
              {this.state.loading && <Loader className="loader-top-middle" />}
              {!this.state.loading &&
                this.state.allCourses['OnGoing']?.length === 0 && <Empty />}
            </Card>
            <Card bordered={false} title="Upcoming Courses">
              <div className="px-12 pt-12 pb-8">
                {this.state.allCourses['Previous']?.length > 4 && <><Link
                  className="more-frnd-btn left"
                  onClick={(e) => {
                    e.preventDefault();
                    this.PreviousSlider.current.prev();
                  }}
                >
                  <span className="icon left-arrow mr-0"></span>
                </Link>
                <Link
                  className="more-frnd-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    this.PreviousSlider.current.next();
                  }}
                >
                  <span className="icon right-arrow mr-0"></span>
                </Link></>}
                <OwlCarousel items={3} options={options} autoWidth={true} ref={this.PreviousSlider} key={`carousel_${this.state.allCourses['Previous']?.length}`}>
                  {this.state.allCourses['Previous']?.map((course, indx) => (
                    <div className="course-list-item" key={indx}>
                      <Card
                        bordered={false}
                        className="card-item"
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
                              to={"course/" + course.id}
                              className="text-primary"
                            >
                              {course.name}
                            </Link>
                          }
                          description={
                            <div className="coursecard-cont">
                              <Paragraph className="f-12 semibold text-secondary text-uppercase">
                                    Starts On{" "}
                                    <span className="semibold text-primary f-16 d-block">
                                      <Moment format="MM/DD/YYYY">
                                        {course.startDate}
                                      </Moment>
                                    </span>
                                  </Paragraph>
                              <div>
                                <Paragraph
                                  ellipsis={{ rows: 2 }}
                                  className="f-14 text-primary mb-8"
                                  style={{ height: "42px" }}
                                >
                                  {course.description}
                                </Paragraph>
                                <div className="justify-content-between">
                                    <span className="ml-4 f-12 text-secondary">
                                      {
                                        course.members
                                      }{" "}
                                      Members
                                    </span>
                                  </div>
                              </div>
                            </div>
                          }
                        />
                      </Card>
                    </div>
                  ))}
                </OwlCarousel>
              </div>
              {this.state.loading && <Loader className="loader-top-middle" />}
              {!this.state.loading &&
                this.state.allCourses['Previous']?.length === 0 && <Empty />}
            </Card>
            <Card bordered={false} title="Previous Courses">
              <div className="px-12 pt-12 pb-8">
                {this.state.allCourses['Upcoming']?.length > 4 && <><Link
                  className="more-frnd-btn left"
                  onClick={(e) => {
                    e.preventDefault();
                    this.UpcomingSlider.current.prev();
                  }}
                >
                  <span className="icon left-arrow mr-0"></span>
                </Link>
                <Link
                  className="more-frnd-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    this.UpcomingSlider.current.next();
                  }}
                >
                  <span className="icon right-arrow mr-0"></span>
                </Link></>}
                <OwlCarousel items={3} options={options} autoWidth={true} ref={this.UpcomingSlider} key={`carousel_${this.state.allCourses['Upcoming']?.length}`}>
                  {this.state.allCourses['Upcoming']?.map((course, indx) => (
                    <div className="course-list-item" key={indx}>
                      <Card
                        bordered={false}
                        className="card-item"
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
                              to={"course/" + course.id}
                              className="text-primary"
                            >
                              {course.name}
                            </Link>
                          }
                          description={
                            <div className="coursecard-cont">
                              <Paragraph className="f-12 semibold text-secondary text-uppercase">
                                    Starts On{" "}
                                    <span className="semibold text-primary f-16 d-block">
                                      <Moment format="MM/DD/YYYY">
                                        {course.startDate}
                                      </Moment>
                                    </span>
                                  </Paragraph>
                              <div>
                                <Paragraph
                                  ellipsis={{ rows: 2 }}
                                  className="f-14 text-primary mb-8"
                                  style={{ height: "42px" }}
                                >
                                  {course.description}
                                </Paragraph>
                                  <div className="justify-content-between">
                                    <span className="ml-4 f-12 text-secondary">
                                      {
                                        course.members
                                      }{" "}
                                      Members
                                    </span>
                                  </div>
                              </div>
                            </div>
                          }
                        />
                      </Card>
                    </div>
                  ))}
                </OwlCarousel>
              </div>
              {this.state.loading && <Loader className="loader-top-middle" />}
              {!this.state.loading &&
                this.state.allCourses['Upcoming']?.length === 0 && <Empty />}
            </Card> */}
          </TabPane>
          <TabPane tab="My Courses" key="2">
           
              <div className="">
                {this.state.courses?.map((course, indx) => (
                  <Card
                    className="card-item vertical-card"
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
                          to={"course/" + course.id}
                          className="text-primary"
                        >
                          {course.name}
                        </Link>
                      }
                      description={
                        <div className="coursecard-cont">
                          <div>
                            {course.CourseType === "Live Session" && (
                              <Paragraph className="f-12 text-secondary ">
                                Starts on{" "}
                                <span className="semibold text-primary f-16 d-block">
                                  <Moment format="MM/DD/YYYY">
                                    {course.LiveDate}
                                  </Moment>
                                </span>
                              </Paragraph>
                            )}
                            {course.CourseType === "Content" && (
                              <Paragraph className="f-12 text-secondary">
                                Created on{" "}
                                <span className="semibold text-primary f-16 d-block">
                                  <Moment format="MM/DD/YYYY">
                                    {course.CreatedDate}
                                  </Moment>
                                </span>
                              </Paragraph>
                            )}
                            <Paragraph
                              ellipsis={{ rows: 2 }}
                              className="f-14 text-primary mb-8"
                              style={{ height: "42px" }}
                            >
                              {course.description}
                            </Paragraph>
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
              {this.state.loading && <Loader className="loader-top-middle" />}
              {this.state.loading &&
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
export default connect(mapStateToProps)(CourseCards);
