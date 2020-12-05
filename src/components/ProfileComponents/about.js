import React, { Component, createRef } from "react";
import { Card, Divider, Row, Col, Form, Input, Select } from "antd";
import { Link } from "react-router-dom";
import { store } from "../../store";
import "../../index.css";
import "../../App.css";
import CommonModal from "./CommonModal";
import { ErrorMessage, Field, Formik } from "formik";
import deepEqual from "lodash.isequal";
const { Option } = Select;

class About extends Component {
  state = {
    PhoneNumber: this.props.about.PhoneNumber,
    Email: this.props.about.Email,
    AboutMe: this.props.about.Aboutme,
    address: this.props.about.Address,
    visible: false,
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
  handleValidate = (values) => {
    let errors = {};
    // if (!value.Email) {
    //     errors.Email = "Required!";
    // } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value.Email)) {
    //     errors.Email = "Invalid email address!";
    // }
    for (var key in values) {
      if (!values[key]) {
        errors[key] = "is required";
      }
    }

    return errors;
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
    this.formRef.current.handleSubmit();
    const hasChanged = deepEqual(
      this.formRef.current.values,
      this.initialValues
    );
    if (!hasChanged) {
      this.setState({
        visible: false,
      });
    }
  };
  handleCancel = (e) => {
    this.formRef.current.setErrors({});
    this.setState({
      visible: false,
      errors: {},
    });
  };
  formRef = createRef();
  render() {
    const { user } = store.getState().oidc;

    const { PhoneNumber, Email, AboutMe, address, visible } = this.state;

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
            {({ values }) => {
              return (
                <Form layout="vertical">
                  <Row gutter={16}>
                    {/* <Col xs={24}>
                                    <h3>Contact</h3>
                                </Col> */}
                    <Col xs={24} sm={12}>
                      <Form.Item label="Plot No" className="custom-fields">
                        <Field
                          className="ant-input"
                          value={values.BlockHouseNo}
                          name="BlockHouseNo"
                        />
                        <span className="validateerror">
                          <ErrorMessage name="BlockHouseNo" />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Street Name" className="custom-fields">
                        <Field
                          className="ant-input"
                          value={values.BuildingEstate}
                          name="BuildingEstate"
                        />
                        <span className="validateerror">
                          <ErrorMessage name="BuildingEstate" />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item label="Address" className="custom-fields">
                        <Field
                          className="ant-input"
                          value={values.Address}
                          name="Address"
                        />
                        <span className="validateerror">
                          <ErrorMessage name="Address" />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label="City" className="custom-fields">
                        <Field
                          className="ant-input"
                          value={values.City}
                          name="City"
                        />
                        <span className="validateerror">
                          <ErrorMessage name="City" />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="State"
                        className="custom-fields custom-select"
                      >
                        <Select
                          defaultValue="Select Option"
                          value={values.State}
                          name="State"
                        >
                          <Option value="Select Option">Select State</Option>
                        </Select>
                        <span className="validateerror">
                          <ErrorMessage name="State" />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Country"
                        className="custom-fields custom-select"
                      >
                        <Select
                          id="select"
                          value={values.Country}
                          name="Country"
                          onChange={this.handleOnChange.bind(this)}
                        >
                          <Option value="Select Option">Select Option</Option>
                        </Select>
                        <span className="validateerror">
                          <ErrorMessage name="Country" />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Pin Code" className="custom-fields">
                        <Field
                          className="ant-input"
                          value={values.PostalCode}
                          name="PostalCode"
                        />
                        <span className="validateerror">
                          <ErrorMessage name="PostalCode" />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24}>
                      <Form.Item label="Phone Number" className="custom-fields">
                        <Field
                          className="ant-input"
                          value={values.PhoneNumber}
                          name="PhoneNumber"
                        />
                        <span className="validateerror">
                          <ErrorMessage name="PhoneNumber" />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24}>
                      <Form.Item label="Email" className="custom-fields">
                        <Input value={Email} name="Email" disabled />
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
                          value={values.AboutMe}
                          name="AboutMe"
                        />
                        <span className="validateerror">
                          <ErrorMessage name="AboutMe" />
                        </span>
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
