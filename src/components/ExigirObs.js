import React from "react";
import styled from "styled-components";
const TextArea = styled.textarea`
  padding: 5px;
  margin-top: 10px;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 5px;
`;

export const ExigirObs = (props) => {
  return (
    <>
      <br />
      <h3>Campos obrigatórios</h3>
       <br />
      <label>Observações</label>
      <TextArea
        onChange={(event) => {
          props.onChangeObs(event.target.value);
        }}
      />
    </>
  );
};
