import React, { Component, useState } from "react";
import { Row, Col, Affix, Input, Button, Select, Form } from "antd";
import Identity from "../components/identity";
import Ads from "../components/ads";
import Carers from "./carers";
import BBScholars from "../shared/components/scholars";
import Tags from "../components/ProfileComponents/tags";
import JobCard from "./jobcard";
import { withRouter } from "react-router-dom";
import { RegionDropdown } from "react-country-region-selector";

const { Option } = Select;
const CMSComponent = (props) => {
  const [form] = Form.useForm();
  const searchjob = {
    stateValue: "",
    cityValue: "",
  };
  const [searchObj, setSearchObj] = useState({ ...searchjob });

  const jobSearch = () => {
    props.history.push(
      `/jobsearch/${searchObj.stateValue}/${searchObj.cityValue}`
    );
  };

  return (
    <div className="main">
      <Row gutter={16}>
        <Col xs={24} sm={12} md={8} lg={6} xl={5} xxl={5}>
          <Affix offsetTop={86}>
            <Identity />
            <Tags />
          </Affix>
        </Col>
        <Col xs={24} sm={12} md={16} lg={12} xl={12} xxl={12}>
          <div className="share-box px-16 pt-16 text-left">
          <Form
                initialValues={{ ...searchjob }}
                onFinishFailed={() => {}}
                onFinish={() => jobSearch()}
                form={form}
              >
            <Row gutter={16} align="middle">
                <Col
                  xs={24}
                  sm={12}
                  md={12}
                  lg={10}
                  xl={10}
                  xxl={10}
                  className="custom-fields"
                >
                  <Form.Item className="custom-fields"
                        name="stateValue"
                        rules={[{ required: true, message: "State  required" }]}>
                   <Select
                    showSearch
                    placeholder="Select By State"
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
                  </Form.Item>
                </Col>
                <Col
                  xs={24}
                  sm={12}
                  md={12}
                  lg={10}
                  xl={10}
                  xxl={10}
                  className="custom-fields"
                >
                  <Form.Item
                    className="custom-fields"
                    name="cityValue"
                    rules={[
                      {
                        required: true,
                        message: "City required",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Search By City"
                      name="cityValue"
                      onChange={(e) => {
                        searchObj.cityValue = e.currentTarget.value;
                        setSearchObj({ ...searchObj });
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col
                  xs={24}
                  sm={12}
                  md={12}
                  lg={4}
                  xl={4}
                  xxl={4}
                  className="custom-fields"
                >
                  <Button type="primary" htmlType="submit">
                    Search
                  </Button>
                </Col>
            </Row>
            </Form>
          </div>
          <BBScholars />
          <JobCard postingsType={"Normal"} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={7} xxl={7}>
          <Affix offsetTop={86}>
            {/* <Carers />  */}
            <Ads />
          </Affix>
        </Col>
      </Row>
    </div>
  );
};
export default withRouter(CMSComponent);
