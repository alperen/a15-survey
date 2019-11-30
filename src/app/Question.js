import React, {useState} from "react";

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

	const [selectedAnswersIndexes, setSelectedAnswersIndexes] = useState([]);
	const areThereSeletedAnswers = selectedAnswersIndexes.length > 0;

	function handleAnswerCheckboxChange(event) {
		const changedCheckboxValue = event.target.value;
		const isChecked = event.target.checked;

		if (isMultipleSelect) {
			if (isChecked) {
				setSelectedAnswersIndexes([...selectedAnswersIndexes, changedCheckboxValue]);
			}else {
				const selectedIndexesWithoutUnselectedIndex = selectedAnswersIndexes
																												.filter(selectedAnswerIndex => selectedAnswerIndex !== changedCheckboxValue);
				setSelectedAnswersIndexes(selectedIndexesWithoutUnselectedIndex);
			}
		} else {
			setSelectedAnswersIndexes(changedCheckboxValue);
		}
	}

	function handleAnswerSubmitButtonClick(event) {
		event.preventDefault();

		onAnsweringCompleted(selectedAnswersIndexes);
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
								 onChange={handleAnswerCheckboxChange}
								 checked={isChecked}
								 disabled={!isAnswerable}
								 value={answerIndex} />
					<label className={"form-check-label"}>
						{answer}
					</label>
				</div>
				)
			})}

			{isAnswerable && <button className={"btn btn-primary"}
							onClick={handleAnswerSubmitButtonClick}
							disabled={!areThereSeletedAnswers}>
				{submitButtonText}
			</button>}
		</div>
	)
}

export default Question;