import { TOOGGLE_BLACKLIST } from "../actionTypes";
const initialState = {
    // allblackListItems: ["Breads", "Cookies", "Vegan"],
    allblackListItems: [],
};

export default function (state = initialState, action) {
    switch (action.type) {
        case TOOGGLE_BLACKLIST: {
            const blackListItem = action.blackListItem;
            if (state.allblackListItems.includes(blackListItem)) {
                return {
                    allblackListItems: state.allblackListItems.filter(
                        (value) => value !== blackListItem
                    ),
                };
            } else {
                return {
                    allblackListItems: [
                        ...state.allblackListItems,
                        blackListItem,
                    ],
                };
            }
        }

        default:
            return state;
    }
}
