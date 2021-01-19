import React, { Component } from 'react';
import { Card, List, Row, Col, Carousel, Collapse, Avatar, Tabs, Divider, Typography,Input,Button, Result, Tooltip, Upload, Comment, Form } from 'antd'
import { Link } from 'react-router-dom';
import { CaretRightOutlined, SmileOutlined } from '@ant-design/icons';
import defaultUser from "../styles/images/defaultuser.jpg";
import TextArea from 'antd/lib/input/TextArea';
import '../index.css';
import '../App.css';
import test from "../styles/images/test.svg";

const { Title, Paragraph } = Typography;
const { Dragger } = Upload;
const listData = [
  {
    title: `Assignment - 1`,
    fileSize: `25KB`,
    avatar: `docx`
  },
  {
    title: `Assignment - 2`,
    fileSize: `50KB`,
    avatar: `ppt`
  },
  {
    title: `Assignment - 3`,
    fileSize: `20KB`,
    avatar: `pdf`
  },
  {
    title: `Assignment - 4`,
    fileSize: `50KB`,
    avatar: `docx`
  }
];
const data = [
    {
        title: 'Skill levels',
        description: ' All Levels'
    },
    {
        title: 'Students',
        description: ' 46865'
        
    },
    {
        title: 'Languages',
        description: ' English'
        
    },
    {
        title: 'video',
        description: ' 59 total hours'
        
    }
];
class OverView extends Component {

    render() {
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
                    What is JavaScript? How does JavaScript work?
                  </Title>
                  <p className="text-secondary f-14">5 Views | Jan,01,2021</p>
                  <Paragraph className="text-primary">
                    As a multi-paradigm language, JavaScript supports
                    event-driven, functional, and imperative programming styles.
                    It has application programming interfaces (APIs) for working
                    with text, dates, regular expressions, standard data
                    structures, and the Document Object Model (DOM). As a
                    multi-paradigm language, JavaScript supports event-driven,
                    functional, and imperative programming styles. It has
                    application programming interfaces (APIs) for working with
                    text, dates, regular expressions, standard data structures,
                    and the Document Object Model (DOM).
                  </Paragraph>
                  <Paragraph className="text-primary">
                    As a multi-paradigm language, JavaScript supports
                    event-driven, functional, and imperative programming styles.
                    It has application programming interfaces (APIs) for working
                    with text, dates, regular expressions, standard data
                    structures, and the Document Object Model (DOM). As a
                    multi-paradigm language, JavaScript supports event-driven,
                    functional, and imperative programming styles. It has
                    application programming interfaces (APIs) for working with
                    text, dates, regular expressions, standard data structures,
                    and the Document Object Model (DOM).
                  </Paragraph>
                  <Divider />
                  <Title className="semibold mb-4 text-primary f-16">
                    Participent List
                  </Title>
                </div>
              </Card>
            </div>
            <div className="custom-card mb-8">
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
                </div>
            <div className="custom-card">
              <Card title="Comments (5)">
                <div className="px-12">
                  <Comment
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
                  />
                </div>
              </Card>
            </div>
            <div className="custom-card">
              <Card title="Take a Test">
                <Result
                  icon={<img src={test} />}
                  title="Test documents are uploaded here"
                  subTitle="Please download and completed the assignments and upload bellow, thank you !"
                  extra={<Button type="primary">Download Here</Button>}
                />
                <div className="px-12 pb-12">
                  <Dragger className="upload mb-16">
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
                    <List
                      itemLayout="horizontal"
                      dataSource={listData}
                      renderItem={(item, indx) => (
                        <List.Item className="upload-preview">
                          <List.Item.Meta
                            avatar={[
                              <span className={`doc-icons ${item.avatar}`} />
                            ]}
                            // avatar={item.avatar}
                            title={item.title}
                            description={
                              <div className="file-size f-12">
                                {item.fileSize}
                              </div>
                            }
                          />
                          <a class="item-close">
                            <Tooltip title="Remove">
                              <span className="close-icon"></span>
                            </Tooltip>
                          </a>
                        </List.Item>
                      )}
                    />
                    <div className="mt-12 text-center">
                      <Button type="primary" key="console">
                        Submit Files
                      </Button>
                    </div>
                  </div>
                  <div className="px-12 pb-12">
                    <Divider />
                    <Result
                      icon={<span className="error-icons success" />}
                      title="Successfully Uploaded"
                      subTitle="We sent your file's to the admin review, untill approve, please wait..."
                    />
                    <Result
                      icon={<span className="error-icons failed" />}
                      title="Submission Rejected"
                      subTitle="Please check and modify the assignments before resubmitting."
                      extra={[<Button type="primary">Re - Upload</Button>]}
                    ></Result>
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
export default OverView;

