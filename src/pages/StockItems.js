
import React, { useState, useEffect } from "react";
import { Card, Grid, Typography, List, ListItem, CircularProgress } from "@mui/material";
export default function StockItems() {


    const [items, setItems] = useState(undefined)

    useEffect(() => {
        
        getItems()

    }, [])

    const getItems = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Cache-Control", "no-cache");
        myHeaders.append("Ocp-Apim-Subscription-Key", "67a39b7b8bbe4581aed70a1f2562a784");
        myHeaders.append("Access-Control-Allow-Origin", "*");

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        await fetch("/Inventory/GetProductInventoryHistory/BQC/0", requestOptions)
            .then((res) => {
                const { data } = res;

                const customers = {}
                const products = {}
                data.forEach((val) => {
                    if (!(val.customer in customers)) {
                        customers[val.customer] = "1"
                    }
                    if (val.name in products) {
                        products[val.name] = {
                            poDetails: val.poDetails.push({
                                po: val.poId,
                                age: val.age,
                                numBoxes: val.boxes,
                                boxType: val.boxCode,
                                customer: val.customer
                            }),
                            name: val.name,
                            numBoxes: Number.parseInt(products[val.name].numBoxes) + Number.parseInt(val.name.boxes)
                        }
                    } else {
                        products[val.name] = {
                            poDetails: [{
                                po: val.poId,
                                age: val.age,
                                numBoxes: val.boxes,
                                boxType: val.boxCode,
                                customer: val.customer
                            }],
                            name: val.name,
                            numBoxes: Number.parseInt(val.name.boxes)
                        }
                    }

                })


                setItems(products)
                

            })
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

    }

    return (
        <>
            {

                items !== undefined ?

                    <Grid container spacing={2}>
                        {
                            Object.keys(items).map((item) => {
                                return (

                                    <Grid item style={{ margin: 10 }} xs={12}>
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
                    </Grid> : <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}><CircularProgress></CircularProgress></div>
            }



        </>
    )




}