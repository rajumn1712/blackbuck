import React, { Component } from 'react';
import { Button, Card, Divider, Row, Col, Form, Input, Select, List, Avatar, Tabs, Empty } from 'antd'
import { Link } from 'react-router-dom';
import { store } from '../../store'
import '../../index.css';
import '../../App.css';
import TextArea from 'antd/lib/input/TextArea';
import user from '../../styles/images/user.jpg';
import PremiumBadge from "../../styles/images/premiumbadge.svg";
import MediaPreview from '../../group/MediaPreview';
import { getMedia } from "../api/apiServer";
const { Option } = Select;
const joingroup = <div className="join-grp-title">John Doe <span className="join-grp-txt">has Created a group name is</span> Mech Mantra</div>
const { TabPane } = Tabs;
const { Meta } = Card;
class Media extends Component {
    state = {
        Videos: [],
        Photos: [],
        tabkey: "1",
    }

    openFullview = (item, type) => {
        this.mediaPreview.openFullview(item, type)
    }
    componentDidMount() {
        this.getMedia(this.props.groupData.GroupId, 'photos', 20, 0);
    }
    getMedia = (groupid, type, take, skip, index) => {
        getMedia(groupid, type, take, skip).then(res => {
            let { Photos, Videos } = this.state;
            if (type == 'photos') {
                Photos = res.data;
                this.setState({ ...this.state, Photos, tabkey: index });
            }
            else {
                Videos = res.data;
                this.setState({ ...this.state, Videos, tabkey: index });
            }
        });
    }
    render() {
        const { Videos, Photos, tabkey } = this.state;
        return (
            <div className="custom-card">
                <Card title="Media" bordered={false}
                // extra={<div><a className="f-14 px-16" href="#">Create Album</a><a className="pl-8 f-14" href="#">Add Photos/Video</a></div>}
                >
                    <Tabs defaultActiveKey={tabkey} className=" media-tabs" onChange={(index) => this.getMedia(this.props.groupData.GroupId, index == 1 ? 'Photos' : 'Video', 20, 0, index)}>
                        <TabPane tab="Photos" key="1">
                            <div className="">
                                <Row>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="m-8">
                                        <Row >
                                            {Photos.length > 0 && Photos?.map((item, indx) => {
                                                return <Col span={6}><Card key={indx}
                                                    hoverable
                                                    cover={<img src={item.ImageUrl} onClick={() => this.openFullview(item, 'Photo')} />}
                                                >
                                                </Card></Col>
                                            })
                                            }
                                            {Photos.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                                        </Row>
                                    </Col>

                                </Row></div>
                        </TabPane>
                        <TabPane tab="Videos" key="2">
                            <Row gutter={16}>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="m-8">
                                    <Row gutter={24}>
                                        {Videos.length > 0 && Videos?.map((item, indx) => {
                                            return <Col span={6}><Card key={indx}
                                                hoverable
                                                cover={<div className="video-post" >
                                                    <video width="100%" onClick={() => this.openFullview(item, 'Video')} >
                                                        <source src={item.ImageUrl} />
                                                    </video>
                                                </div>}
                                            >
                                            </Card></Col>
                                        })
                                        }
                                        {Videos.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                                    </Row>
                                </Col>
                            </Row>
                        </TabPane>
                        {/* <TabPane tab="Albums" key="3">
                            <Row gutter={16}>
                                <Col xs={24} sm={8} md={8} lg={8} xl={8} className="m-8">
                                    <Card
                                        hoverable
                                        cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                                    >
                                        <Meta title="June 30, 2020" description="3 photos" />
                                    </Card>
                                </Col>

                            </Row>
                        </TabPane> */}

                    </Tabs>
                </Card>
                <MediaPreview onRef={mediaPreview => this.mediaPreview = mediaPreview} groupData={this.props.groupData} />
            </div>
        )
    }
}
export default Media;