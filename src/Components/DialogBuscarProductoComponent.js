import React from "react";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Grid";
import DialogTitle from "@mui/material/Grid";
import DialogContent from "@mui/material/Grid";
import List from "@mui/material/Grid";
import ListItem from "@mui/material/Grid";
import DialogActions from "@mui/material/Grid";
import Button from "@mui/material/Grid";

/**
 * 
 * @param {{
 * open: boolean
 * onClose: function
 * product: string
 * items: object
 * }} props Props for the application
 * @returns 
 */
export default function DialogBuscarProductoComponent(props) {

    const { open, onClose, product, items } = props

    return <Dialog maxWidth={false} onClose={onClose} open={open}>
        <DialogTitle>{product}</DialogTitle>
        <DialogContent>
            {items === undefined ? <></> :
                product.split(", ").map(productName => (
                    items[productName] !== undefined ?
                        <Grid key={productName} item style={{ margin: 10, display: "flex", flexDirection: "row", overflow: "auto" }} xs={12}>
                            {
                                Object.keys(items[productName]).map((name) => {
                                    return (
                                        <List key={name}>
                                            <ListItem key="po">PO: {items[productName][name].po}</ListItem>
                                            <ListItem key="boxType">Tipo: {items[productName][name].boxType}</ListItem>
                                            <ListItem key="age">Age: {items[productName][name].age}</ListItem>
                                            <ListItem key="cajas"># Cajas: {items[productName][name].numBoxes}</ListItem>
                                            <ListItem key="pack"># Pack: {items[productName][name].pack}</ListItem>
                                            <ListItem key="reference">Reference: {items[productName][name].reference}</ListItem>
                                        </List>
                                    )
                                })

                            }
                        </Grid> : undefined))
            }
            <DialogActions>
                <Button sx={{
                    color: "#fff",
                    backgroundColor: "RGBA(255, 0, 0, 1)",
                    "&:hover": {
                        backgroundColor: "RGBA(255,0,0,0.8)"
                    }
                }} onClick={onClose}>
                    Cerrar
                </Button>
            </DialogActions>
        </DialogContent>
    </Dialog>
}