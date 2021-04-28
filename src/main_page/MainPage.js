import React, { useState, useEffect } from "react";
import "./css/MainPage.css";
import SiderBar from "./components/Sider/SideBar.js";
import { Container, Row } from "reactstrap";
import { useSelector } from "react-redux";
import Header from "./components/Header/Header.js";
import FrontPanel from "./components/FrontPanel/FrontPanel.js";
import CostumePagination from "./components/Pagination/CostumePagination.js";
import fetchSearchResultDefault from "./components/Common/UtilityFunction";
import { useDispatch } from "react-redux";

const MainPage = (props) => {
    const selectedIngredients = useSelector(
        (state) => state.ingredient.allSelectedIngredients
    );
    const allblackListItems = useSelector(
        (state) => state.blackList.allblackListItems
    );
    const allTags = useSelector((state) => state.tag.allTags);

    const [sidebar, setSidebar] = useState(false);
    const toggleLayout = () => setSidebar(!sidebar);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchSearchResultDefault(
            dispatch,
            selectedIngredients,
            allTags,
            allblackListItems
        );
    }, [allTags, allblackListItems, dispatch, selectedIngredients]);

    const loginStatus = useSelector((state) => state.login.loggedIn);
    let mainPage;
    if (loginStatus) {
        mainPage = (
            <Container fluid>
                <Row>
                    <div
                        className={`side-bar ${
                            sidebar ? "custom-collapse" : ""
                        }`}
                    >
                        <SiderBar />
                        <span
                            className={
                                sidebar
                                    ? "sider-toggle sider-toggle-expand"
                                    : "sider-toggle sider-toggle-collapse"
                            }
                            onClick={toggleLayout}
                        />
                    </div>

                    <div className="main-body">
                        <Header className="main-header" />
                        <FrontPanel />
                    </div>
                </Row>
                <Row>
                    <CostumePagination className="main-pignation" />
                </Row>
            </Container>
        );
    } else {
        mainPage = (
            <h1 className="main-page-heading">You are not logged in </h1>
        );
    }

    return mainPage;
};

export default MainPage;
