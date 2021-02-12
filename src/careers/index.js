import React, { useRef, useState } from "react";
import { Row, Col, Affix, Input, Button, Select, Form } from "antd";
import Identity from "../components/identity";
import Ads from "../components/ads";
import BBScholars from "../shared/components/scholars";
import Tags from "../components/ProfileComponents/tags";
import JobCard from "./jobcard";
import { withRouter } from "react-router-dom";
import { RegionDropdown } from "react-country-region-selector";

const { Option } = Select;

const statesList = [
  {
    "key": "AN",
    "name": "Andaman and Nicobar Islands"
  },
  {
    "key": "AP",
    "name": "Andhra Pradesh"
  },
  {
    "key": "AR",
    "name": "Arunachal Pradesh"
  },
  {
    "key": "AS",
    "name": "Assam"
  },
  {
    "key": "BR",
    "name": "Bihar"
  },
  {
    "key": "CG",
    "name": "Chandigarh"
  },
  {
    "key": "CH",
    "name": "Chhattisgarh"
  },
  {
    "key": "DH",
    "name": "Dadra and Nagar Haveli"
  },
  {
    "key": "DD",
    "name": "Daman and Diu"
  },
  {
    "key": "DL",
    "name": "Delhi"
  },
  {
    "key": "GA",
    "name": "Goa"
  },
  {
    "key": "GJ",
    "name": "Gujarat"
  },
  {
    "key": "HR",
    "name": "Haryana"
  },
  {
    "key": "HP",
    "name": "Himachal Pradesh"
  },
  {
    "key": "JK",
    "name": "Jammu and Kashmir"
  },
  {
    "key": "JH",
    "name": "Jharkhand"
  },
  {
    "key": "KA",
    "name": "Karnataka"
  },
  {
    "key": "KL",
    "name": "Kerala"
  },
  {
    "key": "LD",
    "name": "Lakshadweep"
  },
  {
    "key": "MP",
    "name": "Madhya Pradesh"
  },
  {
    "key": "MH",
    "name": "Maharashtra"
  },
  {
    "key": "MN",
    "name": "Manipur"
  },
  {
    "key": "ML",
    "name": "Meghalaya"
  },
  {
    "key": "MZ",
    "name": "Mizoram"
  },
  {
    "key": "NL",
    "name": "Nagaland"
  },
  {
    "key": "OR",
    "name": "Odisha"
  },
  {
    "key": "PY",
    "name": "Puducherry"
  },
  {
    "key": "PB",
    "name": "Punjab"
  },
  {
    "key": "RJ",
    "name": "Rajasthan"
  },
  {
    "key": "SK",
    "name": "Sikkim"
  },
  {
    "key": "TN",
    "name": "Tamil Nadu"
  },
  {
    "key": "TS",
    "name": "Telangana"
  },
  {
    "key": "TR",
    "name": "Tripura"
  },
  {
    "key": "UK",
    "name": "Uttar Pradesh"
  },
  {
    "key": "UP",
    "name": "Uttarakhand"
  },
  {
    "key": "WB",
    "name": "West Bengal"
  }
];
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
        <Col xs={24} sm={12} md={8} lg={6} xl={5} xxl={5}>

          <Identity />
          <Affix offsetTop={86}>
            <Tags />
          </Affix>
        </Col>
        <Col xs={24} sm={12} md={16} lg={12} xl={12} xxl={12}>
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
                <Col xs={24} sm={12} lg={2}>
                  <Button type="primary" htmlType="submit" className="cms-search"><span className="icons search-icon-white" /></Button>
                </Col>
              </Row>
            </Form>
          </div>
          <BBScholars />
          <JobCard postingsType={"Normal"} refresh={refresh} searchobj={searchObj} postingsType={"jobsearch"} />
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
