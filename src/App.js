import React, { useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import { Button, Flex, Form, Input, Typography } from "antd";

function App() {
  const [network, setNetwork] = useState(process.env.REACT_APP_API_NETWORK);
  const [apiKey, setApiKey] = useState(process.env.REACT_APP_API_KEY);
  const [privateKey, setPrivateKey] = useState(
    process.env.REACT_APP_PRIVATE_KEY
  );
  const [tokenContract, setTokenContract] = useState(
    process.env.REACT_APP_TOKEN_CONTRACT
  );
  const [recipientAddress, setRecipientAddress] = useState(
    "0xcAa4b64Defcd241BB46dCC97C4Ffd71E82100c89"
  );
  const [amount, setAmount] = useState("100");
  const [symbol, setSymbol] = useState("");
  const [balance, setBalance] = useState(0.0);
  const [balanceWalletLoading, setBalanceWalletLoading] = useState(false);
  const [balanceInfuralLoading, setBalanceInfuralLoading] = useState(false);
  const [transferWalletLoading, setTransferWalletLoading] = useState(false);
  const [transferInfuralLoading, setTransferInfuraLoading] = useState(false);

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

  const getBalanceViaWallet = async () => {
    try {
      setBalanceWalletLoading(true);
      getBalance(tokenContract);
    } catch (error) {
      console.log(error);
    } finally {
      setBalanceWalletLoading(false);
    }
  };

  const getBalanceViaInfura = async () => {
    try {
      setBalanceInfuralLoading(true);
      const provider = new ethers.InfuraProvider(network, apiKey);
      const signer = new ethers.Wallet(privateKey, provider);
      getBalance(tokenContract, signer);
    } catch (error) {
      console.log(error);
    } finally {
      setBalanceInfuralLoading(false);
    }
  };

  const sendViaWallet = async () => {
    try {
      setTransferWalletLoading(true);
      await sendTransaction(tokenContract, recipientAddress, amount);
    } catch (error) {
      console.log(error);
    } finally {
      setTransferWalletLoading(false);
    }
  };

  const sendViaInfura = async () => {
    try {
      setTransferInfuraLoading(true);
      const provider = new ethers.InfuraProvider(network, apiKey);
      const signer = new ethers.Wallet(privateKey, provider);
      await sendTransaction(tokenContract, recipientAddress, amount, signer);
    } catch (error) {
      console.log(error);
    } finally {
      setTransferInfuraLoading(false);
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

  // Configure the app frontend
  return (
    <Flex className="App" justify="center">
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
      >
        <Typography.Title>DApp Demo</Typography.Title>
        <Form.Item label="Network">
          <Input value={network} onChange={(e) => setNetwork(e.target.value)} />
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
          {window.ethereum && (
            <Button
              type="primary"
              onClick={getBalanceViaWallet}
              loading={balanceWalletLoading}
            >
              Get Balance via Wallet
            </Button>
          )}
          <Button onClick={getBalanceViaInfura} loading={balanceInfuralLoading}>
            Get Balance via Infural
          </Button>
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
      </Form>
    </Flex>
  );
}

export default App;
