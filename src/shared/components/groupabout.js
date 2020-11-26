import React, { Component } from 'react';
import { Button, Card, Divider, Row, Col, Form, Input, Select,List, Avatar } from 'antd'
import { Link } from 'react-router-dom';
import { store } from '../../store'
import '../../index.css';
import '../../App.css';
import TextArea from 'antd/lib/input/TextArea';
const { Option } = Select;
const data = [
    {
        title: 'Ant Design Title 1',
    },
    {
        title: 'Ant Design Title 2',
    },
    {
        title: 'Ant Design Title 3',
    },
    {
        title: 'Ant Design Title 4',
    },
];
class GroupAbout extends Component {


    render() {
        const { user } = store.getState().oidc;

        return (
            <div className="custom-card">
                <Card title="About Me" bordered={false}>
                    <div>
                        <p>Programming is the process of creating a set of instructions that tell a computer how to perform a task</p>
                        <div>
                            <List
                                itemLayout="horizontal"
                                dataSource={data}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                            title={<a href="https://ant.design">{item.title}</a>}
                                            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>

                    </div>
                </Card>

            </div>
        )
    }
}
export default GroupAbout;