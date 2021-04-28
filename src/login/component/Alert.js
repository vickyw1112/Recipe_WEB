import React, { useState } from "react";
import { Alert } from "reactstrap";

const AlertLogIn = (props) => {
    const [visible, setVisible] = useState(true);

    const onDismiss = () => setVisible(false);
    const { message, color, className, resetState } = props;

    const composition = () => {
        onDismiss();
        resetState();
    };

    return (
        <Alert
            color={color}
            isOpen={visible}
            toggle={composition}
            className={className}
        >
            {message}
        </Alert>
    );
};

export default AlertLogIn;
