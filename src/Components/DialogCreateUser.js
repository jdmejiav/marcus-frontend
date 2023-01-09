import Alert from "@mui/material/Alert";
import axios from "axios";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import List from "@mui/material/List";
import MenuItem from "@mui/material/MenuItem";
import ListItem from "@mui/material/ListItem";
import Select from "@mui/material/Select";
import React, { useState } from "react";
import { Roles } from "../util/RolesDiagram";
import TextField from "@mui/material/TextField";

export default function DialogCreateUser(props) {

    const { open, onClose } = props
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")
    const [rol, setRol] = useState("")
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [message, setMessage] = useState("")


    return <Dialog open={open} onClose={onClose} maxWidth={false}>
        {success ? <Alert onClose={() => { setSuccess(false) }} severity="success">{message}</Alert> : undefined}
        {error ? <Alert onClose={() => { setError(false) }} severity="error">{message}</Alert> : undefined}
        <DialogTitle>
            Crear Usuario
        </DialogTitle>
        <DialogContent>
            <List sx={{ width: "25vw" }}>
                <ListItem>
                    <TextField fullWidth value={username} onChange={(e) => { setUsername(e.target.value) }} label="Usuario" variant="outlined" />
                </ListItem>
                <ListItem>
                    <TextField fullWidth value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" label="Contraseña" variant="outlined" />
                </ListItem>
                <ListItem>
                    <TextField fullWidth value={nombre} onChange={(e) => { setNombre(e.target.value) }} type="text" label="Nombre" variant="outlined" />
                </ListItem>
                <ListItem>
                    <TextField fullWidth value={apellido} onChange={(e) => { setApellido(e.target.value) }} type="text" label="Apellido" variant="outlined" />
                </ListItem>
                <ListItem>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Rol</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={rol}
                            label="Age"
                            onChange={(e) => {
                                setRol(e.target.value)
                            }}
                            fullWidth
                        >
                            {Object.keys(Roles).map((rol) => {
                                return <MenuItem value={rol} key={rol}>
                                    {rol}
                                </MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </ListItem>
            </List>
        </DialogContent>
        <DialogActions>
            <Button variant="contianed" sx={{
                color: "#fff",
                backgroundColor: "RGBA(255, 0, 0, 1)",
                "&:hover": {
                    backgroundColor: "RGBA(255,0,0,0.8)"
                }
            }} onClick={() => {
                setNombre("")
                setApellido("")
                setUsername("")
                setPassword("")
                onClose()
            }}>
                Cerrar
            </Button>
            <Button
                sx={{
                    color: "#fff",
                    backgroundColor: "RGBA(152, 208, 70, 1)",
                    "&:hover": {
                        backgroundColor: "RGBA(152, 208, 70, 0.8)"
                    }
                }}
                onClick={
                    async () => {
                        if (username === "" || password === "" || nombre === "" || apellido === "" || rol === "") {
                            setMessage("Debe llenar todos los campos")
                            setError(true)
                        } else {
                            await axios.post(`${process.env.REACT_APP_REST_BACKEND_URL}/register`, {
                                firstName: nombre,
                                lastName: apellido,
                                username: username,
                                password: password,
                                rol: rol
                            }).then((res) => {
                                const data = res.data;
                                if (data.success === true) {
                                    setMessage("Usuario Creado")
                                    setSuccess(true)
                                    setNombre("")
                                    setApellido("")
                                    setUsername("")
                                    setPassword("")
                                } else {
                                    setMessage("No se ha podido crear el usuario")
                                    setError(true)
                                }
                            })
                        }
                    }
                }
                variant="contianed"
            >
                Añadir
            </Button>
        </DialogActions>
    </Dialog>

}