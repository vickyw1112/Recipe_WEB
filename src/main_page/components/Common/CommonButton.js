import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";

const CommonButton = (props) => {
    // pass onclick as arg so we can pass in a different dispatch function
    // the checkIfActive is passed in for the same reason
    // to reuse this component else where
    const [isOutLined, setisOutLined] = useState(false);

    const { item, className, onClick, checkIfActive, color } = props;

    useEffect(() => {
        if (checkIfActive(item)) {
            setisOutLined(false);
        } else {
            setisOutLined(true);
        }
    }, [checkIfActive, item]);

    return (
        <Button
            size="sm"
            color={color}
            className={className}
            onClick={() => onClick()}
            outline={isOutLined}
        >
            {item}
        </Button>
    );
};

export default CommonButton;
