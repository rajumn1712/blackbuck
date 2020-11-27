import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const Loader = ({className})=>{
    return <div className={className}><Spin indicator={antIcon}  /></div>
}

export default Loader;