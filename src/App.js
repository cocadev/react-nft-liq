import React, { useEffect, useState } from "react";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import Nouislider from 'nouislider-react';
import numeral from 'numeraljs'
import get from 'lodash.get'
import './styles/slider-style.css';
import "nouislider/distribute/nouislider.css";
import { useMoralis } from "react-moralis";
const depositABI = require("./deposit.json");
const ercABI = require("./abi.json");

const truncate = (input, len) =>
  input?.length > len ? `${input?.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #122455;
  padding: 10px;
  // font-weight: bold;
  color: var(--secondary-text);
  width: 220px;
  height: 50px;
  cursor: pointer;
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  // flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 100px;
  @media (min-width: 767px) {
    width: 150px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 10px;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: #939499;
  text-decoration: none;
  font-size: 12px;
  margint-top:20px;
`;

export const Card = styled.div`
  padding: 35px 32px;
  color: #fff;
  background-color: #272833;
  width: 285px;
  height: 326px;
  border-radius: 20px;
`
export const Range = styled.div`
  color: #fff;
  font-size: 11px;
  width: 30px;
  margin-top: -6px;
  position: absolute;
  border: 1px solid red;
  z-index: 100
`

function App() {

  const { isAuthenticated, isWeb3Enabled, account, Moralis, chainId, enableWeb3, isWeb3EnableLoading, authenticate } = useMoralis();

  const [range, setRange] = useState(8000);

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
  }, [isAuthenticated, isWeb3Enabled]);

  const formatter = {
    to: (num) => {
      return numeral(num).format('0a')
    },
    from: (str) => {
      return numeral(str).value()
    }
  }

  const options = {
    connect: 'lower',
    animate: true,
    animationDuration: 300,
    behaviour: 'tap',
    range: {
      min: 1,
      max: 10000
    },
    start: range,
    tooltips: formatter,
    onChange: (args) => {
      const sliderValue = get(args, '[0]')
      setRange(numeral(sliderValue).value())
    }
  }

  const onDeposit = async() => {
    const request = {
      chain: chainId,
      contractAddress: '0x70716b1a0bf78ab52b9eb3666c30255bb4c7b3db',
      functionName: "deposit",
      abi: depositABI,
      params: {
        _amount: 1
      },
    };

    try{
      await Moralis.executeFunction(request).then(res => console.log('+++++++++', res));

    }catch(e){
      console.log('+_+eeee+_+', e)
    }

  };

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "#050338" }}
      >
        <s.Container
          fd={'row'}
          jc={'space-between'}
          style={{ padding: '12px 24px', backgroundColor: "#050338" }}
        >
          <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />

          {!isAuthenticated ? <StyledButton
              onClick={() => {
                authenticate({ signingMessage: 'LIQUIDUS AUTHENTICATION'});
              }}
            >
            CONNECT
          </StyledButton> : <StyledButton style={{ fontSize: 20}}>{truncate(account, 15)}</StyledButton>}
        </s.Container>

        <s.SpacerSmall />

        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <Card>
            <div style={{ color: '#939499', fontSize: 15 }}>1. Token Prices (BSC mainnet)</div>
            <s.SpacerSmall />
            <s.Container fd={'row'} ai={"center"}>
              <img src="config/images/bnb.png" alt="" />
              <div style={{ marginLeft: 12, fontSize: 19 }}>BNB - $340.35</div>
            </s.Container>
            <s.SpacerSmall />

            <s.Container fd={'row'} ai={"center"}>
              <img src="config/images/Liquidus.png" alt="" />
              <div style={{ marginLeft: 12, fontSize: 19 }}>LIQ - $0.281</div>
            </s.Container>
            <s.SpacerLarge />
            <s.SpacerLarge />

            <div style={{ color: '#939499', fontSize: 15 }}>2. BNB-LIQ Total Liquidity</div>
            <s.SpacerSmall />
            <s.Container fd={'row'} ai={"center"}>
              <img src="config/images/Group 1.png" alt="" />
              <div style={{ marginLeft: 12, fontSize: 19 }}>$850,300.32</div>
            </s.Container>
          </Card>
          <s.SpacerLarge />

          <Card style={{ width: 430 }}>

            <s.Container fd={'row'} ai={"center"} jc={'space-between'} style={{ color: '#939499', fontSize: 15 }}>
              <div>Deposit (Testnet)</div>
              <s.Container fd={'row'} ai={"center"}>
                <div>Balance</div><s.SpacerSmall /><s.SpacerSmall />
                <div style={{ color: '#fff' }}>{range?.toFixed(0)}</div>
              </s.Container>
            </s.Container>

            <s.SpacerSmall />

            <s.Container fd={'row'} ai={"center"}>
              <img src="config/images/Liquidus.png" alt="" />
              <div style={{ marginLeft: 12, fontSize: 19 }}>
                <div>10,000 LIQ</div>
                <div style={{ fontSize: 12, color: '#939499', marginTop: 2 }}>$2900.45</div>
              </div>
            </s.Container>

            <>
              <s.SpacerSmall />
              <s.SpacerSmall />

              <div style={{ position: 'relative' }}>
                <Nouislider{...options} />
              </div>

              <s.SpacerLarge />
              <s.SpacerMedium />
              <s.SpacerLarge />

              <s.Container ai={"center"} jc={"center"}>
                <StyledButton
                  onClick={(e) => {
                    e.preventDefault();
                    onDeposit();
                  }}
                >
                  Deposit
                </StyledButton>
              </s.Container>

            </>

            <s.TextDescription
              style={{
                textAlign: "center",
                marginTop: 12
              }}
            >
              <StyledLink target={"_blank"} href={'https://testnet.bscscan.com/token/0x481E0c66d2cC0bC41AA75D135cC6C7137a5A21EC'}>
                View Contract
              </StyledLink>
            </s.TextDescription>
            <s.SpacerMedium />
            <s.SpacerMedium />
            <s.SpacerMedium />

          </Card>

          <s.SpacerLarge />

          <Card>
            <div style={{ color: '#939499', fontSize: 15 }}>Total LIQ Earned (Testnet)</div>
            <s.SpacerSmall />

            <s.Container fd={'row'} ai={"center"}>
              <img src="config/images/Liquidus.png" alt="" />
              <div style={{ marginLeft: 12, fontSize: 19 }}>
                <div>50.23 BTE</div>
                <div style={{ fontSize: 12, color: '#939499', marginTop: 2 }}>$15.20 BTE</div>
              </div>
            </s.Container>

            <s.SpacerLarge />
            <StyledButton
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              Harvest
            </StyledButton>

          </Card>

        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container style={{ margin: 50 }}>
          <s.TextDescription
            style={{
              color: "#fff",
              fontSize: 12,
              marginLeft: 20
            }}
          >
            LIQ Testnet:<br />
            https://testnet.bscscan.com/token/0x481E0c66d2cC0bC41AA75D135cC6C7137a5A21EC

          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              color: "#fff",
              fontSize: 12,
              marginLeft: 20
            }}
          >
            Staking Contract (for deposit and LIQ earned)<br />
            https://testnet.bscscan.com/address/0x70716b1a0bf78ab52b9eb3666c30255bb4c7b3db#code
          </s.TextDescription>
        </s.Container>

      </s.Container>
    </s.Screen>
  );
}

export default App;