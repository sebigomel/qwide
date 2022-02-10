import React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 70px;
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2em;
`;

export default function Navbar() {
  return (
    <Container>
      <img src="logo.png" alt="" width="130px" height="auto" />
    </Container>
  );
}
