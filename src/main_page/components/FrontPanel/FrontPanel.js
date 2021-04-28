import React, { useState, useEffect } from "react";
import "../../css/FrontPanel.css";
import { Row, Col } from "reactstrap";
import FpCard from "./FpCard.js";
import { useSelector } from "react-redux";
import Axios from "axios";

const FrontPanel = (props) => {
    const [result, setResult] = useState([]);
    const searchResult = useSelector(
        (state) => state.fetchSearchResult.searchResult
    );

    // for each id do api call
    useEffect(() => {
        if (searchResult.data !== undefined) {
            let row = [];
            let i = 0;
            setResult([]);
            searchResult.data.ids.forEach((element) => {
                Axios.get(`/recipe/${element}`).then((response) => {
                    row.push(
                        <Col key={i++}>
                            <FpCard
                                key={i}
                                className="fp-card"
                                id={response.data.id}
                                title={response.data.name}
                                imagePath={response.data.image}
                            />
                        </Col>
                    );
                    if (row.length === 4) {
                        setResult((result) => [
                            ...result,
                            <Row key={++i}>{row}</Row>,
                        ]);
                        row = [];
                    }
                });
            });
        } else {
            setResult([]);
        }
    }, [searchResult.data]);

    return <div className="fp">{result}</div>;
};

export default FrontPanel;
