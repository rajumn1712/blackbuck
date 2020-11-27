import React, { Component } from 'react';
import { Card, Tag, Input } from 'antd'
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
        tags: this.props.hobbies,
        inputVisible: false,
        inputValue: {Name:''},
        visible: false
    };
    
    showModal = (e) => {
        e.preventDefault();
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

    handleClose = removedTag => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        this.setState({ tags });
    };

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    };

    handleInputChange = e => {
        this.setState({ inputValue:{
            Name:e.target.value
        }  });
    };
    handleInputConfirm = () => {
        const { inputValue } = this.state;
        let { tags } = this.state;
        if (inputValue.Name && tags.indexOf(inputValue.Name) === -1) {
            tags = [...tags, inputValue];
        }
        this.setState({
            tags,
            inputVisible: false,
            inputValue: {Name:''},
        });
    };

    saveInputRef = input => {
        this.input = input;
    };

    forMap = (tag,index) => {
        const tagElem = (
            <Tag key={index}
                closable
                onClose={e => {
                    e.preventDefault();
                    this.handleClose(tag);
                }}
            >
                {tag.Name}
            </Tag>
        );
        return (
            <span className="hobbies-tag" key={index} style={{ display: 'inline-block' }}>
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
                <Card title="Hobbies" className="hobbies-card" bordered={false} extra={!this.props.IsHideAction ? <Link onClick={this.showModal}><span className="icons edit" /></Link> : null} >
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
                                value={inputValue.Name}
                                onChange={this.handleInputChange}
                                onBlur={this.handleInputConfirm}
                                onPressEnter={this.handleInputConfirm}
                            />
                        )}
                        {!inputVisible && (
                            <Tag onClick={this.showInput} className="site-tag-plus">
                                <PlusOutlined /> Enter Hobbies
                            </Tag>
                        )}
                    </div>
                </CommonModal>
            </div>
        )
    }
}
export default Hobbies;