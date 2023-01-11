import React from "react";
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Typography } from "@mui/material";



export default function DialogConfirmNewDay(props) {

    const { open, onClose, handleOnNewDay } = props

    return <Dialog onClose={onClose} maxWidth={false} open={open}>

        <DialogContent>

            <Box style={{ paddingTop: 10 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignContent: "center", justifyContent: "center" }}>
                    <WarningAmberRoundedIcon style={{ height: "100px", width: "auto", color: "#ff0000" }} />
                    <Typography variant="h4" fontWeight={200} >¿Estás seguro que deseas cambiar de día?</Typography>
                </div>
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
                        variant="contianed" onClick={handleOnNewDay}>
                        Cambiar de día
                    </Button>
                </DialogActions>

            </Box>
        </DialogContent>
    </Dialog>
}