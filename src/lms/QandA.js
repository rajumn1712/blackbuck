import React, { Component, useState } from 'react';
import { Card, List, Row, Col, Comment, Form, Avatar, Tabs, Divider, Modal, Button } from 'antd'
import { Link } from 'react-router-dom';
import TextArea from 'antd/lib/input/TextArea';
import { CaretRightOutlined } from '@ant-design/icons';
import PremiumBadge from "../styles/images/premiumbadge.svg";
import defaultUser from '../styles/images/defaultuser.jpg';
import '../index.css';
import '../App.css';

const data = [
  {
    title: 'Jhon Doe',
    description: 'You need to consider that doing document.body.innerHTML',
  },
];
const data1 = [
  {
    title: 'Herbert Van-Vliet',
    description: 'Not only is this slow, but destroys the earlier elements',
  },
];

class QandA extends Component {
  state = {
    loading: false,
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };
  render() {
    const { visible, loading } = this.state;
    return (
      <div className="card-background p-0 fw-500">
        <div className="justify-content-between p-16 d-flex">
          <div className="f-16">344 questions in this course</div><div><Link onClick={this.showModal}>Add a new Question</Link></div>
        </div>
        <Divider className="my-4" />
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item actions={[<a className="f-12" key="list-loadmore-more">12 <span className="grp-type-icon reply"></span></a>]} >
              <List.Item.Meta
                avatar={<img src={PremiumBadge} />}
                title={<a>{item.title}</a>}
                description={<div>{item.description}</div>}
              />

            </List.Item>

          )}
        />
        {/* <div>
         <link>10 replys</link>
         <List
          itemLayout="horizontal"
          dataSource={data1}
          renderItem={item => (
            <List.Item actions={[<a className="f-12" key="list-loadmore-more">12 <span className="grp-type-icon reply"></span></a>]} >
              <List.Item.Meta
                avatar={<img src={PremiumBadge} />}
                title={<a>{item.title}</a>}
                description={<div>{item.description}</div>}
              />

            </List.Item>

          )}
        />
</div> */}
        <Modal
          visible={visible}
          title="Title"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleOk}>Submit</Button>,
          ]}
        >
          <Comment 
            avatar={
              <Avatar src={this.props.profile?.ProfilePic || defaultUser} />
            }
            content={
              <Form.Item><TextArea onChange={this.onChange} value={this.state.Comment} autoSize={{ minRows: 1, maxRows: 6 }} />
                <Button disabled={!this.state.Comment} htmlType="submit" onClick={this.onSubmit} shape="circle" type="link" className="post-btn">
                  <span className="post-icons send-icon mr-0"></span>
                </Button></Form.Item>
            }
          />
        </Modal>
      </div>


    )
  }
}
export default QandA;

