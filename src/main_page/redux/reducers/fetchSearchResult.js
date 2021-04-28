import {
    FETCH_SEARCH_RESULT_REQUEST,
    FETCH_SEARCH_RESULT_SUCCESS,
    FETCH_SEARCH_RESULT_FAILURE,
} from "../actionTypes";

const initialState = {
    loading: false,
    searchResult: [],
    error: "",
};
export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_SEARCH_RESULT_REQUEST: {
            // should change to 2d array inorder to implement pigantion
            return { ...state, loading: true };
        }
        case FETCH_SEARCH_RESULT_SUCCESS: {
            return { loading: false, searchResult: action.payload, error: "" };
        }
        case FETCH_SEARCH_RESULT_FAILURE: {
            return { loading: false, searchResult: [], error: action.payload };
        }
        default:
            return state;
    }
}
