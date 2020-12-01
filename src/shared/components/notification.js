import 'antd/dist/antd.css';
import { notification } from 'antd';

const notify = type => {
    notification.open({
        message: type.message,
        description:
            type.description,
        placement: type.placement||"topRight",
        type:type.type|| "success"
    });
};
export default notify;