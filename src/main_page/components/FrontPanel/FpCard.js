import React from "react";
import { Card, CardBody, CardTitle, CardImg } from "reactstrap";
// import { Link, useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router-dom";

const FpCard = (props) => {
    const { id, title, imagePath, className } = props;
    let history = useHistory();
    // console.log(imagePath);
    // image path may be an url path from our data source websites
    // or a base64 binary image
    // either way, the html seem to be compatible to handle both case
    // so we really don't need to do anything here
    return (
        <Card
            className={className}
            onClick={() => {
                history.push(`/recipe/${id}`);
            }}
        >
            <CardBody>
                <CardTitle>{title}</CardTitle>
            </CardBody>
            <CardImg bottom width="100%" src={imagePath} alt="Card image cap" />
        </Card>
    );
};

export default FpCard;
