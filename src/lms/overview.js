import React, { Component } from 'react';
import { Card, List, Row, Col, Carousel, Collapse, Avatar, Tabs, Divider, Typography,Input,Button } from 'antd'
import { Link } from 'react-router-dom';
import { CaretRightOutlined } from '@ant-design/icons';
import '../index.css';
import '../App.css';
const { Title } = Typography;

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
            <div className="p-16 card-background">
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
                <Title level={4}>What is JavaScript? How does JavaScript work?</Title>
                <p>As a multi-paradigm language, JavaScript supports event-driven, functional, and imperative programming styles. It has application programming interfaces (APIs) for working with text, dates, regular expressions, standard data structures, and the Document Object Model (DOM). </p>
                <p>Although there are similarities between JavaScript and Java, including language name, syntax, and respective standard libraries, the two languages are distinct and differ greatly in design.</p>
                <p>The choice of the JavaScript name has caused confusion, sometimes giving the impression that it is a spin-off of Java. Since Java was the hot new programming language at the time, this has been characterized as a marketing ploy by Netscape to give its own new language cachet.</p>
                <p>Although there are similarities between JavaScript and Java, including language name, syntax, and respective standard libraries, the two languages are distinct and differ greatly in design.</p>
                <p>The choice of the JavaScript name has caused confusion, sometimes giving the impression that it is a spin-off of Java. Since Java was the hot new programming language at the time, this has been characterized as a marketing ploy by Netscape to give its own new language cachet.</p>
                <p className="mb-0">As a multi-paradigm language, JavaScript supports event-driven, functional, and imperative programming styles.</p>
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
        )
    }
}
export default OverView;

