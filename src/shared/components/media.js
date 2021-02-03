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
import VisSenseFactory from "vissense";
const { Option } = Select;
const joingroup = <div className="join-grp-title">John Doe <span className="join-grp-txt">has Created a group name is</span> Mech Mantra</div>
const { TabPane } = Tabs;
const { Meta } = Card;
const VisSense = VisSenseFactory(window);
class Media extends Component {
    state = {
        Videos: [],
        Photos: [],
        tabkey: "1",
        loadMore: true,
        page: 1,
        pageSize: 10,
    }
    handleScroll = () => {
        const windowHeight =
            "innerHeight" in window
                ? window.innerHeight
                : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight
        );
        const windowBottom = Math.ceil(windowHeight + window.pageYOffset);
        if (windowBottom >= docHeight) {
            this.loadMore();
        } else {
        }
    };
    loadMore(e) {
        if (this.state.loadMore) {
            let { page, index } = this.state;
            page += 1;
            this.setState({ ...this.state, page, loading: true }, () => {
                this.getMedia(this.props.groupData.GroupId, index == 1 ? 'photos' : 'Video', this.state.pageSize, this.state.page * this.state.pageSize - this.state.pageSize);
            });
        }
    }
    openFullview = (item, type, e) => {
        if (e) {
            const videoElements = document.querySelectorAll("video");
            for (const i in videoElements) {
                if (typeof videoElements[i] == "object") {
                    this.enableVideoAutoPlay(videoElements[i]);
                }
            }
        }
        this.mediaPreview.openFullview(item, type)
    }
    enableVideoAutoPlay(myVideo) {
        var videoElementArea = VisSense(myVideo);
        var monitorBuilder = VisSense.VisMon.Builder(videoElementArea);
        monitorBuilder.on("hidden", function () {
            myVideo.pause();
        });
        var videoVisibilityMonitor = monitorBuilder.build();
        videoVisibilityMonitor.start();
    }
    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
        this.getMedia(this.props.groupData.GroupId, 'photos', this.state.pageSize, this.state.page * this.state.pageSize - this.state.pageSize,"1");
    }
    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
      }
    getMedia = (groupid, type, take, skip, index) => {
        this.setState({ ...this.state, loading: true });
        getMedia(groupid, type, take, skip).then(res => {
            let { Photos, Videos } = this.state;
            if (type == 'photos') {
                Photos = Photos.concat(res.data);
                Photos.forEach(item => {
                    if (Array.isArray(item.ImageUrl)) {
                        item.ImageUrl = item.ImageUrl.slice(0, 1);
                    }
                });
                this.setState({
                    ...this.state, Photos, tabkey: index,
                    loading: false,
                    loadMore: res.data.length === this.state.pageSize
                });
            }
            else {
                Videos = Videos.concat(res.data);
                this.setState({
                    ...this.state, Videos, tabkey: index,
                    loading: false,
                    loadMore: res.data.length === this.state.pageSize
                });
            }
        });
    }
    onTabClick = (index, tabkey) => {
        if (index !== tabkey)
            this.setState({ ...this.state, Photos: [], Videos: [] }, () => { this.getMedia(this.props.groupData.GroupId, index == 1 ? 'photos' : 'Video', this.state.pageSize, this.state.page * this.state.pageSize - this.state.pageSize, index) });
    }
    render() {
        const { Videos, Photos, tabkey } = this.state;
        return (
            <div className="custom-card">
                <Card title="Media" bordered={false}
                // extra={<div><a className="f-14 px-16" href="#">Create Album</a><a className="pl-8 f-14" href="#">Add Photos/Video</a></div>}
                >
                    <Tabs defaultActiveKey={tabkey} className=" media-tabs" onTabClick={(index)=>this.onTabClick(index,this.state.tabkey)}>
                        <TabPane tab="Photos" key="1">
                            <div className="">
                                <Row>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="m-8">
                                        <Row >
                                            {Photos.length > 0 && Photos?.map((item, indx) => {
                                                return <Col span={6}><Card key={indx}
                                                    hoverable
                                                    cover={<img className="obj-fit" src={item.ImageUrl} onClick={() => this.openFullview(item, 'Photo')} />}
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
                                                cover={<div className="post-image" onClick={(e) =>{this.openFullview(item, 'Video',e)}}>
                                                    <video width="100%"  height="100%" controls>
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