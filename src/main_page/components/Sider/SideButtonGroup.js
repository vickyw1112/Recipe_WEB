import React from "react";
import { Button, ButtonGroup } from "reactstrap";
import { useDispatch } from "react-redux";
import { resetIngredient } from "../../redux/actions";

const SideButtonGroup = (props) => {
    const { toogle, className } = props;
    const dispatch = useDispatch();

    return (
        <ButtonGroup className={className}>
            <Button outline color="secondary" onClick={toogle}>
                Expand All
            </Button>
            <Button
                outline
                color="secondary"
                onClick={() => dispatch(resetIngredient())}
            >
                Reset
            </Button>
        </ButtonGroup>
    );
};

export default SideButtonGroup;
