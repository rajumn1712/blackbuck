import React, { Component } from 'react';
import { Card, Avatar, List, Input } from 'antd'
import { Link } from 'react-router-dom';
import { userManager } from '../../shared/authentication/auth';
import { store } from '../../store'
import User1 from '../../styles/images/avatar.png';
import User2 from '../../styles/images/user.jpg';
import User3 from '../../styles/images/user_image.jpg';
import User4 from '../../styles/images/user-image.jpg';
import '../../index.css';
import '../../App.css';
import CommonModal from './CommonModal';
import notify from '../../shared/components/notification';

const { Search } = Input;


class Interests extends Component {
    state = {
        interests: this.props.interests,
        visible: false,
        search: null
    };
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleOk = e => {
        this.setState({
            visible: false,
        });
    };
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };
    handleSearch = e => {
        let keyword = e.target.value;
        this.setState({ search: keyword })
    }
    handleInterest = ()=>{
        notify({ placement: 'bottom', message: 'Interest', description: 'Request sent successfully.' });
    }
    handleRemove = (e,index)=>{
        const indx = [...this.state.interests];
        indx.splice(index,1)
        this.setState({interests:indx});
    }

    render() {
        const { user } = store.getState().oidc;
        const { interests, visible } = this.state;

        const interesetsList = interests.filter((item) => {
            if (this.state.search == null) {
                return item
            } else if (item.title.toLowerCase().includes(this.state.search.toLowerCase())) {
                return item
            }
        }).map((item,index) => {
            return (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={<div className="d-flex align-items-center"><span className="overflow-text">{item.title}</span></div>}
                        description={<div><span style={{ color: 'var(--textprimary)' }}>{item.members}</span> Members | <span style={{ color: 'var(--textprimary)' }}>{item.post}</span> posts</div>}
                    />
                    <Link className="f-12 list-link" onClick={this.handleInterest}>Interest</Link>
                    <Link className="f-12 list-link ml-16 text-red" onClick={(e)=>this.handleRemove(e,index)}>Remove</Link>
                </List.Item>
            )
        })

        return (
            <div className="custom-card">
                <Card title="Interests" bordered={false} extra={!this.props.IsHideAction ? <Link onClick={this.showModal}><span className="icons add" /></Link> : null}  >
                    <List
                        grid={{ gutter: 16, column: 2 }}
                        itemLayout="horizontal"
                        dataSource={interests}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.Image} />}
                                    title={<div className="d-flex align-items-center"><span className="overflow-text">{item.Name}</span></div>}
                                    description={
                                    <div><span style={{ color: 'var(--textprimary)' }}>{item.Members}</span> Mutual Friends</div>
                                }
                                />
                            </List.Item>
                        )}
                    />
                </Card>
                <CommonModal className="custom-popup modal-interest" visible={visible} title="Interests" cancel={this.handleCancel} saved={this.handleOk}>
                    <div className="modal-search p-16">
                        <Search className="header-searchbar" placeholder="Search Groups / Courses" onChange={(e => this.handleSearch(e))} />
                    </div>
                    <div className="custom-card p-16 bg-white">
                        <List itemLayout="horizontal">
                            {interesetsList}
                        </List>
                    </div>
                </CommonModal>
            </div>

        )
    }
}
export default Interests;