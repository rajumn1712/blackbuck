import React, { Component } from 'react';
import { Card, List, Row, Col, Typography, Button, Result, Tooltip, Upload, Spin, } from 'antd'
import '../index.css';
import '../App.css';
import { getCertifiedFlags, submitTests } from './api';
import { connect } from 'react-redux';
import Comments from '../shared/components/postings/Comments/Comments';
import Loader from '../common/loader';
import notify from '../shared/components/notification';
import { uuidv4 } from '../utils';
import { apiClient } from '../shared/api/clients';
import logo from './logo.png';
import certificatelogo from './ce1.png';
import aapng from './aa.png';

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
    flagsData:{Id:null,"IsSubmitted":null,"IsCertified":null,"IsRejected":null,ReSubmit:null},
    showUpload:false,
    buttonLoading:false
}
componentDidMount(){
  this.getCertified();
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
  accept:".doc,.docx,.ott,.rtf,.docm,.dot,.odt,.dotm,.md,.xls,.xlsx.,.csv,.pptx,.pdf",
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
  beforeUpload: (file) => {
    let accepted = false;
    const fileMaxSize = 25 * 1000000;
    const acceptTypes = "doc,docx,ott,rtf,docm,dot,odt,dotm,md,xls,xlsx,csv,pptx,pdf"
    if(!(acceptTypes.indexOf(file.name.substr(file.name.lastIndexOf(".") + 1)) > -1)){
      notify({
        message: "Upload",
        description: `File format not supported`,
        type: "warning",
      });
       accepted = true;
    }
    if (file.size > fileMaxSize) {
      notify({
        message: "Upload",
        description: `Document size does not exceed 25 MB`,
        type: "warning",
      });
    }
    return file.size <= fileMaxSize && !accepted;
  },
};



saveUserTestFiles = async ()=>{
  const object ={
    "Id":this.state.flagsData.Id ? this.state.flagsData.Id : uuidv4(),
  "CourseId": this.props.courseid,
  "UserId": this.props.profile?.Id,
  "Firstname": this.props.profile?.FirstName,
  "Lastname": this.props.profile?.LastName,
  "Image": this.props.profile?.ProfilePic,
   "CreatedDate":new Date(),
   "IsSubmitted":this.state.showUpload ? false : true,
   "ReSubmit":this.state.showUpload ? true : false,
   "IsRejected":false,
   "IsCertified":false,
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
  flagsData.IsCertified = false;
  flagsData.IsSubmitted = false;
  this.setState({...this.state,flagsData,showUpload:true})
}

downloadCertificate = ()=>{
  this.setState({...this.state,buttonLoading:true})
  const html = `
  <!DOCTYPE html>
    <html>

        <head>
		<meta charset="UTF-8">     
		<link href="http://fonts.cdnfonts.com/css/neue-haas-grotesk-text-pro" rel="stylesheet">       
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Download CERTIFICATE</title>
            <style>
                body{line - height: 30px;}
         @import url('http://fonts.cdnfonts.com/css/neue-haas-grotesk-text-pro');
        * {
            font-family: 'Neue Haas Grotesk Text Pro', sans-serif;
        }
			</style>
        </head>

        <body>
            <table border="1" style="border-collapse: collapse; width: 50%;height:477px;text-align:center;margin: auto;background-image: url('${aapng}'); background-repeat: no-repeat;">
                <tbody>
                    <tr>
                        <td style="width: 100%;vertical-align: top;">
                            <table border="1" style="border-collapse: collapse; width: 100%; border-style: none; float: left;">
                                <tbody>
                                    <tr>
                                        <td style="width: 100%; border-style: none none solid;vertical-align: top;border:0;text-align: left;">
										<span style="display:flex;">
										<span><img src="${logo}" width="56" height="56" alt="" style="padding:35px 0 0 45px;margin-bottom: 15px;" /></span>
										<span style="font-family: arial, helvetica, sans-serif;font-size: 24px;color: #353744;padding: 48px 0 0 8px;margin-bottom: 15px;">BlackBuck</span>
										</span>
										</td>
                                    </tr>
									<tr>
										<td style="text-align:center;font-size:28px;font-weight:600;padding-top:20px;border:0;font-family: arial, helvetica, sans-serif;color:#07A3B2;">CERTIFICATE</td>
									</tr>
									<tr>
										<td style="padding:0;text-align:center;width:30px;font-family: arial, helvetica, sans-serif;border:0;">
											<img src="${certificatelogo}" width="238" height="25px" alt="" style="margin-bottom: 15px;text-align:center;margin-bottom:0;" />
										</td>
									</tr>
									<tr>
										<td style="text-align:center;font-size:18px;padding:10px 35px;border:0;font-family: arial, helvetica, sans-serif;">
										<p style="line-height: 1.8;letter-spacing: 1px;">This is to certify that ${this.props.profile?.FirstName} ${this.props.profile?.LastName} successfully completed of official BlackBuck Insights: on BlackBuck online course</p>
										</td>
									</tr>
									
									
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </body>
    </html>
  `
  apiClient.post(process.env.REACT_APP_AUTHORITY + '/Account/DownLoadProfile',{
    FileName:this.props?.profile?.FirstName,
    TemplateContent:html
  }).then(res=>{
    if(res.ok){
      window.open(res.data);
      this.setState({...this.state,buttonLoading:false},()=>{
        notify({
          message:"Download",
          description:'Certificate downloaded successfully'
          
        })
      })
    }else{
      this.setState({...this.state,buttonLoading:false},()=>{
        notify({
          message:"Error",
          description:'Something went wrong',
          type:'error'
        })
      })
    }
  })
}
updateCount=(prop,value)=>{
  let {courseDetails} = this.state;
  courseDetails.CommentCount = value;
  this.setState({...this.state,courseDetails});
}


    render() {
      const {courseDetails,flagsData} = this.state;
        return (
          <div>
            <div className="custom-card">
              {/*<Card actions={(size > 9 && size < Members?.length) ? [
                    <Button type="primary" onClick={() => this.showMore()}>See More</Button>
                ] : []}>
                 <div className="py-12">
                   <Title level={4} className="semibold mb-4 text-primary">
                   {courseDetails.GroupName}
                  </Title> 
                  <div className="px-12">
                  <p className="text-secondary f-14">{courseDetails.Author[0].Firstname} {courseDetails.Author[0].Lastname} |  {moment(courseDetails.CreatedDate).format('ll')}</p>
                  <Paragraph className="text-primary">
                    {courseDetails.Description}
                  </Paragraph></div>
                  <Divider className="mt-0 mb-6" />
                  <div className="px-12">
                  <Title className="semibold mb-4 text-primary f-16">
                    Members List 
                  </Title>
                   <div>
                            <Avatar.Group
                                maxCount={size-1}
                                size="large"
                                maxStyle={{ color: 'var(--primary)', backgroundColor: 'var(--secondary)' }}
                            >
                                {Members.length > 0 && Members.map((user, index) => {
                                    return <Tooltip title={user.Firstname ? user.Firstname : user.FirstName} placement="top">
                                        <Link to={this.props?.profile.Id == user.UserId ? "/profile/IsProfileTab" : ("/profileview/" + user.UserId)}><Avatar src={user.Image || defaultUser} key={index} style={{ backgroundColor: user.colorbc }}>
                                        </Avatar></Link> 
                                    </Tooltip>
                                })}
                            </Avatar.Group>

                            {/* <Avatar.Group className="img-marginremove"
                                    maxCount={9}
                                    size="large"
                                    maxStyle={{ color: 'var(--primary)', backgroundColor: 'var(--secondary)' }}
                                >
                                    <Avatar src={user} />
                                    <Avatar src={user} />
                                    <Avatar >K</Avatar>
                                    <Avatar >K</Avatar>
                                    <Avatar >K</Avatar>
                                    <Avatar >K</Avatar>
                                    <Avatar >K</Avatar>
                                    <Avatar >K</Avatar>
                                </Avatar.Group> */}
                        {/* </div></div>
                </div> 
              </Card>*/}
            </div>
            {flagsData.IsCertified && <div className="custom-card mb-8">
                    <Card className="start-course">
                        <Row align="middle" className="p-16" justify="space-between">
                            <Col xs={24} sm={18} md={18} lg={18} xl={18} xxl={18}>
                                <Title level={3} className="normalbold text-white mb-4">Download Course Certificate</Title>
                                <p className="f-14 text-white mb-0">Your are certified and your certificate is generated now its ready to generate.</p>
                            </Col>
                            <Col xs={24} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                <Button type="dashed" onClick={this.downloadCertificate} disabled={this.state.buttonLoading}>
                                  {this.state.buttonLoading && <Spin />}
                                  Download Here
                                  </Button>
                            </Col>
                        </Row>
                    </Card>
                </div>}
            {(courseDetails.Tests.length > 0 &&!flagsData.IsCertified) && <div className="custom-card">
              <Card title='Take a Test'>
                {!flagsData.IsSubmitted && <div className="docs p-12">
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
                  <a
                    class="item-close"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(item.Documents)
                    }}
                    target="_blank"
                  >
                    <Tooltip title="Download">
                      <span className="post-icons download-coloricon mt-6 ml-6"></span>
                    </Tooltip>
                  </a>
                </List.Item>
              )}
            />
                </div>}
                <div className="px-12 pb-12">
               {(flagsData.IsSubmitted || flagsData.ReSubmit) && <Result
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
                  {(courseDetails.Tests.length > 0 && (!flagsData.IsCertified && !flagsData.IsRejected && !flagsData.IsSubmitted && !flagsData.ReSubmit)) && <Dragger className="upload"
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
                  {(courseDetails.Tests.length > 0 && (!flagsData.IsCertified && !flagsData.IsRejected && !flagsData.IsSubmitted && !flagsData.ReSubmit)) && <div className="docs px-0 hideempty">
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
                  {/* <div className="px-12 pb-12">
                    <Divider />
                    
                  </div> */}
                </div>
              </Card>
            </div>}
            <div className="custom-card comment-over">
              <Card title={`Comments (${courseDetails.CommentCount})`}>
                <div className="px-12 post-card comment-show comment-over">
                {<Comments
                onUpdate={(prop, value) => {
                  this.updateCount(prop, value);
                }}
                count={courseDetails.CommentCount}
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


