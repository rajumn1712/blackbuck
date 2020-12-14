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
  Modal,
} from "antd";
import { Link } from "react-router-dom";
import { store } from "../../store";
import "../../index.css";
import "../../App.css";
import Dragger from "antd/lib/upload/Dragger";
import CommonModal from "./CommonModal";
import { deleteinternship, saveInternships } from "../../shared/api/apiServer";
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
  {
    action: "Edit",
    icons: "post-icons edit-icon",
    subTitle: "Edit internship",
  },
  {
    action: "Delete",
    icons: "post-icons delete-icon",
    subTitle: "Delete internship",
  },
];

const { Option } = Select;
const internshipsObj = {
  InternshipId: "",
  CompanyLogo: "",
  uploadsources: [],
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
        Certificate: this.state.internshipsObj.uploadsources,
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
    showUploadList: false,
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
        internshipsObj.uploadsources.push(this.state.certificates);
        this.setState({ internshipsObj: internshipsObj });
        message.success(`${info.file.name} file uploaded successfully.`);
        this.setState({ ...this.state, fileUpload: false });
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
        this.setState({ ...this.state, fileUpload: false });
      }
    },
  };
  deleteLogo = () => {
    const internshipsObj = { ...this.state };
    internshipsObj.CompanyLogo = "";
    this.setState({ internshipsObj: internshipsObj });
  };
  deleteFile = (key) => {
    const internship = { ...this.state.internshipsObj };
    internship.uploadsources.splice(key, 1);
    this.setState({ internshipsObj: internship });
  };
  handleEvent = async (e, name, item) => {
    switch (name) {
      case "Edit":
        this.showModal(e.domEvent, true, item);
        break;
      case "Delete":
        Modal.confirm({
          title: "Alert",
          icon: "",
          content: "Are you sure want to delete internship?",
          okText: "Delete",
          cancelText: "Cancel",
          onOk: () => this.deleteInternship(item),
        });
        break;
      default:
        break;
    }
  };
  deleteInternship = async (item) => {
    const deleteres = await deleteinternship(
      item.InternshipId,
      this.props.userid
    );
    if (deleteres.ok) {
      notify({
        description: "Internship deleted successfully",
        message: "Internship",
      });
      this.props.callback(true);
    }
  };
  showModal = (e, isedit, internship) => {
    e.preventDefault();
    let { internshipsObj, initialValues } = { ...this.state };
    if (isedit) {
      const { CompanyName, ShortName, Location, Duration } = internship;
      internshipsObj.InternshipId = internship.InternshipId;
      internshipsObj.CompanyLogo = internship.CompanyLogo;
      internshipsObj.uploadsources = [...internship.Certificate];
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
      internshipsObj: internshipsObj,
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
      this.setState({ ...this.state, loading: true });
      const saveObj = this.createObject(this.formRef.current.values);
      saveInternships(saveObj).then((res) => {
        this.setState(
          {
            loading: false,
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
              <List.Item className="mb-12">
                <div className="intern-cards">
                  <div className="card-options">
                    <span className="card-options-left">
                      <span className="left-menu intenship" />
                    </span>
                    {!this.props.IsHideAction && (
                      <span className="card-options-right">
                        <SideAction
                          horclass="icons more"
                          clickedEvent={(event, name) =>
                            this.handleEvent(event, name, item)
                          }
                          actionsList={ownerActions}
                        />
                        {/* <span className="icons more"/> */}
                      </span>
                    )}
                  </div>
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
                  <div className="intern-cardfooter">
                    {item.Certificate?.map((certificate, indx) => {
                      return (
                        <div className="mb-0 filename" key={indx}>
                          {/* <span className="icons pdf mr-8" /> */}
                          <p>{certificate.File}</p>
                        </div>
                      );
                    })}
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
          {this.state.loading && <Loader className="loader-top-middle" />}
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
                    <Col xs={24} md={12}>
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
                    <Col xs={24} md={12}>
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

                    <Col xs={24} md={12} className="mb-16">
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
                    </Col>
                    <Col xs={24} md={12} className="mb-16">
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
                    </Col>

                    <Col xs={24}>
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
                                onClick={() => this.deleteLogo()}
                              ></span>
                            </Tooltip>
                          )}
                        </a>
                      </div>
                      <div className="docs about-icons education">
                        <List
                          itemLayout="horizontal"
                          dataSource={internshipsObj.uploadsources}
                          renderItem={(item, indx) => (
                            <List.Item className="upload-preview mt-8">
                              <List.Item.Meta
                                avatar={[
                                  <span
                                    className={`doc-icons ${item.Avatar}`}
                                  ></span>,
                                ]}
                                title={item.File}
                                description={
                                  <div className="file-size f-14">
                                    {item.Size}
                                  </div>
                                }
                              />
                              <span
                                className="close-icon"
                                onClick={() => this.deleteFile(indx)}
                              ></span>
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
