import 'antd/dist/antd.css';
import { notification } from 'antd';

const openNotificationWithIcon = type => {
    notification[type.notType]({
        message: type.title,
        description:
            type.message
    });
};
export default openNotificationWithIcon;