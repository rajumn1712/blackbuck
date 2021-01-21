import React, { Component } from 'react';
import { Card, List, Row, Col, Avatar, Divider, Typography, Button, Result, Tooltip, Upload, Comment, Form, Table, Space } from 'antd'
import defaultUser from "../styles/images/defaultuser.jpg";
import TextArea from 'antd/lib/input/TextArea';
import '../index.css';
import '../App.css';
import { fetchUserTests, submitTests } from './api';
import { connect } from 'react-redux';
import moment from 'moment';
import Comments from '../shared/components/postings/Comments/Comments';
import Loader from '../common/loader';
import notify from '../shared/components/notification';

const { Title, Paragraph } = Typography;
const { Dragger } = Upload;

const columns = [
  {
    title: 'Title',
    dataIndex: 'Title',
  },
  {
    title: 'Document',
    dataIndex: 'Documents',
    render: text => <a>{text}</a>
  },
  {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
          <Space size="middle">
              <a className="semibold" style={{ color: 'var(--red)' }}>Download</a>
          </Space>
      ),
  },
];
class OverView extends Component {
  state = {
    courseDetails:this.props.courseDetails,
    tests:[],
    object:{},
    fileUploading:false,
    uploadSources:[]
}
componentDidMount(){
  this.loadUserTests();
}
  loadUserTests = async ()=>{
    const response = await fetchUserTests(this.props.courseid,this.props?.profile?.Id);
    if(response.ok){
        this.setState({...this.state,tests:response.data.Tests});
    }
}
uploadProps = {
  name: "file",
  multiple: true,
  action: process.env.REACT_APP_AUTHORITY + "/Home/UploadFile",
  onChange: (info) => {
    this.setState({ ...this.state, fileUploading: true });
    const { status } = info.file;
    if (status !== "uploading") {
    }
    if (status === "done") {
        const avatar = info.file?.name
          ? info.file.name.substr(info.file.name.lastIndexOf(".") + 1)
          : "word";
        let response = {
          title: info.file.name,
          avatar,
          url: info.file.response[0],
          fileSize: info.file.size,
        };
        this.postObject.ImageUrl = this.postObject.ImageUrl
          ? this.postObject.ImageUrl.concat(response)
          : [response];
        this.setState({
          ...this.state,
          uploadSources: this.state.uploadSources
            ? this.state.uploadSources.concat(response)
            : [response],
        });

      notify({
        description: `${this.postObject.Type} uploaded successfully.`,
        message: "Upload",
      });
      this.setState({ ...this.state, fileUploading: false });
    } else if (status === "error") {
      notify({
        description: `${this.postObject.Type} upload failed.`,
        type: "error",
        message: "Upload",
      });
      this.setState({ ...this.state, fileUploading: false });
    } else if (status == undefined) {
      this.setState({ ...this.state, fileUploading: false });
    }
  },
  beforeUpload: (file, list) => {
    const fileMaxSize = 25 * 1000000;
    if (file.size > fileMaxSize) {
      notify({
        message: "Upload",
        description: `Document size does not exceed 25 MB`,
        type: "warning",
      });
    }
    return file.size <= fileMaxSize;
  },
};

saveUserTestFiles = async ()=>{
  const response = await submitTests(this.state.courseDetails);
  if(response.ok){

  }
}

    render() {
      const {courseDetails} = this.state;
        return (
          <div>
            {/* <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  title={<a>{item.title}</a>}
                  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                />
                
              </List.Item>
              
            )}
          /> */}
            <div className="custom-card">
              <Card>
                <div className="p-12">
                  <Title level={4} className="semibold mb-4 text-primary">
                   {courseDetails.GroupName}
                  </Title>
                  <p className="text-secondary f-14">{courseDetails.Author[0].Firstname} {courseDetails.Author[0].Lastname} |  {moment(courseDetails.CreatedDate).format('ll')}</p>
                  <Paragraph className="text-primary">
                    {courseDetails.Description}
                  </Paragraph>
                  <Divider />
                  <Title className="semibold mb-4 text-primary f-16">
                    Members List
                  </Title>
                </div>
              </Card>
            </div>
            {courseDetails.IsCertified && <div className="custom-card mb-8">
                    <Card className="start-course">
                        <Row align="middle" className="p-16">
                            <Col xs={18} sm={18} md={18} lg={18} xl={18} xxl={18} className="pr-16">
                                <Title level={3} className="normalbold text-white mb-4">Download Course Certificate</Title>
                                <p className="f-14 text-white mb-0">Your are certified and your certificate is generated now its ready to generate.</p>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} className="text-right">
                                <Button type="dashed">Download Here</Button>
                            </Col>
                        </Row>
                    </Card>
                </div>}
            <div className="custom-card">
              <Card title="Comments">
                <div className="px-12 post-card comment-show">
                {<Comments
            count={0}
            postId={this.props.courseid}
            object={this.state.object}
            isLMSComment={true}
          />}
                  {/* <Comment
                    avatar={<Avatar src={defaultUser} />}
                    content={
                      <Form.Item>
                        <TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
                        <Button
                          htmlType="submit"
                          shape="circle"
                          type="link"
                          className="post-btn"
                        >
                          <span className="post-icons send-icon mr-0"></span>
                        </Button>
                      </Form.Item>
                    }
                  /> */}
                </div>
              </Card>
            </div>
            <div className="custom-card">
              <Card title="Take a Test">
              <Table columns={columns} dataSource={this.state.tests} size="small" pagination={{ position: ["bottomCenter"] }} bordered={true} />
                {/* <Result
                  icon={<img src={test} />}
                  title="Test documents are uploaded here"
                  subTitle="Please download and completed the assignments and upload bellow, thank you !"
                  extra={<Button type="primary">Download Here</Button>}
                /> */}
                <div className="px-12 pb-12">
                {courseDetails.IsUploaded && <Result
                      icon={<span className="error-icons success" />}
                      title="Successfully Uploaded"
                      subTitle="We sent your file's to the admin review, untill approve, please wait..."
                    />}
                    {courseDetails.IsRejected && <Result
                      icon={<span className="error-icons failed" />}
                      title="Submission Rejected"
                      subTitle="Please check and modify the assignments before resubmitting."
                      extra={[<Button type="primary">Re - Upload</Button>]}
                    ></Result>}
                  <Dragger className="upload mb-16"
                  {...this.uploadProps}
                  showUploadList={false}
                  >
                    {this.state.fileUploading && <Loader className="loader-top-middle" />}
                    <span className="sharebox-icons docs-upload mb-16"></span>
                    <p className="ant-upload-text">
                      Upload your assignment files here
                    </p>
                    <p className="ant-upload-hint">
                      Support for a single or bulk upload. Strictly prohibit
                      from uploading company data or other band files (doc, PPT,
                      PDF, xls).
                    </p>
                  </Dragger>
                  <div className="docs px-0">
                    <div className="mt-12 text-center">
                      <Button type="primary" key="console">
                        Submit Files
                      </Button>
                    </div>
                  </div>
                  <div className="px-12 pb-12">
                    <Divider />
                    
                  </div>
                </div>
              </Card>
            </div>
            {/* <Divider className="my-4" />

                <div className="set-flex mb-12">
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    title={<h3 className="mb-0">{item.title}</h3>}
                                    description={<div><div>{item.description}</div>
                                    </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </div> */}
          </div>
        );
    }
}
const mapStateToProps = ({ oidc }) => {
  return { profile: oidc.profile };
};
export default connect(mapStateToProps)(OverView);


