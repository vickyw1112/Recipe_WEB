import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "../../css/HeaderModal.css";
import CommonButton from "../Common/CommonButton";
import { useSelector, useDispatch } from "react-redux";
import { toogleTag } from "../../redux/actions";
const ModalTags = (props) => {
    const { className, toggle, modal, headerTitle, tags } = props;
    const allblackListItems = useSelector(
        (state) => state.blackList.allblackListItems
    );
    const allTags = useSelector((state) => state.tag.allTags);
    const dispatch = useDispatch();

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader toggle={toggle}>{headerTitle}</ModalHeader>
                <ModalBody>
                    {tags.map((tagItem, index) => {
                        if (allblackListItems.includes(tagItem)) {
                            return (
                                <Button
                                    className="header-button"
                                    outline
                                    size="sm"
                                    disabled
                                    key={index}
                                >
                                    {tagItem}
                                </Button>
                            );
                        } else {
                            return (
                                <CommonButton
                                    key={index}
                                    className="header-button"
                                    item={tagItem}
                                    color="primary"
                                    size="sm"
                                    onClick={() => dispatch(toogleTag(tagItem))}
                                    checkIfActive={(value) =>
                                        allTags.includes(value)
                                    }
                                />
                            );
                        }
                    })}
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

export default ModalTags;
