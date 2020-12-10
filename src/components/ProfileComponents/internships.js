import React, { Component, createRef } from "react";
import {
  Card,
  List,
  Form,
  Row,
  Col,
  Select,
  Input,
  message,
  Tooltip,
  Image,
} from "antd";
import { Link } from "react-router-dom";
import { store } from "../../store";
import "../../index.css";
import "../../App.css";
import Dragger from "antd/lib/upload/Dragger";
import CommonModal from "./CommonModal";
import { saveInternships } from "../../shared/api/apiServer";
import Loader from "../../common/loader";
import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";
import { hasChanged, uuidv4 } from "../../utils";
import notify from "../../shared/components/notification";
import SideAction from "../../shared/components/postings/Actions/SideActions";

const docs = [
  {
    avatar: [<span className="doc-icons word"></span>],
    title: "Mini Project.Doc",
    fileSize: "150 KB",
  },
];

const ownerActions = [
  { action: 'Edit', icons: 'post-icons edit-icon', subTitle: "Edit internship" },
  { action: 'Delete', icons: 'post-icons delete-icon', subTitle: "Delete internship" }
]

const { Option } = Select;
const internshipsObj = {
  CompanyName: "",
  ShortName: "",
  Place: "",
  Duration: "",
  CompanyLogo: "",
  Certificate: [],
};
class Intership extends Component {
  formRef = createRef();
  state = {
    internships: this.props.internships,
    internshipsObj: internshipsObj,
    certificates: {
      Avatar: "",
      File: "",
      Size: "",
    },
    initialValues: {
      CompanyName: internshipsObj.CompanyName,
      ShortName: internshipsObj.ShortName,
      Location: internshipsObj.Location,
      Duration: internshipsObj.Duration,
    },
    duration: ["30 days", "45 days", "2 months", "3 months", "6 months"],
    visible: false,
    fileUploading: false,
    fileUpload: false,
    isEdit: false,
  };
  createObject = (values) => {
    return {
      UserId: this.props.userid,
      Internships: {
        InternshipId: this.state.isEdit
          ? this.state.internshipsObj.InternshipId
          : uuidv4(),
        CompanyName: values.CompanyName,
        ShortName: values.ShortName,
        CompanyLogo: this.state.internshipsObj.CompanyLogo,
        Location: values.Location,
        Duration: values.Duration,
        Certificate: this.state.internshipsObj.Certificate,
      },
    };
  };

  // validateSchema = Yup.object().shape({
  //   CompanyName: Yup.string().required("is required"),
  //   ShortName: Yup.string().required("is required"),
  //   Place: Yup.string().required("is required"),
  //   Duration: Yup.string().required("is required"),
  // });
  uploadProps = {
    name: "file",
    accept: ".jpg,.jpeg,.png",
    multiple: false,
    showUploadList: false,
    action: "http://138.91.35.185/tst.blackbuck.identity/Home/UploadFile",
    onChange: (info) => {
      this.setState({ ...this.state, fileUploading: true });
      const { status } = info.file;
      if (status !== "uploading") {
        this.setState({ ...this.state, fileUploading: false });
      }
      if (status === "done") {
        const { internshipsObj } = this.state;
        internshipsObj.CompanyLogo = info.file.response[0];
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
    accept: ".doc,.docx",
    multiple: false,
    action: "http://138.91.35.185/tst.blackbuck.identity/Home/UploadFile",
    onChange: (info) => {
      this.setState({ ...this.state, fileUpload: true });
      const { status } = info.file;
      if (status !== "uploading") {
        this.setState({ ...this.state, fileUpload: false });
      }
      if (status === "done") {
        const { internshipsObj, certificates } = this.state;
        certificates.Avatar = info.file.name.split(".")[1];
        certificates.File = info.file.response[0];
        certificates.Size = parseFloat(info.file.size * 0.0009765625).toFixed(
          3
        );
        this.setState({ certificates: certificates });
        internshipsObj.Certificate.push(this.state.certificates);
        this.setState({ internshipsObj: internshipsObj });
        message.success(`${info.file.name} file uploaded successfully.`);
        this.setState({ ...this.state, fileUpload: false });
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
        this.setState({ ...this.state, fileUpload: false });
      }
    },
  };
  deleteFile = () => {
    const internshipsObj = { ...this.state };
    internshipsObj.CompanyLogo = "";
    this.setState({ internshipsObj: internshipsObj });
  };
  showModal = (e, isedit, internship) => {
    e.preventDefault();
    let { internshipsObj, initialValues } = this.state;
    if (isedit) {
      const { CompanyName, ShortName, Location, Duration } = internship;
      Object.assign(initialValues, {
        CompanyName,
        ShortName,
        Location,
        Duration,
      });
    } else {
      initialValues = {
        CompanyName: "",
        ShortName: "",
        Location: "",
        Duration: "",
      };
    }

    this.setState({
      visible: true,
      isEdit: isedit ? true : false,
      internshipsObj: isedit ? internship : internshipsObj,
      initialValues: initialValues,
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
    if (!hasChanged(this.formRef.current.values)) {
      const saveObj = this.createObject(this.formRef.current.values);
      saveInternships(saveObj).then((res) => {
        this.setState(
          {
            visible: false,
          },
          () => {
            notify({
              description: "Internship saved successfully",
              message: "Internship",
            });
            this.props.callback(true);
          }
        );
      });
    }
  };
  handleCancel = (e) => {
    this.formRef.current.setErrors({});
    this.setState({
      ...this.state,
      visible: false,
      internshipsObj: internshipsObj,
    });
  };
  render() {
    const { user } = store.getState().oidc;
    const data = [...this.state.internships];
    const { internshipsObj, duration, initialValues } = this.state;
    return (
      <div className="custom-card internship-card">
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
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 3,
              xxl: 3,
            }}
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => (
              <List.Item onClick={(e) => this.showModal(e, true, item)} className="mb-12">
                <div className="intern-cards">
                  <span className="left-menu intenship card-options-left" />
                  <span className="card-options-right">
                  <SideAction actionsList={ownerActions} />
                    {/* <span className="icons more"/> */}
                  </span>
                  <div className="intern-cardbody">
                    <div className="internlogo">
                      <img src={item.CompanyLogo} />
                    </div>
                    <h4 className="title">{item.CompanyName}</h4>
                    <p className="description">
                      <span className="afterline mr-16">{item.Location}</span>
                      <span className="">{item.Duration}</span>
                    </p>
                  </div>
                  {/* <div className="intern-cardfooter">
                    <p className="mb-0">
                      <span className="icons pdf mr-8" />
                      {item.Certificate}
                    </p>
                  </div> */}
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
            enableReinitialize
            initialValues={initialValues}
            innerRef={this.formRef}
            validate={(values) => this.handleValidate(values)}
          // validationSchema={this.validateSchema}
          >
            {({ values, setFieldValue }) => {
              return (
                <Form layout="vertical">
                  <Row gutter={8}>
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
                          name="Location"
                          value={values.Location}
                        />
                        <span className="validateerror">
                          <ErrorMessage name="Location" />
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
                          defaultValue=""
                          onChange={(value) => setFieldValue("Duration", value)}
                          value={values.Duration}
                        >
                          <Option value="">Select Duration</Option>
                          {duration.map((duration, index) => {
                            return (
                              <Option key={index} value={duration}>
                                {duration}
                              </Option>
                            );
                          })}
                        </Select>
                        <span className="validateerror">
                          <ErrorMessage name="Duration" />
                        </span>
                      </Form.Item>
                    </Col>

                    <Col className="mb-16" xs={12}>
                      <Dragger
                        className="upload"
                        {...this.uploadProps}
                        onRemove={() =>
                          this.setState({
                            ...this.state.internshipsObj,
                            CompanyLogo: "",
                          })
                        }
                      >
                        {this.state.fileUploading && (
                          <Loader className="loader-top-middle" />
                        )}
                        <span className="sharebox-icons photo-upload"></span>
                        <p className="ant-upload-text mt-8 mb-0">Upload Logo</p>
                      </Dragger>
                      <div className="mb-16 upload-preview">
                        <Image src={internshipsObj.CompanyLogo} />
                        <a
                          class="item-close"
                          onClick={() =>
                            this.setState({
                              ...this.state.internshipsObj,
                              CompanyLogo: "",
                            })
                          }
                        >
                          {internshipsObj.CompanyLogo && (
                            <Tooltip title="Remove">
                              <span
                                className="close-icon"
                                onClick={() => this.deleteFile()}
                              ></span>
                            </Tooltip>
                          )}
                        </a>
                      </div>
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
                    <Col xs={12}>
                      <Dragger
                        className="upload"
                        {...this.uploadfileProps}
                        onRemove={() =>
                          this.setState({
                            ...this.state.internshipsObj,
                            Certificate: [],
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
                                avatar={
                                  <span className="doc-icons word"></span>
                                }
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
