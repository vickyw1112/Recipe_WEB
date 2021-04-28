import React, { useState, useEffect } from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import {
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink,
    Row,
    Col,
} from "reactstrap";

import classnames from "classnames";

import { Layout } from "antd";

import TwoFieldFrom from "./TwoFieldFrom";
const Recipe = (props) => {
    const { Content } = Layout;
    const { className } = props;
    const [data, setData] = useState([]);
    const [activeTab, setActiveTab] = useState("2");
    const [ingredients, setIngredients] = useState([]);
    const toggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    useEffect(() => {
        fetch("http://localhost:5000/dashboard/recipeList", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => setData(data.recipes));

        fetch("http://localhost:5000/ingredients/getall", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => setIngredients(data.ingredients));
    }, []);

    return (
        <Content className={className}>
            <div>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({
                                active: activeTab === "1",
                            })}
                            onClick={() => {
                                toggle("1");
                            }}
                        >
                            Added Recipes
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({
                                active: activeTab === "2",
                            })}
                            onClick={() => {
                                toggle("2");
                            }}
                        >
                            Add recipes
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                        <Row>
                            <Col sm="12">
                                {data && (
                                    <ListGroup>
                                        {data.map((item, index) => (
                                            <ListGroupItem key={index}>
                                                {item.name}
                                            </ListGroupItem>
                                        ))}
                                    </ListGroup>
                                )}
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="2">
                        <Row>
                            <Col sm="12">
                                <TwoFieldFrom ingredients={ingredients} />
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
            </div>
        </Content>
    );
};
export default Recipe;
