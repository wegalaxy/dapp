import React, { useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import { Button, Flex, Form, Input, notification, Typography } from "antd";

function App() {
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
  const [startUnixTime, setStartUnixTime] = useState(
    Math.round(Date.now() / 1000)
  );
  const [endUnixTime, setEndUnixTime] = useState(
    Math.round(new Date(Date.now() + 60 * 3 * 1000).getTime() / 1000)
  );
  const [fundPerGuessing, setFundPerGuessing] = useState("10");
  const [rewardPercentage, setRewardPercentage] = useState(10);

  const [gameId, setGameId] = useState(1003);
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

  const [api, contextHolder] = notification.useNotification();

  const provider = new ethers.InfuraProvider(network, apiKey);
  const signer = new ethers.Wallet(privateKey, provider);

  const abi = [
    {
      inputs: [
        { internalType: "string", name: "name", type: "string" },
        { internalType: "string", name: "symbol", type: "string" },
        { internalType: "uint256", name: "totalSupply", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "allowance", type: "uint256" },
        { internalType: "uint256", name: "needed", type: "uint256" },
      ],
      name: "ERC20InsufficientAllowance",
      type: "error",
    },
    {
      inputs: [
        { internalType: "address", name: "sender", type: "address" },
        { internalType: "uint256", name: "balance", type: "uint256" },
        { internalType: "uint256", name: "needed", type: "uint256" },
      ],
      name: "ERC20InsufficientBalance",
      type: "error",
    },
    {
      inputs: [{ internalType: "address", name: "approver", type: "address" }],
      name: "ERC20InvalidApprover",
      type: "error",
    },
    {
      inputs: [{ internalType: "address", name: "receiver", type: "address" }],
      name: "ERC20InvalidReceiver",
      type: "error",
    },
    {
      inputs: [{ internalType: "address", name: "sender", type: "address" }],
      name: "ERC20InvalidSender",
      type: "error",
    },
    {
      inputs: [{ internalType: "address", name: "spender", type: "address" }],
      name: "ERC20InvalidSpender",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "spender", type: "address" },
      ],
      name: "allowance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "value", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "value", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "value", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const gameABI = [
    {
      inputs: [
        { internalType: "address", name: "tokenContract", type: "address" },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          indexed: false,
          internalType: "bytes32",
          name: "hash",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "uint64",
          name: "startUnixTime",
          type: "uint64",
        },
        {
          indexed: false,
          internalType: "uint64",
          name: "endUnixTime",
          type: "uint64",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "fundPerGuessing",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "rewardPercentage",
          type: "uint256",
        },
      ],
      name: "GameCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "gameId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "number",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "greeting",
          type: "string",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "rewardPerWinner",
          type: "uint256",
        },
      ],
      name: "GameRevealed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "player",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "gameId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "number",
          type: "uint256",
        },
      ],
      name: "PlayerGuessed",
      type: "event",
    },
    {
      inputs: [],
      name: "currentGameId",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "fundTokenContract",
      outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "gameId", type: "uint256" }],
      name: "gameExists",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "games",
      outputs: [
        { internalType: "uint256", name: "id", type: "uint256" },
        { internalType: "string", name: "name", type: "string" },
        { internalType: "uint256", name: "targetNumber", type: "uint256" },
        { internalType: "string", name: "greeting", type: "string" },
        { internalType: "bytes32", name: "hash", type: "bytes32" },
        { internalType: "uint64", name: "startUnixTime", type: "uint64" },
        { internalType: "uint64", name: "endUnixTime", type: "uint64" },
        { internalType: "uint256", name: "fundPerGuessing", type: "uint256" },
        { internalType: "uint256", name: "totalFund", type: "uint256" },
        { internalType: "bool", name: "revealed", type: "bool" },
        { internalType: "uint256", name: "rewardPercentage", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "targetNumber", type: "uint256" },
        { internalType: "string", name: "greeting", type: "string" },
      ],
      name: "generateGameHash",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "gameId", type: "uint256" },
        { internalType: "uint256", name: "number", type: "uint256" },
      ],
      name: "getGameNumberGuesses",
      outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "gameId", type: "uint256" },
        { internalType: "address", name: "player", type: "address" },
      ],
      name: "getGamePlayerGuess",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "gameId", type: "uint256" }],
      name: "getGamePlayers",
      outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "gameId", type: "uint256" }],
      name: "getGameWinNumbers",
      outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "gameId", type: "uint256" },
        { internalType: "uint256", name: "number", type: "uint256" },
      ],
      name: "guess",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "maxTargetNumber",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "minTargetNumber",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "string", name: "name", type: "string" },
        { internalType: "bytes32", name: "hash", type: "bytes32" },
        { internalType: "uint64", name: "startUnixTime", type: "uint64" },
        { internalType: "uint64", name: "endUnixTime", type: "uint64" },
        { internalType: "uint256", name: "fundPerGuessing", type: "uint256" },
        { internalType: "uint256", name: "rewardPercentage", type: "uint256" },
      ],
      name: "newGame",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "gameId", type: "uint256" },
        { internalType: "uint256", name: "number", type: "uint256" },
        { internalType: "string", name: "greeting", type: "string" },
      ],
      name: "revealTargetNumber",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

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
    const contract = new ethers.Contract(tokenContract, abi, signer);
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
    const contract = new ethers.Contract(tokenContract, abi, signer);
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
    const contract = new ethers.Contract(gameContract, gameABI, signer);
    const hash = await contract.generateGameHash(targetNumber, greeting);
    const tx = await contract.newGame(
      name,
      hash,
      startUnixTime,
      endUnixTime,
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
    const contract = new ethers.Contract(tokenContract, abi, signer);
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
    const contract = new ethers.Contract(gameContract, gameABI, signer);
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
    const contract = new ethers.Contract(gameContract, gameABI, signer);
    const tx = await contract.revealTargetNumber(gameId, number, greeting);
    console.log(await tx.wait());
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
      <Flex className="App" justify="center">
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
        >
          <Typography.Title>DApp Demo</Typography.Title>
          <Form.Item label="Network">
            <Input
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="API Key">
            <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
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
          <Form.Item label="Recipient Address" required>
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} />
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
              <Button onClick={sendViaInfura} loading={transferInfuralLoading}>
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
              <Button onClick={guessViaInfura} loading={guessInfuralLoading}>
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
              <Button onClick={revealViaInfura} loading={revealInfuralLoading}>
                Reveal via Infura
              </Button>
            </Flex>
          </Flex>
        </Form>
      </Flex>
    </>
  );
}

export default App;
