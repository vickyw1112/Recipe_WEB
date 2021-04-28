import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
const Verify = (props) => {
    const { id } = useParams();
    console.log("in this reouter");
    const [result, setResult] = useState("failed");

    useEffect(() => {
        fetch(`http://localhost:5000/auth/verify/${id}`).then((res) => {
            if (res.ok) {
                setResult("Successful");
            }
        });
        //console.log(result);
    }, [id]);

    return <p style={{ font: 10 }}> verify {result}.</p>;
};

export default Verify;
