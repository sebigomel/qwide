import styled from "styled-components";
import React from "react";

const Logo = styled.span`
  position: absolute;
  left: 5%;
  top: 40%;
  font-size: 1em;
  color: #828282;
`;

const Container = styled.div`
  position: relative;
`;

const StyledInput = styled.input`
  border: 1px solid #bdbdbd;
  border-radius: 8px;
  width: 25em;
  font-size: 0.8em;
  padding: 0.7em;
  padding-left: 3.5em;
  margin-top: 15px;
  outline: none;
  &:focus {
    border: 1px solid #2f80ed;
  }
  &&::placeholder {
    color: #828282;
  }
`;

export default function Input(props) {
  const name = props.content.toLowerCase();
  return (
    <Container>
      <Logo className="material-icons">{props.logo}</Logo>
      <StyledInput
        placeholder={props.content}
        name={name}
        type={props.type}
        onChange={props.handleChange}
      />
    </Container>
  );
}
