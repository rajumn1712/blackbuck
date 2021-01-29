import React, { Component } from "react";
import { Card, Avatar, List } from "antd";
import { Link } from "react-router-dom";
import { store } from "../../store";
import "../../index.css";
import "../../App.css";
import notify from "../../shared/components/notification";
import {
  fetchCourseSuggestions,
  getUserCourses,
  joinGroup,
} from "../../shared/api/apiServer";
import Loader from "../../common/loader";
import { connect } from "react-redux";
import { lmsJoinCourse } from "../../lms/api";
import { responsiveArray } from "antd/lib/_util/responsiveObserve";

class Courses extends Component {
  state = {
    courses: [],
    loading: false,
    size:0
  };

  componentDidMount() {
    this.getCourseSuggestions();
  }
  async getCourseSuggestions(isDataRefreshed) {
    this.setState({ ...this.state, loading: true });
    const getcourses = await (this.props?.loadUserCourse
      ? getUserCourses
      : fetchCourseSuggestions)(this.props?.profile?.Id, 5, 1);
    let { courses } = this.state;
    courses = courses.concat(getcourses.data);
    if (getcourses.ok) {
      this.setState({ courses, loading: false,size:getcourses.data.length });
    }
  }

  handleCourseJoin = async (item) => {
    const obj = {
      UserId: this.props?.profile?.Id,
      Firstname: this.props?.profile?.FirstName,
      Lastname: this.props?.profile?.LastName,
      Image: this.props?.profile?.ProfilePic,
      Email: this.props?.profile?.Email,
    };
    if (item.type == "Private") {
      obj.Type = "request";
    }
    const joinResponse = await lmsJoinCourse(item.id, obj);
    if (joinResponse.ok) {
      notify({
        message: "Courses join",
        description:
          item.type === "Private" ? "Request sent" : "Course joined successfully",
      });
      // if (item.type !== 'Private') {
      //     this.props.profile.Groups = (this.props.profile.Groups ? this.props.profile.Groups : 0) + 1;
      //     this.props.updateProfile(this.props.profile)
      // }
      if(this.props.isDataReferesh){
        this.props.isDataReferesh.loadCourses("1")
      }
      this.updateCourse(item);
    } else {
      notify({
        message: "Error",
        description: "Something went wrong :)",
        type: "error",
      });
    }
  };
  updateCourse(item) {
    let { data } = this.state;
    if (item.type === "Private") {
      for (const i in data) {
        let _item = data[i];
        if (_item.id === item.id) {
          _item.requestJoin = _item.requestJoin ? null : "request";
        }
      }
      this.setState({ ...this.state, data });
    } else {
      this.getCourseSuggestions(true);
    }
  }

  render() {
    const { user } = store.getState().oidc;

    const { courses,size,loading } = this.state;
    return (
      <div className="custom-card sub-text card-scroll">
        {/* {this.state.loading && <Loader className="loader-top-middle" />} */}
        <Card
          title="Courses"
          bordered={false}
          extra={
            !this.props.IsHideAction ? (
              <Link to="/lms">View all</Link>
            ) : null
          }
        >
          <List
          loading={loading}
            itemLayout="horizontal"
            dataSource={courses}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.image} />}
                  title={
                    <div className="d-flex align-items-center mr-16">
                      {(!this.props.IsHideAction && this.props.loadUserCourse) ? <Link to={"/course/" + item.id} title={item.name} className="text-primary text-overflow">{item.name}</Link> : <span className="overflow-text">{item.name}</span>}

                    </div>
                  }
                  description={
                    <div className="f-12 text-secondary">
                      {item.members && (
                        <span>
                          {!this.props.loadUserCourse ? item.members : item.members.concat(item.AdminUsers).length}
                        </span>
                      )}{" "}
                      Members 
                      {/* |{" "}
                      {item.posts && (
                        <span>
                          {item.posts}
                        </span>
                      )}{" "}
                      posts */}
                    </div>
                  }
                />
                {!this.props?.loadUserCourse &&
                  (item.requestJoin === "request" ? (
                    <Link
                      className="ml-8 f-12 list-link ml-16"
                      onClick={() => this.cancelGroupRequest(item)}
                    >
                      Cancel request
                    </Link>
                  ) : (
                      <Link
                        className="text-center f-12 list-link"
                        onClick={() => this.handleCourseJoin(item)}
                      >
                        Join
                      </Link>
                    ))}
              </List.Item>
            )}
          />
          {!this.props?.loadUserCourse && <div className="text-center">
              {size >= 5 && (
                <a className="more-comments" onClick={() => this.getCourseSuggestions()}>
                  View more courses
                </a>
              )}
            </div>}
        </Card>
      </div>
    );
  }
}
const mapStateToProps = ({ oidc }) => {
  return { profile: oidc.profile };
};
export default connect(mapStateToProps)(Courses);
