import React, { Component, createRef } from "react";
import { Card, List, Form, Row, Col, Select, Input, message } from "antd";
import { Link } from "react-router-dom";
import { store } from "../../store";
import "../../index.css";
import "../../App.css";
import Dragger from "antd/lib/upload/Dragger";
import CommonModal from "./CommonModal";
import { saveInnternship } from "../../shared/api/apiServer";
import Loader from "../../common/loader";
import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";
import deeepEqual from "lodash.isequal";

const docs = [];
const { Option } = Select;
const internshipsObj = {
  CompanyName: "",
  ShortName: "",
  Place: "",
  Duration: "",
  lstUploadLogos: [],
  lstUploadFiles: [],
};
class Intership extends Component {
  formRef = createRef();
  state = {
    internships: this.props.internships,
    internshipsObj: internshipsObj,
    visible: false,
    fileUploading: false,
    fileUpload: false,
  };
  initialValues = {
    CompanyName: "",
    ShortName: "",
    Place: "",
    Duration: "",
  };
  validateSchema = Yup.object().shape({
    CompanyName: Yup.string().required("is required"),
    ShortName: Yup.string().required("is required"),
    Place: Yup.string().required("is required"),
    Duration: Yup.string().required("is required"),
  });
  uploadProps = {
    name: "file",
    multiple: false,
    action: "http://138.91.35.185/tst.blackbuck.identity/Home/UploadFile",
    onChange: (info) => {
      this.setState({ ...this.state, fileUploading: true });
      const { status } = info.file;
      if (status !== "uploading") {
        this.setState({ ...this.state, fileUploading: false });
      }
      if (status === "done") {
        const { internshipsObj } = this.state;
        internshipsObj.lstUploadLogos = [info.file.response];
        this.setState({ internshipsObj: internshipsObj });
        message.success(`${info.file.name} file uploaded successfully.`);
        this.setState({ ...this.state, fileUploading: false });
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
        this.setState({ ...this.state, fileUploading: false });
      }
    },
  };
  uploadfileProps = {
    name: "file",
    multiple: false,
    action: "http://138.91.35.185/tst.blackbuck.identity/Home/UploadFile",
    onChange: (info) => {
      this.setState({ ...this.state, fileUpload: true });
      const { status } = info.file;
      if (status !== "uploading") {
        this.setState({ ...this.state, fileUpload: false });
      }
      if (status === "done") {
        const { internshipsObj } = this.state;
        internshipsObj.lstUploadFiles = [info.file.response];
        this.setState({ internshipsObj: internshipsObj });
        message.success(`${info.file.name} file uploaded successfully.`);
        this.setState({ ...this.state, fileUpload: false });
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
        this.setState({ ...this.state, fileUpload: false });
      }
    },
  };
  showModal = (e) => {
    e.preventDefault();
    this.setState({
      visible: true,
    });
  };
  handleValidate = (values) => {
    let errors = {};
    for (var key in values) {
      if (!values[key]) {
        errors[key] = "is required";
      }
    }

    return errors;
  };
  handleChange = (target) => {
    const { internshipsObj } = this.state;
    internshipsObj[target.currentTarget.name] = target.currentTarget
      ? target.currentTarget.value
      : target;
    this.setState({ internshipsObj: internshipsObj });
  };
  handleddlChange = (value) => {
    const { internshipsObj } = this.state;
    internshipsObj.Duration = value;
    this.setState({ internshipsObj: internshipsObj });
  };
  handleOk = (e) => {
    this.formRef.current.handleSubmit();
    const hasChanged = deeepEqual(
      this.formRef.current.values,
      this.initialValues
    );
    if (!hasChanged) {
      saveInnternship(this.props?.profile?.Id, this.state.internshipsObj).then(
        (res) => {
          message.success("Intership saved successfully");
          this.setState({
            visible: false,
          });
        }
      );
    }
  };
  handleCancel = (e) => {
    this.formRef.current.setErrors({});
    this.setState({
      visible: false,
    });
  };
  render() {
    const { user } = store.getState().oidc;
    const data = [...this.state.internships];
    const { internshipsObj, errors } = this.state;
    return (
      <div className="custom-card">
        <Card
          title="Internships"
          bordered={false}
          extra={
            !this.props.IsHideAction ? (
              <Link onClick={this.showModal}>
                <span className="icons add" />
              </Link>
            ) : null
          }
        >
          <List
            grid={{
              gutter: 8,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 2,
              xl: 2,
              xxl: 2,
            }}
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => (
              <List.Item>
                <div className="intern-cards">
                  <span className="left-menu intenship card-options-left" />
                  <span className="icons more card-options-right" />
                  <div className="intern-cardbody">
                    <img src={item.CompanyLogo} />
                    <h4 className="title">{item.CompanyName}</h4>
                    <p className="description">
                      <span className="afterline mr-16">{item.Location}</span>
                      <span className="">{item.Duration}</span>
                    </p>
                  </div>
                  <div className="intern-cardfooter">
                    <p className="mb-0">
                      <span className="icons pdf mr-8" />
                      {item.Certificate}
                    </p>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Card>
        <CommonModal
          className="custom-popup"
          visible={this.state.visible}
          title="Internships"
          cancel={this.handleCancel}
          saved={this.handleOk}
        >
          <Formik
            initialValues={this.initialValues}
            innerRef={this.formRef}
            validate={(values) => this.handleValidate(values)}
            // validationSchema={this.validateSchema}
          >
            {({ values }) => {
              return (
                <Form layout="vertical">
                  <Row gutter={16} className="mb-16">
                    <Col xs={24}>
                      <Form.Item label="Company Name" className="custom-fields">
                        <Field
                          className="ant-input"
                          name="CompanyName"
                          value={values.CompanyName}
                        />
                        <span className="validateerror">
                          <ErrorMessage name="CompanyName" />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item label="Short Name" className="custom-fields">
                        <Field
                          className="ant-input"
                          name="ShortName"
                          value={values.ShortName}
                        />
                        <span className="validateerror">
                          <ErrorMessage name="ShortName" />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={12}>
                      <Form.Item label="Place" className="custom-fields">
                        <Field
                          className="ant-input"
                          name="Place"
                          value={values.Place}
                        />
                        <span className="validateerror">
                          <ErrorMessage name="Place" />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={12}>
                      <Form.Item
                        label="Duration"
                        className="custom-fields custom-select"
                      >
                        <Select
                          name="Duration"
                          defaultValue="Select Option"
                          value={values.Duration}
                          onChange={(event) => this.handleddlChange(event)}
                        >
                          <Option value="Select Option">Select Duration</Option>
                        </Select>
                        <span className="validateerror">
                          <ErrorMessage name="Duration" />
                        </span>
                      </Form.Item>
                    </Col>

                    <Col className="mb-16" xs={24}>
                      <Dragger
                        className="upload"
                        {...this.uploadProps}
                        onRemove={() =>
                          this.setState({
                            ...this.state.internshipsObj,
                            lstUploadLogos: [],
                          })
                        }
                      >
                        {this.state.fileUploading && (
                          <Loader className="loader-top-middle" />
                        )}
                        <span className="sharebox-icons photo-upload"></span>
                        <p className="ant-upload-text mt-8 mb-0">Upload Logo</p>
                      </Dragger>
                      <div className="docs about-icons education">
                        <List
                          itemLayout="horizontal"
                          dataSource={docs}
                          renderItem={(item) => (
                            <List.Item className="upload-preview mt-8">
                              <List.Item.Meta
                                avatar={item.avatar}
                                title={item.title}
                                description={
                                  <div className="file-size f-14">
                                    {item.fileSize}
                                  </div>
                                }
                              />
                              <span className="close-icon"></span>
                            </List.Item>
                          )}
                        />
                      </div>
                    </Col>
                    <Col xs={24}>
                      <Dragger
                        className="upload"
                        {...this.uploadfileProps}
                        onRemove={() =>
                          this.setState({
                            ...this.state.internshipsObj,
                            lstUploadFiles: [],
                          })
                        }
                      >
                        {this.state.fileUpload && (
                          <Loader className="loader-top-middle" />
                        )}
                        <span className="sharebox-icons photo-upload"></span>
                        <p className="ant-upload-text mt-8 mb-0">
                          Upload Certificate
                        </p>
                      </Dragger>
                      <div className="docs about-icons education">
                        <List
                          itemLayout="horizontal"
                          dataSource={docs}
                          renderItem={(item) => (
                            <List.Item className="upload-preview mt-8">
                              <List.Item.Meta
                                avatar={item.avatar}
                                title={item.title}
                                description={
                                  <div className="file-size f-14">
                                    {item.fileSize}
                                  </div>
                                }
                              />
                              <span className="close-icon"></span>
                            </List.Item>
                          )}
                        />
                      </div>
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
export default Intership;
