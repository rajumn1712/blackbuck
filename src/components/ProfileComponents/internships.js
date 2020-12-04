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

const docs = [
  {
    avatar: [<span className="icon education-icon mr-0"></span>],
    title: "Inter Marks memo.jpeg",
  },
];
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
    errors: {},
  };
  initialValues = {
    CompanyName: "",
    ShortName: "",
    Place: "",
    Duration: "",
  };
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
  errors = {};
  handleValidate = (values) => {
    for (var key in values) {
      if (!values[key]) {
        this.errors[key] = "is required";
      }
    }

    return this.errors;
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
    let { errors } = this.state;
    errors = this.handleValidate(this.formRef.current.values);
    this.setState({ errors: errors });
    saveInnternship(this.props?.profile?.Id, this.state.internshipsObj).then(
      (res) => {
        message.success("Intership saved successfully");
      }
    );
    // this.setState({
    //   visible: false,
    // });
  };
  handleCancel = (e) => {
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
          >
            {({ touched, handleBlur }) => {
              return (
                <Form layout="vertical">
                  <Row gutter={16} className="mb-16">
                    <Col xs={24}>
                      <Form.Item label="Company Name" className="custom-fields">
                        <Field
                          className="ant-input"
                          name="CompanyName"
                          value={internshipsObj.CompanyName}
                          onChange={(event) => this.handleChange(event)}
                          onBlur={handleBlur}
                        />
                        <span className="validateerror">
                          <ErrorMessage name="CompanyName" />
                        </span>
                        {errors["CompanyName"] && !touched.CompanyName ? (
                          <span className="validateerror">
                            {errors["CompanyName"]}
                          </span>
                        ) : null}
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item label="Short Name" className="custom-fields">
                        <Field
                          className="ant-input"
                          name="ShortName"
                          value={internshipsObj.ShortName}
                          onChange={(event) => this.handleChange(event)}
                        />
                        <span className="validateerror">
                          <ErrorMessage name="ShortName" />
                        </span>
                        {errors["ShortName"] && !touched.ShortName ? (
                          <span className="validateerror">
                            {errors["ShortName"]}
                          </span>
                        ) : null}
                      </Form.Item>
                    </Col>
                    <Col xs={12}>
                      <Form.Item label="Place" className="custom-fields">
                        <Field
                          className="ant-input"
                          name="Place"
                          value={internshipsObj.Place}
                          onChange={(event) => this.handleChange(event)}
                        />
                        <span className="validateerror">
                          <ErrorMessage name="Place" />
                        </span>
                        {errors["Place"] && !touched.Place ? (
                          <span className="validateerror">
                            {errors["Place"]}
                          </span>
                        ) : null}
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
                          value={internshipsObj.Duration}
                          onChange={(event) => this.handleddlChange(event)}
                        >
                          <Option value="Select Option">Select Duration</Option>
                        </Select>
                        <span className="validateerror">
                          <ErrorMessage name="Duration" />
                        </span>
                        {errors["Duration"] && !touched.Duration ? (
                          <span className="validateerror">
                            {errors["Duration"]}
                          </span>
                        ) : null}
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
