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
import { Logout } from "@mui/icons-material";

function App() {
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [address, setAddress] = useState();
  const [game, setGame] = useState();
  const [gameWinNumbers, setGameWinNumbers] = useState();
  const [players, setPlayers] = useState();
  const [tokenSymbol, setTokenSymbol] = useState();

  const [network] = useState(process.env.REACT_APP_API_NETWORK);
  const [apiKey] = useState(process.env.REACT_APP_API_KEY);
  const [privateKey] = useState(process.env.REACT_APP_PRIVATE_KEY);
  const [tokenContract] = useState(process.env.REACT_APP_TOKEN_CONTRACT);
  const [gameContract] = useState(process.env.REACT_APP_GAME_CONTRACT);
  const [amount] = useState("100");

  const [balance, setBalance] = useState();

  const [targetNumber, setTargetNumber] = useState("20");
  const [greeting, setGreeting] = useState("Hello World");
  const [name, setName] = useState("Guess Game");
  const [startUnixTime, setStartUnixTime] = useState(dayjs());
  const [endUnixTime, setEndUnixTime] = useState(dayjs());
  const [fundPerGuessing, setFundPerGuessing] = useState("10");
  const [rewardPercentage, setRewardPercentage] = useState("10");

  const [gameId, setGameId] = useState("1001");
  const [number, setNumber] = useState("20");

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
      await guess(gameContract, gameId, number);
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
      await guess(gameContract, gameId, number, signer);
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
      await reveal(gameContract, gameId, number, greeting);
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
      await reveal(gameContract, gameId, number, greeting, signer);
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
    setGameId(Number(currentGameId));
    setGame(game);
    setGameWinNumbers(gameWinNumbers);
    setPlayers(players);
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
                    Connect via Wallet
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
              {game && gameWinNumbers && (
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
                    <List
                      sx={{
                        width: "100%",
                        maxWidth: 360,
                        bgcolor: "background.paper",
                      }}
                    >
                      {players.map((player) => (
                        <div key={player}>
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
                                    Guess Number: {player.number}
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
                        label="Target Number"
                        variant="outlined"
                        type="number"
                        value={targetNumber}
                        onChange={(event) =>
                          setTargetNumber(event.target.value)
                        }
                      />
                      <TextField
                        label="Greeting"
                        variant="outlined"
                        value={greeting}
                        onChange={(event) => setGreeting(event.target.value)}
                      />
                      <TextField
                        label="Name"
                        variant="outlined"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                      />
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                        value={fundPerGuessing}
                        onChange={(event) =>
                          setFundPerGuessing(event.target.value)
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
                            New Game via Wallet
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
                        label="Greeting"
                        variant="outlined"
                        value={greeting}
                        onChange={(event) => setGreeting(event.target.value)}
                      />
                      <TextField
                        label="Target Number"
                        variant="outlined"
                        type="number"
                        value={targetNumber}
                        onChange={(event) =>
                          setTargetNumber(event.target.value)
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
                            Reveal via Wallet
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
                <CardHeader title="Guess Number"></CardHeader>
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
                        label="Number"
                        variant="outlined"
                        type="number"
                        value={number}
                        onChange={(event) => setNumber(event.target.value)}
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
                            onClick={approveViaWallet}
                            loading={approveWalletLoading}
                          >
                            Approve via Wallet
                          </LoadingButton>
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
                            Guess via Wallet
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
