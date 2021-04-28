import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "../../css/HeaderModal.css";
import CommonButton from "../Common/CommonButton";
import { useSelector, useDispatch } from "react-redux";
import { toogleBlackList, deleteTag } from "../../redux/actions";
const ModalBlackList = (props) => {
    const { className, toggle, modal, headerTitle, tags } = props;
    const allblackListItems = useSelector(
        (state) => state.blackList.allblackListItems
    );
    const dispatch = useDispatch();

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader toggle={toggle}>{headerTitle}</ModalHeader>
                <ModalBody>
                    {tags.map((tagItem, index) => (
                        <CommonButton
                            key={index}
                            className="header-button"
                            color="danger"
                            item={tagItem}
                            onClick={() => {
                                dispatch(toogleBlackList(tagItem));
                                dispatch(deleteTag(tagItem));
                            }}
                            checkIfActive={(value) =>
                                allblackListItems.includes(value)
                            }
                        />
                    ))}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={toggle}>
                        Confirm
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default ModalBlackList;
