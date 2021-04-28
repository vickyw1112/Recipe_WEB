import {
    REGISTRY_FAILURE,
    REGISTRY_SECCESS,
    REGISTRY_REQUEST,
} from "../actionTypes";

const initialState = {
    loading: false,
    loggedIn: false,
    error: "",
};
export default function (state = initialState, action) {
    switch (action.type) {
        case REGISTRY_REQUEST: {
            return { ...state, loading: true };
        }
        case REGISTRY_SECCESS: {
            return { loading: false, loggedIn: true, error: "" };
        }
        case REGISTRY_FAILURE: {
            return { loading: false, loggedIn: false, error: action.payload };
        }

        default:
            return state;
    }
}
