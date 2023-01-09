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

export default function DialogEditUser(props) {

    const { open, onClose, username, nombre, apellido, rol, setUsername, setNombre, setApellido, setRol, onEditUser, usernameTemp } = props
    const [password, setPassword] = useState("")
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [message, setMessage] = useState("")


    return <Dialog open={open} onClose={onClose} maxWidth={false}>
        {success ? <Alert onClose={() => { setSuccess(false) }} severity="success">{message}</Alert> : undefined}
        {error ? <Alert onClose={() => { setError(false) }} severity="error">{message}</Alert> : undefined}

        <DialogTitle>
            Editar Usuario {usernameTemp}
        </DialogTitle>
        <DialogContent>
            <List sx={{ width: "25vw" }}>
                <ListItem>
                    <TextField fullWidth value={username} onChange={setUsername} label="Usuario" variant="outlined" />
                </ListItem>
                <ListItem>
                    <TextField fullWidth value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" label="Contraseña" variant="outlined" />
                </ListItem>
                <ListItem>
                    <TextField fullWidth value={nombre} onChange={setNombre} type="text" label="Nombre" variant="outlined" />
                </ListItem>
                <ListItem>
                    <TextField fullWidth value={apellido} onChange={setApellido} type="text" label="Apellido" variant="outlined" />
                </ListItem>
                <ListItem>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Rol</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={rol}
                            label="Age"
                            onChange={setRol}
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
            }} onClick={onClose}>
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
                onClick={async () => {
                    let bodyTemp = {
                        username: username,
                        nombre: nombre,
                        apellido: apellido,
                        rol: rol
                    }
                    if (password !== "") {
                        bodyTemp["password"] = password
                    }
                    await axios.post(`${process.env.REACT_APP_REST_BACKEND_URL}/updateUser/${usernameTemp}`, bodyTemp).then(res => {
                        window.location.reload();
                        return res.data
                    }).catch(e => {
                        setMessage("Falló la actualización del usuario")
                        setError(true)
                        console.log(e)
                    })
                    onEditUser()
                }}
                variant="contianed"
            >
                Editar
            </Button>
        </DialogActions>
    </Dialog>

}