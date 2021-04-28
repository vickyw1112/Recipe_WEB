import Axios from "axios";
import {
    fetchSearchResultRequest,
    fetchSearchResultSuccess,
    fetchSearchResultFailure,
} from "../../redux/actions";

// dispatch is a react hook, it must be passed in from the body of the component
// all three list need to be passed in as well
const fetchSearchResultDefault = (
    dispatch,
    selectedIngredients,
    allTags,
    allblackListItems
) => {
    dispatch(fetchSearchResultRequest());
    Axios.post("/recipe/search", {
        ingredients: selectedIngredients,
        tags: allTags,
        blackList: allblackListItems,
    })
        .then((response) => {
            dispatch(fetchSearchResultSuccess(response));
        })
        .catch((error) => {
            dispatch(fetchSearchResultFailure(error.message));
        });
};

export default fetchSearchResultDefault;
