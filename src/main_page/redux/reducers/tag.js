import { TOOGLE_TAG, DELETE_TAG } from "../actionTypes";
const initialState = {
    allTags: [],
};
export default function (state = initialState, action) {
    switch (action.type) {
        case TOOGLE_TAG: {
            const tag = action.tag;
            if (state.allTags.includes(tag)) {
                return {
                    allTags: state.allTags.filter((value) => value !== tag),
                };
            } else {
                return {
                    allTags: [...state.allTags, tag],
                };
            }
        }
        case DELETE_TAG: {
            const tag = action.tag;
            return {
                allTags: state.allTags.filter((value) => value !== tag),
            };
        }
        default:
            return state;
    }
}
