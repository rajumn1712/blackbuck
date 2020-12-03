import React from 'react';
import { Button, Modal } from 'antd';


class CommonModal extends React.Component {

    render() {

        const modal = { ...this.props };

        return (
            <Modal title={<div className="custom-modal-header"><h4>{modal.title}</h4><a onClick={modal.cancel}><span className="close-icon" /></a></div>}
                visible={modal.visible}
                closable={false}
                onOk={modal.saved}
                className={modal.className}
                onCancel={modal.cancel}
                footer={[<div className="">
                    {/* <Button key="back" onClick={modal.cancel} className="btn-cancel">
                        Close
                </Button> */}
                    <Button key="submit" type="primary" htmlType="submit" onClick={modal.saved}>
                        Save
                </Button></div>
                ]}>
                {this.props.children}
            </Modal>
        )
    }
}

export default CommonModal;