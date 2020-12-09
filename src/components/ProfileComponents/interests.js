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
  };
  componentDidMount() {
    debugger;
    window.addEventListener('scroll', this.handleScroll)
    this.fetchInterestsLu();
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll)
  }
  fetchInterestsLu = () => {
    this.setState({ ...this.state, loading: true });
    fetchInterestsLu(this.state.pageSize, (this.state.page * this.state.pageSize - this.state.pageSize))
      .then(res => {
        if (res.ok) {
          let { interestsLu } = this.state;
          interestsLu = interestsLu.concat(res.data)
          this.setState({ ...this.state, loading: false, interestsLu: interestsLu, loadMore: res.data.length === this.state.pageSize })
        }
      })
  }
  handleScroll = () => {
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = Math.ceil(windowHeight + window.pageYOffset);
    if (windowBottom >= docHeight) {
      this.loadMore();
    } else {

    }
  }
  loadMore(e) {
    if (this.state.loadMore) {
      let { page } = this.state;
      page += 1;
      this.setState({ ...this.state, page, loading: true }, () => {
        this.fetchInterestsLu();
      })
    }
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
    const { interests, visible, interestsLu } = this.state;

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
        </CommonModal>
      </div>
    );
  }
}
export default Interests;
