import {
    TOOGLE_INGREDIENT,
    DELETE_INGREDIENT,
    RESET_INGREDIENT,
} from "../actionTypes";

const initialState = {
    allSelectedIngredients: [],
};

export default function (state = initialState, action) {
    switch (action.type) {
        case TOOGLE_INGREDIENT: {
            const ingredient = action.ingredient;
            if (state.allSelectedIngredients.includes(ingredient)) {
                return {
                    allSelectedIngredients: state.allSelectedIngredients.filter(
                        (value) => value !== ingredient
                    ),
                };
            } else {
                return {
                    allSelectedIngredients: [
                        ...state.allSelectedIngredients,
                        ingredient,
                    ],
                };
            }
        }
        case DELETE_INGREDIENT: {
            const ingredient = action.ingredient;
            return {
                allSelectedIngredients: state.allSelectedIngredients.filter(
                    (value) => value !== ingredient
                ),
            };
        }
        case RESET_INGREDIENT: {
            return { allSelectedIngredients: [] };
        }
        default:
            return state;
    }
}
