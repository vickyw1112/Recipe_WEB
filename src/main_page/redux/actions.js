import {
    TOOGLE_INGREDIENT,
    DELETE_INGREDIENT,
    TOOGLE_TAG,
    TOOGGLE_BLACKLIST,
    RESET_INGREDIENT,
    DELETE_TAG,
    FETCH_SEARCH_RESULT_REQUEST,
    FETCH_SEARCH_RESULT_SUCCESS,
    FETCH_SEARCH_RESULT_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SECCESS,
    LOGIN_FAILURE,
    LOG_OUT,
    REGISTRY_REQUEST,
    REGISTRY_SECCESS,
    REGISTRY_FAILURE,
} from "./actionTypes";

// action creator
export const toogleIngredient = (ingredient) => ({
    type: TOOGLE_INGREDIENT,
    ingredient,
});

export const deleteIngredient = (ingredient) => ({
    type: DELETE_INGREDIENT,
    ingredient,
});

export const resetIngredient = () => ({
    type: RESET_INGREDIENT,
});

export const toogleTag = (tag) => ({
    type: TOOGLE_TAG,
    tag,
});

export const deleteTag = (tag) => ({
    type: DELETE_TAG,
    tag,
});

export const toogleBlackList = (blackListItem) => ({
    type: TOOGGLE_BLACKLIST,
    blackListItem,
});

export const fetchSearchResultRequest = () => ({
    type: FETCH_SEARCH_RESULT_REQUEST,
});

export const fetchSearchResultSuccess = (searchResult) => ({
    type: FETCH_SEARCH_RESULT_SUCCESS,
    payload: searchResult,
});

export const fetchSearchResultFailure = (error) => ({
    type: FETCH_SEARCH_RESULT_FAILURE,
    payload: error,
});

export const loginRequest = () => ({
    type: LOGIN_REQUEST,
});

export const loginSuccess = () => ({
    type: LOGIN_SECCESS,
});

export const loginFailure = (error) => ({
    type: LOGIN_FAILURE,
    payload: error,
});
export const logout = () => ({
    type: LOG_OUT,
});
export const registryRequest = () => ({
    type: REGISTRY_REQUEST,
});

export const registrySuccess = () => ({
    type: REGISTRY_SECCESS,
});

export const registryFailure = (error) => ({
    type: REGISTRY_FAILURE,
    payload: error,
});
