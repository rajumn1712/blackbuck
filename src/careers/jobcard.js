import React, { Component } from "react";
import { Button, Typography, Statistic, Card } from "antd";
import Identity from "../components/identity";
import Ads from "../components/ads";
import Postings from "../shared/postings";
import BBScholars from "../shared/components/scholars";
import Tags from "../components/ProfileComponents/tags";
import { LikeOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
class JobCard extends Component {
  render() {
    return (
      <div className="post-card">
        <Card
          bordered={true}
          className="job-card"
          actions={[
            <a>
                <span className="post-icons save-job"></span>Save Job
            </a>,
            <a>
              <span className="post-icons view-job mr-8"></span>View
              Details
            </a>,
            <a>
              <span className="post-icons apply-job"></span>Apply
              Now
            </a>
          ]}
        >
          <div className="p-16">
            <Title className="f-16 semibold text-primary mb-0">
              Front End Developer
            </Title>
            <Paragraph className="f-12 text-secondary">28/01/2021</Paragraph>
            <Paragraph className="f-14 text-primary" ellipsis={{rows: 2}}>
                UI/UX Designer responsibilities include gathering user requirements, designing graphic elements and building navigation components. To be successful in this role, you should have experience with design software and wireframe tools. If you also have a portfolio of professional design projects that includes work with web/mobile applications, we d like to meet you.
            </Paragraph>
            <ul className="d-flex m-0 pl-0 job-req">
              <li className="f-14 text-primary">
                <span className="post-icons job mr-16"></span>
                <div>
                    <Paragraph className="f-12 text-secondary m-0">Type</Paragraph>
                    <Paragraph className="f-14 text-primary m-0">Internship</Paragraph>
                </div>
              </li>
              <li className=" f-14 text-primary ">
                <span className="post-icons role mr-16"></span>
                <div>
                    <Paragraph className="f-12 text-secondary m-0">Role</Paragraph>
                    <Paragraph className="f-14 text-primary m-0">UI Developer</Paragraph>
                </div>
              </li>
              <li className="f-14 text-primary">
                <span className="post-icons location mr-16"></span>
                <div>
                    <Paragraph className="f-12 text-secondary m-0">Location</Paragraph>
                    <Paragraph className="f-14 text-primary m-0">Hyderabad, Telangana</Paragraph>
                </div>
              </li>
            </ul>
            <span className="job-ldate f-12 text-secondary px-8 py-4">Last date | <span className="semibold text-primary">18/02/2021</span></span>
          </div>
        </Card>
      </div>
    );
  }
}
export default JobCard;
