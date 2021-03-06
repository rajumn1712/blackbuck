import React, { useEffect, useState, useRef } from "react";
import { Card, Col, Row, Empty, Typography, Skeleton } from "antd";
import photography from "../styles/images/default-cover.png";
import { Link, withRouter } from "react-router-dom";
import Moment from "react-moment";
import Loader from "../common/loader";
import OwlCarousel from "react-owl-carousel2";
import { getByCourseType, getCoursesByType } from "./api";

const { Paragraph } = Typography;
const { Meta } = Card;

const normalCourses = ["ongoing", "upcoming", "previous"];

const options = {
  margin: 10,
  responsiveClass: true,
  dots: false,
  responsive: {
    0: {
      items: 1,
    },

    575: {
      items: 2,
    },

    768: {
      items: 2,
    },

    992: {
      items: 3,
    },
  },
};

const AllCourses = (props) => {
  let page = 1;
  let size = 10;

  const slider = useRef(null);

  const [loading, setLoading] = useState(false);
  let [courses, setCourses] = useState([]);
  let [loadMore, setLoadMore] = useState(true);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    loadCoursesByType(page, size);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadCoursesByType = async (pageNo, pagesize) => {
    setLoading(true);
    const response = await (normalCourses.indexOf(
      props.type || props.path.replace(/\\|\//g, "")
    ) > -1
      ? getCoursesByType
      : getByCourseType)(
        props.type || props.path.replace(/\\|\//g, ""),
        pagesize,
        pagesize * pageNo - pagesize
      );
    if (response.ok) {
      courses = courses.concat(response.data);
      loadMore = response.data.length === size ? true : false;
      setCourses([...courses]);
      setLoadMore(loadMore);
      setLoading(false);
    }
  };
  const handleScroll = () => {
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
      loadMoreCourses();
    } else {
    }
  };
  const loadMoreCourses = (e) => {
    if (loadMore && !loading && !props.type && courses.length > 0) {
      page += 1;
      setLoading(true);
      loadCoursesByType(page, 10);
    }
  };
  const methods = {
    ongoing: "Live/OnGoing Courses",
    upcoming: "UpComing Courses",
    previous: "Previous Courses",
    mockinterviews: "Mock Interviews",
    webinars: `Webinar's`,
    workshops: "Workshops",
    courseslive: "Courses",
  };

  //   const owl = document.querySelector('.owl-carousel');
  // owl.on('mousewheel', '.owl-stage', function(e) {
  //    if (e.originalEvent.deltaY > 0) {
  //       owl.trigger('next.owl');
  //    } else {
  //       owl.trigger('prev.owl');
  //    }
  //    e.preventDefault();
  // });
  const handleWheel = (e) => {
    if (e.deltaY > 0) {
      slider.current.next();
    } else {
      slider.current.prev();
    }
    e.stopPropagation();
  };
  return (
    <div className={props.type ? "" : "main custom-card"}>
      {props.type && (
        <Card
          bordered={false}
          title={props.title}
          extra={<Link to={`${props.type}`}>View all</Link>}
        >
          <div className="px-12 pt-12 pb-8">
            {courses.length > 3 && <><Link
              className="more-frnd-btn left"
              onClick={(e) => {
                e.preventDefault();
                slider.current.prev();
              }}
            >
              <span className="icon left-arrow mr-0"></span>
            </Link>
              <Link
                className="more-frnd-btn"
                onClick={(e) => {
                  e.preventDefault();
                  slider.current.next();
                }}
              >
                <span className="icon right-arrow mr-0"></span>
              </Link></>}
            <OwlCarousel
              options={options}
              ref={slider}
              autoWidth={true}
              key={`carousel_${courses?.length}`}
            >
              {courses?.map((course, indx) => (
                <div className="course-list-item" key={indx}>
                  <Card
                    bordered={false}
                    className="card-item"
                    onClick={() => { props.history.push("course/" + course.id) }}
                    cover={
                      <>
                        <img
                          alt="photography"
                          src={
                            course.image.length > 0 ? course.image : photography
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
                          <Paragraph
                            ellipsis={{ rows: 2 }}
                            className="f-14 text-primary mb-8"
                            style={{ height: "42px" }}
                          >
                            {course.description}
                          </Paragraph>
                          {course.startDate ? (
                            <Paragraph className="job-ldate f-12 semibold text-secondary">
                              Starts On{" "}
                              <span className="semibold text-primary f-14">
                                <Moment format="MM/DD/YYYY">
                                  {course.startDate}
                                </Moment>
                              </span>
                            </Paragraph>
                          ) : (
                              <Paragraph className="job-ldate f-12 semibold text-secondary">
                                Created On{" "}
                                <span className="semibold text-primary f-14">
                                  <Moment format="MM/DD/YYYY">
                                    {course.CreatedDate}
                                  </Moment>
                                </span>
                              </Paragraph>
                            )}
                          <div>

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
                                    course.members
                                  }{" "}
                                  Members
                                </span>
                              </div>
                            )}
                            {course.CourseType === "Live Session" && (
                              <div className="justify-content-between">
                                <span className="ml-4 f-12 text-secondary">
                                  {course.members} Members
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </div>
              ))}
            </OwlCarousel>
          </div>
          {loading && <Row gutter={8} className="p-12">
            <Col xs={12} md={8}>
              <div className="cards-list-skelton lms-card-skelton" >
                <Skeleton.Image active shape='square' />
                <Skeleton active paragraph={{ rows: 2 }} />
                <Skeleton.Button active shape='square' />
                <Skeleton active paragraph={{ rows: 0 }} />
              </div>
            </Col>
            <Col xs={12} md={8}>
              <div className="cards-list-skelton lms-card-skelton" >
                <Skeleton.Image active shape='square' />
                <Skeleton active paragraph={{ rows: 2 }} />
                <Skeleton.Button active shape='square' />
                <Skeleton active paragraph={{ rows: 0 }} />
              </div>
            </Col>
            <Col xs={12} md={8}>
              <div className="cards-list-skelton lms-card-skelton" >
                <Skeleton.Image active shape='square' />
                <Skeleton active paragraph={{ rows: 2 }} />
                <Skeleton.Button active shape='square' />
                <Skeleton active paragraph={{ rows: 0 }} />
              </div>
            </Col>
          </Row>}
          {!loading && courses?.length === 0 && <Empty />}
        </Card>
      )}
      {!props.type && (
        <Card
          bordered={false}
          title={props.title || methods[props.path.replace(/\\|\//g, "")]}
          extra={props.type && <Link to={`${props.type}`}>View all</Link>}
        >
          <div className="px-12 pt-12 pb-8">
            <Row gutter={8}>
              {courses?.map((course, indx) => (
                <Col
                  key={indx}
                  xs={24}
                  md={props.type ? 12 : 8}
                  lg={props.type ? 8 : 6}
                //  md={8} lg={6}
                >
                  <Card
                    className="card-item custom-card"
                    onClick={() => { props.history.push("course/" + course.id) }}
                    cover={
                      <>
                        <img
                          alt="photography"
                          src={
                            course.image.length > 0 ? course.image : photography
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
                            <Paragraph
                              ellipsis={{ rows: 2 }}
                              className="f-14 text-primary mb-8"
                              style={{ height: "42px" }}
                            >
                              {course.description}
                            </Paragraph>
                            {course.CourseType === "Live Session" && (
                              <Paragraph className="job-ldate f-12 semibold text-secondary">
                                Starts On {" "}
                                <span className="semibold text-primary f-14">
                                  <Moment format="MM/DD/YYYY">
                                    {course.LiveDate}
                                  </Moment>
                                </span>
                              </Paragraph>
                            )}
                            {course.CourseType === "Content" && (
                              <Paragraph className="job-ldate f-12 semibold text-secondary">
                                Created On {" "}
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
                                    course.members
                                  }{" "}
                                  Members
                                </span>
                              </div>
                            )}
                            {course.CourseType === "Live Session" && (
                              <div className="justify-content-between">
                                <span className="ml-4 f-12 text-secondary">
                                  {course.members} Members
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
          {loading && <Row gutter={8} className="p-12">
            <Col xs={12} md={8} lg={6}> 
              <div className="cards-list-skelton lms-card-skelton" >
                <Skeleton.Image active shape='square' />
                <Skeleton active paragraph={{ rows: 2 }} />
                <Skeleton.Button active shape='square' />
                <Skeleton active paragraph={{ rows: 0 }} />
              </div>
            </Col>
            <Col xs={12} md={8} lg={6}>
              <div className="cards-list-skelton lms-card-skelton" >
                <Skeleton.Image active shape='square' />
                <Skeleton active paragraph={{ rows: 2 }} />
                <Skeleton.Button active shape='square' />
                <Skeleton active paragraph={{ rows: 0 }} />
              </div>
            </Col>
            <Col xs={12} md={8} lg={6}>
              <div className="cards-list-skelton lms-card-skelton" >
                <Skeleton.Image active shape='square' />
                <Skeleton active paragraph={{ rows: 2 }} />
                <Skeleton.Button active shape='square' />
                <Skeleton active paragraph={{ rows: 0 }} />
              </div>
            </Col>
            <Col xs={12} md={8} lg={6}>
              <div className="cards-list-skelton lms-card-skelton" >
                <Skeleton.Image active shape='square' />
                <Skeleton active paragraph={{ rows: 2 }} />
                <Skeleton.Button active shape='square' />
                <Skeleton active paragraph={{ rows: 0 }} />
              </div>
            </Col>
          </Row>}
          {!loading && courses.length === 0 && <Empty />}
        </Card>
      )}
    </div>
  );
};

export default withRouter(AllCourses);
