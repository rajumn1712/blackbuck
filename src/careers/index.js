import React, { Component } from "react";
import { Row, Col, Affix, Input, Button, Select } from "antd";
import Identity from "../components/identity";
import Ads from "../components/ads";
import Carers from "./carers";
import BBScholars from "../shared/components/scholars";
import Tags from "../components/ProfileComponents/tags";
import JobCard from "./jobcard";

const { Option } = Select;
class CMSComponent extends Component {
  render() {
    return (
      <div className="main">
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={6} xl={5} xxl={5}>
              <Identity />
              <Tags />
          </Col>
          <Col xs={24} sm={12} md={16} lg={12} xl={12} xxl={12}>
            <div className="share-box px-16 pt-16 text-left">
              <Row gutter={16} align="middle">
                <Col xs={24} sm={12} md={12} lg={10} xl={10} xxl={10} className="custom-fields">
                  <Select
                    showSearch
                    placeholder="Select State"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="tom">Tom</Option>
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={12} lg={10} xl={10} xxl={10} className="custom-fields">
                  <Select
                    showSearch
                    placeholder="Select City"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="tom">Tom</Option>
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={12} lg={4} xl={4} xxl={4} className="custom-fields">
                  <Button type="primary">Search</Button>
                </Col>
              </Row>
            </div>
            <BBScholars />
            <JobCard />
            <JobCard />
            <JobCard />
            <JobCard />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={7} xxl={7}>
            <Affix offsetTop={86}>
              <Carers /> 
              <Ads />
            </Affix>
          </Col>
        </Row>
      </div>
    );
  }
}
export default CMSComponent;
