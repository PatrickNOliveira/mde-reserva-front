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

export const ExigirPeriodo = (props) => {
  return (
    <>
      <br />
      <h3>Campos obrigatórios</h3>
      <br />
      <label>Data de inicio</label>
      <Input
        type="date"
        onChange={(event) => {
          props.onChangeDtInicio(event.target.value);
        }}
        placeholder="Data de inicio"
      />{" "}
      <br /> <br />
      <label>Data de término</label>
      <Input
        type="date"
        onChange={(event) => {
          props.onChangeDtFim(event.target.value);
        }}
        placeholder="Data de término"
      />{" "}
      <br /> <br />
    </>
  );
};
