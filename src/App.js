import React, { useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import { notification } from "antd";
import dayjs from "dayjs";
import { GAME_ABI, TOKEN_ABI } from "./Constants";
import { LoadingButton } from "@mui/lab";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  AppBar,
  Avatar,
  Backdrop,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { HelpOutline, Logout } from "@mui/icons-material";

function App() {
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [address, setAddress] = useState();
  const [game, setGame] = useState();
  const [gameWinRates, setGameWinRates] = useState();
  const [players, setPlayers] = useState();
  const [rateDecimalPoints, setRateDecimalPoints] = useState();
  const [tokenSymbol, setTokenSymbol] = useState();

  const [network] = useState(process.env.REACT_APP_API_NETWORK);
  const [apiKey] = useState(process.env.REACT_APP_API_KEY);
  const [privateKey] = useState(process.env.REACT_APP_PRIVATE_KEY);
  const [tokenContract] = useState(process.env.REACT_APP_TOKEN_CONTRACT);
  const [gameContract] = useState(process.env.REACT_APP_GAME_CONTRACT);
  const [amount] = useState("10000");

  const [balance, setBalance] = useState();

  const [name, setName] = useState("FX Rate - JPY/HKD");
  const [currencyPair, setCurrencyPair] = useState("JPY/HKD");
  const [rateUnixTime, setRateUnixTime] = useState(dayjs());
  const [startUnixTime, setStartUnixTime] = useState(dayjs());
  const [endUnixTime, setEndUnixTime] = useState(dayjs());
  const [fundPerGuessingInWei, setFundPerGuessingInWei] = useState("10");
  const [rewardPercentage, setRewardPercentage] = useState("10");

  const [gameId, setGameId] = useState("1000");
  const [rate, setRate] = useState("534280000");
  const [resultRate, setResultRate] = useState("534280000");

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

  const newGameViaWallet = async () => {
    try {
      setNewGameWalletLoading(true);
      await newGame(
        gameContract,
        name,
        currencyPair,
        rateUnixTime,
        startUnixTime,
        endUnixTime,
        fundPerGuessingInWei,
        rewardPercentage
      );
      await getCurrentGame(gameContract);
    } catch (error) {
      console.error(error);
      openNotification(error.action, error.reason);
    } finally {
      setNewGameWalletLoading(false);
    }
  };

  const newGameViaInfura = async () => {
    try {
      setNewGameInfuraLoading(true);
      await newGame(
        gameContract,
        name,
        currencyPair,
        rateUnixTime,
        startUnixTime,
        endUnixTime,
        fundPerGuessingInWei,
        rewardPercentage,
        signer
      );
      await getCurrentGame(gameContract, signer);
    } catch (error) {
      console.error(error);
      openNotification(error.action, error.reason);
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
      openNotification(error.action, error.reason);
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
      openNotification(error.action, error.reason);
    } finally {
      setApproveInfuraLoading(false);
    }
  };

  const guessViaWallet = async () => {
    try {
      setGuessWalletLoading(true);
      await guess(gameContract, gameId, rate);
      await getCurrentGame(gameContract);
    } catch (error) {
      console.error(error);
      openNotification(error.action, error.reason);
    } finally {
      setGuessWalletLoading(false);
    }
  };

  const guessViaInfura = async () => {
    try {
      setGuessInfuraLoading(true);
      await guess(gameContract, gameId, rate, signer);
      await getCurrentGame(gameContract, signer);
    } catch (error) {
      console.error(error);
      openNotification(error.action, error.reason);
    } finally {
      setGuessInfuraLoading(false);
    }
  };

  const revealViaWallet = async () => {
    try {
      setRevealWalletLoading(true);
      await reveal(gameContract, gameId, resultRate);
      await getCurrentGame(gameContract);
    } catch (error) {
      console.error(error);
      openNotification(error.action, error.reason);
    } finally {
      setRevealWalletLoading(false);
    }
  };

  const revealViaInfura = async () => {
    try {
      setRevealInfuraLoading(true);
      await reveal(gameContract, gameId, resultRate, signer);
      await getCurrentGame(gameContract, signer);
    } catch (error) {
      console.error(error);
      openNotification(error.action, error.reason);
    } finally {
      setRevealInfuraLoading(false);
    }
  };

  const connectViaWallet = async () => {
    try {
      setConnectWalletLoading(true);
      setLoading(true);
      await connect(gameContract);
      await getCurrentGame(gameContract);
      await getBalanceOfFundToken(gameContract);
    } catch (error) {
      console.error(error);
      openNotification(error.action, error.reason);
    } finally {
      setConnectWalletLoading(false);
      setLoading(false);
    }
  };

  const connectViaInfura = async () => {
    try {
      setConnectInfuraLoading(true);
      await connect(gameContract, signer);
      await getCurrentGame(gameContract, signer);
      await getBalanceOfFundToken(gameContract, signer);
    } catch (error) {
      console.error(error);
      openNotification(error.action, error.reason);
    } finally {
      setConnectInfuraLoading(false);
    }
  };

  // New game using either the Web3Provider or InfuraProvider
  const newGame = async (
    gameContract,
    name,
    currencyPair,
    rateUnixTime,
    startUnixTime,
    endUnixTime,
    fundPerGuessingInWei,
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
    const tx = await contract.newGame(
      name,
      currencyPair,
      rateUnixTime.unix(),
      startUnixTime.unix(),
      endUnixTime.unix(),
      ethers.parseUnits(fundPerGuessingInWei),
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
  const guess = async (gameContract, gameId, rate, signer) => {
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
    const tx = await contract.guess(
      gameId,
      rate.padEnd(rateDecimalPoints, "0")
    );
    console.log(await tx.wait());
  };

  // Reveal traget number using either the Web3Provider or InfuraProvider
  const reveal = async (gameContract, gameId, resultRate, signer) => {
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
    const tx = await contract.revealGame(
      gameId,
      resultRate.padEnd(rateDecimalPoints, "0")
    );
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
    const gameWinRates = await contract.getWinningRates(currentGameId);
    const playerAddresses = await contract.getPlayers(currentGameId);
    const rateDecimalPoints = await contract.rateDecimalPoints();
    const players = [];
    for (let i = 0; i < playerAddresses.length; i++) {
      let playerAddress = playerAddresses[i];
      let guessRates = await contract.getRatesByPlayer(
        currentGameId,
        playerAddress
      );
      players.push({
        address: playerAddress,
        rates: guessRates,
      });
    }
    setGameId(Number(currentGameId));
    setGame(game);
    setGameWinRates(gameWinRates);
    setPlayers(players);
    setRateDecimalPoints(Number(rateDecimalPoints));
  };

  const getBalanceOfFundToken = async (gameContract, signer = null) => {
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
    setBalance(
      ethers.formatUnits(await tokenContract.balanceOf(signer.address))
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

  const disconnect = () => {
    setBalance(null);
    setTokenSymbol(null);
    setAddress(null);
    setIsConnected(false);
  };

  // Configure the app frontend
  return (
    <>
      {contextHolder}
      <Box sx={{ display: "flex" }}>
        <AppBar component="nav">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              DApp Demo
            </Typography>
            {address && (
              <Box sx={{ flexGrow: 0 }}>
                <Chip
                  sx={{
                    "& .MuiChip-label": {
                      maxWidth: 80,
                    },
                  }}
                  avatar={<Avatar>{address.substring(2, 4)}</Avatar>}
                  label={address}
                  variant="outlined"
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                />
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem
                    key="disconnect"
                    onClick={() => {
                      setAnchorEl(null);
                      disconnect();
                    }}
                  >
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Disconnect
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Toolbar />
      <Container>
        <Box component="main" sx={{ p: 2, display: "grid", gap: 3 }}>
          {!isConnected && (
            <Box
              sx={{
                "& > button": { m: 1 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {window.ethereum && (
                <>
                  <LoadingButton
                    variant="contained"
                    onClick={connectViaWallet}
                    loading={connectWalletLoading}
                  >
                    Connect
                  </LoadingButton>
                </>
              )}

              <LoadingButton
                variant="outlined"
                onClick={connectViaInfura}
                loading={connectInfuralLoading}
                sx={{ display: "none" }}
              >
                Connect via Infura
              </LoadingButton>
            </Box>
          )}

          {balance && tokenSymbol && (
            <Typography variant="h6">
              Balance: {balance} {tokenSymbol}
            </Typography>
          )}

          {isConnected && (
            <>
              {game && gameWinRates && (
                <Card>
                  <CardHeader title="Game Info"></CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        {[
                          {
                            key: "id",
                            label: "ID",
                            children: Number(game.id),
                          },
                          {
                            key: "currencyPair",
                            label: "Currency Pair",
                            children: game.currencyPair,
                          },
                          {
                            key: "rateUnixTime",
                            label: "Rate Datetime",
                            children: dayjs
                              .unix(Number(game.rateUnixTime))
                              .format("YYYY-MM-DD HH:mm:ss"),
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
                            key: "fundPerGuessingInWei",
                            label: "Fund Per Guessing",
                            children: `${ethers.formatUnits(
                              game.fundPerGuessingInWei
                            )} ${tokenSymbol}`,
                          },
                          {
                            key: "totalFundInWei",
                            label: "Total Fund",
                            children: `${ethers.formatUnits(
                              game.totalFundInWei
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
                            key: "resultRate",
                            label: "Result Rate",
                            children: `${Number(game.resultRate)}`,
                          },
                          {
                            key: "numberOfGueses",
                            label: "Number Of Gueses",
                            children: `${Number(game.numberOfGueses)}`,
                          },
                          {
                            key: "gameWinRates",
                            label: "Winning Rates",
                            children: `${gameWinRates.join(",")}`,
                          },
                        ].map((row) => (
                          <TableRow key={row.key}>
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="right">{row.label}</TableCell>
                            <TableCell align="left">{row.children}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {players && (
                <Card>
                  <CardHeader title="Game Players"></CardHeader>
                  <CardContent>
                    <List>
                      {players.map((player) => (
                        <div key={player.address}>
                          <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                              <Avatar>{player.address.substring(2, 4)}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <React.Fragment>
                                  <Typography
                                    sx={{
                                      display: "inline",
                                      wordBreak: "break-word",
                                    }}
                                    component="span"
                                    variant="body2"
                                  >
                                    {player.address}
                                    {player.address === address && (
                                      <Chip
                                        label="Me"
                                        color="secondary"
                                        size="small"
                                        sx={{ ml: 1 }}
                                      />
                                    )}
                                    {gameWinRates.every((rate) =>
                                      player.rates.includes(rate)
                                    ) && (
                                      <Chip
                                        label="Winner"
                                        color="success"
                                        size="small"
                                        sx={{ ml: 1 }}
                                      />
                                    )}
                                  </Typography>
                                </React.Fragment>
                              }
                              secondary={
                                <React.Fragment>
                                  <Typography
                                    sx={{ display: "inline" }}
                                    component="span"
                                    variant="body2"
                                  >
                                    Guess Rate: {player.rates.join(",")}
                                  </Typography>
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </div>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}

              <Card hidden={!isOwner}>
                <CardHeader title="New Game"></CardHeader>
                <CardContent>
                  <Container maxWidth="sm">
                    <Box
                      component="form"
                      sx={{
                        "& .MuiTextField-root": {
                          my: 2,
                          minWidth: "100%",
                          maxWidth: 600,
                        },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        label="Name"
                        variant="outlined"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                      />
                      <TextField
                        label="Currency Pair"
                        variant="outlined"
                        value={currencyPair}
                        onChange={(event) =>
                          setCurrencyPair(event.target.value)
                        }
                      />
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          label="Rate Datetime"
                          format="YYYY-MM-DD HH:mm:ss"
                          views={[
                            "year",
                            "month",
                            "day",
                            "hours",
                            "minutes",
                            "seconds",
                          ]}
                          ampm={false}
                          value={rateUnixTime}
                          onChange={(date) => setRateUnixTime(date)}
                        />
                        <DateTimePicker
                          label="Start Datetime"
                          format="YYYY-MM-DD HH:mm:ss"
                          views={[
                            "year",
                            "month",
                            "day",
                            "hours",
                            "minutes",
                            "seconds",
                          ]}
                          ampm={false}
                          value={startUnixTime}
                          onChange={(date) => setStartUnixTime(date)}
                        />
                        <DateTimePicker
                          label="End Datetime"
                          format="YYYY-MM-DD HH:mm:ss"
                          views={[
                            "year",
                            "month",
                            "day",
                            "hours",
                            "minutes",
                            "seconds",
                          ]}
                          ampm={false}
                          value={endUnixTime}
                          onChange={(date) => setEndUnixTime(date)}
                        />
                      </LocalizationProvider>
                      <TextField
                        label="Fund Per Guessing"
                        variant="outlined"
                        type="number"
                        value={fundPerGuessingInWei}
                        onChange={(event) =>
                          setFundPerGuessingInWei(event.target.value)
                        }
                      />
                      <TextField
                        label="Reward Percentage"
                        variant="outlined"
                        type="number"
                        value={rewardPercentage}
                        onChange={(event) =>
                          setRewardPercentage(event.target.value)
                        }
                      />
                      <Box
                        sx={{
                          "& > button": { m: 1 },
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        {window.ethereum && (
                          <LoadingButton
                            variant="contained"
                            onClick={newGameViaWallet}
                            loading={newGameWalletLoading}
                          >
                            New Game
                          </LoadingButton>
                        )}
                        <LoadingButton
                          variant="outlined"
                          onClick={newGameViaInfura}
                          loading={newGameInfuralLoading}
                          sx={{ display: "none" }}
                        >
                          New Game via Infura
                        </LoadingButton>
                      </Box>
                    </Box>
                  </Container>
                </CardContent>
              </Card>

              <Card hidden={!isOwner}>
                <CardHeader title="Reveal Game"></CardHeader>
                <CardContent>
                  <Container maxWidth="sm">
                    <Box
                      component="form"
                      sx={{
                        "& .MuiTextField-root": {
                          my: 2,
                          minWidth: "100%",
                          maxWidth: 600,
                        },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        label="Game ID"
                        variant="outlined"
                        value={gameId}
                        onChange={(event) => setGameId(event.target.value)}
                      />
                      <TextField
                        label="Result Rate"
                        variant="outlined"
                        type="number"
                        value={resultRate}
                        onChange={(event) =>
                          setResultRate(
                            event.target.value
                              ? Math.max(0, parseInt(event.target.value))
                                  .toString()
                                  .slice(0, rateDecimalPoints)
                              : "0"
                          )
                        }
                      />
                      <Box
                        sx={{
                          "& > button": { m: 1 },
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        {window.ethereum && (
                          <LoadingButton
                            variant="contained"
                            onClick={revealViaWallet}
                            loading={revealWalletLoading}
                          >
                            Reveal
                          </LoadingButton>
                        )}
                        <LoadingButton
                          variant="outlined"
                          onClick={revealViaInfura}
                          loading={revealInfuralLoading}
                          sx={{ display: "none" }}
                        >
                          Reveal via Infura
                        </LoadingButton>
                      </Box>
                    </Box>
                  </Container>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Guess Rate"></CardHeader>
                <CardContent>
                  <Container maxWidth="sm">
                    <Box
                      component="form"
                      sx={{
                        "& .MuiTextField-root": {
                          my: 2,
                          minWidth: "100%",
                          maxWidth: 600,
                        },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        label="Game ID"
                        variant="outlined"
                        value={gameId}
                        onChange={(event) => setGameId(event.target.value)}
                      />
                      <TextField
                        label="Rate"
                        variant="outlined"
                        type="number"
                        value={rate}
                        onChange={(event) =>
                          setRate(
                            event.target.value
                              ? Math.max(0, parseInt(event.target.value))
                                  .toString()
                                  .slice(0, rateDecimalPoints)
                              : "0"
                          )
                        }
                      />
                      <Box
                        sx={{
                          "& > button": { m: 1 },
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        {window.ethereum && (
                          <Box
                            sx={{
                              "& > button": { m: 1 },
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <LoadingButton
                              variant="contained"
                              onClick={approveViaWallet}
                              loading={approveWalletLoading}
                            >
                              Approve
                            </LoadingButton>
                            <Link
                              href="https://community.trustwallet.com/t/what-is-token-approval/242764 "
                              target="_blank"
                              rel="noreferrer"
                            >
                              <HelpOutline />
                            </Link>
                          </Box>
                        )}
                        <LoadingButton
                          variant="outlined"
                          onClick={approveViaInfura}
                          loading={approveInfuralLoading}
                          sx={{ display: "none" }}
                        >
                          Approve via Infura
                        </LoadingButton>
                        {window.ethereum && (
                          <LoadingButton
                            variant="contained"
                            onClick={guessViaWallet}
                            loading={guessWalletLoading}
                          >
                            Guess
                          </LoadingButton>
                        )}
                        <LoadingButton
                          variant="outlined"
                          onClick={guessViaInfura}
                          loading={guessInfuralLoading}
                          sx={{ display: "none" }}
                        >
                          Guess via Infura
                        </LoadingButton>
                      </Box>
                    </Box>
                  </Container>
                </CardContent>
              </Card>
            </>
          )}
        </Box>
      </Container>
      <Backdrop sx={{ backgroundColor: "#00000080" }} open={loading}>
        <CircularProgress />
      </Backdrop>
    </>
  );
}

export default App;
