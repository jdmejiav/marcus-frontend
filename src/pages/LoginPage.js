import React, { useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Paleta from '../util/Pallete'
import Button from '@mui/material/Button'
import background from "../images/background.png";
import axios from 'axios'

export default function LoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleOnUsernameChange = (e) => {
        setUsername(e.target.value)
    }
    const handleOnPasswordChange = (e) => {
        setPassword(e.target.value)
    }
    const handleOnLogin = async () => {

        const data = await axios.post("http://20.7.2.215:8080/login", {
            username: username,
            password: password
        })
        if (data.data.message === true){
            window.location.href="/"
        }

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
                    <form>
                        <TextField
                            sx={{
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
                            }} fullWidth id="username-input" type="text" label="User Name" variant="standard" value={username} onChange={handleOnUsernameChange} />
                        <TextField
                            sx={{
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
                        <Button onClick={handleOnLogin} sx={{ backgroundColor: "#fff", color: "#000", marginTop: "2rem", paddingTop: "1rem", paddingBottom: "1rem" }} fullWidth variant="contained">Sign In</Button>
                    </form>
                </Box>
            </Box>
        </Box>)
}