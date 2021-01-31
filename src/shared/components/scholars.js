import React, { Component } from "react";
import { Row, Col, Affix, Typography, Button } from "antd";
import { Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel2";
import "react-owl-carousel2/src/owl.carousel.css";
import "react-owl-carousel2/src/owl.theme.default.css";
import defaultUser from "../../styles/images/defaultuser.jpg";
import user from "../../styles/images/user.jpg";
import userimage from "../../styles/images/user_image.jpg";
import scholarBadge from "../../styles/images/premiumbadge.svg";
import { getScholorUsers } from '../../shared/api/apiServer';
import notify from '../../shared/components/notification';
import Loader from "../../common/loader";
import { connect } from "react-redux";

const { Title, Paragraph } = Typography;
class BBScholars extends Component {
  carouselRef;
  state = {
    allScholors: [],
    isViewAllPage: window.location.href.indexOf("scholors") > -1,
    loading: false,
    loadMore:true,
    page:1,
    pageSize:4
  }
  componentDidMount() {
    if(window.location.href.indexOf("scholars") > -1){
      window.addEventListener("scroll", this.handleScholarsScroll);
    }
    this.getScholors()
  }
  componentWillUnmount() {
    if(window.location.href.indexOf("scholars") > -1){
      window.addEventListener("scroll", this.handleScholarsScroll);
    }
  }
  getScholors = async () => {
    this.setState({...this.state,loading:true})
    let { allScholors, loading,page,pageSize,loadMore } = this.state;
    const scholorResponse = await getScholorUsers(pageSize, page * pageSize - pageSize);
    if (scholorResponse.ok) {
      allScholors = allScholors.concat(scholorResponse.data);
      loading = false;
      loadMore = scholorResponse.data.length = allScholors.length;
      this.setState({ ...this.state, allScholors, loading });
    } else {
      loading = false;
      this.setState({ ...this.state, allScholors, loading });
      notify({
        description: "Something went wrong'",
        message: "Error",
        type: "error",
      });
    }
  }
  handleScholarsScroll = () => {
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
  loadMore(e) {
    if (this.state.loadMore && !this.state.loading) {
      let { page } = this.state;
      page += 1;
      this.setState({ ...this.state, page, loading: true }, () => {
        this.getScholors();
      });
    }
  }
  render() {
    const { allScholors } = this.state;
    if (!allScholors || allScholors?.length === 0) { return null; }
    if (this.state.isViewAllPage) {
      return (
        <div onScroll={this.handleScholarsScroll}>
          <Row gutter={8} >
            {allScholors.map((scholor, index) => <Col lg={8}>
              <div className="frnds-list-item">
                <div className="frnds-img">
                  <div className="scholar-badge p-4">
                    {scholor.IsScholor && <img src={scholarBadge} />}
                  </div>
                  <Link to="">
                    <img src={scholor.Image || defaultUser} width="100%" height="100%" />
                  </Link>
                </div>
                <div style={{ padding: 16 }}>
                  <Paragraph className="frnd-name text-overflow c-default">
                    {scholor.Firstname}
                  </Paragraph>
                  <div className="text-center mt-16">
                    <Button
                      type="default"
                      className="addfrnd semibold"
                    >
                      <Link to={scholor.UserId === this.props?.profile.Id ? "/profile/IsProfileTab"
                        : "/profileview/" + scholor.UserId}>  View Profile</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Col>)}
          </Row>
          {this.state.isViewAllPage && this.state.loading && <Loader className="loader-top-middle" />}
        </div>
      )
    }
    return (
      <div>
        <div className="friends-thead px-4">
          <Title level={5} style={{ fontWeight: 500 }}>
            Blackbuck Scholars
          </Title>
          <Link
            to="/scholors"
            className="link-color d-flex align-items-center"
          >
            View all
          </Link>
        </div>
        <Row gutter={8}>
          <div className="friends">
            {(allScholors?.length > 4) && <><Link className="more-frnd-btn left" onClick={() => { this.carouselRef.prev() }}><span className="icon left-arrow mr-0"></span></Link><Link className="more-frnd-btn" onClick={() => { this.carouselRef.next() }}><span className="icon right-arrow mr-0"></span></Link></>}
            <OwlCarousel items={3} autoWidth={true} ref={(ref) => this.carouselRef = ref} key={`carousel_${allScholors}`}>
              {allScholors.map((scholor, index) => <div className="frnds-list-item">
                <div className="frnds-img">
                  <div className="scholar-badge p-4">
                    {scholor.IsScholor && <img src={scholarBadge} />}
                  </div>
                  <Link to="">
                    <img src={scholor.Image || defaultUser} width="100%" height="100%" />
                  </Link>
                </div>
                <div style={{ padding: 16 }}>
                  <Paragraph className="frnd-name text-overflow c-default">
                    {scholor.Firstname}
                  </Paragraph>
                  <div className="text-center mt-16">
                    <Button
                      type="default"
                      className="addfrnd semibold"
                    >
                      <Link to={scholor.UserId === this.props?.profile.Id ? "/profile/IsProfileTab"
                        : "/profileview/" + scholor.UserId}>  View Profile</Link>
                    </Button>
                  </div>
                </div>
              </div>)}
            </OwlCarousel>
          </div>
        </Row>
      </div>
    )
  }
}
const mapStateToProps = ({ oidc }) => {
  return { profile: oidc.profile };
};

export default connect(mapStateToProps)(BBScholars);
