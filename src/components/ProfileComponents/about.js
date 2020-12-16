import React, { Component, createRef } from "react";
import { Card, Divider, Row, Col, Form, Input, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { store } from "../../store";
import "../../index.css";
import "../../App.css";
import CommonModal from "./CommonModal";
import { ErrorMessage, Field, Formik } from "formik";
import { saveAboutMe } from "../../shared/api/apiServer";
import { hasChanged, uuidv4 } from "../../utils";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import notify from "../../shared/components/notification";
import Loader from "../../common/loader";

class About extends Component {
  state = {
    PhoneNumber: this.props.about.PhoneNumber
      ? this.props.about.PhoneNumber
      : "",
    Email: this.props.about.Email,
    AboutMe: this.props.about.Aboutme ? this.props.about.Aboutme : "",
    finalAddress: this.props.about.Address,
    address: {},
    visible: false,
    loading: false,
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
    let editObject = { ...this.state };
    editObject.address =
      this.props.about.Address.length > 0
        ? { ...this.props.about.Address[0] }
        : {
            PlatNo: "",
            Street: "",
            Address: "",
            City: "",
            State: "",
            Country: "",
            PinCode: "",
          };
    editObject.address = Object.assign(editObject.address, {
      PhoneNumber: editObject.PhoneNumber,
      AboutMe: editObject.AboutMe,
    });

    this.setState({
      visible: true,
      address: editObject.address,
    });
  };

  handleOk = () => {
    this.formRef.current.handleSubmit();
    if (!hasChanged(this.formRef.current.values)) {
      this.setState({ ...this.state, loading: true });
      const saveObj = this.createSaveObj(this.formRef.current.values);
      saveAboutMe(saveObj).then((res) => {
        this.setState(
          {
            loading: false,
            visible: false,
          },
          () => {
            notify({
              description: "Profile saved successfully",
              message: "Abou Me",
            });
            this.props.callback(true);
          }
        );
      });
    }
  };
  createSaveObj = (values) => {
    const saveObj = {
      UserId: this.props.about.UserId,
      Aboutme: values.AboutMe,
      PhoneNumber: values.PhoneNumber,
      Address: [
        {
          AddressId: this.state.address.AddressId
            ? this.state.address.AddressId
            : uuidv4(),
          PlatNo: values["PlatNo"],
          Street: values["Street"],
          Address: values["Address"],
          City: values["City"],
          State: values["State"],
          Country: values["Country"],
          PinCode: values["PinCode"],
        },
      ],
    };
    return saveObj;
  };
  handleCancel = (e) => {
    this.formRef.current.setErrors({});
    this.setState({
      visible: false,
      address: {},
    });
  };
  formRef = createRef();
  render() {
    const { user } = store.getState().oidc;

    const {
      PhoneNumber,
      Email,
      AboutMe,
      finalAddress,
      visible,
      address,
      loading,
    } = this.state;

    return (
      <div className="custom-card profile-card">
        <Card
          title="About Me"
          bordered={false}
          extra={
            !this.props.IsHideAction ? (
              <Tooltip title="Edit">
                <Link onClick={this.showModal}>
                  <span className="icons edit" />
                </Link>
              </Tooltip>
            ) : null
          }
        >
          <div>
            {AboutMe && <p>{AboutMe}</p>}
            <Divider className="text-left-line" orientation="left">
              Contact
            </Divider>
            <Row gutter={16}>
              {finalAddress?.length > 0 && (
                <Col xs={24} sm={12}>
                  <div className="about-details">
                    <div className="about-icons">
                      <span className="icons location c-default" />
                    </div>
                    {finalAddress?.map((displayaddress, index) => {
                      delete displayaddress.AddressId;
                      return (
                        <p key={index}>
                          {Object.keys(displayaddress)
                            .map((k) => {
                              return displayaddress[k];
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
          {loading && <Loader className="loader-top-middle" />}
          <Formik
            enableReinitialize
            innerRef={this.formRef}
            initialValues={address}
            validate={(values) => this.handleValidate(values)}
          >
            {({ values, setFieldValue }) => {
              return (
                <Form layout="vertical">
                  <Row gutter={16}>
                    {/* <Col xs={24}>
                                    <h3>Contact</h3>
                                </Col> */}
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Plot No"
                        name="Plot No"
                        rules={[{ required: true }]}
                        className="custom-fields"
                      >
                        <Field
                          className="ant-input"
                          value={values?.PlatNo}
                          name="PlatNo"
                        />
                        <span className="validateerror">
                          <ErrorMessage name="PlatNo" />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Street Name"
                        name="Street Name"
                        rules={[{ required: true }]}
                        className="custom-fields"
                      >
                        <Field
                          className="ant-input"
                          value={values?.Street}
                          name="Street"
                        />
                        <span className="validateerror">
                          <ErrorMessage name="Street" />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item
                        label="Address"
                        name="Address"
                        rules={[{ required: true }]}
                        className="custom-fields"
                      >
                        <Field
                          className="ant-input"
                          value={values?.Address}
                          name="Address"
                        />
                        <span className="validateerror">
                          <ErrorMessage name="Address" />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="City"
                        name="City"
                        rules={[{ required: true }]}
                        className="custom-fields"
                      >
                        <Field
                          className="ant-input"
                          value={values?.City}
                          name="City"
                        />
                        <span className="validateerror">
                          <ErrorMessage name="City" />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Country"
                        name="Country"
                        rules={[{ required: true }]}
                        className="custom-fields custom-select"
                      >
                        <CountryDropdown
                          onChange={(value) => setFieldValue("Country", value)}
                          value={values?.Country}
                          name="Country"
                        />
                        {/* <Select
                          id="select"
                          value={values.Country}
                          name="Country"
                          onChange={this.handleOnChange.bind(this)}
                        >
                          <Option value="Select Option">Select Option</Option>
                        </Select> */}
                        <span className="validateerror">
                          <ErrorMessage name="Country" />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="State"
                        name="State"
                        rules={[{ required: true }]}
                        className="custom-fields custom-select"
                      >
                        <RegionDropdown
                          onChange={(value) => setFieldValue("State", value)}
                          country={values?.Country}
                          value={values?.State}
                        />
                        {/* <Select
                          defaultValue="Select Option"
                          value={values.State}
                          name="State"
                        >
                          <Option value="Select Option">Select State</Option>
                        </Select> */}
                        <span className="validateerror">
                          <ErrorMessage name="State" />
                        </span>
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Pin Code"
                        name="Pin Code"
                        rules={[{ required: true }]}
                        className="custom-fields"
                      >
                        <Field
                          className="ant-input"
                          value={values?.PinCode}
                          name="PinCode"
                        />
                        <span className="validateerror">
                          <ErrorMessage name="PinCode" />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24}>
                      <Form.Item
                        label="Phone Number"
                        name="Phone Number"
                        rules={[{ required: true }]}
                        className="custom-fields"
                      >
                        <Field
                          className="ant-input"
                          value={values?.PhoneNumber}
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
                        name="About Me"
                        rules={[{ required: true }]}
                        className="custom-fields mb-24"
                      >
                        <Field
                          component="textarea"
                          className="ant-input"
                          autoSize={{ minRows: 2, maxRows: 6 }}
                          value={values?.AboutMe}
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
