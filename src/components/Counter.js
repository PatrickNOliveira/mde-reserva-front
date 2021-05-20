import React, { useState } from 'react';
import { BiMinus } from "react-icons/bi";
import { BiPlus } from "react-icons/bi";
import styled from 'styled-components';                                                                   

function Counter({value, onUpdate}) {                                                                          

  const Contador = styled.div`                    
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #ff9000;
    border-radius: 5px;
    margin: 20px;
    width: 300px;
    height: 50px;    
  `;

  const ButtonCounter = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    width: 44px;
    background-color: #fff;
    border-radius: 5px;
  `;

  return (
    <Contador>
      <div>
        <BiMinus onClick={() => onUpdate(-1)} style={{fontSize: 23}}/>
      </div>
      <ButtonCounter>
        <h1 style={{color: '#ff9000', fontSize: 25}}>{value}</h1>
      </ButtonCounter>
      <div>
        <BiPlus onClick={() => onUpdate(1)} style={{fontSize: 23}}/>
      </div>
    </Contador>
  );
}

export default Counter;