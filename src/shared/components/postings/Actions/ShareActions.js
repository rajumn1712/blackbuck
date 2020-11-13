import React, { Component } from 'react';
import { Menu, Popover } from 'antd';
import { FacebookIcon, LinkedinIcon, TwitterIcon, WhatsappIcon } from 'react-share';


const sharepost = (
    <Menu className="share-pop">
        <Menu.Item key="0" >
            <FacebookIcon size={24} borderRadius={24} /><a href="https://www.facebook.com" target="_blank">Facebook</a>
      </Menu.Item>
        <Menu.Item key="1">
            <TwitterIcon size={24} borderRadius={24} /><a href="https://twitter.com/" target="_blank">Twitter</a>
      </Menu.Item>
        <Menu.Item key="3">
            <LinkedinIcon size={24} borderRadius={24} /><a href="https://in.linkedin.com/" target="_blank">LinkedIn</a>
      </Menu.Item>
        <Menu.Item key="4">
            <WhatsappIcon size={24} borderRadius={24} /><a href="https://web.whatsapp.com/" target="_blank">Whatsapp</a>
      </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="5">
            <span className="post-icons sharenow-icon"></span>&nbsp;Share Now
      </Menu.Item>
        <Menu.Item key="6">
            <span className="post-icons copylink-icon"></span>&nbsp;Copy Link
      </Menu.Item>
    </Menu>
);

class ShareAction extends Component{
    render(){
        return(
            <Popover content={sharepost} trigger="click">
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}><span className="post-icons share-icon"></span>Share</a>
            </Popover>
        )
    }
}

export default ShareAction;