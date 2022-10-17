import React, { useState, useEffect } from "react"
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import OutlinedInput from "@mui/material/OutlinedInput";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from '@mui/material/FormControl';
import InputLabel from "@mui/material/InputLabel";
import { DataGrid } from "@mui/x-data-grid";
import { w3cwebsocket as W3CWebSocket } from "websocket"
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import moment from "moment";
import Button from "@mui/material/Button";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add'
import Paleta from "../util/Pallete";



const client = new W3CWebSocket('ws://20.7.2.215:8000')


export default function PlaneacionPage() {

    // States Definition

    const [customers, setCustomers] = useState([])

    const [dialogAdd, setDialogAdd] = useState(false)
    const [dialogBuscar, setDialogBuscar] = useState(false)

    const [items, setItems] = useState(undefined)

    const [newCustomer, setNewCustomer] = useState("")


    const [newProduct, setNewProduct] = useState("")

    const [rows, setRows] = useState([])

    const [tempItem, setTempItem] = useState()




    // UseEffect definitions

    useEffect(() => {

        getItems()
    }, [])


    useEffect(() => {
        client.onopen = () => {
            console.log("WebScoket Client connected");
            fetchContent()
        }
        client.onmessage = (message) => {
            console.log(message)
            const dataFromServer = JSON.parse(message.data);

            if (dataFromServer["type"] === 'conn') {
                if (dataFromServer.data !== undefined) {
                    setRows(dataFromServer.data)
                }

            } else if (dataFromServer["type"] === 'update') {

                let row = dataFromServer["row"]
                let copy = [...rows]
                copy[row] = dataFromServer.data
                setRows(copy)
            } else if (dataFromServer["type"] === 'add') {
                let copy = [...rows]
                if (dataFromServer["row"] >= rows.length) {
                    copy.push(dataFromServer.data)
                    setRows(copy)
                }
            } else if (dataFromServer["type"] === 'delete') {
                console.log("se hace update de")
                console.log(dataFromServer["data"])
                setRows(dataFromServer["data"])
            }
        }
    })


    const fetchContent = () => {
        client.send(JSON.stringify({
            type: "conn"
        }))
    }

    const handleOnRowChange = (e) => {

        let copy = [...rows]

        copy[e.id - 1][e.field] = e.value

        if (e.field === "product") {
            copy[e.id - 1]["po"] = []
            copy[e.id - 1]["poDescription"] = {}
        }

        setRows(copy)
        console.log(rows)
        client.send(
            JSON.stringify({
                type: "update",
                data: copy[e.id - 1],
                row: e.id - 1
            })
        )
    }

    const updateDry = (row) => {
        let copy = [...rows]

        let cajas = rows[row].poDescription


        let count = {}

        Object.keys(cajas).map((key) => (
            count[key.charAt(key.length - 1)] = (count[key.charAt(key.length - 1)] === undefined ? Number.parseInt(cajas[key]) : Number.parseInt(count[key.charAt(key.length - 1)]) + Number.parseInt(cajas[key]))
        ))

        copy[row].dry_boxes = count
        setRows(copy)

    }

    const columns = [
        { field: 'id', headerName: '#', width: 20, hideable: true },
        {
            width: 125, field: "actions", headerName: "Acciones", sortable: false, renderCell: (params) => {
                return (
                    <>
                        <IconButton sx={{ color: "#000000" }} onClick={(e) => {
                            sendDeleteItem(params.row.id)
                        }
                        }>
                            <DeleteRoundedIcon style={{ color: "#FF0000" }} ></DeleteRoundedIcon>
                        </IconButton>
                        <IconButton onClick={(e) => {
                            console.log(params)
                            setTempItem(params.row.product)
                            setDialogBuscar(true)
                        }}>
                            <SearchRoundedIcon style={{ color: "#00ADFF" }}></SearchRoundedIcon>
                        </IconButton>
                    </>
                )
            }
        },
        {
            width: 110, field: "date", headerName: "Date", type: 'date', sortable: true, editable: true, valueFormatter: params =>
                moment(params.value).format("DD/MM/YYYY"),
        },
        { width: 110, field: "customer", headerName: "Customer", sortable: true, editable: true, type: "singleSelect", valueOptions: customers },
        { width: 250, field: "product", headerName: "Product", sortable: true, editable: true, type: "singleSelect", valueOptions: Object.keys(items === undefined ? {} : items) },
        {
            width: 250, field: "po", sortable: false, headerName: "P.O.", renderCell: (params) => {
                const [pos, setPos] = useState(rows[params.row.id - 1] === undefined ? [] : rows[params.row.id - 1].po)
                useEffect(() => {
                    setPos(rows[params.row.id - 1] === undefined ? [] : rows[params.row.id - 1].po)
                }, [rows])


                const handleChange = (event) => {
                    const {
                        target: { value },
                    } = event;
                    let copy = rows
                    setPos(
                        // On autofill we get a stringified value.
                        typeof value === 'string' ? value.splvalue.split(',') : value
                    );
                    // Add items that are on POs Columns but not in te PO Details (When adding items)
                    let copyPoDetails = copy[params.row.id - 1].poDescription;
                    for (var key of (typeof value === 'string' ? value.splvalue.split(',') : value)) {

                        if (!Object.keys(copy[params.row.id - 1].poDescription).includes(key)) {
                            copyPoDetails[key] = 0
                        }
                    }

                    // Remove elements that are not on the POs Column but are on PO Details Column (when deleting items)
                    let finalCopy = Object.fromEntries(value.map((key) => [key, copyPoDetails[key]]))
                    copy[params.row.id - 1].po = value
                    copy[params.row.id - 1].poDescription = finalCopy
                    setRows(copy)
                    updateDry(params.row.id - 1)
                    client.send(
                        JSON.stringify({
                            type: "update",
                            data: copy[params.row.id - 1],
                            row: params.row.id - 1
                        })
                    )



                };



                return (


                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="demo-multiple-chip-label">P.Os</InputLabel>
                        <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={pos}
                            onChange={handleChange}
                            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                        >

                            {items === undefined ? <MenuItem value=""></MenuItem> :
                                (items[params.row.product] === undefined ? <MenuItem value=""></MenuItem> :
                                    items[params.row.product].poDetails.map((name) =>

                                    (<MenuItem
                                        key={name.po + " " + name.numBoxes + name.boxType}
                                        value={name.po + " " + name.numBoxes + name.boxType}
                                    >
                                        <ListItemText key={name.po + " " + name.numBoxes + name.boxType}>{name.po + " " + name.numBoxes + name.boxType}</ListItemText>
                                    </MenuItem>)
                                    ))
                            }
                        </Select>
                    </FormControl>


                )


            },
        },
        {
            width: 250, field: "poDescription", headerName: "P.O. Description", sortable: false, renderCell: (params) => {

                return (
                    rows[params.row.id - 1] === undefined ? <></> :
                        <List>
                            {
                                Object.keys(rows[params.row.id - 1].poDescription).map((key) => {

                                    const handleOnPONumberChange = (e) => {
                                        let copy = [...rows]


                                        const boxesTemp = key.split(" ");

                                        let maxBoxes = + Number.parseInt(boxesTemp[1].substring(0, boxesTemp[1].length - 1))


                                        console.log(maxBoxes)

                                        if ((Number.parseInt(e.target.value) <= Number.parseInt(maxBoxes) && Number.parseInt(e.target.value) >= 0) || e.target.value === '') {
                                            copy[params.row.id - 1].poDescription[key] = (e.target.value === '' ? 0 : Number.parseInt(e.target.value))
                                        }
                                        setRows(copy)
                                        updateDry(params.row.id - 1)
                                    }

                                    const updateRow = (e) => {

                                        let copy = [...rows]
                                        client.send(
                                            JSON.stringify({
                                                type: "update",
                                                data: copy[params.row.id - 1],
                                                row: params.row.id - 1
                                            })
                                        )
                                    }

                                    return <MenuItem>
                                        <Grid container spacing={4}>
                                            <Grid sx={{ p: 0, m: 0 }} item xs={6}>
                                                <TextField sx={{ p: 0, m: 0 }} type="number" onBlur={updateRow} onChange={handleOnPONumberChange} value={rows[params.row.id - 1].poDescription[key]} fullWidth />
                                            </Grid>
                                            <Grid sx={{ p: 0, m: 0 }} item xs={6}
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <Typography sx={{ p: 0, m: 0 }}>{" "}{key}:</Typography>
                                            </Grid>
                                        </Grid>



                                    </MenuItem>
                                })}
                        </List>
                )



            }
        },
        {
            width: 110, field: "dry_boxes", headerName: "Dry Boxes",

            renderCell: (params) => (

                <List>
                    {
                        rows[params.row.id - 1] === undefined ?
                            <></> :
                            Object.keys(rows[params.row.id - 1].dry_boxes).map((key) => (<Typography>{rows[params.row.id - 1].dry_boxes[key]}{key}</Typography>))
                    }
                </List>

            )

        },
        {
            width: 110, field: "pull_date", headerName: "Pull Date", type: "date", editable: true, valueFormatter: params =>
                moment(params.value).format("DD/MM/YYYY")
        },
        { width: 110, field: "wet_pack", headerName: "Wet Pack", editable: true },
        {
            width: 250, field: "comment", headerName: "Comment", editable:true
        },
        { width: 110, field: "wo", headerName: "W.O.", editable: true },
        { width: 110, field: "line", headerName: "Line", editable: true, type: "singleSelect", valueOptions: (params) => (params.row.turno === "Mañana" ? ["Línea 1", "Línea 2", "Línea 3", "Línea 4", "Línea 5", "Vases 1", "Vases 2", "Linea 10 (eComerce)"] : ["Línea 6", "Línea 7", "Línea 8", "Línea 9", "Línea 11", "Vases 3", "Vases 4", "Linea 10 (eComerce)"]) },
        { width: 110, field: "turno", headerName: "Turno", editable: true, type: "singleSelect", valueOptions: ["Mañana", "Tarde"] },
        { width: 110, field: "priority", headerName: "Priority", sortable: true, editable: true, type: "singleSelect", valueOptions: ["No Priorizada", "Prioridad 1", "Prioridad 2", "Prioridad 3", "Pausada"] },
        { width: 110, field: "assigned", headerName: "Assigned To", editable: true },
        { width: 110, field: "made", headerName: "Made By", editable: true },
        { width: 110, field: "order_status", headerName: "Order Status", sortable: true, editable: true, type: "singleSelect", valueOptions: ["ARMADO", "NO ARMADO", "EN PROCESO"]  },
        { width: 110, field: "scan_status", headerName: "Scan Status", sortable: true, editable: true, type: "singleSelect", valueOptions: ["ESCANEADO", "NO ESCANEADO"] },

        { width: 110, field: "po_status", headerName: "P.O. Status", sortable: true, editable: true },
        { width: 110, field: "hargoods", headerName: "Hargoods", editable: true },
    ]

    const getItems = async () => {

        const myHeaders = new Headers();
        myHeaders.append("Cache-Control", "no-cache");
        myHeaders.append("Ocp-Apim-Subscription-Key", process.env.REACT_APP_API_KEY);
        myHeaders.append("Access-Control-Allow-Origin", "*");

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        await fetch("/Inventory/GetProductInventoryHistory/BQC/0", requestOptions)
            .then(async (res) => {
                const data = await res.json()

                const customers = {}
                const products = {}
                data.forEach((val) => {

                    if (!(val.customer in customers)) {
                        customers[val.customer] = "1"
                    }
                    if (val.name in products) {
                        const arrTemp = products[val.name].poDetails;
                        arrTemp.push({
                            po: val.poId,
                            age: val.age,
                            numBoxes: val.boxes,
                            boxType: val.boxCode,
                            customer: val.customer
                        })
                        products[val.name] = {
                            poDetails: arrTemp,
                            numBoxes: Number.parseInt(products[val.name].numBoxes) + Number.parseInt(val.boxes)
                        }
                    } else {
                        products[val.name] = {
                            poDetails: Array({
                                po: val.poId,
                                age: val.age,
                                numBoxes: Number.parseInt(val.boxes),
                                boxType: val.boxCode,
                                customer: val.customer
                            }),
                            name: val.name,
                            numBoxes: val.boxes
                        }
                    }

                })

                setItems(products)
                setCustomers(Object.keys(customers))
                
            })
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }
    const sendDeleteItem = (row) => {
        client.send(JSON.stringify({
            type: "delete",
            row: row - 1,
            data: rows
        }))
    }
    
    const renderDialogCrearRow = () => {
        const handleAddRow = () => {
            let copy = [...rows]
            let row = {
                id: rows.length === 0 ? 1 : rows[rows.length - 1].id + 1,
                date: new Date(),
                customer: newCustomer,
                product: newProduct,
                po: [],
                poDescription: {},
                dry_boxes: [],
                pull_date: undefined,
                wet_pack: "",
                wo: "",
                line: "",
                turno: "Mañana",
                priority: "No Priorizada",
                assigned: "",
                made: "",
                order_status: "",
                scan_status: "",
                comment: "",
                po_status: "",
                hargoods: "",
            }
            copy.push(row)
            setRows(copy)
            client.send(
                JSON.stringify({
                    type: "add",
                    data: row,
                    dataRows: rows,
                    row: rows.length === 0 ? 0 : rows[rows.length - 1].id
                })
            )
        }
        return (
            <Dialog height="100%" fullWidth open={dialogAdd}>
                <DialogContent >
                    <Grid container spacing={4}>


                        <Grid item xs={6}>
                            <Autocomplete
                                id="product-autocomplete"
                                onChange={(e) => {
                                    setNewCustomer(items[e.target.innerText].poDetails[0].customer)
                                    setNewProduct(e.target.innerText)
                                }}
                                options={items !== undefined ?
                                    Object.keys(items).sort().map((product) => ({ "label": product })) : {}}

                                renderInput={(params) => <TextField {...params} label="Product" />} />

                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="customer-label">Customer</InputLabel>
                                <Select
                                    labelId="customer-label"
                                    id="customer-select"
                                    value={newCustomer}
                                    label="Customer"
                                    onChange={(e) => { setNewCustomer(e.target.value) }}
                                >
                                    {
                                        customers.sort().map((item) => (
                                            <MenuItem key={item} value={item}>{item}</MenuItem>)
                                        )
                                    }
                                </Select>
                            </FormControl>
                        </Grid>


                    </Grid>
                    <div style={{ marginTop: 10, display: "flex", flexDirection: "row", justifyContent: "center", alignContent: "center" }}>
                        <Button onClick={() => { setDialogAdd(false) }}>
                            Cerrar
                        </Button>
                        <Button onClick={() => {
                            handleAddRow()
                            setDialogAdd(false)
                        }}>
                            Add
                        </Button>
                    </div>
                </DialogContent>
            </Dialog >)
    }
    const renderDialogBuscarProducto = () => {
        return (<Dialog open={dialogBuscar}>
            <DialogContent>
                {items === undefined ? <></> :
                    (
                        items[tempItem] !== undefined ?

                            <Grid item style={{ margin: 10, display: "flex", flexDirection: "row", overflow: "auto" }} xs={12}>

                                <List>
                                    <ListItem key="nombre">
                                        <Typography>
                                            {tempItem}
                                        </Typography>
                                    </ListItem>
                                    <ListItem key="infoProducto">
                                        <Typography>
                                            Total Cajas: {items[tempItem] !== undefined ? items[tempItem].numBoxes : <></>}
                                        </Typography>
                                    </ListItem>
                                </List>

                                {
                                    items[tempItem].poDetails.map((detail) => {
                                        return (
                                            <List>
                                                <ListItem key="po">PO: {detail.po}</ListItem>
                                                <ListItem key="age">Age: {detail.age}</ListItem>
                                                <ListItem key="cajas"># Cajas: {detail.numBoxes}</ListItem>
                                            </List>
                                        )
                                    })
                                }
                            </Grid> : <></>)
                }
                <Button onClick={() => { setDialogBuscar(false) }}>
                    Cerrar
                </Button>
            </DialogContent>
        </Dialog>)
    }
    return (
        <div style={{ overflowY: "hidden" }}>
            {items !== undefined ?
                <>
                    {
                        renderDialogBuscarProducto()
                    }
                    {
                        renderDialogCrearRow()
                    }
                    <Box sx={{
                        height: "100vh",
                        width: '100%',
                    }}>
                        <DataGrid
                            sx={
                                {

                                    '.MuiSvgIcon-root': {
                                        color: "#fff"
                                    },
                                    '.MuiDataGrid-columnHeadersInner': {
                                        backgroundColor: Paleta.azulOscuro,
                                        color: "#fff"
                                    },
                                    '& .prioridad1': {
                                        //color: "#FF0000",
                                        backgroundColor: '#ffff00',
                                    },
                                    /*
                                    '& .prioridad2': {
                                        color: '#FF8000',
                                    },
                                    '& .prioridad3': {
                                        color: '#00C244',
                                    },
                                    */
                                    '& .prioridad1Cell': {
                                        fontWeight: 900,
                                        color: "#FF0000"
                                    },
                                    '& .prioridad2Cell': {
                                        //backgroundColor: "#FFCE97" ,
                                        fontWeight: 900,
                                        color: "#FF8000"
                                    },
                                    '& .prioridad3Cell': {
                                        //backgroundColor: "#88FFA7" ,
                                        fontWeight: 900,
                                        color: "#00C244"
                                    },
                                    '& .pausada': {
                                        backgroundColor: "#FF0000"
                                    },
                                    '& .pausadaCell': {
                                        fontWeight: 900,
                                    },



                                    '& .orderStatusArmadoCell':{
                                        backgroundColor:"#92d050",
                                        fontWeight:900 
                                    },
                                    '& .orderStatusNoArmadoCell':{
                                        backgroundColor:"#ff0000",
                                        fontWeight:900 
                                    },
                                    '& .orderStatusEnProcesoCell':{
                                        backgroundColor:"#ffc000",
                                        fontWeight:900 
                                    },


                                    '& .scanStatusEscaneadoCell':{
                                        backgroundColor:"#92d050",
                                        fontWeight:900 
                                    },
                                    '& .scanStatusNoEscaneadoCell':{
                                        backgroundColor:"#ff0000",
                                        fontWeight:900 
                                    },


                                }
                            }

                            getRowHeight={() => 'auto'}
                            pageSize={20}
                            rowsPerPageOptions={[20]}
                            disableSelectionOnClick
                            onCellEditCommit={(e) => { handleOnRowChange(e) }}
                            rows={rows}
                            columns={columns}

                            getCellClassName={(params) => {

                                if (params.field === 'order_status'){
                                    if (params.value === "ARMADO") {
                                        return 'orderStatusArmadoCell'
                                    } else if (params.value === "NO ARMADO") {
                                        return 'orderStatusNoArmadoCell'
                                    } else if (params.value === "EN PROCESO") {
                                        return 'orderStatusEnProcesoCell';
                                    }
                                }

                                if (params.field === 'scan_status'){
                                    if (params.value === "ESCANEADO") {
                                        return 'scanStatusEscaneadoCell'
                                    } else if (params.value === "NO ESCANEADO") {
                                        return 'scanStatusNoEscaneadoCell'
                                    }
                                }


                                if (params.field === 'priority') {
                                    if (params.value === "Prioridad 1") {
                                        return 'prioridad1Cell'
                                    } else if (params.value === "Prioridad 2") {
                                        return 'prioridad2Cell'
                                    } else if (params.value === "Prioridad 3") {
                                        return 'prioridad3Cell';
                                    } else if (params.value === "Pausada") {
                                        return 'pausadaCell';
                                    }
                                }
                            }}

                            getRowClassName={(params) => {





                                if (params.row.priority === "Prioridad 1") {
                                    return 'prioridad1'
                                } else if (params.row.priority === "Prioridad 2") {

                                    return 'prioridad2'
                                } else if (params.row.priority === "Prioridad 3") {
                                    return 'prioridad3';
                                } else if (params.row.priority === "Pausada") {
                                    return "pausada"
                                }
                                return ''
                            }}>
                        </DataGrid>
                        <Fab
                            sx={{ backgroundColor: Paleta.azulOscuro }}
                            style={{
                                position: "sticky",
                                bottom: "10px",
                                left: "30px"
                            }} onClick={() => { setDialogAdd(true) }} color="primary" aria-label="add">
                            <AddIcon />
                        </Fab>
                    </Box>


                </>
                :
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <CircularProgress />
                </div>
            }
        </div >
    )
}