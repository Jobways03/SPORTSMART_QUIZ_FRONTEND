import { api } from "./api";

export async function checkSubmissionStatus({ quizId, userId }) {
  const res = await api.get(
    `/api/responses/status?quizId=${quizId}&userId=${userId}`
  );
  return res.data; // { submitted: true | false }
}

export async function submitQuiz(payload) {
  // payload:
  // { quizId, matchId, userId, answers: [{ questionId, selectedOptionIndex }] }
  const res = await api.post("/api/responses/submit", payload);
  return res.data; // { message: "Responses recorded successfully" }
}