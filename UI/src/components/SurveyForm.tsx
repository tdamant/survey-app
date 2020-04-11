import React, {useState} from "react";
import styled from "styled-components";
import {GroupedResponses, Question, SurveyResponse} from "../../../sharedTypes";
import {useHistory} from "react-router-dom";

const StyledForm = styled.form`
  display: flex; 
  flex-direction: column;
  margin: 16px 0;
`;

const StyledInput = styled.input` 
  height: 30px;
  margin: 10px;
  border: 1px solid #b8bebf;
  border-radius: 4px;
  text-align: center;
  background-color: #f0f6f7;
  color: #5c6263;
`;

const StyledSelect = styled.select`
  height: 30px;
  margin-left: 10px;
  text-align-last: center;
  background-color: #f0f6f7;
  color: #5c6263;
`;

const StyledSubmit = styled.input`
  height: 30px;
  width: 150px;  
  border-radius: 4px;
  margin: 10px auto;
  background-color: #f0f6f7;
  color: #5c6263;
`;
type SurveyFromProps = {
  saveResponseFn: (response: SurveyResponse) => Promise<{ error?: string, responses: GroupedResponses }>
  question: Question
};

export const SurveyForm = ({saveResponseFn, question}: SurveyFromProps) => {
  const [userInput, setUserInput] = useState<SurveyResponse>({comment: '', selectedOption: '', emailAddress: ''});
  const history = useHistory();

  const handleChange = (inputType: keyof SurveyResponse, event: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLSelectElement>) => {
    setUserInput({...userInput, [inputType]: event.currentTarget.value})
  };

  const validateForm = (input: SurveyResponse): boolean => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return !!input.selectedOption && emailRegex.test(input.emailAddress)
  };


  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const valid = validateForm(userInput);
    if(!valid) {
      alert('please enter a valid email and select an option from the drop down');
      return
    }
    const apiResult = await saveResponseFn(userInput);
    if(apiResult.error) {
      alert('something went wrong saving your result, please try again');
      return
    }
    history.push('/results');
  };

  return (
      <StyledForm id={'userForm'}>
        <StyledInput type={'email'} placeholder={'email@email.com'} onChange={(event) => handleChange('emailAddress', event)}/>
        <label style={{margin: 'auto'}}>
          {question?.question}
        <StyledSelect form={'userForm'} onChange={(event) => handleChange('selectedOption', event)}>
          <option value={''}/>
          {question?.options.map((option, index) => <option value={option.value} key={`${option.value}:${index}`}>{option.value}</option>)}
        </StyledSelect>
        </label>
        <StyledInput type={'text'} placeholder={'Comment'} onChange={(event) => handleChange('comment', event)}/>
        <StyledSubmit type={'submit'} onClick={handleSubmit}/>
      </StyledForm>
  )
};