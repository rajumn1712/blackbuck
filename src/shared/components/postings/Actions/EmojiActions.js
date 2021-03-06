import React, { Component, Fragment } from 'react';
import { Tooltip } from 'antd';

class EmojiAction extends Component {
    render() {
        return (
            <a className={`like-emojis ${this.props?.IsUserLikes?'focus':""}`} onClick={(event)=>this.props.clickedEvent(event, 'Likes',0)}>
                <ul className="l-emojis">
                    <li><Tooltip title="Love"><a onClick={(event) =>  this.props.clickedEvent(event, 'Love')}><span className="like-icon love" /></a></Tooltip></li>
                    <li><Tooltip title="Claps"><a onClick={(event) =>  this.props.clickedEvent(event, 'Claps')}><span className="like-icon claps" /></a></Tooltip></li>
                    <li><Tooltip title="Whistle"><a onClick={(event) =>  this.props.clickedEvent(event, 'Whistles')}><span className="like-icon whistle" /></a></Tooltip></li>
                </ul>
                <span className="post-icons like-icon like-emojis"></span>Like</a>
        )
    }
}

export default EmojiAction;