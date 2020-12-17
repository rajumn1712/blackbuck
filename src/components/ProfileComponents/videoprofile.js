import React, { Component } from "react";
import { Card, Input, Upload, Form, message, Tooltip, Empty } from "antd";
import { Link } from "react-router-dom";
import { store } from "../../store";
import "../../index.css";
import "../../App.css";
import "../../styles/theme.css";
import CommonModal from "./CommonModal";
import notify from "../../shared/components/notification";
import { saveVideoAsProfile } from "../../shared/api/apiServer";
import Loader from "../../common/loader";

const { Dragger } = Upload;
class VideoProfile extends Component {
  state = {
    video: this.props.video,
    inputValue: this.props.video ? this.props.video : "",
    visible: false,
    fileUploading: false,
    loading: false,
  };
  createObject = (value) => {
    return {
      UserId: this.props.userid,
      VideoAsProfile: value,
    };
  };
  uploadProps = {
    name: "file",
    accept: ".mp4,.mpeg4,.mov,.flv,.avi,.mkv,.webm",
    multiple: false,
    action: "http://138.91.35.185/tst.blackbuck.identity/Home/UploadFile",
    onChange: (info) => {
      this.setState({ ...this.state, fileUploading: true });
      const { status } = info.file;
      if (status !== "uploading") {
        this.setState({ ...this.state, fileUploading: false });
      }
      if (status === "done") {
        let { inputValue } = this.state;
        inputValue = info.file.response[0];
        notify({
          description: `${info.file.name} file uploaded successfully.`,
          message: "Upload",
        });
        this.setState({ ...this.state, fileUploading: false, inputValue });
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
        this.setState({ ...this.state, fileUploading: false });
      }
    },
  };
  showModal = (e) => {
    e.preventDefault();
    let { inputValue } = { ...this.state.inputValue };
    inputValue = this.props.video ? this.props.video : "";
    this.setState({
      visible: true,
      inputValue,
    });
  };
  handleVideoCHange = (e) => {
    let { inputValue } = this.state;
    inputValue = e.target.value;
    this.setState({ inputValue });
  };
  handleOk = async (e) => {
    this.setState({ ...this.state, loading: true });
    const saveObj = this.createObject(this.state.inputValue);
    const response = await saveVideoAsProfile(saveObj);
    if (response.ok) {
      this.setState(
        {
          loading: false,
          visible: false,
        },
        () => {
          notify({
            description: "Profile video saved successfully",
            message: "Profile video",
          });
          this.props.callback(true);
        }
      );
    } else {
      notify({
        description: "Something went wrong :)",
        message: "Error",
        type: "error",
      });
    }
  };
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };
  render() {
    const { user } = store.getState().oidc;
    const { video, visible, inputValue } = this.state;

    return (
      <div className="custom-card">
        <Card
          title="Video as Profile"
          className="pfvideocard"
          cover={
            video ? (
              <video width="100%" controls src={video}></video>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )
          }
          bordered={false}
          extra={
            !this.props.IsHideAction ? (
              <Tooltip title="Edit">
                <Link onClick={this.showModal}>
                  <span className={`icons ${video ? "edit" : "add"}`} />
                </Link>
              </Tooltip>
            ) : null
          }
        ></Card>
        <CommonModal
          visible={visible}
          disable={!inputValue}
          title="Video as Profile"
          cancel={this.handleCancel}
          saved={() => this.handleOk()}
        >
          <div className="">
            {this.state.loading && <Loader className="loader-top-middle" />}
            <Dragger
              className="upload mb-16"
              {...this.uploadProps}
              onRemove={() =>
                this.setState({ ...this.state.video, VideoAsProfile: "" })
              }
              showUploadList={false}
            >
              {this.state.fileUploading && (
                <Loader className="loader-top-middle" />
              )}
              <span className="sharebox-icons video-upload"></span>
              <p className="ant-upload-text mt-8 mb-0">Upload Video</p>
            </Dragger>
            <Form layout="vertical" className="mt-16">
              <Form.Item label="URL" className="custom-fields">
                <Input
                  value={this.state.inputValue}
                  name="VideoAsProfile"
                  onChange={this.handleVideoCHange}
                />
              </Form.Item>
            </Form>
          </div>
        </CommonModal>
      </div>
    );
  }
}
export default VideoProfile;
