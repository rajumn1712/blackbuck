import { Dropdown, Menu } from 'antd';
import React, { Component } from 'react';

const actionsList = [
    { action: 'Save Post', icons: 'post-icons savepost-icon' },
    { action: 'Edit', icons: 'post-icons edit-icon' },
    { action: 'Turn on Notifications', icons: 'post-icons notify-icon' },
    { action: 'Delete', icons: 'post-icons delete-icon' }
]


class SideAction extends Component {
    render() {

        const menu = (
            <Menu className="custom-dropdown more-opt">
                {this.props.actionsList?.map((menu, index) => {
                    return <Menu.Item key={index}>
                        <span className={menu.icons}></span><a onClick={(event) => this.props.clickedEvent(event, menu.action)}>{menu.action}<p className="f-12 mb-0" style={{color: 'var(--textsecondary)'}}>Save it for later</p></a>
                    </Menu.Item>
                })}
            </Menu>
        )

        return (
            <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                <a className="ant-dropdown-link">
                    <span className="post-icons h-more-icon mr-0"></span>
                </a>
            </Dropdown>
        )
    }
}

export default SideAction;