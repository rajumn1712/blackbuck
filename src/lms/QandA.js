import React, { Component,useState } from 'react';
import { Card, List, Row, Col, Carousel, Collapse, Avatar, Tabs,Divider,Modal } from 'antd'
import { Link } from 'react-router-dom';
import { CaretRightOutlined } from '@ant-design/icons';
import PremiumBadge from "../styles/images/premiumbadge.svg";
import '../index.css';
import '../App.css';

const data = [
    {
      title: 'Jhon Doe',
      description: 'You need to consider that doing document.body.innerHTML',
    },
    {
      title: 'Herbert Van-Vliet',
      description: 'Not only is this slow, but destroys the earlier elements',
    },
];

class QandA extends Component {
  
    render(){
      
      
  
        return (
            <div className="py-16 fw-500">
                <div className="justify-content-between d-flex">
                    <div className="f-16">344 questions in this course</div><div><Link >Add a new Question</Link></div>
                </div>
                <Divider />
            <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
              <List.Item  actions={[ <a className="f-12" key="list-loadmore-more">12 <span className="grp-type-icon reply"></span></a>]} >
                <List.Item.Meta
                  avatar={<img src={PremiumBadge} />}
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

