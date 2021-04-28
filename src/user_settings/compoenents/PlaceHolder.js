import React from "react";
import { useParams } from "react-router-dom";
import DashBoard from "./DashBoard";
import BookMark from "./BookMark";
import Email from "./Email";
import Ingredient from "./Ingredient";
import Recipe from "./Recipe";
import ErrorPage from "./ErrorPage";
import "../css/PlaceHolder.css";
const PlaceHolder = (props) => {
    let { topicId } = useParams();

    switch (topicId) {
        case "bookmark":
            return <BookMark className="user-setting-content" />;
        case "email":
            return <Email className="user-setting-content" />;
        case "dashboard":
            return <DashBoard className="user-setting-content" />;
        case "ingredient":
            return <Ingredient className="user-setting-content" />;
        case "recipe":
            return <Recipe className="user-setting-content" />;
        default:
            return <ErrorPage className="user-setting-content" />;
    }
};
export default PlaceHolder;
