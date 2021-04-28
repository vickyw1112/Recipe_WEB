import React, { useState, useEffect } from "react";
import { Collapse, Button } from "reactstrap";
import "../../css/SideBarCollapse.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch } from "react-redux";
import CommonButton from "../Common/CommonButton";
import { toogleIngredient } from "../../redux/actions";
import { useSelector } from "react-redux";

const SideBarCollapse = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    const { btnState1 } = props;
    useEffect(() => {
        if (btnState1 === true) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [btnState1]);

    const dispatch = useDispatch();
    const selectedIngredients = useSelector(
        (state) => state.ingredient.allSelectedIngredients
    );

    // some api deprecated in Collapse component
    return (
        <div>
            <Button
                outline
                color={isOpen ? "primary" : "secondary"}
                className="choice-type text-left"
                onClick={toggle}
                style={{ marginBottom: "1rem" }}
            >
                {props.IngredientType}
            </Button>
            <Collapse isOpen={isOpen}>
                {props.IngredientName.map &&
                    props.IngredientName.map((item, index) => (
                        <CommonButton
                            key={index}
                            className="choice-item"
                            item={item}
                            color="primary"
                            onClick={() => dispatch(toogleIngredient(item))}
                            checkIfActive={(value) =>
                                selectedIngredients.includes(value)
                            }
                        />
                    ))}
            </Collapse>
        </div>
    );
};

export default SideBarCollapse;
