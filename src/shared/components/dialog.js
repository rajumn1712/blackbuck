import 'antd/dist/antd.css';
import { Modal } from 'antd';
const { confirm } = Modal;
const dialog = (props) => {
    return (
        confirm({
            title: props.title,
            icon: props.icon,
            content: props.content,
            onOk() {
                props.onOk();
            },
            onCancel() {

            },
        })
    )
}

export default dialog