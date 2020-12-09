import React, { Component } from "react";
import { Card, Avatar, List, Input } from "antd";
import { Link } from "react-router-dom";
import { store } from "../../store";
import "../../index.css";
import "../../App.css";
import CommonModal from "./CommonModal";
import notify from "../../shared/components/notification";
import { fetchInterestsLu } from '../../shared/api/apiServer'

const { Search } = Input;

class Interests extends Component {
  state = {
    interests: this.props.interests,
    interestsLu: [],
    visible: false,
    search: null,
    page: 1,
    pageSize: 10,
    loadMore: true,
    loading: true,
    count:0
  };
  componentDidMount() {
    this.fetchInterestsLu(10,0);
  }
  fetchInterestsLu = (take,skip) => {
    this.setState({ ...this.state, loading: true });
    fetchInterestsLu(take, skip)
      .then(res => {
        if (res.ok) {
          let { interestsLu } = this.state;
          interestsLu = interestsLu.concat(res.data)
          this.setState({ ...this.state, loading: false, interestsLu: interestsLu, loadMore: res.data.length === this.state.pageSize })
        }
      })
  }

  showModal = (e) => {
    e.preventDefault();
    this.setState({
      visible: true,
    });
  };
  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  };
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };
  handleSearch = (e) => {
    let keyword = e.target.value;
    this.setState({ search: keyword });
  };
  handleInterest = () => {
    notify({
      placement: "bottom",
      message: "Interest",
      description: "Request sent successfully.",
    });
  };
  handleRemove = (e, index) => {
    const indx = [...this.state.interests];
    indx.splice(index, 1);
    this.setState({ interests: indx });
  };

  render() {
    const { user } = store.getState().oidc;
    const { interests, visible, interestsLu,count } = this.state;

    const interesetsList = interestsLu
      .filter((item) => {
        if (this.state.search == null) {
          return item;
        } else if (
          item.title.toLowerCase().includes(this.state.search.toLowerCase())
        ) {
          return item;
        }
      })
      .map((item, index) => {
        return (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item.Image} />}
              title={
                <div className="d-flex align-items-center">
                  <span className="overflow-text">{item.Name}</span>
                </div>
              }
              description={
                <div>
                  <span style={{ color: "var(--textprimary)" }}>
                    {item.members}
                  </span>{" "}
                  Members |{" "}
                  <span style={{ color: "var(--textprimary)" }}>
                    {item.post}
                  </span>{" "}
                  posts
                </div>
              }
            />
            <Link className="f-12 list-link" onClick={this.handleInterest}>
              Interest
            </Link>
            <Link
              className="f-12 list-link ml-16 text-red"
              onClick={(e) => this.handleRemove(e, index)}
            >
              Remove
            </Link>
          </List.Item>
        );
      });

    return (
      <div className="custom-card">
        <Card
          title="Interests"
          bordered={false}
          extra={
            !this.props.IsHideAction ? (
              <Link onClick={this.showModal}>
                <span className="icons add" />
              </Link>
            ) : null
          }
        >
          <List
            grid={{ gutter: 16, column: 2 }}
            itemLayout="horizontal"
            dataSource={interests}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.Image} />}
                  title={
                    <div className="d-flex align-items-center">
                      <span className="overflow-text">{item.Name}</span>
                    </div>
                  }
                  description={
                    <div>
                      <span style={{ color: "var(--textprimary)" }}>
                        {item.Members}
                      </span>{" "}
                      Mutual Friends
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
        <CommonModal
          className="custom-popup modal-interest"
          visible={visible}
          title="Interests"
          cancel={this.handleCancel}
          saved={this.handleOk}
          onScroll={this.handleScroll}
        >
          <div className="modal-search py-16">
            <Search
              className="header-searchbar"
              placeholder="Search Groups / Courses"
              onChange={(e) => this.handleSearch(e)}
            />
          </div>
          <div className="custom-card p-16 bg-white">
            <List itemLayout="horizontal">{interesetsList}</List>
          </div>
          {interesetsList.length !== count && <a className="more-comments mt-16" onClick={() => this.fetchInterestsLu(5, interesetsList.length)}>View more comments</a>}
        </CommonModal>
      </div>
    );
  }
}
export default Interests;
