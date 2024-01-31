import React, { useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Descriptions,
  Flex,
  Form,
  Input,
  InputNumber,
  List,
  notification,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { GAME_ABI, TOKEN_ABI } from "./Constants";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [address, setAddress] = useState();
  const [game, setGame] = useState();
  const [gameWinNumbers, setGameWinNumbers] = useState();
  const [players, setPlayers] = useState();
  const [tokenSymbol, setTokenSymbol] = useState();

  const [network, setNetwork] = useState(process.env.REACT_APP_API_NETWORK);
  const [apiKey, setApiKey] = useState(process.env.REACT_APP_API_KEY);
  const [privateKey, setPrivateKey] = useState(
    process.env.REACT_APP_PRIVATE_KEY
  );
  const [tokenContract, setTokenContract] = useState(
    process.env.REACT_APP_TOKEN_CONTRACT
  );
  const [gameContract, setGameContract] = useState(
    process.env.REACT_APP_GAME_CONTRACT
  );
  const [recipientAddress, setRecipientAddress] = useState(
    "0xcAa4b64Defcd241BB46dCC97C4Ffd71E82100c89"
  );
  const [amount, setAmount] = useState("100");
  const [symbol, setSymbol] = useState("");
  const [balance, setBalance] = useState(0.0);

  const [targetNumber, setTargetNumber] = useState(20);
  const [greeting, setGreeting] = useState("Hello World");
  const [name, setName] = useState("Guess Game");
  const [startUnixTime, setStartUnixTime] = useState(dayjs());
  const [endUnixTime, setEndUnixTime] = useState(dayjs());
  const [fundPerGuessing, setFundPerGuessing] = useState("10");
  const [rewardPercentage, setRewardPercentage] = useState(10);

  const [gameId, setGameId] = useState(1001);
  const [number, setNumber] = useState(20);

  const [balanceWalletLoading, setBalanceWalletLoading] = useState(false);
  const [balanceInfuralLoading, setBalanceInfuralLoading] = useState(false);
  const [transferWalletLoading, setTransferWalletLoading] = useState(false);
  const [transferInfuralLoading, setTransferInfuraLoading] = useState(false);
  const [newGameWalletLoading, setNewGameWalletLoading] = useState(false);
  const [newGameInfuralLoading, setNewGameInfuraLoading] = useState(false);
  const [approveWalletLoading, setApproveWalletLoading] = useState(false);
  const [approveInfuralLoading, setApproveInfuraLoading] = useState(false);
  const [guessWalletLoading, setGuessWalletLoading] = useState(false);
  const [guessInfuralLoading, setGuessInfuraLoading] = useState(false);
  const [revealWalletLoading, setRevealWalletLoading] = useState(false);
  const [revealInfuralLoading, setRevealInfuraLoading] = useState(false);
  const [connectWalletLoading, setConnectWalletLoading] = useState(false);
  const [connectInfuralLoading, setConnectInfuraLoading] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const provider = new ethers.InfuraProvider(network, apiKey);
  const signer = new ethers.Wallet(privateKey, provider);

  const getBalanceViaWallet = async () => {
    try {
      setBalanceWalletLoading(true);
      getBalance(tokenContract);
    } catch (error) {
      console.error(error);
      openNotification(error.code, error.action);
    } finally {
      setBalanceWalletLoading(false);
    }
  };

  const getBalanceViaInfura = async () => {
    try {
      setBalanceInfuralLoading(true);
      getBalance(tokenContract, signer);
    } catch (error) {
      console.error(error);
      openNotification(error.code, error.action);
    } finally {
      setBalanceInfuralLoading(false);
    }
  };

  const sendViaWallet = async () => {
    try {
      setTransferWalletLoading(true);
      await sendTransaction(tokenContract, recipientAddress, amount);
    } catch (error) {
      console.error(error);
      openNotification(error.code, error.action);
    } finally {
      setTransferWalletLoading(false);
    }
  };

  const sendViaInfura = async () => {
    try {
      setTransferInfuraLoading(true);
      await sendTransaction(tokenContract, recipientAddress, amount, signer);
    } catch (error) {
      console.error(error);
      openNotification(error.code, error.action);
    } finally {
      setTransferInfuraLoading(false);
    }
  };

  const newGameViaWallet = async () => {
    try {
      setNewGameWalletLoading(true);
      await newGame(
        gameContract,
        targetNumber,
        greeting,
        name,
        startUnixTime,
        endUnixTime,
        fundPerGuessing,
        rewardPercentage
      );
      await getCurrentGame(gameContract);
    } catch (error) {
      console.error(error);
      openNotification(error.code, error.action);
    } finally {
      setNewGameWalletLoading(false);
    }
  };

  const newGameViaInfura = async () => {
    try {
      setNewGameInfuraLoading(true);
      await newGame(
        gameContract,
        targetNumber,
        greeting,
        name,
        startUnixTime,
        endUnixTime,
        fundPerGuessing,
        rewardPercentage,
        signer
      );
      await getCurrentGame(gameContract, signer);
    } catch (error) {
      console.error(error);
      openNotification(error.code, error.action);
    } finally {
      setNewGameInfuraLoading(false);
    }
  };

  const approveViaWallet = async () => {
    try {
      setApproveWalletLoading(true);
      await approve(tokenContract, gameContract, amount);
    } catch (error) {
      console.error(error);
      openNotification(error.code, error.action);
    } finally {
      setApproveWalletLoading(false);
    }
  };

  const approveViaInfura = async () => {
    try {
      setApproveInfuraLoading(true);
      await approve(tokenContract, gameContract, amount, signer);
    } catch (error) {
      console.error(error);
      openNotification(error.code, error.action);
    } finally {
      setApproveInfuraLoading(false);
    }
  };

  const guessViaWallet = async () => {
    try {
      setGuessWalletLoading(true);
      await guess(gameContract, gameId, number);
    } catch (error) {
      console.error(error);
      openNotification(error.code, error.action);
    } finally {
      setGuessWalletLoading(false);
    }
  };

  const guessViaInfura = async () => {
    try {
      setGuessInfuraLoading(true);
      await guess(gameContract, gameId, number, signer);
    } catch (error) {
      console.error(error);
      openNotification(error.code, error.action);
    } finally {
      setGuessInfuraLoading(false);
    }
  };

  const revealViaWallet = async () => {
    try {
      setRevealWalletLoading(true);
      await reveal(gameContract, gameId, number, greeting);
    } catch (error) {
      console.error(error);
      openNotification(error.code, error.action);
    } finally {
      setRevealWalletLoading(false);
    }
  };

  const revealViaInfura = async () => {
    try {
      setRevealInfuraLoading(true);
      await reveal(gameContract, gameId, number, greeting, signer);
    } catch (error) {
      console.error(error);
      openNotification(error.code, error.action);
    } finally {
      setRevealInfuraLoading(false);
    }
  };

  const connectViaWallet = async () => {
    try {
      setConnectWalletLoading(true);
      await connect(gameContract);
      await getCurrentGame(gameContract);
      await getFundToken(gameContract);
    } catch (error) {
      console.error(error);
      openNotification(error.code, error.action);
    } finally {
      setConnectWalletLoading(false);
    }
  };

  const connectViaInfura = async () => {
    try {
      setConnectInfuraLoading(true);
      await connect(gameContract, signer);
      await getCurrentGame(gameContract, signer);
      await getFundToken(gameContract, signer);
    } catch (error) {
      console.error(error);
      openNotification(error.code, error.action);
    } finally {
      setConnectInfuraLoading(false);
    }
  };

  // Send the transaction using either the Web3Provider or InfuraProvider
  const sendTransaction = async (
    tokenContract,
    address,
    amount,
    signer = null
  ) => {
    if (signer == null) {
      // Web3 Provider
      if (!window.ethereum) console.error("No wallet found!");
      else {
        await window.ethereum.send("eth_requestAccounts");
        const provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
      }
    }
    const contract = new ethers.Contract(tokenContract, TOKEN_ABI, signer);
    const tx = await contract.transfer(address, ethers.parseUnits(amount));
    console.log(await tx.wait());
  };

  // Get balance using either the Web3Provider or InfuraProvider
  const getBalance = async (tokenContract, signer = null) => {
    if (signer == null) {
      // Web3 Provider
      if (!window.ethereum) console.error("No wallet found!");
      else {
        await window.ethereum.send("eth_requestAccounts");
        const provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
      }
    }
    const contract = new ethers.Contract(tokenContract, TOKEN_ABI, signer);
    const symbol = await contract.symbol();
    const balance = await contract.balanceOf(signer.address);
    setSymbol(symbol);
    setBalance(ethers.formatUnits(balance));
  };

  // New game using either the Web3Provider or InfuraProvider
  const newGame = async (
    gameContract,
    targetNumber,
    greeting,
    name,
    startUnixTime,
    endUnixTime,
    fundPerGuessing,
    rewardPercentage,
    signer
  ) => {
    if (signer == null) {
      // Web3 Provider
      if (!window.ethereum) console.error("No wallet found!");
      else {
        await window.ethereum.send("eth_requestAccounts");
        const provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
      }
    }
    const contract = new ethers.Contract(gameContract, GAME_ABI, signer);
    const hash = await contract.generateGameHash(targetNumber, greeting);
    const tx = await contract.newGame(
      name,
      hash,
      startUnixTime.unix(),
      endUnixTime.unix(),
      ethers.parseUnits(fundPerGuessing),
      rewardPercentage
    );
    console.log(await tx.wait());
  };

  // Approve using either the Web3Provider or InfuraProvider
  const approve = async (tokenContract, gameContract, amount, signer) => {
    if (signer == null) {
      // Web3 Provider
      if (!window.ethereum) console.error("No wallet found!");
      else {
        await window.ethereum.send("eth_requestAccounts");
        const provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
      }
    }
    const contract = new ethers.Contract(tokenContract, TOKEN_ABI, signer);
    const tx = await contract.approve(gameContract, ethers.parseUnits(amount));
    console.log(await tx.wait());
  };

  // Guess number using either the Web3Provider or InfuraProvider
  const guess = async (gameContract, gameId, number, signer) => {
    if (signer == null) {
      // Web3 Provider
      if (!window.ethereum) console.error("No wallet found!");
      else {
        await window.ethereum.send("eth_requestAccounts");
        const provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
      }
    }
    const contract = new ethers.Contract(gameContract, GAME_ABI, signer);
    const tx = await contract.guess(gameId, number);
    console.log(await tx.wait());
  };

  // Reveal traget number using either the Web3Provider or InfuraProvider
  const reveal = async (gameContract, gameId, number, greeting, signer) => {
    if (signer == null) {
      // Web3 Provider
      if (!window.ethereum) console.error("No wallet found!");
      else {
        await window.ethereum.send("eth_requestAccounts");
        const provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
      }
    }
    const contract = new ethers.Contract(gameContract, GAME_ABI, signer);
    const tx = await contract.revealTargetNumber(gameId, number, greeting);
    console.log(await tx.wait());
  };

  const connect = async (gameContract, signer = null) => {
    if (signer == null) {
      // Web3 Provider
      if (!window.ethereum) console.error("No wallet found!");
      else {
        await window.ethereum.send("eth_requestAccounts");
        const provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
      }
    }
    const contract = new ethers.Contract(gameContract, GAME_ABI, signer);
    const owner = await contract.owner();
    const address = signer.address;
    setAddress(address);
    setIsOwner(owner === address);
    setIsConnected(true);
  };

  const getCurrentGame = async (gameContract, signer = null) => {
    if (signer == null) {
      // Web3 Provider
      if (!window.ethereum) console.error("No wallet found!");
      else {
        await window.ethereum.send("eth_requestAccounts");
        const provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
      }
    }
    const contract = new ethers.Contract(gameContract, GAME_ABI, signer);
    const currentGameId = await contract.currentGameId();
    const game = await contract.games(currentGameId);
    const gameWinNumbers = await contract.getGameWinNumbers(currentGameId);
    const playerAddresses = await contract.getGamePlayers(currentGameId);
    const players = [];
    for (let i = 0; i < playerAddresses.length; i++) {
      let playerAddress = playerAddresses[i];
      let guessNumber = await contract.getGamePlayerGuess(
        currentGameId,
        playerAddress
      );
      players.push({
        address: playerAddress,
        number: Number(guessNumber),
      });
    }
    setGameId(currentGameId);
    setGame(game);
    setGameWinNumbers(gameWinNumbers);
    setPlayers(players);
  };

  const getFundToken = async (gameContract, signer = null) => {
    if (signer == null) {
      // Web3 Provider
      if (!window.ethereum) console.error("No wallet found!");
      else {
        await window.ethereum.send("eth_requestAccounts");
        const provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
      }
    }
    const contract = new ethers.Contract(gameContract, GAME_ABI, signer);
    const fundTokenContract = await contract.fundTokenContract();
    const tokenContract = new ethers.Contract(
      fundTokenContract,
      TOKEN_ABI,
      signer
    );
    setTokenSymbol(await tokenContract.symbol());
  };

  const openNotification = (code, action) => {
    api.info({
      message: code,
      description: action,
      placement: "top",
    });
  };

  // Configure the app frontend
  return (
    <>
      {contextHolder}
      <Flex className="App" gap={32} vertical>
        <Typography.Title>DApp Demo</Typography.Title>
        {window.ethereum && !isConnected && (
          <>
            <Button
              type="primary"
              onClick={connectViaWallet}
              loading={connectWalletLoading}
            >
              Connect Via Wallet
            </Button>
          </>
        )}

        {!isConnected && (
          <Button onClick={connectViaInfura} loading={connectInfuralLoading}>
            Connect Via Infura
          </Button>
        )}

        {isConnected && (
          <>
            {game && gameWinNumbers && (
              <Descriptions
                title="Game Info"
                items={[
                  {
                    key: "id",
                    label: "ID",
                    children: Number(game.id),
                  },
                  {
                    key: "name",
                    label: "Name",
                    children: game.name,
                  },
                  {
                    key: "targetNumber",
                    label: "Target Number",
                    children: Number(game.targetNumber),
                  },
                  {
                    key: "startUnixTime",
                    label: "Start Datetime",
                    children: dayjs
                      .unix(Number(game.startUnixTime))
                      .format("YYYY-MM-DD HH:mm:ss"),
                  },
                  {
                    key: "endtUnixTime",
                    label: "End Datetime",
                    children: dayjs
                      .unix(Number(game.endUnixTime))
                      .format("YYYY-MM-DD HH:mm:ss"),
                  },
                  {
                    key: "fundPerGuessing",
                    label: "Fund Per Guessing",
                    children: `${ethers.formatUnits(
                      game.fundPerGuessing
                    )} ${tokenSymbol}`,
                  },
                  {
                    key: "totalFund",
                    label: "Total Fund",
                    children: `${ethers.formatUnits(
                      game.totalFund
                    )} ${tokenSymbol}`,
                  },
                  {
                    key: "revealed",
                    label: "Revealed",
                    children: game.revealed ? "Yes" : "No",
                  },
                  {
                    key: "rewardPercentage",
                    label: "Reward Percentage",
                    children: `${Number(game.rewardPercentage)}%`,
                  },
                  {
                    key: "gameWinNumbers",
                    label: "Win Numbers",
                    children: `${[gameWinNumbers].join(",")}`,
                  },
                ]}
                bordered
              />
            )}

            {players && (
              <Card title="Game Players">
                <Flex gap={16} vertical>
                  <List
                    itemLayout="horizontal"
                    dataSource={players}
                    renderItem={(player, index) => (
                      <List.Item key={index}>
                        <List.Item.Meta
                          avatar={
                            <Avatar>{player.address.substring(2, 4)}</Avatar>
                          }
                          title={
                            <Typography.Text wrap>
                              {player.address}
                              {player.address === address && (
                                <Tag color="magenta" style={{ marginLeft: 8 }}>
                                  Me
                                </Tag>
                              )}
                            </Typography.Text>
                          }
                          description={
                            <Typography.Text>
                              Guess Number: {player.number}
                            </Typography.Text>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Flex>
              </Card>
            )}

            <Card title="Demo" hidden>
              <Form
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
                style={{ maxWidth: 600 }}
              >
                <Form.Item label="Network">
                  <Input
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="API Key">
                  <Input
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Priavte Key">
                  <Input
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Token Contract" required>
                  <Input
                    value={tokenContract}
                    onChange={(e) => setTokenContract(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Game Contract" required>
                  <Input
                    value={gameContract}
                    onChange={(e) => setGameContract(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Recipient Address" required>
                  <Input
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Amount" required>
                  <Input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Balance">
                  <Typography.Text>
                    {balance} {symbol}
                  </Typography.Text>
                </Form.Item>
                <Flex gap={16} justify="center" wrap="wrap">
                  <Flex gap={16} justify="center" wrap="wrap">
                    {window.ethereum && (
                      <Button
                        type="primary"
                        onClick={getBalanceViaWallet}
                        loading={balanceWalletLoading}
                      >
                        Get Balance via Wallet
                      </Button>
                    )}
                    <Button
                      onClick={getBalanceViaInfura}
                      loading={balanceInfuralLoading}
                    >
                      Get Balance via Infural
                    </Button>
                  </Flex>
                  <Flex gap={16} justify="center" wrap="wrap">
                    {window.ethereum && (
                      <Button
                        type="primary"
                        onClick={sendViaWallet}
                        loading={transferWalletLoading}
                      >
                        Send via Wallet
                      </Button>
                    )}
                    <Button
                      onClick={sendViaInfura}
                      loading={transferInfuralLoading}
                    >
                      Send via Infura
                    </Button>
                  </Flex>
                  <Flex gap={16} justify="center" wrap="wrap">
                    {window.ethereum && (
                      <Button
                        type="primary"
                        onClick={newGameViaWallet}
                        loading={newGameWalletLoading}
                      >
                        New Game Via Wallet
                      </Button>
                    )}
                    <Button
                      onClick={newGameViaInfura}
                      loading={newGameInfuralLoading}
                    >
                      New Game via Infura
                    </Button>
                  </Flex>
                  <Flex gap={16} justify="center" wrap="wrap">
                    {window.ethereum && (
                      <Button
                        type="primary"
                        onClick={approveViaWallet}
                        loading={approveWalletLoading}
                      >
                        Approve Via Wallet
                      </Button>
                    )}
                    <Button
                      onClick={approveViaInfura}
                      loading={approveInfuralLoading}
                    >
                      Approve via Infura
                    </Button>
                  </Flex>
                  <Flex gap={16} justify="center" wrap="wrap">
                    {window.ethereum && (
                      <Button
                        type="primary"
                        onClick={guessViaWallet}
                        loading={guessWalletLoading}
                      >
                        Guess Via Wallet
                      </Button>
                    )}
                    <Button
                      onClick={guessViaInfura}
                      loading={guessInfuralLoading}
                    >
                      Guess via Infura
                    </Button>
                  </Flex>
                  <Flex gap={16} justify="center" wrap="wrap">
                    {window.ethereum && (
                      <Button
                        type="primary"
                        onClick={revealViaWallet}
                        loading={revealWalletLoading}
                      >
                        Reveal Via Wallet
                      </Button>
                    )}
                    <Button
                      onClick={revealViaInfura}
                      loading={revealInfuralLoading}
                    >
                      Reveal via Infura
                    </Button>
                  </Flex>
                </Flex>
              </Form>
            </Card>

            <Card title="New Game" hidden={!isOwner}>
              <Form
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
                style={{ maxWidth: 600 }}
              >
                <Form.Item label="Target Number">
                  <InputNumber
                    value={targetNumber}
                    onChange={(value) => setTargetNumber(value)}
                  />
                </Form.Item>
                <Form.Item label="Greeting">
                  <Input
                    value={greeting}
                    onChange={(e) => setGreeting(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Name">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Start Datetime" required>
                  <DatePicker
                    value={startUnixTime}
                    onChange={(date) => setStartUnixTime(date)}
                    showTime
                  />
                </Form.Item>
                <Form.Item label="End Datetime" required>
                  <DatePicker
                    value={endUnixTime}
                    onChange={(date) => setEndUnixTime(date)}
                    disabledDate={(current) => {
                      return current && current <= startUnixTime;
                    }}
                    showTime
                  />
                </Form.Item>
                <Form.Item label="Fund Per Guessing" required>
                  <InputNumber
                    value={fundPerGuessing}
                    onChange={(value) => setFundPerGuessing(value)}
                  />
                </Form.Item>
                <Form.Item label="Reward Percentage" required>
                  <InputNumber
                    value={rewardPercentage}
                    onChange={(value) => setRewardPercentage(value)}
                  />
                </Form.Item>
                <Flex gap={16} justify="center" wrap="wrap">
                  <Flex gap={16} justify="center" wrap="wrap">
                    {window.ethereum && (
                      <Button
                        type="primary"
                        onClick={newGameViaWallet}
                        loading={newGameWalletLoading}
                      >
                        New Game Via Wallet
                      </Button>
                    )}
                    <Button
                      onClick={newGameViaInfura}
                      loading={newGameInfuralLoading}
                    >
                      New Game via Infura
                    </Button>
                  </Flex>
                </Flex>
              </Form>
            </Card>

            <Card title="Reveal Game" hidden={!isOwner}>
              <Form
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
                style={{ maxWidth: 600 }}
              >
                <Form.Item label="Game ID">
                  <Input
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Greeting">
                  <Input
                    value={greeting}
                    onChange={(e) => setGreeting(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Target Number">
                  <InputNumber
                    value={targetNumber}
                    onChange={(value) => setTargetNumber(value)}
                  />
                </Form.Item>
                <Flex gap={16} justify="center" wrap="wrap">
                  <Flex gap={16} justify="center" wrap="wrap">
                    {window.ethereum && (
                      <Button
                        type="primary"
                        onClick={revealViaWallet}
                        loading={revealWalletLoading}
                      >
                        Reveal Via Wallet
                      </Button>
                    )}
                    <Button
                      onClick={revealViaInfura}
                      loading={revealInfuralLoading}
                    >
                      Reveal via Infura
                    </Button>
                  </Flex>
                </Flex>
              </Form>
            </Card>

            <Card title="Guess Number">
              <Form
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
                style={{ maxWidth: 600 }}
              >
                <Form.Item label="Game ID">
                  <Input
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Number">
                  <InputNumber
                    value={number}
                    onChange={(value) => setNumber(value)}
                  />
                </Form.Item>
                <Flex gap={16} justify="center" wrap="wrap">
                  <Flex gap={16} justify="center" wrap="wrap">
                    {window.ethereum && (
                      <Button
                        type="primary"
                        onClick={approveViaWallet}
                        loading={approveWalletLoading}
                      >
                        Approve Via Wallet
                      </Button>
                    )}
                    <Button
                      onClick={approveViaInfura}
                      loading={approveInfuralLoading}
                    >
                      Approve via Infura
                    </Button>
                  </Flex>
                  <Flex gap={16} justify="center" wrap="wrap">
                    {window.ethereum && (
                      <Button
                        type="primary"
                        onClick={guessViaWallet}
                        loading={guessWalletLoading}
                      >
                        Guess Via Wallet
                      </Button>
                    )}
                    <Button
                      onClick={guessViaInfura}
                      loading={guessInfuralLoading}
                    >
                      Guess via Infura
                    </Button>
                  </Flex>
                </Flex>
              </Form>
            </Card>
          </>
        )}
      </Flex>
    </>
  );
}

export default App;
