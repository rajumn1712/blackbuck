import React, { Component } from 'react';
import { Card, List, Row, Col, Carousel, Collapse, Avatar, Tabs, Divider, Typography,Input,Button } from 'antd'
import { Link } from 'react-router-dom';
import { CaretRightOutlined } from '@ant-design/icons';
import '../index.css';
import '../App.css';
const { Title } = Typography;

const data = [
    {
        title: 'Name',
        description: 'saranya'
    },
    {
        title: 'Username',
        description: ' https://www.blackbuck.com/saranya'
    },
];
class OverView extends Component {

    render() {
        return (
            <div className="py-16">
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
                <Title level={4}>About this Course</Title>
                <p>In the process of internal desktop applications development, many different design specs and implementations would be involved, which might cause designers and developers difficulties </p>

                <Divider />

                <div className="set-flex mb-12">
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <List.Item actions={[<a onClick={this.showModal} key="list-loadmore-edit">Edit</a>]}>
                                <List.Item.Meta
                                    title={<h3 className="mb-0">{item.title}</h3>}
                                    description={<div><div>{item.description}</div>
                                    </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </div>
                <Divider />
            </div>
        )
    }
}
export default OverView;

