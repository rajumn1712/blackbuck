import React, { Component } from 'react';
import { Card, List } from 'antd'
import { Link } from 'react-router-dom';
import { fetchTags } from '../../shared/api/apiServer';
import '../../index.css';
import '../../App.css';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import connectStateProps from '../../shared/stateConnect';
import { connect } from 'react-redux';

class FriendRequests extends Component {
    componentDidMount() {
        fetchTags(this.props?.profile?.Id,10, 0).then(res => {
            const { tags } = this.state;
            res.data.forEach(item => {
                if (Array.isArray(item)) {
                    item.forEach(index => {
                        if (typeof (index) !== 'object')
                            tags.push(index);
                    })
                }
            });
            this.setState({ tags: tags })
        });
    }

    state = {
        tags: []
    }

    render() {

        const { tags } = this.state;
        return (
            <div className="custom-card tag-card">
                <Card title="#Tags" bordered={false} >
                    <List
                        itemLayout="vertical"
                        dataSource={tags?.slice(0, 5)}
                        renderItem={item => (
                            <div className="tag-name"><Link onClick={() => {
                                this.props.updateSearchValue(item.replace("#", ""));
                                this.props.history.push(`/search/${item.replace("#", "")}/Tags`)
                            }}>{item}</Link></div>

                        )}
                    />
                </Card>
            </div>

        )
    }
}
const mapStateToProps = ({ oidc }) => {
    return { profile: oidc.profile };
  };
export default withRouter(connectStateProps(connect(mapStateToProps)(FriendRequests)));