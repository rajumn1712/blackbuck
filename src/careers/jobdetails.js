import React, { Component } from "react";
import { Row, Col, Affix, Input, Button, Typography, Card, Divider } from "antd";
import Identity from "../components/identity";
import Ads from "../components/ads";
import Carers from "./carers";
import BBScholars from "../shared/components/scholars";
import Tags from "../components/ProfileComponents/tags";
import JobCard from "./jobcard";

const { Title, Paragraph } = Typography;
class JobDetails extends Component {
  render() {
    return (
      <>
        <a className="f-16 semibold mx-4 text-primary"><span class="icon left-arrow mr-0"></span>Back</a>
        <div className="custom-card mt-12">
          <Card
          >
            <div className="p-12">
              <Title className="f-16 semibold text-primary mb-0">
                Angular Developer
              </Title>
              <Paragraph className="f-12 text-secondary">30/01/2021</Paragraph>
              <Paragraph className="f-14" style={{ color: "var(--primary)" }}>
                Ziraff Technologies Pvt Ltd
              </Paragraph>
              <p className="f-14 text-primary mb-12 job-req">
                <span className="post-icons job mr-16"></span>Internship
              </p>
              <p className="f-14 text-primary mb-12 job-req">
                <span className="post-icons role mr-16"></span>UI Developer
              </p>
              <p className="f-14 text-primary job-req">
                <span className="post-icons location mr-16"></span>Hyderabad,
                Telangana - 500049
              </p>
              <span className="job-ldate f-14 semibold text-secondary px-8 py-4">
                Last date |{" "}
                <span className="semibold text-primary f-16">13/02/2021</span>
              </span>
            </div>
            <div className="p-12 text-right" style={{borderTop: '1px solid var(--border)'}}>
            <Button type="dashed">Save Job</Button><Button type="primary" className="ml-16">Apply Now</Button>
            </div>
          </Card>
          <Card title="Job Description" bordered>
            <div className="p-12">
              <Paragraph className="text-secondary">
                Contrary to popular belief, Lorem Ipsum is not simply random
                text. It has roots in a piece of classical Latin literature from
                45 BC, making it over 2000 years old. Richard McClintock, a
                Latin professor at Hampden-Sydney College in Virginia, looked up
                one of the more obscure Latin words, consectetur, from a Lorem
                Ipsum passage, and going through the cites of the word in
                classical literature, discovered the undoubtable source. Lorem
                Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus
                Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero,
                written in 45 BC. This book is a treatise on the theory of
                ethics, very popular during the Renaissance. The first line of
                Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line
                in section 1.10.32.
              </Paragraph>
              <Paragraph className="text-secondary">
                Contrary to popular belief, Lorem Ipsum is not simply random
                text. It has roots in a piece of classical Latin literature from
                45 BC, making it over 2000 years old. Richard McClintock, a
                Latin professor at Hampden-Sydney College in Virginia, looked up
                one of the more obscure Latin words, consectetur, from a Lorem
                Ipsum passage, and going through the cites of the word in
                classical literature, discovered the undoubtable source. Lorem
                Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus
                Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero,
                written in 45 BC. This book is a treatise on the theory of
                ethics, very popular during the Renaissance. The first line of
                Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line
                in section 1.10.32.
              </Paragraph>
              <Title className="f-16 semibold text-primary mb-8">
                Education
              </Title>
              <Paragraph className="text-primary f-14 mb-4">
                <span className="text-secondary">UG -</span> B-Tech
              </Paragraph>
              <Paragraph className="text-primary f-14 mb-4">
                <span className="text-secondary">PG -</span> Masters of
                Computers Applications
              </Paragraph>
            </div>
          </Card>
          <Card title="Tags" bordered>
            <div className="p-12">
              <a className="job-tag">#UI/UX Designer,</a>
              <a className="job-tag">#UI Developer,</a>
              <a className="job-tag">#FrontEnd Development,</a>
              <a className="job-tag">#Developer,</a>
            </div>
          </Card>
        </div>
      </>
    );
  }
}
export default JobDetails;
