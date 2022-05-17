import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

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

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
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
  padding: 35px 27px;
  color: #fff;
  background-color: #272833;
  width: 277px;
  height: 326px;
  border-radius: 20px;
`

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "#050338" }}
      >
        <s.Container
          // ai={"center"}
          fd={'row'}
          jc={'space-between'}
          style={{ padding: '12px 24px', backgroundColor: "#050338" }}
        >
          <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />

          <StyledButton
            onClick={(e) => {
              e.preventDefault();
              dispatch(connect());
              getData();
            }}
          >
            CONNECT
          </StyledButton>
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

            <s.SpacerSmall />
            <>

              <s.SpacerSmall />
              <s.Container ai={"center"} jc={"center"}>
                <StyledButton
                  onClick={(e) => {
                    e.preventDefault();
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
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
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
                <div style={{ fontSize: 12, color: '#939499', marginTop: 2 }}>$.23 BTE</div>
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
