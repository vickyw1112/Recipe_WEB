import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SiderBarTab from "./SideBarTab.js";
import "../../css/SideBar.css";

// placeholder component
const SiderBar = (props) => {
    return (
        <div className="side-bar-content">
            <SiderBarTab />
        </div>
    );
};

export default SiderBar;
