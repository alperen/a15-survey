function generateQuestionsQueueFromHeadlines(deservedHeadlines, questions) {
	const questionsQueue = [];

	deservedHeadlines.forEach(function (headline) {
		const findHeadline = questions.find(questionSection => questionSection.name == headline);
		const headlineQuestions = findHeadline.questions || [];

		questionsQueue.push(...headlineQuestions);
	});

	return questionsQueue;
}

export default generateQuestionsQueueFromHeadlines;