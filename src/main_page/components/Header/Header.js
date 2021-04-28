import React, { useState } from "react";
import { Button, ButtonGroup, Badge } from "reactstrap";
import ModalBlackList from "./ModalBlackList.js";
import ModalTags from "./ModalTags";
import { useSelector } from "react-redux";
import "../../css/Header.css";
const mock_data_tags = {
    Tags: [
        "Breads",
        "Breakfast",
        "Cakes",
        "Casseroles",
        "Cookies",
        "Dinner",
        "Dips",
        "Drinks",
        "Desserts",
        "Asian",
        "French",
        "German",
        "Italian",
        "Chinese",
        "Mexican",
        "Vegan",
        "Vegetarian",
        "Gluten free",
        "Lactose free",
    ],
};

const Header = (props) => {
    const [modalTag, setModalTag] = useState(false);
    const toggleTag = () => setModalTag(!modalTag);

    const [modalBlackList, setModalBlackList] = useState(false);
    const toggleBlackList = () => setModalBlackList(!modalBlackList);

    const allblackListItems = useSelector(
        (state) => state.blackList.allblackListItems
    );
    const allTags = useSelector((state) => state.tag.allTags);

    return (
        <ButtonGroup className={props.className}>
            <Button outline onClick={toggleTag}>
                Tags
                <Badge className="header-badge" color="secondary">
                    {allTags.length}
                </Badge>
            </Button>
            <ModalTags
                className="header-modal"
                toggle={toggleTag}
                modal={modalTag}
                headerTitle="Tags"
                tags={mock_data_tags.Tags}
            />
            <Button outline onClick={toggleBlackList}>
                Blacklist
                <Badge className="header-badge" color="secondary">
                    {allblackListItems.length}
                </Badge>
            </Button>
            <ModalBlackList
                className="header-modal"
                toggle={toggleBlackList}
                modal={modalBlackList}
                headerTitle="BlackList"
                tags={mock_data_tags.Tags}
            />
        </ButtonGroup>
    );
};

export default Header;
