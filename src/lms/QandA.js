import React, { Component } from 'react';
import { Card, List, Row, Col, Carousel, Collapse, Avatar, Tabs,Divider } from 'antd'
import { Link } from 'react-router-dom';
import { CaretRightOutlined } from '@ant-design/icons';
import '../index.css';
import '../App.css';
const data = [
    {
      title: 'Ant Design Title 1',
      description: 'df',
    },
    {
      title: 'Ant Design Title 2',
      description: 'df',
    },
];
class QandA extends Component {

    render(){
        return (
            <div className="py-16 fw-500">
                <div className="justify-content-between d-flex">
                    <div className="f-16">344 questions in this course</div><div>Add a new Question</div>
                </div>
                <Divider />
            <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
              <List.Item  actions={[ <a className="f-12" key="list-loadmore-more">12 <span className="grp-type-icon reply"></span></a>]} >
                <List.Item.Meta
                  avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  title={<a>{item.title}</a>}
                  description={<div>{item.description}</div>}
                />
                
              </List.Item>
              
            )}
          />
          </div>
            )
            }
    }
    export default QandA;

