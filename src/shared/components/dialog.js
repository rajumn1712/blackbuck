import 'antd/dist/antd.css';
import { Modal } from 'antd';
const dialog = (props) => {
    return (
        Modal.confirm({
            title: props.title,
            icon: props.icon,
            content: props.content,
            okText: props.okText,
            cancelText: props.cancelText,
            okType:props.okType?props.okType:'',
            onOk() {
                props.onOk();
            },
            onCancel() {

            },
        })
    )
}

export default dialog