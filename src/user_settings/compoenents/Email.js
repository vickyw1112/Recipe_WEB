import React from "react";
import { Layout } from "antd";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
const Email = (props) => {
    const { Content } = Layout;

    const [emailFreq, setEmailFreq] = React.useState(
        localStorage.getItem("emailFreq")
    );

    function setWeekly() {
        setEmailFreq("weekly");
        localStorage.setItem("emailFreq", "weekly");
    }
    function setMonthly() {
        setEmailFreq("monthly");
        localStorage.setItem("emailFreq", "monthly");
    }
    function setYearly() {
        setEmailFreq("yearly");
        localStorage.setItem("emailFreq", "yearly");
    }

    return (
        <Content className="email-settings">
            <h1>Email</h1>
            <h2>Set your email notification frequency</h2>
            <ButtonGroup aria-label="Basic example">
                <Button
                    onClick={setWeekly}
                    variant={emailFreq === "weekly" ? "primary" : "secondary"}
                >
                    Weekly
                </Button>
                <Button
                    onClick={setMonthly}
                    variant={emailFreq === "monthly" ? "primary" : "secondary"}
                >
                    Monthly
                </Button>
                <Button
                    onClick={setYearly}
                    variant={emailFreq === "yearly" ? "primary" : "secondary"}
                >
                    Yearly
                </Button>
            </ButtonGroup>
        </Content>
    );
};
export default Email;
