export type Answers = {
  selectedOption: string;
  comment: string;
}
export type GroupedResponses = {
  [email: string]: Answers[]
}
export type SurveyResponse = Answers & {
  emailAddress: string;
}
export type Option = { value: string }
export type Question = { question: string, options: Option[] }