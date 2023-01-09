import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import Paleta from "../util/Pallete";
import AddIcon from '@mui/icons-material/Add'
import Fab from '@mui/material/Fab';
import DialogCreateUser from "../Components/DialogCreateUser";
import DialogEditUser from "../Components/DialogEditUser";

/**
 * Page to see and edit the wetpacks recipes
 */

const AdminUsersPage = () => {

    const [users, setUsers] = useState(undefined)
    const [dialogAddUser, setDialogAddUser] = useState(false)
    const [dialogEditUser, setDialogEditUser] = useState(false)
    const [username, setUsername] = useState("")
    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")
    const [rol, setRol] = useState("")
    const [usernameTemp, setUsernameTemp] = useState()
    useEffect(() => {
        getUsuarios()
        if (localStorage.getItem("token") != null) {
            if (localStorage.getItem("rol") !== "admin") {
                window.location.href = "/"
            }
        }

    }, [])
    const getUsuarios = async () => {

        const data = await axios.get(`${process.env.REACT_APP_REST_BACKEND_URL}/allUsers`).then(res => res.data).catch(err => console.log(err))
        setUsers(data)

    }

    return <Box sx={{ m: 4 }}>
        <DialogCreateUser open={dialogAddUser} onClose={() => {
            setDialogAddUser(false)
            setUsername("")
            setNombre("")
            setApellido("")
            setRol("")
        }} />
        <DialogEditUser open={dialogEditUser} onClose={() => {
            setUsername("")
            setNombre("")
            setApellido("")
            setRol("")
            setDialogEditUser(false)
        }} username={username} nombre={nombre} apellido={apellido} rol={rol} usernameTemp={usernameTemp}
            setUsername={(e) => { setUsername(e.target.value) }}
            setNombre={(e) => { setNombre(e.target.value) }}
            setApellido={(e) => { setApellido(e.target.value) }}
            setRol={(e) => { setRol(e.target.value) }}
            onEditUser={() => {
                setUsername("")
                setNombre("")
                setApellido("")
                setRol("")
            }} />
        {
            users === undefined ?
                <></>
                :
                <Grid container spacing={4}>
                    {users.map((res, idx) =>
                        <Grid key={idx} item xs={3}>
                            <Card>
                                <CardHeader
                                    title={res.nombre}
                                    action={
                                        <>
                                            <IconButton
                                                onClick={() => {
                                                    setUsernameTemp(res.username)
                                                    setUsername(username)
                                                    setNombre(nombre)
                                                    setApellido(apellido)
                                                    setRol(rol)
                                                    setDialogEditUser(true)
                                                }}
                                                aria-label="settings">
                                                <EditRoundedIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={async () => {
                                                    await axios.delete(`${process.env.REACT_APP_REST_BACKEND_URL}/deleteUser/${res._id}`).then(res => {
                                                        window.location.reload()
                                                        return res.data
                                                    })
                                                }}
                                                aria-label="settings">
                                                <DeleteRoundedIcon />
                                            </IconButton>
                                        </>
                                    } />
                                <CardContent>
                                    <List>
                                        <ListItem>
                                            <ListItemText>
                                                <b>Usuario:</b> {res.username} <br />
                                                <b>Nombre:</b> {res.nombre}<br />
                                                <b>Apellido:</b> {res.apellido}
                                            </ListItemText>
                                        </ListItem>
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>)}
                </Grid>
        }
        <div style={{
            position: "sticky",
            bottom: 10
        }}>
            <Fab
                onClick={() => setDialogAddUser(true)}
                sx={{ backgroundColor: Paleta.azulOscuro }}
                style={{
                    marginRight: "1rem"
                }} color="primary" aria-label="add">
                <AddIcon />
            </Fab>
        </div>
    </Box >
}

export default AdminUsersPage