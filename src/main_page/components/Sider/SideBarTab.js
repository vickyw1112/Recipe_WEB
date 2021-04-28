import React, { useState, useEffect } from "react";
import classnames from "classnames";
import { Tag, Input, AutoComplete } from "antd";
import "antd/dist/antd.css";
import SideBarCollapse from "./SideBarCollapse.js";
import "../../css/SideBarTab.css";
import SideButtonGroup from "./SideButtonGroup.js";
import { useSelector, useDispatch } from "react-redux";
import { deleteIngredient } from "../../redux/actions";
import { toogleIngredient } from "../../redux/actions";

import {
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink,
    Row,
    Col,
    Badge,
} from "reactstrap";

const mock_data = {
    SideBarData: [
        {
            type: "Dairy",
            ingredients: ["butter", "egg", "milk", "parmesan", "cheddar"],
        },
        {
            type: "Vegetables",
            ingredients: ["onion", "garlic", "tomato", "potate", "carrot"],
        },
        {
            type: "Fruit",
            ingredients: ["lemon", "apple", "banana", "lime", "strawberry"],
        },
        {
            type: "Alcohol",
            ingredients: [
                "white wine",
                "beer",
                "red wine",
                "vodka",
                "rum",
                "teqila",
                "sherry",
                "cooking wine",
            ],
        },
    ],
};

const SiderBarTab = (props) => {
    const [activeTab, setActiveTab] = useState("1");
    const [data, setData] = useState([]);

    // state of the expand all button
    const [activeB, setActiveB] = useState(false);

    const toggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };
    //state.allSelectedIngredients
    const selectedIngredients = useSelector(
        (state) => state.ingredient.allSelectedIngredients
    );
    function fetchData() {
        setData(mock_data.SideBarData);
    }
    const dispatch = useDispatch();
    // in order to do a next ingredient search

    const allblackListItems = useSelector(
        (state) => state.blackList.allblackListItems
    );
    const allTags = useSelector((state) => state.tag.allTags);
    /* 
		Note: the empty deps array [] means
		this useEffect will run once
		similar to componentDidMount()
		when user add or delete ingredients on other components 
		should trigger refetch data here, make an indicator varible and 
		pass here into the dependency array
	*/
    const [result, setResult] = useState([]);
    useEffect(() => {
        fetchData();

        fetch("http://localhost:5000/recipe/nextIngredient", {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "http://127.0.0.1:5000",
                "Access-Control-Allow-Credentials": true,
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                ingredients: selectedIngredients,
                tags: allTags,
                blackList: allblackListItems,
            }),
        })
            .then((res) => res.json())
            .then((rc) => {
                // console.log(selectedIngredients);
                // console.log(allTags);
                // console.log(allblackListItems);
                //console.log("result is" + rc);
                setResult(rc.ingredients);
            });
    }, [allTags, allblackListItems, selectedIngredients]);

    const [value, setValue] = useState("");
    const [options, setOptions] = useState([]);

    // const onSearch = (searchText) => {
    //     setOptions(!searchText ? [] : [{ value: "fuck" }, { value: "fuck2" }]);
    // };
    const onSearch = (searchText) => {
        if (result === []) {
            setOptions([]);
        } else {
            setOptions(
                !searchText
                    ? []
                    : result.map((item) => {
                          return { value: item };
                      })
            );
        }

        // console.log(result);
        // console.log(options);
    };
    const onSelect = (data) => {
        console.log("onSelect", data);
        dispatch(toogleIngredient(data));
    };

    const onChange = (data) => {
        setValue(data);
    };

    return (
        <div>
            <Nav tabs className="side-tabs">
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === "1" })}
                        onClick={() => {
                            toggle("1");
                        }}
                    >
                        Category
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === "2" })}
                        onClick={() => {
                            toggle("2");
                        }}
                    >
                        Cart
                        <Badge className="sider-badge" color="light">
                            {selectedIngredients.length}
                        </Badge>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === "3" })}
                        onClick={() => {
                            toggle("3");
                        }}
                    >
                        Search
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                    <Row>
                        <Col sm="12">
                            <Nav vertical className="sidebar-item">
                                <SideButtonGroup
                                    className="sidebar-bg"
                                    toogle={() => setActiveB(!activeB)}
                                />
                                {data.map((sitem, index) => (
                                    <SideBarCollapse
                                        IngredientType={sitem.type}
                                        key={index}
                                        IngredientName={sitem.ingredients}
                                        btnState1={activeB}
                                    />
                                ))}
                            </Nav>
                        </Col>
                    </Row>
                </TabPane>

                <TabPane tabId="2">
                    <div className="sidebar-item">
                        <p>everything selected should be presented here.</p>
                        {selectedIngredients.map((item, index) => (
                            <Tag
                                className="tag-item"
                                closable
                                key={index}
                                onClose={(e) => {
                                    e.preventDefault();
                                    dispatch(deleteIngredient(item));
                                }}
                            >
                                {item}
                            </Tag>
                        ))}
                    </div>
                </TabPane>
                <TabPane tabId="3">
                    <div className="sidebar-item">
                        <AutoComplete
                            className="sider-search"
                            dropdownClassName="certain-category-search-dropdown"
                            dropdownMatchSelectWidth={500}
                            style={{
                                width: 250,
                            }}
                            value={value}
                            options={options}
                            onSelect={onSelect}
                            onChange={onChange}
                            onSearch={onSearch}
                        >
                            <Input.Search
                                size="large"
                                placeholder="input here"
                            />
                        </AutoComplete>
                    </div>
                </TabPane>
            </TabContent>
        </div>
    );
};

export default SiderBarTab;
