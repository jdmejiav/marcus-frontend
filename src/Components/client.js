import React, { useState, useEffect } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket"
import { TextField, Button, Grid, IconButton, TableContainer, Table, TableBody, TableCell, tableCellClasses, TableHead, Paper, TableRow } from "@mui/material";
import { Container } from "@mui/system";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { styled } from '@mui/material/styles';



const client = new W3CWebSocket('ws://127.0.0.1.:8000')

export default function Client() {


    const [programacion, setProgramacion] = useState([])

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));


    const [userName, setUserName] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)


    const [customer, setCustomer] = useState("")
    const [edit, setEdit] = useState(true)

    useEffect(() => {
        client.onopen = () => {
            console.log("WebScoket Client connected");
        }
        client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);

            if (dataFromServer.destino == "customer") {

                setCustomer(dataFromServer.msg)
            }


        }

    })

    const sendMessage = (value, destino) => {
        client.send(JSON.stringify({
            type: "ci wenas",
            msg: value,
            destino: destino,
            userName: userName
        }))
    }


    const onButtonClicked = (value) => {
        client.send(JSON.stringify({
            type: "ci wenas",
            msg: value,
            userName: userName
        }))
    }
    const onLogin = (e) => {
        setIsLoggedIn(!isLoggedIn)
    }

    return (

        <div style={{ width: "100%", display: "flex", alignItems: "center", alignContent: "center", justifyContent: "center", justifyItems: "center", flexDirection: "column" }}>

            {!isLoggedIn ?
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} >

                    <Grid item xs={8}>
                        <TextField fullWidth value={userName} onChange={(e) => {
                            setUserName(e.target.value
                            )
                        }} placeholder="User Name" />
                    </Grid>
                    <Grid item xs={4}>
                        <Button sx={{ height: "100%" }} fullWidth variant="contained" onClick={() => { onLogin() }}>
                            Login
                        </Button>
                    </Grid>
                </Grid>
                :
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} >
                    <Grid item xs={4}>


                        {
                            edit ?


                                <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
                                    <TextField
                                        disabled={true}
                                        onChange={(e) => {
                                            setCustomer(e.target.value)

                                        }}
                                        value={customer}>
                                    </TextField>
                                    <IconButton color="inherit" sx={{ height: "50%", p: 0, m: 0 }} onClick={() => { setEdit(!edit) }}>
                                        <EditRoundedIcon />
                                    </IconButton>


                                </div>
                                :

                                <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
                                    <TextField
                                        onChange={(e) => {
                                            setCustomer(e.target.value)

                                        }}
                                        value={customer}>
                                    </TextField>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <IconButton color="inherit" sx={{ height: "50%", p: 0, m: 0 }} onClick={() => {
                                            sendMessage(customer, "customer")
                                            setEdit(!edit)
                                        }}>
                                            <SendRoundedIcon />
                                        </IconButton>
                                        <IconButton sx={{ height: "50%", p: 0, m: 0 }} onClick={() => { setEdit(!edit) }}>
                                            <CancelRoundedIcon />
                                        </IconButton>
                                    </div>
                                </div>
                        }
                    </Grid>
                </Grid>
            }
            <Paper sx={{ width: "80%", height: "800px", overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 800 }} component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">

                        <TableHead>
                            <TableRow>

                                <StyledTableCell>Date</StyledTableCell>
                                <StyledTableCell>Customer</StyledTableCell>
                                <StyledTableCell>Product</StyledTableCell>
                                <StyledTableCell>P.O </StyledTableCell>
                                <StyledTableCell>Dry Boxes</StyledTableCell>
                                <StyledTableCell>Pull_date</StyledTableCell>
                                <StyledTableCell>Wet pack</StyledTableCell>
                                <StyledTableCell>Work Order</StyledTableCell>
                                <StyledTableCell>Line</StyledTableCell>
                                <StyledTableCell>Priority</StyledTableCell>
                                <StyledTableCell>Assigned To</StyledTableCell>
                                <StyledTableCell>Made By</StyledTableCell>
                                <StyledTableCell>Order Status</StyledTableCell>
                                <StyledTableCell>Scan Status</StyledTableCell>
                                <StyledTableCell>Comment</StyledTableCell>
                                <StyledTableCell>Po Status</StyledTableCell>
                                <StyledTableCell>Hardgoods</StyledTableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>

                            {programacion.map((row, index_row) => {
                                return <StyledTableRow sx={{ p: 0, m: 0 }} key={index_row}>
                                    {Object.keys(row).map((key, idx_item) => {
                                        return <StyledTableCell sx={{ p: 0.2, m: 0.2 }} align="right"><TextField multiline onChange={(e) => {


                                        }} disabled={false} sx={{ p: 0, m: 0 }}></TextField></StyledTableCell>
                                    })}
                                </StyledTableRow>

                            })}


                        </TableBody>


                    </Table>
                </TableContainer>
            </Paper>

            <Button onClick={() => {


                const nuevo = {
                    "date": "",
                    "customer": "",
                    "product": "",
                    "po": "",
                    "dry_boxes": "",
                    "pull_date": "",
                    "wet_pack": "",
                    "work_order": "",
                    "line": "",
                    "priority": "",
                    "assigned_to": "",
                    "made_by": "",
                    "order_status": "",
                    "scan_status": "",
                    "comment": "",
                    "po_status": "",
                    "hardgoods": ""
                }



                setProgramacion([...programacion, nuevo]);


            }}> Add</Button>

            <Grid>

                <Grid>
                    {
                        programacion.map((row, idx_row) => {
                            Object.keys(row).map((item, idx_item) => {
                                return (
                                    <Grid>
                                        TextField    
                                    </Grid>
                                )
                            })
                        })
                    }
                </Grid>
            </Grid>




        </div>
    )


}
