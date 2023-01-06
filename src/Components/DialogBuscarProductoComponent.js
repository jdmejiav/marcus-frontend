import React from "react";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";


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

    return (
        <Dialog maxWidth={false} onClose={onClose} open={open}>
            <DialogTitle>{product}</DialogTitle>
            <DialogContent>


                {items === undefined ? <></> :
                    product.split(", ").map(productName => (
                        items[productName] !== undefined ?
                            <Grid key={productName} item style={{ margin: 10, display: "flex", flexDirection: "row", overflow: "auto" }} xs={12}>
                                {
                                    Object.keys(items[productName]).map((name, idx) => {
                                        return (
                                            <List key={idx}>
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
                            </Grid> : <></>))
                }

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

            </DialogContent>
        </Dialog>
    )
}