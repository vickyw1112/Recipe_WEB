import React, { useState } from "react";
import { useSelector } from "react-redux";
import "antd/dist/antd.css";
import { Layout, Menu } from "antd";
import "./css/UserSettings.css";
import DashBoard from "./compoenents/DashBoard";
import {
    DesktopOutlined,
    PieChartOutlined,
    UserOutlined,
} from "@ant-design/icons";

import PlaceHolder from "./compoenents/PlaceHolder";
import { Switch, Route, Link, useRouteMatch } from "react-router-dom";
// sidebar here should incorporate with router
const UserSettings = (props) => {
    const { Sider } = Layout;
    const { SubMenu } = Menu;
    const [collapsed, setCollapsed] = useState(false);
    const onCollapse = () => setCollapsed(!collapsed);
    let { path, url } = useRouteMatch();
    let usersetting;
    // use the login status when finish dashboard
    const loginStatus = useSelector((state) => state.login.loggedIn);
    if (loginStatus) {
        usersetting = (
            <Layout className="user-settings-container">
                <Sider
                    collapsible
                    width="20%"
                    collapsed={collapsed}
                    onCollapse={onCollapse}
                >
                    <Menu
                        theme="dark"
                        defaultSelectedKeys={["1"]}
                        mode="inline"
                    >
                        <Menu.Item key="1" icon={<PieChartOutlined />}>
                            <Link to={`${url}/dashboard`}>Dashboard</Link>
                        </Menu.Item>
                        <Menu.Item key="2" icon={<DesktopOutlined />}>
                            <Link to={`${url}/bookmark`}>Bookmark</Link>
                        </Menu.Item>
                        <Menu.Item key="3" icon={<PieChartOutlined />}>
                            <Link to={`${url}/email`}>Email</Link>
                        </Menu.Item>
                        <SubMenu
                            key="sub1"
                            icon={<UserOutlined />}
                            title="Creation"
                        >
                            <Menu.Item key="4">
                                <Link to={`${url}/ingredient`}>Ingredient</Link>
                            </Menu.Item>
                            <Menu.Item key="5">
                                <Link to={`${url}/recipe`}>Recipe</Link>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Switch>
                        <Route exact path={path}>
                            <DashBoard className="user-setting-content" />
                        </Route>
                        <Route path={`${path}/:topicId`}>
                            <PlaceHolder />
                        </Route>
                    </Switch>
                </Layout>
            </Layout>
        );
    } else {
        usersetting = (
            <h1 className="usersetting-heading">You are not logged in </h1>
        );
    }
    return usersetting;
};

export default UserSettings;
