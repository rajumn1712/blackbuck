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

class Courses extends Component {
  state = {
    courses: [],
    loading: false,
  };

  componentDidMount() {
    this.getCourseSuggestions();
  }
  async getCourseSuggestions(isDataRefreshed) {
    this.setState({ ...this.state, loading: true });
    const getcourses = await (this.props?.loadUserCourse
      ? getUserCourses
      : fetchCourseSuggestions)(this.props?.profile?.Id, 10, 0);
    let { courses } = this.state;
    courses = getcourses.data;
    if (getcourses.ok) {
      this.setState({ courses, loading: false });
      if (isDataRefreshed) {
        this.props.isDataRefreshed(isDataRefreshed);
        this.props.isDataRefreshed(false);
      }
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
    const joinResponse = await joinGroup(item.id, obj);
    if (joinResponse.ok) {
      notify({
        message: "Courses join",
        description:
          item.type === "Private" ? "Request sent" : "Joined to course",
      });
      // if (item.type !== 'Private') {
      //     this.props.profile.Groups = (this.props.profile.Groups ? this.props.profile.Groups : 0) + 1;
      //     this.props.updateProfile(this.props.profile)
      // }
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

    const { courses } = this.state;
    return (
      <div className="custom-card">
        {/* {this.state.loading && <Loader className="loader-top-middle" />} */}
        <Card
          title="Courses"
          bordered={false}
          extra={
            !this.props.IsHideAction ? (
              <Link to="/commingsoon">View all</Link>
            ) : null
          }
        >
          <List
            itemLayout="horizontal"
            dataSource={courses}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.image} />}
                  title={
                    <div className="d-flex align-items-center">
                      <span className="overflow-text">{item.name}</span>
                    </div>
                  }
                  description={
                    <div>
                      {item.members && (
                        <span style={{ color: "var(--textprimary)" }}>
                          {item.members}
                        </span>
                      )}{" "}
                      Members |{" "}
                      {item.posts && (
                        <span style={{ color: "var(--textprimary)" }}>
                          {item.posts}
                        </span>
                      )}{" "}
                      posts
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
                      className="ml-8 f-12 list-link ml-16"
                      onClick={() => this.handleCourseJoin(item)}
                    >
                      Join
                    </Link>
                  ))}
              </List.Item>
            )}
          />
        </Card>
      </div>
    );
  }
}
const mapStateToProps = ({ oidc }) => {
  return { profile: oidc.profile };
};
export default connect(mapStateToProps)(Courses);
