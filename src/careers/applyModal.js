import { Button, Form, Input, List, Modal, Upload } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { set } from "lodash";
import React, { useState } from "react";
import Loader from "../common/loader";
import { saveApplicationJob } from "../shared/api/apiServer";
import notify from "../shared/components/notification";
import connectStateProps from "../shared/stateConnect";
import { uuidv4 } from "../utils";

const { Dragger } = Upload;

const ApplyModal = (props) => {
  const [form] = Form.useForm();

  let application = {
    Skills: "",
    Comment: "",
    FileName: "",
    uploadsources: [],
  };
  let resumeFile = {
    Avatar: "",
    File: "",
    Size: "",
    Url:""
  };

  let [jobApplication, setJObApplication] = useState({ ...application });
  const [resume,setResume] = useState({...resumeFile});
  const [loading, setLoading] = useState(false);
  

  const uploadfileProps = {
    name: "file",
    accept: ".doc,.docx",
    multiple: false,
    showUploadList: false,
    action: process.env.REACT_APP_AUTHORITY + "/Home/UploadFile",
    onChange: (info) => {
      jobApplication["uploadsources"] = [];
      setJObApplication({ ...jobApplication });
      const { status } = info.file;

      if (status === "done") {
        resume.Avatar = info.file.name.split(".")[1];
        resume.File = info.file.name;
        resume.Size = parseFloat(info.file.size * 0.0009765625).toFixed(
          3
        );
        resume.Url = info.file.response[0];
        setResume({...resume})
        jobApplication["uploadsources"].push(resume);
        setJObApplication({ ...jobApplication });
        setLoading(false);
        notify({
          description: `Resume uploaded successfully.`,
          message: "Upload",
        });
      } else if (status === "error") {
        setLoading(false);
        notify({
          description: `File upload failed.`,
          type: "error",
          message: "Upload",
        });
      }
      else if (status === "uploading") {
        setLoading(true);
      }
    },
    beforeUpload: (file) => {
      let accepted = false;
      const fileMaxSize = 25 * 1000000;
      const acceptTypes = "doc,docx";
      if (
        !(
          acceptTypes.indexOf(
            file.name.substr(file.name.lastIndexOf(".") + 1)
          ) > -1
        )
      ) {
        setLoading(false);
        notify({
          message: "Upload",
          description: `File format not supported`,
          type: "warning",
        });
        accepted = true;
      }
      if (file.size > fileMaxSize) {
        setLoading(false);
        notify({
          message: "Upload",
          description: `Document size does not exceed 25 MB`,
          type: "warning",
        });
      }
      return file.size <= fileMaxSize && !accepted;
    },
  };

  const deleteFile = (key) => {
    jobApplication.uploadsources.splice(key, 1);
    setJObApplication({ ...jobApplication });
  };

  const submitJob = async () => {
      if(jobApplication.uploadsources.length == 0){
          notify({
              message:'Warning',
              type:'error',
              description:'Please uplaod resume to submit'
          });
          return;
      }
      setLoading(true);
      const saveJob = {
        ApplicationId:uuidv4(),
        JobId:props.object.JobId,
        Title:props.object.Title,
        EmployerName:props.object.EmployerName,
        Skills:jobApplication.Skills,
        ApplicantName:props.profile?.FirstName,
        ApplicantDetails:{
            "UserId": props.profile?.Id,
            "Firstname": props.profile?.FirstName,
            "Lastname": props.profile?.LastName,
            "Image": props.profile?.ProfilePic
        },
        FIleName:jobApplication.FileName,
        Documents:resume,
        Comment:jobApplication.Comment,
        CreateDate:new Date()
      }
      const response = await saveApplicationJob(saveJob);
      if(response.ok){
        jobApplication={};
          setJObApplication({...jobApplication})
          setLoading(false);
          props.cancel();
          notify({
              message:'Submit',
              description:'Job Application submitted successfully'
          })
      }else{
          notify({
              message:'Error',
              type:'error',
              description:'Something went wrong'
          })
      }
  };

  return (
    <Modal
      title={
        <div className="custom-modal-header">
          <h4>Apply Now</h4>
          <a onClick={props.cancel}>
            <span className="close-icon" />
          </a>
        </div>
      }
      visible={props.visible}
      closable={false}
      footer={
        <Button
          key="submit"
          form={props.formid}
          type="primary"
          htmlType="submit"
        >
          Submit
        </Button>
      }
      destroyOnClose
    >
      <Form
      id={props.formid}
        initialValues={{ ...jobApplication }}
        onFinishFailed={() => {}}
        onFinish={() => submitJob()}
        form={form}
      >
        <Dragger className="upload mb-16" {...uploadfileProps}>
          {loading && <Loader className="loader-top-middle" />}
          <span class="sharebox-icons docs-upload"></span>
          <p className="ant-upload-text mt-8 mb-0">Upload Resume</p>
        </Dragger>
        <div className="docs about-icons education hideempty">
          <List
            itemLayout="horizontal"
            dataSource={jobApplication.uploadsources}
            renderItem={(item, indx) => (
              <List.Item className="upload-preview mt-8">
                <List.Item.Meta
                  avatar={[
                    <span className={`doc-icons ${item.Avatar}`}></span>,
                  ]}
                  title={item.File}
                  description={
                    <div className="file-size f-14">
                      {item.Size} {"KB"}
                    </div>
                  }
                />
                <span
                  className="close-icon"
                  onClick={() => deleteFile(indx)}
                ></span>
              </List.Item>
            )}
          />
        </div>
        <div className="custom-fields">
          <label className="text-secondary d-block mb-4 semibold required">
            Skills
          </label>
          <Form.Item
          className="custom-fields"
            name="Skills"
            rules={[{ required: true, message: "Skills  required" }]}
          >
            <Input
              placeholder="Skills"
              maxLength={150}
              autoComplete="off"
              onChange={(e)=>{
                jobApplication.Skills = e.currentTarget.value;
                setJObApplication({...jobApplication})
            }}
            />
          </Form.Item>
        </div>
        <div className="custom-fields">
          <label className="text-secondary d-block mb-4 semibold">
            Comment
          </label>
          <Form.Item name="Comment" rules={[{ required: false }]}>
          <TextArea 
                          placeholder="Type your comment..."
                          onResize
                          autoSize={{ minRows: 3, maxRows: 30 }}
                          onChange={(e)=>{
                            jobApplication.Comment = e.currentTarget.value;
                            setJObApplication({...jobApplication})
                        }}
                          maxLength={1360}
                        />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default connectStateProps(ApplyModal);
