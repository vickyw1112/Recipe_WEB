import {
    LOGIN_SECCESS,
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOG_OUT,
} from "../actionTypes";

const initialState = {
    loading: false,
    loggedIn: false,
    error: "",
};
export default function (state = initialState, action) {
    switch (action.type) {
        case LOGIN_REQUEST: {
            return { ...state, loading: true };
        }
        case LOGIN_SECCESS: {
            return { loading: false, loggedIn: true, error: "" };
        }
        case LOGIN_FAILURE: {
            return { loading: false, loggedIn: false, error: action.payload };
        }
        case LOG_OUT: {
            return { loading: false, loggedIn: false, error: "" };
        }
        default:
            return state;
    }
}
