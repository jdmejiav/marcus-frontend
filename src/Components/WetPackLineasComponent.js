import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { productivities } from "../util/Productivities";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

/**
 * 
 * @param {{
 *  open boolean
 *  onClose function
 *  rows array
 *  workOrders object
 * }} props 
 * @returns 
 */
export default function WetPackLineasComponent(props) {
    const { open, onClose, rows, workOrders } = props
    const [wetPacks, setSetWetPacks] = useState({})
    const [lineProduction, setLineProduction] = useState({
        "línea 1": 0,
        "línea 2": 0,
        "línea 3": 0,
        "línea 4": 0,
        "línea 5": 0,
        "Vase L1": 0,
        "Vase L2": 0,
        "Línea 10 (eComerce)": 0,
    })
    const handleLineStatistics = () => {
        const tempLineProdcution = {
            "LINE 1": 0,
            "LINE 2": 0,
            "LINE 3": 0,
            "LINE 4": 0,
            "LINE 5": 0,
            "Vase L1": 0,
            "Vase L2": 0,
            "LINE 10 (eComerce)": 0,
        }
        rows.forEach(row => {
            if (row.wo !== "" && row.wo in workOrders) {
                console.log(row.wo + "   " + workOrders[row.wo].task)
                tempLineProdcution[row.line] = (tempLineProdcution[row.line] === undefined ? 0 : tempLineProdcution[row.line]) + (Number(workOrders[row.wo].boxes) / productivities[workOrders[row.wo].task])
            }
        })
        setLineProduction(tempLineProdcution)
    }
    useEffect(() => {
        handleLineStatistics()
        let tempWetpack = {}
        rows.forEach(row => {
            if (row.line !== "") {
                tempWetpack[row.line] = tempWetpack[row.line] === undefined ? row.wet_pack : tempWetpack[row.line] + row.wet_pack
            }
        })
        console.log(tempWetpack)
        console.log(typeof open)
        setSetWetPacks(tempWetpack)
    }, [open])
    return <Dialog maxWidth={false} onClose={onClose} open={open}>
        <DialogTitle>
            # Wetpack Líneas
        </DialogTitle>
        <DialogContent>
            <Stack sx={{
                "&": {
                    flexDirection: "row"
                }
            }}>
                {Object.keys(wetPacks).sort().map(line => (<></>))}
            </Stack>
            <Divider sx={{ marginBottom: 3 }}></Divider>
            <Typography>Estimación horas:</Typography>
            <Stack sx={{
                "&": {
                    flexDirection: "row"
                }
            }}>
                {
                    Object.keys(lineProduction).sort().map(key => {
                        return <ListItem item key={key} xs={6}>
                            <ListItemText>
                                <b>{key}</b>: {Math.round(lineProduction[key]).toString().padStart(2, '0')}:{(Math.round((lineProduction[key] - Math.round(lineProduction[key])) * 60)).toString().padStart(2, '0')} H
                            </ListItemText>
                        </ListItem>
                    })
                }
            </Stack>
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

        </DialogActions>
    </Dialog>
}