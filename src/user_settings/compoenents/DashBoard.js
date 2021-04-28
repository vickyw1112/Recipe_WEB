import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import { Jumbotron } from "reactstrap";
const DashBoard = (props) => {
    const { Content } = Layout;

    const [data, setData] = useState({
        added_ingredient_ids: [],
        allergy: "",
        email: "",
        email_interval: "",
        name: "",
    });

    useEffect(() => {
        fetch("http://localhost:5000/auth/info", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((result) => setData(result));
    }, []);

    return (
        <Content>
            <Jumbotron>
                <h1 className="display-3">Hello, {data.name}!</h1>
                <p className="lead">Welcome to your personal dashboard.</p>
                <hr className="my-2" />
                <p>
                    You can view your bookmarked recipes, your email settings,
                    creations owned by you, from the tab on the left.
                </p>
            </Jumbotron>
        </Content>
    );
};
export default DashBoard;
