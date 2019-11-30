import { SET_ANSWER_QUEUE, SET_QUESTION_ANSWER, INCREASE_CURRENT_QUESTION, RESET_REDUCER } from "./action-types";
import surveyStateDefault from "./default-state";

function surveyReducer(state = surveyStateDefault, action) {
	switch (action.type) {
		case SET_ANSWER_QUEUE:
			return {
				...state,
				questions: action.payload
			};
		case SET_QUESTION_ANSWER:
			const {
				questionIndex,
				answerIndex
			} = action.payload;

			const newQuestionsAnswers = [...state.questionAnswers];
			newQuestionsAnswers[questionIndex] = answerIndex;

			return {
				...state,
				questionAnswers: newQuestionsAnswers
			}
		case INCREASE_CURRENT_QUESTION:
			return {
				...state,
				activeQuestionIndex: state.activeQuestionIndex + 1
			}
		case RESET_REDUCER:
			return surveyStateDefault;
		default:
			return state;
	}
}

export default surveyReducer;