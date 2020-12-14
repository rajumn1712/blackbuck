import React, { Component } from 'react';
import { Card, Avatar, Col, Row, Typography, Empty } from 'antd'
import { Link } from 'react-router-dom';
import { store } from '../../store'
import connectStateProps from '../stateConnect';
import { fetchUserGroups } from '../api/apiServer'
import CommonModal from '../../components/ProfileComponents/CommonModal'
import CreateGroup from '../../group/creategroup'
const { Meta } = Card;
let GroupEditObj={};
class GroupsPage extends Component {
    state = {
        Groups: [],
        page: 1,
        pageSize: 20,
        loading: true,
        loadMore: true,
        visible: false,
    }
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll)
        this.getGroups();
    }
    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll)
    }
    saveGroup = () => {
        this.creategroup.handleSave();
    }
    getGroups() {
        this.setState({ ...this.state, loading: true });
        fetchUserGroups((this.props.userId ? this.props.userId : (this.props?.profile?.Id)), this.state.pageSize, (this.state.page * this.state.pageSize - this.state.pageSize))
            .then(res => {
                if (res.ok) {
                    let { Groups } = this.state;
                    Groups = Groups.concat(res.data)
                    this.setState({ ...this.state, loading: false, Groups: Groups, loadMore: res.data.length === this.state.pageSize })
                }
            })
    }
    handleScroll = () => {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = Math.ceil(windowHeight + window.pageYOffset);
        if (windowBottom >= docHeight) {
            this.loadMore();
        } else {

        }
    }
    loadMore(e) {
        if (this.state.loadMore) {
            let { page } = this.state;
            page += 1;
            this.setState({ ...this.state, page, loading: true }, () => {
                this.getGroups();
            })
        }
    }
    handleCancel = e => {
        GroupEditObj = {};
        this.setState({
            visible: false,
        });
    }
    editPost = (group) => {
        GroupEditObj = group;
        this.setState({
            visible: true,
        });
    }
    render() {
        const { user } = store.getState().oidc;
        const { Groups,visible } = this.state;
        return (
            <div className="group-page" >
                <Row gutter={16} className="">
                    {Groups.length > 0 && Groups?.map((group, index) => {
                        return <Col className="mb-16" md={12} lg={8} xl={8} xxl={6}>
                            <Card key={index}
                                cover={<img className="obj-fit" src={group.image} />} actions={[
                                    <Link className="list-link f-14" to="/commingsoon">Leave Group</Link>
                                ]}
                            >
                                <Meta title={<Link to="/groupview" className="post-title">{group.name}</Link>}
                                    description={<div>
                                        <div className="mb-4 f-12 text-overflow">{group.description}</div>
                                        <div className="d-flex align-items-center">
                            
                                            {group.members && <span><span>{group.members?group.members:0}</span> Members</span>}
                                            <a className="edit-groupbtn"></a>
                                        </div>
                                    </div>}
                                />
                            </Card>
                        </Col>
                    })
                    }
                    {Groups.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />

                    }


                </Row>
                <CommonModal
                    className="creategroup-popup"
                    visible={visible}
                    title="Edit group"
                    cancel={this.handleCancel}
                    saved={this.saveGroup}
                    // isHideFooter={true}
                >
                    {visible && <CreateGroup Type={"Edit"} GroupId={GroupEditObj.id} handleCancel={this.handleCancel} onRef={creategroup => this.creategroup = creategroup}/>}
                </CommonModal>
            </div>


        )
    }
}
export default connectStateProps(GroupsPage);