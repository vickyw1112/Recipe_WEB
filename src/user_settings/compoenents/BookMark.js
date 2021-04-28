import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { ListGroup, ListGroupItem } from "reactstrap";
const BookMark = (props) => {
    const { Content } = Layout;
    const { className } = props;
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch("http://localhost:5000/dashboard/bookmarkList", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((result) => setData(result.recipes));
    }, []);
    console.log(data);
    return (
        <Content className={className}>
            <ListGroup>
                {data && data.map((item) => (
                    <ListGroupItem>{item.name}</ListGroupItem>
                ))}
                {
                    data ? <div/> : <div className={'no-bookmark'}>You have no bookmarks</div>
                }
            </ListGroup>
        </Content>
    );
};
export default BookMark;
