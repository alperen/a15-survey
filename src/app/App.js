import React, {useState, useReducer} from "react";

import Question from "./Question.js";
import generateQuestionsQueueFromHeadlines from "./generateQuestionsQueueFromHeadlines.js";

import surveyReducer from "./survey-state/reducer.js";
import surveyStateDefault from "./survey-state/default-state.js";
import { SET_ANSWER_QUEUE, SET_QUESTION_ANSWER, INCREASE_CURRENT_QUESTION, RESET_REDUCER } from "./survey-state/action-types.js";

import commentReducer from "./comment-state/reducer";
import commentStateDefault from "./comment-state/default-state";
import {
	SET_COMMENT,
	SET_COMMENT_REQUIRED,
	RESET_REDUCER as COMMENT_RESET_REDUCER
} from "./comment-state/action-types";

import { SELECT_FRAMEWORKS_STEP, SURVEY_STEP, GIVE_COMMENT_STEP, SUBMISSION_STEP } from "./step-state/steps.js";

import questions from "../static/questions.json";

const humanReadableOtherHeadline = "Diğer";

function App() {
	const [step, setStepState] = useState(SELECT_FRAMEWORKS_STEP);
	const [surveyState, surveyStateDispatch] = useReducer(surveyReducer, surveyStateDefault);
	const [commentState, commentStateDispatch] = useReducer(commentReducer, commentStateDefault);
	const isLastQuestion = surveyState.activeQuestionIndex == (surveyState.questions.length - 1);
	const questionHeadlines = questions.map(questionSection => questionSection.name);

	function handleStepZeroCompleted(selectedHeadlineIndexes) {
		/*find fonksiyonu secim sirasini bozuyor*/
		const selectedHeadlines = [];
		selectedHeadlineIndexes.forEach(headlineIndex => selectedHeadlines.push(questionHeadlines[headlineIndex]));

		if (selectedHeadlines.includes(humanReadableOtherHeadline)) {
			commentStateDispatch({
				type: SET_COMMENT_REQUIRED
			});
		}

		const questionsQueue = generateQuestionsQueueFromHeadlines(selectedHeadlines, questions);

		if (questionsQueue.length == 0) {
			setStepState(GIVE_COMMENT_STEP);
		}else {
			surveyStateDispatch({
				type: SET_ANSWER_QUEUE,
				payload: questionsQueue
			});
			setStepState(SURVEY_STEP);
		}
	}

	function handleCurrentQuestionAnswer(selectedAnswerIndex) {
		surveyStateDispatch({
			type: SET_QUESTION_ANSWER,
			payload: {
				questionIndex: surveyState.activeQuestionIndex,
				answerIndex: selectedAnswerIndex
			}
		});

		if (!isLastQuestion) {
			surveyStateDispatch({
				type: INCREASE_CURRENT_QUESTION
			});
		}else {
			setStepState(GIVE_COMMENT_STEP);
		}
	}

	function handleCommentFormSubmit(event) {
		event.preventDefault();

		const comment = event.target.querySelector("textarea").value;

		commentStateDispatch({
			type: SET_COMMENT,
			payload: {
				comment
			}
		});
		setStepState(SUBMISSION_STEP);
	}

	function handleStartAgainButtonClick(event) {
		event.preventDefault();

		// window.location.reload(); :)))
		setStepState(SELECT_FRAMEWORKS_STEP);
		commentStateDispatch({
			type: COMMENT_RESET_REDUCER
		});
		surveyStateDispatch({
			type: RESET_REDUCER
		});
	}

	function renderSurveySection() {
		const currentQuestion = surveyState.questions[surveyState.activeQuestionIndex];

		return (
			<Question question={currentQuestion.question}
								answers={currentQuestion.answers}
								isMultipleSelect={false}
								onAnsweringCompleted={handleCurrentQuestionAnswer}
								submitButtonText={isLastQuestion ? "Sonraki Bölüme Geç" : "Diğer Soru"}/>
		)
	}

	function renderCommentSection() {
		return (
			<div>
				<p>{"Yorum birakin:"}</p>
				<form onSubmit={handleCommentFormSubmit}>
					<textarea className={"form-control"}
										required={commentState.shouldCommentRequired}/>
					<button type={"submit"} className={"btn btn-success mt-2"}>{"Yorum da ekleyin."}</button>
				</form>
			</div>
		)
	}

	function renderSubmissionSection() {
		return (
			<div>
				<h3>Cevapladiginiz Sorular:</h3>
				{surveyState.questions  ? (
					<div>
						{surveyState.questions.map((question, questionIndex) => (
							<Question question={question.question}
												isAnswerable={false}
												answers={question.answers}
												selectedAnswerIndex={surveyState.questionAnswers[questionIndex]}
												key={questionIndex} />
						))}
					</div>
				) : (
					<b>{"Hic soru cevaplamadiniz."}</b>
				)}

				<div className={"mt-1"}>
					<h3>{"Yorumunuz:"}</h3>
					<p className={"text-monospace"}> {commentState.comment} </p>
				</div>

				<div className={"mt-1"}>
					<button type={"button"}
									onClick={handleStartAgainButtonClick}
									className={"btn btn-warning"}> {"Yeniden Baslayin"} </button>
				</div>
			</div>
		);
	}

	function renderStep() {
		switch (step) {
			case SELECT_FRAMEWORKS_STEP:
				return (
					<Question question={"Favori Framework'unuz nedir?"}
										answers={questionHeadlines}
										submitButtonText={"Anket'e basla"}
										isMultipleSelect={true}
										onAnsweringCompleted={handleStepZeroCompleted}/>
				);
			case SURVEY_STEP:
				return renderSurveySection();
			case GIVE_COMMENT_STEP:
				return renderCommentSection();
			case SUBMISSION_STEP:
				return renderSubmissionSection();
		}
	}

	return (
		<div className={"m-5"}>
			{renderStep()}
		</div>
	)
}

export default App;