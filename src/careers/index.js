import React, { useRef, useState } from "react";
import { Row, Col, Affix, Input, Button, Select, Form } from "antd";
import Identity from "../components/identity";
import Ads from "../components/ads";
import BBScholars from "../shared/components/scholars";
import Tags from "../components/ProfileComponents/tags";
import JobCard from "./jobcard";
import { withRouter } from "react-router-dom";
import { statesList } from "../shared/api/apiServer";

const { Option } = Select;

const CMSComponent = (props) => {
  const [form] = Form.useForm();
  const searchjob = {
    stateValue: undefined,
    cityValue: "",
  };
  const [searchObj, setSearchObj] = useState({ ...searchjob });
  const [refresh, setRefresh] = useState(0)
  const childRef = useRef()

  const jobSearch = () => {

    setRefresh(refresh + 1)
  };

  return (
    <div className="main">
      <Row gutter={16}>
        <Col  xs={{span:24 , order:2}} sm={{span:8 , order:1}} lg={6} xl={5} xxl={5}>
          <div className="xs-none">
            <Identity />
          </div>
          <div className="affix-top">
            <Tags />
          </div>
        </Col>
        <Col xs={{span:24 , order:1}}  sm={{span:16 , order:2}}  lg={12} xl={12} xxl={12}>
          <div className="cms-box px-16 pt-16 text-left">
            <Form
              initialValues={{ ...searchjob }}
              onFinishFailed={() => { }}
              onFinish={() => jobSearch()}
              form={form}
            >
              <Row gutter={4}>
                <Col
                  xs={24}
                  sm={12}
                  lg={13}
                >
                  <Form.Item
                    className="custom-fields"
                    name="cityValue"
                    rules={[
                      {
                        required: (searchObj.stateValue ? false : true),
                        message: "Title,Company, or City required",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Search By Title,Company, or City"
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
                  lg={9}
                >
                  <Form.Item className="custom-fields state-search"
                    name="stateValue"
                    rules={[{ required: (searchObj.cityValue ? false : true), message: "State required" }]}>
                    <Select
                      showSearch
                      placeholder="Search By State"
                      allowClear
                      optionFilterProp="children"
                      value={searchObj.stateValue}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={(value) => {
                        searchObj.stateValue = value;
                        setSearchObj({ ...searchObj });
                      }}
                    >
                      {statesList.map(statevalue => <Option key={statevalue.key} value={statevalue.name}>{statevalue.name}</Option>)}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} lg={2} className="text-center">
                  <Button type="primary" htmlType="submit" className="cms-search"><span className="icons search-icon-white" /></Button>
                </Col>
              </Row>
            </Form>
          </div>
          <BBScholars />
          <JobCard postingsType={"Normal"} refresh={refresh} searchobj={searchObj} postingsType={"jobsearch"} />
        </Col>
        <Col xs={{span:24 , order:3}} sm={{span:12 , order:3}} md={8} lg={6} xl={7} xxl={7}>
          <div className="affix-top">
            {/* <Carers />  */}
            <Ads />
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default withRouter(CMSComponent);
