import {
	SET_COMMENT_REQUIRED,
	SET_COMMENT,
	RESET_REDUCER
} from "./action-types";
import commentStateDefault from "./default-state";

function commentReducer(state = commentStateDefault, action) {
	switch (action.type) {
		case SET_COMMENT_REQUIRED:
			return {
				...state,
				shouldCommentRequired: true
			};
		case SET_COMMENT:
			return {
				...state,
				comment: action.payload.comment
			}
		case RESET_REDUCER:
			return commentStateDefault;
		default:
			return state;
	}
}

export default commentReducer;