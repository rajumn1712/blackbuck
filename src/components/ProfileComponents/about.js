import React, { Component, createRef } from "react";
import { Button, Card, Divider, Row, Col, Form, Input, Select } from "antd";
import { Link } from "react-router-dom";
// import { userManager } from '../../shared/authentication/auth';
import { store } from "../../store";
// import User1 from '../../styles/images/avatar.png';
// import User2 from '../../styles/images/user.jpg';
// import User3 from '../../styles/images/user_image.jpg';
// import User4 from '../../styles/images/user-image.jpg';
// import { userLogout } from '../../reducers/auth';
import "../../index.css";
import "../../App.css";
import TextArea from "antd/lib/input/TextArea";
import CommonModal from "./CommonModal";
import { ErrorMessage, Field, Formik } from "formik";
const { Option } = Select;

class About extends Component {
  state = {
    PhoneNumber: this.props.about.PhoneNumber,
    Email: this.props.about.Email,
    AboutMe: this.props.about.Aboutme,
    address: this.props.about.Address,
    visible: false,
    errors: {},
  };
  initialValues = {
    BlockHouseNo: "",
    BuildingEstate: "",
    Address: "",
    City: "",
    State: "",
    Country: "",
    PostalCode: "",
    PhoneNumber: "",
    AboutMe: "",
  };
  errors = {};
  handleValidate = (values) => {
    // if (!value.Email) {
    //     errors.Email = "Required!";
    // } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value.Email)) {
    //     errors.Email = "Invalid email address!";
    // }
    for (var key in values) {
      if (!values[key]) {
        this.errors[key] = "is required";
      }
    }

    return this.errors;
  };
  handleOnChange = (event) => {
    const input = event.target;
    const user = { ...this.state };
    user[input.name] = input.value;
    this.setState(user);
  };
  showModal = (e) => {
    e.preventDefault();
    this.setState({
      visible: true,
    });
  };
  handleOk = () => {
    let { errors } = this.state;
    errors = this.handleValidate(this.formRef.current.values);
    this.setState({ errors: errors });
    // this.setState({
    //     visible: false,
    // });
  };
  handleCancel = (e) => {
    this.errors = {};
    this.setState({
      visible: false,
      errors: {},
    });
  };
  formRef = createRef();
  render() {
    const { user } = store.getState().oidc;

    const {
      PhoneNumber,
      Email,
      AboutMe,
      address,
      visible,
      errors,
    } = this.state;

    return (
      <div className="custom-card profile-card">
        <Card
          title="About Me"
          bordered={false}
          extra={
            !this.props.IsHideAction ? (
              <Link onClick={this.showModal}>
                <span className="icons edit" />
              </Link>
            ) : null
          }
          actions={[
            !this.props.IsHideAction ? (
              <Button type="primary">Download Profile as PDF</Button>
            ) : null,
          ]}
        >
          <div>
            {AboutMe && <p>{AboutMe}</p>}
            <Divider className="text-left-line" orientation="left">
              Contact
            </Divider>
            <Row gutter={16}>
              {address.length > 0 && (
                <Col xs={24} sm={12}>
                  <div className="about-details">
                    <div className="about-icons">
                      <span className="icons location c-default" />
                    </div>
                    {address.map((address, index) => {
                      return (
                        <p key={index}>
                          {Object.keys(address)
                            .map((k) => {
                              return address[k];
                            })
                            .join(",")}
                        </p>
                      );
                    })}
                  </div>
                </Col>
              )}
              {PhoneNumber && (
                <Col xs={24} sm={12}>
                  <div className="about-details">
                    <div className="about-icons">
                      <span className="icons phone c-default" />
                    </div>
                    <p>{PhoneNumber}</p>
                  </div>
                </Col>
              )}
              {Email && (
                <Col xs={24} sm={12}>
                  <div className="about-details">
                    <div className="about-icons">
                      <span className="icons email c-default" />
                    </div>
                    <p>{Email}</p>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        </Card>
        <CommonModal
          className="custom-popup"
          visible={visible}
          title="About Me"
          cancel={this.handleCancel}
          saved={this.handleOk.bind(this)}
        >
          <Formik
            initialValues={this.initialValues}
            innerRef={this.formRef}
            validate={(values) => this.handleValidate(values)}
          >
            {({ touched }) => {
              return (
                <Form layout="vertical">
                  <Row gutter={16}>
                    {/* <Col xs={24}>
                                    <h3>Contact</h3>
                                </Col> */}
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Plot No"
                        className="custom-fields"
                        rules={[{ required: true, message: "is required" }]}
                      >
                        <Field
                          className="ant-input"
                          value={address[0]?.BlockHouseNo}
                          name="BlockHouseNo"
                          onChange={this.handleOnChange}
                        />
                        <span className="validateerror">
                          <ErrorMessage name="BlockHouseNo" />
                        </span>
                        {errors["BlockHouseNo"] && !touched.BlockHouseNo ? (
                          <span className="validateerror">
                            {errors["BlockHouseNo"]}
                          </span>
                        ) : null}
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Street Name" className="custom-fields">
                        <Field
                          className="ant-input"
                          value={address[0]?.BuildingEstate}
                          name="BuildingEstate"
                          onChange={this.handleOnChange}
                        />
                        <span className="validateerror">
                          <ErrorMessage name="BuildingEstate" />
                        </span>
                        {errors["BlockHouseNo"] && !touched.BuildingEstate ? (
                          <span className="validateerror">
                            {errors["BuildingEstate"]}
                          </span>
                        ) : null}
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item label="Address" className="custom-fields">
                        <Field
                          className="ant-input"
                          value={address[0]?.Address}
                          name="Address"
                          onChange={this.handleOnChange}
                        />
                        <span className="validateerror">
                          <ErrorMessage name="Address" />
                        </span>
                        {errors["BlockHouseNo"] && !touched.Address ? (
                          <span className="validateerror">
                            {errors["Address"]}
                          </span>
                        ) : null}
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label="City" className="custom-fields">
                        <Field
                          className="ant-input"
                          value={address[0]?.City}
                          name="City"
                          onChange={this.handleOnChange}
                        />
                        <span className="validateerror">
                          <ErrorMessage name="City" />
                        </span>
                        {errors["BlockHouseNo"] && !touched.City ? (
                          <span className="validateerror">
                            {errors["City"]}
                          </span>
                        ) : null}
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="State"
                        className="custom-fields custom-select"
                      >
                        <Select
                          defaultValue="Select Option"
                          value={address[0]?.State}
                          name="State"
                          onChange={this.handleOnChange}
                        >
                          <Option value="Select Option">Select State</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Country"
                        className="custom-fields custom-select"
                      >
                        <Select
                          id="select"
                          value={address[0]?.Country}
                          name="Country"
                          onChange={this.handleOnChange.bind(this)}
                        >
                          <Option value="Select Option">Select Option</Option>
                          <Option value="India">India</Option>
                          <Option value="Singapore">Singapore</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Pin Code" className="custom-fields">
                        <Field
                          className="ant-input"
                          value={address[0]?.PostalCode}
                          name="PostalCode"
                          onChange={this.handleOnChange}
                        />
                        <span className="validateerror">
                          <ErrorMessage name="PostalCode" />
                        </span>
                        {errors["BlockHouseNo"] && !touched.PostalCode ? (
                          <span className="validateerror">
                            {errors["PostalCode"]}
                          </span>
                        ) : null}
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24}>
                      <Form.Item label="Phone Number" className="custom-fields">
                        <Field
                          className="ant-input"
                          value={PhoneNumber}
                          name="PhoneNumber"
                          onChange={this.handleOnChange}
                        />
                        <span className="validateerror">
                          <ErrorMessage name="PhoneNumber" />
                        </span>
                        {errors["BlockHouseNo"] && !touched.PhoneNumber ? (
                          <span className="validateerror">
                            {errors["PhoneNumber"]}
                          </span>
                        ) : null}
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24}>
                      <Form.Item label="Email" className="custom-fields">
                        <Input
                          value={Email}
                          name="Email"
                          onChange={this.handleOnChange}
                          disabled
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item
                        label="About Me"
                        className="custom-fields mb-24"
                      >
                        <Field
                          component="textarea"
                          className="ant-input"
                          autoSize={{ minRows: 2, maxRows: 6 }}
                          value={AboutMe}
                          name="AboutMe"
                          onChange={this.handleOnChange}
                        />
                        <span className="validateerror">
                          <ErrorMessage name="AboutMe" />
                        </span>
                        {errors["BlockHouseNo"] && !touched.AboutMe ? (
                          <span className="validateerror">
                            {errors["AboutMe"]}
                          </span>
                        ) : null}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              );
            }}
          </Formik>
        </CommonModal>
      </div>
    );
  }
}
export default About;
