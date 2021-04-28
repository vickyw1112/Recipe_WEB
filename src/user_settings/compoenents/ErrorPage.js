import React from "react";
import { Layout } from "antd";
const ErrorPage = (props) => {
    const { Content } = Layout;
    const { className } = props;
    return (
        <Content className={className}>
            <p>404</p>
        </Content>
    );
};
export default ErrorPage;
