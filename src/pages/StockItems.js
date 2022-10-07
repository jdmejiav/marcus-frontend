
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Grid, Typography, List, ListItem, CircularProgress } from "@mui/material";
export default function StockItems() {

    const [items, setItems] = useState(undefined)

    useEffect(() => {
        console.log(items != undefined)
        getItems()

    }, [])

    const getItems = async () => {
        await axios.get("http://localhost:8080/Inventory/GetProductInventoryHistory/getProducts", { headers: { "Access-Control-Allow-Origin": "*" } }).then((res) => {
            setItems(res.data)
        })
    
    }

    return (
        <>
            {
                
                items != undefined ? 
                
                <Grid container spacing={2}>
                {
                Object.keys(items).map((item) => {
                    return (

                        <Grid item style={{margin:10}} xs={12}>
                            <Card style={{ display: "flex", flexDirection: "row", overflow: "auto" }}>
                                <List>
                                    <ListItem>
                                        <Typography>
                                            {item}
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography>
                                            Total Cajas: {items[item].numBoxes}
                                        </Typography>
                                    </ListItem>
                                </List>

                                {
                                    items[item].poDetails.map((detail) => {
                                        return (
                                            <List>
                                                <ListItem>PO: {detail.po}</ListItem>
                                                <ListItem>Age: {detail.age}</ListItem>
                                                <ListItem># Cajas: {detail.numBoxes}</ListItem>
                                                <ListItem>Tipo Caja: {detail.boxType}</ListItem>
                                            </List>
                                        )
                                    })
                                }

                            </Card>
                        </Grid>

                    )
                })}
                </Grid> : <div style={{display:"flex", flexDirection:"row", justifyContent:"center"}}><CircularProgress></CircularProgress></div>
            }



</>
    )




}