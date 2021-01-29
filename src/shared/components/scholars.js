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

const { Title, Paragraph } = Typography;
class BBScholars extends Component {
  render() {
    return (
      <>
        <div className="friends-thead px-4">
          <Title level={5} style={{ fontWeight: 500 }}>
            Blackbuck Scholars
          </Title>
          <Link
            to="/friendsuggestions"
            className="link-color d-flex align-items-center"
          >
            View all
          </Link>
        </div>
            <div className="friends">
              <Link
                className="more-frnd-btn left"
                onClick={() => {
                  this.carouselRef.prev();
                }}
              >
                <span className="icon left-arrow mr-0"></span>
              </Link>
              <Link
                className="more-frnd-btn"
                onClick={() => {
                  this.carouselRef.next();
                }}
              >
                <span className="icon right-arrow mr-0"></span>
              </Link>
              <OwlCarousel items={3} autoWidth={true}>
                <div className="frnds-list-item">
                  <div className="frnds-img">
                    <div className="scholar-badge p-4">
                      <img src={scholarBadge} />
                    </div>
                    <Link to="">
                      <img src={defaultUser} width="100%" height="100%" />
                    </Link>
                    <a
                      className="removefrnd-btn"
                      onClick={() => console.log("Removed")}
                    ></a>
                  </div>
                  <div style={{ padding: 16 }}>
                    <Paragraph className="frnd-name text-overflow c-default">
                        John Doe
                    </Paragraph>
                    <div className="text-center mt-16">
                      <Button
                        type="default"
                        className="addfrnd semibold"
                        onClick={() => console.log("Profile")}
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="frnds-list-item">
                  <div className="frnds-img">
                    <div className="scholar-badge p-4">
                      <img src={scholarBadge} />
                    </div>
                    <Link to="">
                      <img src={user} width="100%" height="100%" />
                    </Link>
                    <a
                      className="removefrnd-btn"
                      onClick={() => console.log("Removed")}
                    ></a>
                  </div>
                  <div style={{ padding: 16 }}>
                    <Paragraph className="frnd-name text-overflow c-default">
                        Sherlyn Chopra
                    </Paragraph>
                    <div className="text-center mt-16">
                      <Button
                        type="default"
                        className="addfrnd semibold"
                        onClick={() => console.log("Profile")}
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="frnds-list-item">
                  <div className="frnds-img">
                    <div className="scholar-badge p-4">
                      <img src={scholarBadge} />
                    </div>
                    <Link to="">
                      <img src={userimage} width="100%" height="100%" />
                    </Link>
                    <a
                      className="removefrnd-btn"
                      onClick={() => console.log("Removed")}
                    ></a>
                  </div>
                  <div style={{ padding: 16 }}>
                    <Paragraph className="frnd-name text-overflow c-default">
                        William Smith
                    </Paragraph>
                    <div className="text-center mt-16">
                      <Button
                        type="default"
                        className="addfrnd semibold"
                        onClick={() => console.log("Profile")}
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="frnds-list-item viewall-item">
                  <Link to="/friendsuggestions">
                    <Button type="default" className="addfrnd semibold">
                      View all
                    </Button>
                  </Link>
                </div>
              </OwlCarousel>
            </div>
      </>
    );
  }
}
export default BBScholars;
