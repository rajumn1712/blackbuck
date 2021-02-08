import React, { useEffect, useState } from 'react';
import { getCoursesByType } from '../shared/api/apiServer';
import { Card, Col, Row, Empty, Typography } from "antd";
import photography from "../styles/images/default-cover.png";
import { Link, withRouter } from "react-router-dom";
import Moment from "react-moment";
import Loader from "../common/loader";

const { Paragraph } = Typography;
const { Meta } = Card;

const AllCourses = (props)=>{
    let page = 1;
    let size = 10;

    const [loading,setLoading] = useState(false);
    let [courses,setCourses] = useState([]);

    useEffect(()=>{
        loadCoursesByType(page,size);
    },[]);

    const loadCoursesByType = async (pageNo,pagesize)=>{
        setLoading(true);
        const response = await getCoursesByType((props.type || props.path.replace(/\\|\//g,'')),pagesize,pagesize * pageNo - pagesize);
        if(response.ok){
            courses = courses.concat(response.data);
            setCourses([...courses]);
            setLoading(false);
        }
    }
    return(
        <Card bordered={false} title={props.title} extra={
            props.type && <Link to={`${props.type}`}>View all</Link>
        }>
              <div className="px-12 pt-12 pb-8">
                <Row gutter={16}>
                  {courses?.map((course, indx) => (
                    <Col key={indx} xs={24} md={12} lg={8}>
                      <Card
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
                              <div>
                                {course.CourseType === "Live Session" && (
                                  <Paragraph className="f-12 semibold text-secondary text-uppercase">
                                    Starts On :{" "}
                                    <span className="semibold text-primary f-16 d-block">
                                      <Moment format="MM/DD/YYYY">
                                        {course.LiveDate}
                                      </Moment>
                                    </span>
                                  </Paragraph>
                                )}
                                {course.CourseType === "Content" && (
                                  <Paragraph className="f-12 semibold text-secondary text-uppercase">
                                    Created On :{" "}
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
                                      {`${
                                        course.videos === 1 ? "Video" : "Videos"
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
                                        course.members
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
                    </Col>
                  ))}
                </Row>
              </div>
              {loading && <Loader className="loader-top-middle" />}
              {!loading &&
                courses.length === 0 && <Empty />}
            </Card>
    )
}

export default withRouter(AllCourses);