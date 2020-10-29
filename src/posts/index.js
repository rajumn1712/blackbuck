import { Card, Layout, Space, Menu, Avatar, Table, PageHeader } from 'antd';
import React, { Component } from 'react';
import { apiClient } from '../shared/api/clients';
import { EllipsisOutlined, UserOutlined, LaptopOutlined, NotificationOutlined, ShareAltOutlined, LikeOutlined, CommentOutlined, FileImageOutlined, VideoCameraOutlined } from '@ant-design/icons';
const { Meta } = Card;
const { Content, Sider } = Layout;
const { SubMenu } = Menu;
class Posts extends Component {
    columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "key",
            render: text => <a onClick={() => this.props.history.push("/post")}>{text}</a>
        },
        {
            title: "Description",
            dataIndex: "body",
            key: "body",
        }
    ]
    state = {
        data: [],
        viewType: "grid",
        isLoading: true
    }
    componentDidMount() {
        apiClient.get("posts").then(data => {
            this.setState({ data: data.data, isLoading: false })
        })
    }
    render() {
        if (this.state.viewType === "card") {
            return (
                <Layout>
                    <Sider style={{ backgroundColor: "#ffff" }} >
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{ height: '100%' }}
                        >
                            <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
                                <Menu.Item key="1">option1</Menu.Item>
                                <Menu.Item key="2">option2</Menu.Item>
                                <Menu.Item key="3">option3</Menu.Item>
                                <Menu.Item key="4">option4</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub2" icon={<LaptopOutlined />} title="subnav 2">
                                <Menu.Item key="5">option5</Menu.Item>
                                <Menu.Item key="6">option6</Menu.Item>
                                <Menu.Item key="7">option7</Menu.Item>
                                <Menu.Item key="8">option8</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub3" icon={<NotificationOutlined />} title="subnav 3">
                                <Menu.Item key="9">option9</Menu.Item>
                                <Menu.Item key="10">option10</Menu.Item>
                                <Menu.Item key="11">option11</Menu.Item>
                                <Menu.Item key="12">option12</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Content style={{ paddingLeft: 100 }}>
                        {this.state.data?.map((item, indx) =>
                            <Card
                                title={<Meta
                                    avatar={
                                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                    } title={item.title} />}
                                extra={<EllipsisOutlined key="ellips" />}
                                actions={[
                                    <CommentOutlined key="comment" />,
                                    <LikeOutlined key="like" />,
                                    <ShareAltOutlined key="share" />,
                                    <EllipsisOutlined key="ellips" />
                                ]}
                                key={indx}
                                hoverable
                                style={{ width: 500, borderRadius: 10, borderBottom: 20 }}
                                cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                                av
                            >
                                <Meta
                                    description={item.body} />
                            </Card>
                        )}
                    </Content>
                    <Sider style={{ backgroundColor: "#ffff" }} />
                </Layout>
            )
        }
        return (
            <>
                <PageHeader title="Posts" onBack={() => null} className="site-page-header" />
                <Table columns={this.columns} dataSource={this.state.data} loading={this.state.isLoading} />
            </>
        )
    }
}

export default Posts;