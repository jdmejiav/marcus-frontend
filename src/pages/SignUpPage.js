import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Paleta from '../util/Pallete'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import Collapse from '@mui/material/Collapse'
import background from "../images/background.png";
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios'
import Typography from '@mui/material/Typography'

export default function SignUpPage() {
    useEffect(() => {
        if (localStorage.getItem("token") != null) {
            window.location.href = "/"
        }
    }, [])

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [openSuccess, setOpenSuccess] = useState(false)
    const [openFailed, setOpenFailed] = useState(false)
    const [message, setMessage] = useState("")
    const handleOnFirstNameChange = (e) => {
        setFirstName(e.target.value)
    }
    const handleOnLastNameChange = (e) => {
        setLastName(e.target.value)
    }
    const handleOnUsernameChange = (e) => {
        setUsername(e.target.value)
    }
    const handleOnPasswordChange = (e) => {
        setPassword(e.target.value)
    }


    const handleOnLogin = async () => {
        await axios.post("http://20.7.2.215:8080/register", {
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: password

        }).then((res) => {
            const data = res.data;
            console.log(res.data)
            if (data.success === true) {
                setMessage(data.message)
                setOpenSuccess(true)
                //window.location.href = "/"
                localStorage.setItem("token", data.token)
            } else {
                setMessage(data.message)
                setOpenFailed(true)
            }
        })


    }
    return (
        <Box
            sx={{
                height: "100vh",
                width: "100vw",
                backgroundColor: Paleta.azulOscuro,

            }} >
            <Box
                sx={{
                    '&': {
                        height: "100vh",
                        width: "100vw",
                        backgroundImage: `url(${background}) `,
                        backgroundSize: "100% auto",
                        backgroundRepeat: "no-repeat",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }
                }}
            >
                <Collapse in={openSuccess}>
                    <Alert
                        severity="success"
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setOpenSuccess(false);
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                    >
                        {message}
                    </Alert>
                </Collapse>
                <Collapse in={openFailed}>
                    <Alert
                        severity="error"
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setOpenFailed(false);
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                    >
                        {message}
                    </Alert>
                </Collapse>
                <Box sx={{
                    borderRadius: "30px",
                    width: "25vw",
                    padding: "3rem",
                    backgroundColor: "rgba(0,0,0,0.2)",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: "1.5rem",
                }}>
                    <form onSubmit={(event) => {
                        event.preventDefault()
                        handleOnLogin();
                    }}>
                        <TextField
                            sx={{
                                marginTop: 1.5,
                                "& input": { color: "#fff" },
                                "& label": {
                                    color: "white"
                                },
                                "& label.Mui-focused": {
                                    color: "white"
                                },
                                "& .MuiInput-underline:after": {
                                    borderBottomColor: "white"
                                },
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "white"
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "white",
                                        borderWidth: 2
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "white"
                                    }
                                },
                                "& .css-1a1fmpi-MuiInputBase-root-MuiInput-root:before ": {
                                    borderBottom: "1px solid rgba(255, 255, 255, 0.42);"
                                },
                                "& .css-1a1fmpi-MuiInputBase-root-MuiInput-root:hover ": {
                                    borderBottom: "1px solid rgba(255, 255, 255, 0.65);"
                                }
                            }} fullWidth id="nombre-input" type="text" label="Nombre" variant="standard" value={firstName} onChange={handleOnFirstNameChange} />

                        <TextField
                            sx={{
                                marginTop: 1.5,
                                "& input": { color: "#fff" },
                                "& label": {
                                    color: "white"
                                },
                                "& label.Mui-focused": {
                                    color: "white"
                                },
                                "& .MuiInput-underline:after": {
                                    borderBottomColor: "white"
                                },
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "white"
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "white",
                                        borderWidth: 2
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "white"
                                    }
                                },
                                "& .css-1a1fmpi-MuiInputBase-root-MuiInput-root:before ": {
                                    borderBottom: "1px solid rgba(255, 255, 255, 0.42);"
                                },
                                "& .css-1a1fmpi-MuiInputBase-root-MuiInput-root:hover ": {
                                    borderBottom: "1px solid rgba(255, 255, 255, 0.65);"
                                }
                            }} fullWidth id="apellido-input" type="text" label="Apellido" variant="standard" value={lastName} onChange={handleOnLastNameChange} />
                        <TextField
                            sx={{
                                marginTop: 1.5,
                                "& input": { color: "#fff" },
                                "& label": {
                                    color: "white"
                                },
                                "& label.Mui-focused": {
                                    color: "white"
                                },
                                "& .MuiInput-underline:after": {
                                    borderBottomColor: "white"
                                },
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "white"
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "white",
                                        borderWidth: 2
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "white"
                                    }
                                },
                                "& .css-1a1fmpi-MuiInputBase-root-MuiInput-root:before ": {
                                    borderBottom: "1px solid rgba(255, 255, 255, 0.42);"
                                },
                                "& .css-1a1fmpi-MuiInputBase-root-MuiInput-root:hover ": {
                                    borderBottom: "1px solid rgba(255, 255, 255, 0.65);"
                                }
                            }} fullWidth id="username-input" type="text" label="Username" variant="standard" value={username} onChange={handleOnUsernameChange} />
                        <TextField
                            sx={{
                                marginTop: 1.5,
                                "& input": { color: "#fff" },
                                "& label": {
                                    color: "white"
                                },
                                "& label.Mui-focused": {
                                    color: "white"
                                },
                                "& .MuiInput-underline:after": {
                                    borderBottomColor: "white"
                                },
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "white"
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "white",
                                        borderWidth: 2
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "white"
                                    }
                                },
                                "& .css-1a1fmpi-MuiInputBase-root-MuiInput-root:before ": {
                                    borderBottom: "1px solid rgba(255, 255, 255, 0.42);"
                                },
                                "& .css-1a1fmpi-MuiInputBase-root-MuiInput-root:hover ": {
                                    borderBottom: "1px solid rgba(255, 255, 255, 0.65);"
                                }
                            }} fullWidth id="password-input" type="password" label="Password" variant="standard" value={password} onChange={handleOnPasswordChange} />
                        <input type="submit" style={{ display: "none" }} value="Submit" />
                        <Button onClick={handleOnLogin} sx={{ backgroundColor: "#fff", color: "#000", marginTop: "2rem", paddingTop: "1rem", paddingBottom: "1rem" }} fullWidth variant="contained">Sign Up</Button>
                    </form>
                </Box>
                <Typography sx={{ color: "white" }}>© By Bouquet Collection</Typography>
            </Box>
        </Box>)
}