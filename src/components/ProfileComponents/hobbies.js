import React, { Component } from 'react';
import { Card, Tag, Input, Tooltip } from 'antd'
import {  PlusOutlined } from '@ant-design/icons';
import { TweenOneGroup } from 'rc-tween-one';
import { Link } from 'react-router-dom';
// import { userManager } from '../shared/authentication/auth';
import { store } from '../../store'
// import User1 from '../styles/images/avatar.png';
// import User2 from '../styles/images/user.jpg';
// import User3 from '../styles/images/user_image.jpg';
// import User4 from '../styles/images/user-image.jpg';
// import { userLogout } from '../reducers/auth';
import '../../index.css';
import '../../App.css';
import CommonModal from './CommonModal';

class Hobbies extends Component {

    state = {
        hobbies:this.props.hobbies,
        tags: [],
        inputVisible: false,
        inputValue: '',
        visible: false
    };
    
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleClose = removedTag => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        console.log(tags);
        this.setState({ tags });
    };

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    };

    handleInputChange = e => {
        this.setState({ inputValue: e.target.value });
    };
    handleInputConfirm = () => {
        const { inputValue } = this.state;
        let { tags } = this.state;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        console.log(tags);
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
    };

    saveInputRef = input => {
        this.input = input;
    };

    forMap = tag => {
        const tagElem = (
            <Tag
                closable
                onClose={e => {
                    e.preventDefault();
                    this.handleClose(tag);
                }}
            >
                {tag}
            </Tag>
        );
        return (
            <span key={tag} style={{ display: 'inline-block' }}>
                {tagElem}
            </span>
        );
    }
    render() {
        const { hobbies,tags, inputVisible, inputValue,visible } = this.state;
        const tagChild = tags?.map(this.forMap);
        const { user } = store.getState().oidc;
        return (
            <div className="custom-card">
                <Card title="Hobbies" className="hobbies-card" bordered={false} extra={<Link onClick={this.showModal}><span className="icons edit" /></Link>} >
                    {hobbies.map((hobby,index)=>{
                        return <Tag className="tags" key={index}>{hobby.Name}</Tag>
                    })}
                </Card>
                <CommonModal visible={visible} title="Hobbies" cancel={this.handleCancel} saved={this.handleOk}>
                <div className="tags">
                        <div style={{ margin: 10 }}>
                            <TweenOneGroup
                                enter={{
                                    scale: 0.8,
                                    opacity: 0,
                                    type: 'from',
                                    duration: 100,
                                    onComplete: e => {
                                        e.target.style = '';
                                    },
                                }}
                                leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                                appear={false}
                            >
                                {tagChild}
                            </TweenOneGroup>
                        </div>
                        {inputVisible && (
                            <Input
                                ref={this.saveInputRef}
                                type="text"
                                size="small"
                                style={{ width: 78 }}
                                value={inputValue}
                                onChange={this.handleInputChange}
                                onBlur={this.handleInputConfirm}
                                onPressEnter={this.handleInputConfirm}
                            />
                        )}
                        {!inputVisible && (
                            <Tag onClick={this.showInput} className="site-tag-plus">
                                <PlusOutlined /> # tag
                            </Tag>
                        )}
                    </div>
                </CommonModal>
            </div>
        )
    }
}
export default Hobbies;