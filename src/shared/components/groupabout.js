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
        title: 'Public',
        description:'Anyone can see whos in the group and what they post',
    },
    {
        title: 'Visible',
        description:'Anyone can find this group.',
    },
    {
        title: 'General Group',
    },
    {
        title: 'History',
        description:'Group created on April 3, 2018. Name last changed on June 27, 2018. ',
    },
];
class GroupAbout extends Component {


    render() {
        const { user } = store.getState().oidc;

        return (
            <div className="custom-card">
                <Card title="About This Group" bordered={false}>
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
                                            description={<a href="https://ant.design">{item.description}</a>}
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