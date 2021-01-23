import React, { Component } from 'react';
import { Card, List, Row, Col, Avatar, Divider, Typography, Button, Result, Tooltip, Upload, Comment, Form, Table, Space } from 'antd'
import defaultUser from "../styles/images/defaultuser.jpg";
import TextArea from 'antd/lib/input/TextArea';
import '../index.css';
import '../App.css';
import user from '../styles/images/user.jpg';
import { fetchUserTests, getCertifiedFlags, getCourseMembersList, submitTests } from './api';
import { connect } from 'react-redux';
import moment from 'moment';
import Comments from '../shared/components/postings/Comments/Comments';
import Loader from '../common/loader';
import notify from '../shared/components/notification';
import { uuidv4 } from '../utils';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;
const { Dragger } = Upload;

class OverView extends Component {
  state = {
    courseDetails:this.props.courseDetails,
    tests:[],
    object:{},
    fileUploading:false,
    uploadSources:[],
    TestsObj:[],
    flagsData:{"IsSubmitted":null,"IsCertified":null,"IsRejected":null},
    Members:{},
    size:5,
    page: 1,
    showUpload:true
}
componentDidMount(){
  this.getMembersList();
  this.getCertified();
}
getMembersList = async ()=>{
  const response = await getCourseMembersList(this.props.courseid,this.state.page,this.state.size);
  if(response.ok){
    this.setState({...this.state,Members:response.data})
  }
}
getCertified = async ()=>{
  const response = await getCertifiedFlags(this.props.courseid,this.props.profile?.Id);
  if(response.ok){
    if(response.data.length > 0){
      this.setState({...this.state,flagsData:response.data[0]})
    }
    
  }
}
//   loadUserTests = async ()=>{
//     const response = await fetchUserTests(this.props.courseid,this.props?.profile?.Id);
//     if(response.ok){
//         this.setState({...this.state,tests:response.data.Tests});
//     }
// }
uploadProps = {
  name: "file",
  multiple: true,
  accept:".doc,.docx,.ott,.rtf,.docm,.dot,.odt,.dotm,.md,.xls,.xlsx.,.csv",
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
        let testObj = {
          TestId:uuidv4(),
          Title:info.file.name,
          Documents:info.file.response[0]
        }
        this.setState({
          ...this.state,
          uploadSources: this.state.uploadSources
            ? this.state.uploadSources.concat(response)
            : [response],
            TestsObj: this.state.TestsObj
            ? this.state.TestsObj.concat(testObj)
            : [testObj]
        });

      notify({
        description: `Documents uploaded successfully.`,
        message: "Upload",
      });
      this.setState({ ...this.state, fileUploading: false });
    } else if (status === "error") {
      notify({
        description: `Documents upload failed.`,
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

showMore = () => {
  let { page } = this.state;
      page += 1;
  this.setState({ ...this.state, page },()=>{
    this.getMembersList();
  })
}

saveUserTestFiles = async ()=>{
  const object ={
    "Id":uuidv4(),
  "CourseId": this.props.courseid,
  "UserId": this.props.profile?.Id,
  "Firstname": this.props.profile?.FirstName,
  "Lastname": this.props.profile?.LastName,
  "Image": this.props.profile?.ProfilePic,
   "CreatedDate":new Date(),
   "IsSubmitted":true,
  "Tests": this.state.TestsObj
  }
  const response = await submitTests(object);
  if(response.ok){
    notify({
      message:"Files Submit",
      description:"Documents submitted successfully",
      type:"success"
    })
    this.getCertified();
  }
}
reUpload = ()=>{
  let {flagsData} = this.state;
  flagsData.IsRejected = false;
  flagsData.IsSubmitted = false;
  this.setState({...this.state,flagsData})
}

    render() {
      const {courseDetails,flagsData,Members,size,showUpload} = this.state;
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
              <Card actions={(size > 4 && size < Members?.length) ? [
                    <Button type="primary" onClick={() => this.showMore()}>See More</Button>
                ] : []}>
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
                   <div className=" pb-16">
                            {/* <Avatar.Group
                                maxCount={size-1}
                                size="large"
                                maxStyle={{ color: 'var(--primary)', backgroundColor: 'var(--secondary)' }}
                            >
                                {Members.map((user, index) => {
                                    return <Tooltip title={user.Firstname ? user.Firstname : user.FirstName} placement="top">
                                        <Link to={this.props?.profile.Id == user.UserId ? "/profile/IsProfileTab" : ("/profileview/" + user.UserId)}><Avatar src={user.Image || defaultUser} key={index} style={{ backgroundColor: user.colorbc }}>
                                        </Avatar></Link> 
                                    </Tooltip>
                                })}
                            </Avatar.Group> */}

                            <Avatar.Group className="img-marginremove"
                                    maxCount={9}
                                    size="large"
                                    maxStyle={{ color: 'var(--primary)', backgroundColor: 'var(--secondary)' }}
                                >
                                    <Avatar src={user} />
                                    <Avatar src={user} />
                                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                </Avatar.Group>
                        </div>
                </div>
              </Card>
            </div>
            {flagsData.IsCertified && <div className="custom-card mb-8">
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
              <Card title={flagsData.IsSubmitted ? '' : 'Take a Test'}>
                {!flagsData.IsSubmitted && <div className="docs px-0">
                <List
              itemLayout="horizontal"
              dataSource={courseDetails.Tests}
              renderItem={(item, indx) => (
                <List.Item className="upload-preview">
                  <List.Item.Meta
                    avatar={[
                      <span className={`doc-icons ${item.Avatar}`}></span>,
                    ]}
                    // avatar={item.avatar}
                    title={<a href={item.Documents}>{item.Title}</a>}
                    description={
                      <div className="file-size f-12">{item.Size}</div>
                    }
                  />
                </List.Item>
              )}
            />
                </div>}
              
                {/* <Result
                  icon={<img src={test} />}
                  title="Test documents are uploaded here"
                  subTitle="Please download and completed the assignments and upload bellow, thank you !"
                  extra={<Button type="primary">Download Here</Button>}
                /> */}
                <div className="px-12 pb-12">
               {(flagsData.IsSubmitted&&!flagsData.IsRejected&&!flagsData.IsCertified) && <Result
                      icon={<span className="error-icons success" />}
                      title="Successfully Uploaded"
                      subTitle="We sent your file's to the admin review, untill approve, please wait..."
                    />}
                    {flagsData.IsRejected && <Result
                      icon={<span className="error-icons failed" />}
                      title="Submission Rejected"
                      subTitle="Please check and modify the assignments before resubmitting."
                      extra={[<Button type="primary" onClick={this.reUpload}>Re - Upload</Button>]}
                    ></Result>}
                  {!flagsData.IsSubmitted && <Dragger className="upload mb-16"
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
                  </Dragger>}
                  {(!flagsData.IsSubmitted) && <div className="docs px-0 hideempty">
                  <List
              itemLayout="horizontal"
              dataSource={this.state.uploadSources}
              renderItem={(item, indx) => (
                <List.Item className="upload-preview">
                  <List.Item.Meta
                    avatar={[
                      <span className={`doc-icons ${item.avatar}`}></span>,
                    ]}
                    // avatar={item.avatar}
                    title={item.title}
                    description={
                      <div className="file-size f-12">{item.fileSize}</div>
                    }
                  />
                  <a
                    class="item-close"
                    onClick={() => {
                      let { uploadSources,TestsObj } = this.state;
                      TestsObj.splice(indx, 1);
                      uploadSources.splice(indx, 1);
                      this.setState({ ...this.state, uploadSources });
                    }}
                  >
                    <Tooltip title="Remove">
                      <span className="close-icon"></span>
                    </Tooltip>
                  </a>
                </List.Item>
              )}
            />
                    {this.state.uploadSources.length > 0 && <div className="mt-12 text-center">
                      <Button type="primary" key="console"
                      onClick={this.saveUserTestFiles}>
                        Submit Files
                      </Button>
                    </div>}
                  </div>}
                  <div className="px-12 pb-12">
                    <Divider />
                    
                  </div>
                </div>
              </Card>
            </div>
            <div className="custom-card comment-over">
              <Card title="Comments">
                <div className="px-12 post-card comment-show comment-over">
                {<Comments
            count={0}
            postId={this.props.courseid}
            object={this.state.object}
            isLMSComment={true}
          />}
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


