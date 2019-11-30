import React, {useState} from "react";

const SELECTED_ANSWERS_INDEXES_DEFAULT = [];

function Question(props) {
	const {
		question,
		answers = [],
		isAnswerable = true,
		isMultipleSelect = false,
		selectedAnswerIndex = null,
		submitButtonText = "Diğer Soru",
		onAnsweringCompleted
	} = props;

	const [selectedAnswersIndexes, setSelectedAnswersIndexes] = useState(SELECTED_ANSWERS_INDEXES_DEFAULT);
	const areThereSeletedAnswers = selectedAnswersIndexes.length > 0;

	function handleAnswerCheckboxChange(event) {
		const changedCheckboxValue = event.target.value;
		const isChecked = event.target.checked;

		if (isChecked) {
			setSelectedAnswersIndexes([...selectedAnswersIndexes, changedCheckboxValue]);
		}else {
			const unselectedIndexRemoved = selectedAnswersIndexes
																			.filter(selectedAnswerIndex => selectedAnswerIndex !== changedCheckboxValue);
			setSelectedAnswersIndexes(unselectedIndexRemoved);
		}
	}

	function handleAnswerRadioChange() {
		const changedRadioValue = event.target.value;
		const isChecked = event.target.checked;

		if (isChecked) {
			setSelectedAnswersIndexes([changedRadioValue]);
		} else {
			setSelectedAnswersIndexes(SELECTED_ANSWERS_INDEXES_DEFAULT);
		}
	}

	function handleAnswerSubmitButtonClick(event) {
		event.preventDefault();

		onAnsweringCompleted(selectedAnswersIndexes);
		// bunu yapmak gerekiyor
		setSelectedAnswersIndexes(SELECTED_ANSWERS_INDEXES_DEFAULT);
	}

	return (
		<div>
			<div>
				<p>{question}</p>
			</div>

			{answers.map(function(answer, answerIndex) {
				const isChecked = selectedAnswersIndexes.includes(answerIndex.toString()) ||
													answerIndex == selectedAnswerIndex;

				return (
					<div className={"form-check"}
						 	 key={Math.random()}>
						<input className={"form-check-input ml-0"}
									 type={isMultipleSelect ? "checkbox" : "radio"}
									 onChange={isMultipleSelect ? handleAnswerCheckboxChange : handleAnswerRadioChange}
									 checked={isChecked}
									 disabled={!isAnswerable}
									 value={answerIndex} />

						<label className={"form-check-label"}>
							{answer}
						</label>
				</div>
				)
			})}

			{isAnswerable && (
				<button className={"btn btn-primary"}
								onClick={handleAnswerSubmitButtonClick}
							  disabled={!areThereSeletedAnswers}>
					{submitButtonText}
				</button>
			)}
		</div>
	)
}

export default Question;