import React, { Component } from 'react';
import { Menu, Popover } from 'antd';
import { FacebookIcon, LinkedinIcon, TwitterIcon, WhatsappIcon, FacebookShareButton, WhatsappShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';
class ShareAction extends Component {
    sharepost = (
       
    );
    render() {
        return (
            <Popover content={<Menu className="share-pop">
                <Menu.Item key="0" >
                    <FacebookShareButton url={this.props.url} imageUrl={this.props.imgUrl}> <FacebookIcon size={24} borderRadius={24} />Facebook</FacebookShareButton>
                </Menu.Item>
                <Menu.Item key="1">
                    <TwitterShareButton url={this.props.url} imageUrl={this.props.imgUrl}>  <TwitterIcon size={24} borderRadius={24} />Twitter</TwitterShareButton>
                </Menu.Item>
                <Menu.Item key="3">
                    <LinkedinShareButton url={this.props.url} imageUrl={this.props.imgUrl}> <LinkedinIcon size={24} borderRadius={24} />LinkedIn</LinkedinShareButton>
                </Menu.Item>
                <Menu.Item key="4">
                    <WhatsappShareButton url={this.props.url} imageUrl={this.props.imgUrl}> <WhatsappIcon size={24} borderRadius={24} />Whatsapp</WhatsappShareButton>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="5">
                    <span className="post-icons sharenow-icon"></span>&nbsp;Share Now
                </Menu.Item>
                <Menu.Item key="6">
                    <CopyToClipboard text={this.props.url}>
                        <>
                            <span className="post-icons copylink-icon"></span>&nbsp;Copy Link
                        </>
                    </CopyToClipboard>
                </Menu.Item>
            </Menu>} trigger="click">
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}><span className="post-icons share-icon"></span>Share</a>
            </Popover>
        )
    }
}

export default ShareAction;