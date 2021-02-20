import React, { Component } from "react";
import { Row, Col, Affix, Typography, Button,Skeleton } from "antd";
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
const options = {
  dots: false,
  responsiveClass: true,
  responsive: {
      0: {
          items: 2    
      },

      992: {
          items: 3
      }
  }

}
class BBScholars extends Component {
  carouselRef;
  state = {
    allScholors: [],
    isViewAllPage: window.location.href.indexOf("scholors") > -1,
    loading: true,
    loadMore:true,
    page:1,
    pageSize:10
  }
  componentDidMount() {
      window.addEventListener("scroll", this.handleScholarsScroll);
    this.getScholors()
  }
  componentWillUnmount() {
      window.removeEventListener("scroll", this.handleScholarsScroll);
  }
  getScholors = async () => {
    this.setState({...this.state,loading:true})
    let { allScholors, loading,page,pageSize,loadMore } = this.state;
    const scholorResponse = await getScholorUsers(pageSize, page * pageSize - pageSize);
    if (scholorResponse.ok) {
      allScholors = allScholors.concat(scholorResponse.data);
      loading = false;
      loadMore = scholorResponse.data.length === pageSize ? true : false;
      this.setState({ ...this.state, allScholors, loading,loadMore });
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
    const { allScholors,isViewAllPage,loading } = this.state;
    if (!allScholors || allScholors?.length === 0) {
      return <>{loading && <Row gutter={8} >
        <Col xs={12} md={8}>
          <div className="cards-list-skelton" >
            <Skeleton.Image active shape='square' />
            <Skeleton active paragraph={{ rows: 1 }} />
            <Skeleton.Button active shape='square' />
          </div>
        </Col>
        <Col xs={12} md={8}>
          <div className="cards-list-skelton" >
            <Skeleton.Image active shape='square' />
            <Skeleton active paragraph={{ rows: 1 }} />
            <Skeleton.Button active shape='square' />
          </div>
        </Col>
        <Col xs={12} md={8}>
          <div className="cards-list-skelton" >
            <Skeleton.Image active shape='square' />
            <Skeleton active paragraph={{ rows: 1 }} />
            <Skeleton.Button active shape='square' />
          </div>
        </Col>
      </Row>
      }
        {!loading && null}
      </>
    }
    if (this.state.isViewAllPage) {
      return (
        <div>
          <Title level={5} className="fw-500">Blackbuck Scholars</Title>
          <Row gutter={8} >
            {allScholors.map((scholor, index) => <Col lg={8}>
              <div className="frnds-list-item mb-10" key={index}>
                <div className="frnds-img">
                  <div className="scholar-badge p-4">
                    {scholor.IsScholor && <img src={scholarBadge} />}
                  </div>
                  <Link to={scholor.UserId === this.props?.profile.Id ? "/profile/IsProfileTab"
                        : "/profileview/" + scholor.UserId}>
                    <img src={scholor.Image || defaultUser} width="100%" height="100%" />
                  </Link>
                </div>
                <div className="p-16">
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
          {isViewAllPage && loading && <Row gutter={8} >
                <Col xs={12} md={8}>
                    <div className="cards-list-skelton" >
                        <Skeleton.Image active shape='square' />
                        <Skeleton active paragraph={{ rows: 1 }} />
                        <Skeleton.Button active shape='square' />
                    </div>
                </Col>
                <Col xs={12} md={8}>
                    <div className="cards-list-skelton" >
                        <Skeleton.Image active shape='square' />
                        <Skeleton active paragraph={{ rows: 1 }} />
                        <Skeleton.Button active shape='square' />
                    </div>
                </Col>
                <Col xs={12} md={8}>
                    <div className="cards-list-skelton" >
                        <Skeleton.Image active shape='square' />
                        <Skeleton active paragraph={{ rows: 1 }} />
                        <Skeleton.Button active shape='square' />
                    </div>
                </Col>
            </Row>}
        </div>
      )
    }
    return (
      <div>
        <div className="friends-thead px-4">
          <Title level={5} className="fw-500">
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
            <OwlCarousel autoWidth={true} ref={(ref) => this.carouselRef = ref}   options={options} key={`carousel_${allScholors.length}`}>
              {allScholors.map((scholor, index) => <div className="frnds-list-item" key={index}>
                <div className="frnds-img">
                  <div className="scholar-badge p-4">
                    {scholor.IsScholor && <img src={scholarBadge} />}
                  </div>
                  <Link to={scholor.UserId === this.props?.profile.Id ? "/profile/IsProfileTab"
                        : "/profileview/" + scholor.UserId}>
                    <img src={scholor.Image || defaultUser} width="100%" height="100%" />
                  </Link>
                </div>
                <div className="p-16">
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
