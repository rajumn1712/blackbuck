import { Dropdown, Menu } from 'antd';
import React, { Component } from 'react';

const actionsList = [
    { action: 'Save Post', icons: 'post-icons savepost-icon' },
    // { action: 'Edit', icons: 'post-icons edit-icon' },
    // { action: 'Turn on Notifications', icons: 'post-icons notify-icon' },
    // { action: 'Delete', icons: 'post-icons delete-icon' }
]


class SideAction extends Component {
    render() {

        const menu = (
            <Menu className="custom-dropdown more-opt">
                {actionsList.map((menu, index) => {
                    return <Menu.Item key={index}>
                        <a onClick={(event) => this.props.clickedEvent(event, menu.action)}><span className={menu.icons}></span>{menu.action}</a>
                    </Menu.Item>
                })}
            </Menu>
        )

        return (
            <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                <a className="ant-dropdown-link">
                    <span className="post-icons more-icon mr-0"></span>
                </a>
            </Dropdown>
        )
    }
}

export default SideAction;