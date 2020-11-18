import React, { Component, Fragment } from 'react';
import { Tooltip } from 'antd';
import Love from '../../../../styles/images/love.gif';
import Claps from '../../../../styles/images/claps.gif';
import Whistle from '../../../../styles/images/whistle.gif';


class EmojiAction extends Component {

    handleLikeEvent = (event) => {
        let lovescount = this.props.mystate.lovesCount;
        lovescount = lovescount + 1
        this.props.clickedEvent(event, 'Love', lovescount)
    }

    handleCLapsEvent = (event) => {
        let clapscount = this.props.mystate.clapsCount;
        clapscount = clapscount + 1
        this.props.clickedEvent(event, 'Claps', clapscount)
    }

    handleWhistlesEvent = (event) => {
        let whistlescount = this.props.mystate.whistlesCount;
        whistlescount = whistlescount + 1
        this.props.clickedEvent(event, 'Whistles', whistlescount)
    }

    render() {
        return (
            <a className="like-emojis">
                <ul class="l-emojis">
                    <li><Tooltip title="Love"><a onClick={(event) => this.handleLikeEvent(event)}><img src={Love} /></a></Tooltip></li>
                    <li><Tooltip title="Claps"><a onClick={(event) => this.handleCLapsEvent(event)}><img src={Claps} /></a></Tooltip></li>
                    <li><Tooltip title="Whistle"><a onClick={(event) => this.handleWhistlesEvent(event)}><img src={Whistle} /></a></Tooltip></li>
                </ul>
                <span className="post-icons like-icon like-emojis"></span>Like</a>
        )
    }
}

export default EmojiAction;