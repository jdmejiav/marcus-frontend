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
import Excel from '../images/excel-icon.svg'
import { styleDataGrid } from "../Components/DataGridStyles";
import { utils, writeFileXLSX } from 'xlsx';
import { workOrdersFetch } from "../Components/WorkOrders";
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import { productivities } from "../util/Productivities";
const client = new W3CWebSocket(process.env.REACT_APP_SOCKET_SERVER_URL)

export default function PlaneacionPage(props) {
    // States Definition
    const [customers, setCustomers] = useState([])

    const [dialogAdd, setDialogAdd] = useState(false)
    const [dialogBuscar, setDialogBuscar] = useState(false)
    const [day, setDay] = useState(props.day)

    const [items, setItems] = useState(undefined)

    const [newCustomer, setNewCustomer] = useState("")
    const [newProduct, setNewProduct] = useState("")

    const [lineProduction, setLineProduction] = useState({
        "línea 1": 0,
        "línea 2": 0,
        "línea 3": 0,
        "línea 4": 0,
        "línea 5": 0,
        "Vases 1": 0,
        "Vases 2": 0,
        "Línea 10 (eComerce)": 0,
    })
    const [lineStatistics, setLineStatistics] = useState(false)

    const [rows, setRows] = useState([])

    const [tempItem, setTempItem] = useState()

    const [workOrders, setWorkOrders] = useState(undefined)
    // UseEffect definitions
    useEffect(() => {
        getItems()
        fetchWo()
    }, [])
    const fetchWo = async () => {

        setWorkOrders(await workOrdersFetch())
    }
    useEffect(() => {
        if (client.readyState === 1) {

            setDay(props.day)
            fetchContent(props.day)
        }

    }, [props.day])

    useEffect(() => {
        client.onopen = () => {
            console.log("WebScoket Client connected");
            fetchContent(day)
        }
        client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            if (dataFromServer.day === props.day) {
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

                    console.log(dataFromServer["data"])
                    setRows(dataFromServer["data"])
                }
            }
        }
    })
    const fetchContent = (day) => {
        client.send(JSON.stringify({
            day: props.day,
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
        if (e.field === "wo") {
            copy[e.id - 1]["wet_pack"] = workOrders[e.value].boxes
        }
        setRows(copy)
        console.log(rows)
        client.send(
            JSON.stringify({
                day: props.day,
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
            width: 100, field: "actions", headerName: "Acciones", sortable: false, renderCell: (params) => {
                return (
                    <>
                        <IconButton sx={{ color: "inherit" }} onClick={(e) => {
                            sendDeleteItem(params.row.id)
                        }
                        }>
                            <DeleteRoundedIcon style={{ color: "inherit" }} ></DeleteRoundedIcon>
                        </IconButton>
                        <IconButton onClick={(e) => {
                            setTempItem(params.row.product)
                            setDialogBuscar(true)
                        }}>
                            <SearchRoundedIcon style={{ color: "inherit" }}></SearchRoundedIcon>
                        </IconButton>
                    </>
                )
            }
        },
        { width: 100, field: "date", headerName: "Date", type: 'date', sortable: true, editable: true, valueFormatter: params => moment(params.value).format("DD/MM/YYYY") },
        { width: 110, field: "customer", headerName: "Customer", sortable: true, editable: true, type: "singleSelect", valueOptions: customers },
        { width: 250, field: "product", headerName: "Product", sortable: true, editable: true, type: "singleSelect", valueOptions: Object.keys(items === undefined ? {} : items) },
        {
            width: 240, field: "po", sortable: false, headerName: "P.O.", renderCell: (params) => {
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
                            day: props.day,
                            type: "update",
                            data: copy[params.row.id - 1],
                            row: params.row.id - 1
                        })
                    )
                };
                return (
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="multiple-chip-label">P.Os</InputLabel>
                        <Select
                            sx={{
                                '& .MuiSvgIcon-root': {
                                    color: "inherit"
                                }
                            }}
                            labelId="multiple-chip-label"
                            id="multiple-chip"
                            multiple
                            value={pos}
                            onChange={handleChange}
                            input={<OutlinedInput fullWidth id="select-multiple-chip" label="Chip" />}
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
                                        key={name.po + " Age: " + name.age + ", " + name.numBoxes + name.boxType}
                                        value={name.po + " Age: " + name.age + ", " + name.numBoxes + name.boxType}
                                    >
                                        <ListItemText key={name.po + " Age: " + name.age + ", " + name.numBoxes + name.boxType}>{name.po + " Age: " + name.age + ", " + name.numBoxes + name.boxType}</ListItemText>
                                    </MenuItem>)
                                    ))
                            }
                        </Select>
                    </FormControl>
                )
            },
        },
        {
            width: 130, field: "poDescription", headerName: "P.O. Description", sortable: false, renderCell: (params) => {
                return (
                    rows[params.row.id - 1] === undefined ? <></> :
                        <List sx={{
                            '& .MuiMenuItem-root ': {
                                padding: "5px 0px"
                            },
                        }}>
                            {
                                Object.keys(rows[params.row.id - 1].poDescription).map((key, idx) => {
                                    const handleOnPONumberChange = (e) => {
                                        let copy = [...rows]
                                        const boxesTemp = key.split(" ");
                                        let maxBoxes = + Number.parseInt(boxesTemp[boxesTemp.length - 1].substring(0, boxesTemp[boxesTemp.length - 1].length - 1))
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
                                                day: props.day,
                                                type: "update",
                                                data: copy[params.row.id - 1],
                                                row: params.row.id - 1
                                            })
                                        )
                                    }
                                    return <MenuItem key={idx}>
                                        <TextField sx={{

                                            '& .MuiOutlinedInput-input': {
                                                padding: "10px 0px 10px 5px"
                                            }, p: 0, m: 0
                                        }} type="number" onBlur={updateRow} onChange={handleOnPONumberChange} value={rows[params.row.id - 1].poDescription[key]} fullWidth />
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
                            Object.keys(rows[params.row.id - 1].dry_boxes).map((key) => (<Typography key={key}>{rows[params.row.id - 1].dry_boxes[key]}{key}</Typography>))
                    }
                </List>
            )
        },
        { width: 110, field: "pull_date", headerName: "Pull Date", editable: true },
        { width: 110, field: "wet_pack", headerName: "Wet Pack", editable: true },
        { width: 250, field: "comment", headerName: "Comment", editable: true },
        { width: 110, field: "priority", headerName: "Priority", sortable: true, editable: true, type: "singleSelect", valueOptions: [" ", "Prioridad 1", "Prioridad 2", "Prioridad 3", "Pausada"] },
        { width: 110, field: "wo", headerName: "W.O.", editable: true },
        { width: 110, field: "line", headerName: "Line", editable: true, type: "singleSelect", valueOptions: (params) => (params.row.turno === "Morning" ? ["Línea 1", "Línea 2", "Línea 3", "Línea 4", "Línea 5", "Vases 1", "Vases 2", "Línea 10 (eComerce)", "Line Dry"] : ["Línea 6", "Línea 7", "Línea 8", "Línea 9", "Línea 11", "Vases 3", "Vases 4", "Linea 10 (eComerce)"]) },
        { width: 110, field: "turno", headerName: "Turno", editable: true, type: "singleSelect", valueOptions: ["Morning", "Afternoon"] },
        { width: 110, field: "assigned", headerName: "Assigned To", editable: true },
        { width: 110, field: "made", headerName: "Made By", editable: true },
        { width: 110, field: "order_status", headerName: "Order Status", sortable: true, editable: true, type: "singleSelect", valueOptions: ["ARMADO", "NO ARMADO", "EN PROCESO"] },
        { width: 110, field: "scan_status", headerName: "Scan Status", sortable: true, editable: true, type: "singleSelect", valueOptions: ["ESCANEADO", "NO ESCANEADO"] },
        { width: 110, field: "hargoods", headerName: "Hargoods", editable: true, type: "singleSelect", valueOptions: ["Disponible", "No en inventario"] },
        { width: 110, field: "hargoods_status", headerName: "Hargoods Status", editable: true, type: "singleSelect", valueOptions: ["Entregado", "Pendiente por entregar"] },
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
                            boxType: val.boxCode.replace(/\s/g, ''),
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
                                boxType: val.boxCode.replace(/\s/g, ''),
                                customer: val.customer
                            }),
                            name: val.name,
                            numBoxes: val.boxes
                        }
                    }
                })




                let begin = new Date()

                let end = new Date()
                end.setDate(end.getDate() + 1)
                await fetch("/Procurement/GetPurchaseProducts/BQC/All/?" + new URLSearchParams({
                    dateFrom: moment(begin).format("YYYY-MM-DD"),
                    dateTo: moment(end).format("YYYY-MM-DD")
                }), requestOptions).then(async (res) => {
                    const data = await res.json()

                    data.forEach((val) => {
                        if (val.dateReceived === null) {

                            if (!(val.customer in customers)) {
                                customers[val.customer] = "1"
                            }
                            if (val.productName in products) {
                                const arrTemp = products[val.productName].poDetails;
                                arrTemp.push({
                                    po: val.poNumber,
                                    age: "N.R",
                                    numBoxes: val.pack,
                                    boxType: val.boxCode.replace(/\s/g, ''),
                                    customer: val.customer
                                })
                                products[val.productName] = {
                                    poDetails: arrTemp,
                                    numBoxes: Number.parseInt(products[val.productName].numBoxes) + Number.parseInt(val.pack)
                                }
                            } else {
                                products[val.productName] = {
                                    poDetails: Array({
                                        po: val.poNumber,
                                        age: "N.R",
                                        numBoxes: Number.parseInt(val.pack),
                                        boxType: val.boxCode.replace(/\s/g, ''),
                                        customer: val.customer
                                    }),
                                    name: val.productName,
                                    numBoxes: val.pack
                                }
                            }
                        }
                    })


                    setItems(products)
                    setCustomers(Object.keys(customers))
                }).catch(error => console.log('error', error));
            })
            .catch(error => console.log('error', error));


    }
    const sendDeleteItem = (row) => {
        client.send(JSON.stringify({
            day: props.day,
            type: "delete",
            row: row - 1,
            data: rows
        }))
    }

    const renderDialogCrearRow = () => {
        const handleAddRow = () => {
            if (newProduct !== "") {
                let copy = [...rows]
                let row = {
                    id: rows.length === 0 ? 1 : rows[rows.length - 1].id + 1,
                    date: new Date(),
                    customer: newCustomer,
                    product: newProduct,
                    po: [],
                    poDescription: {},
                    dry_boxes: [],
                    pull_date: "",
                    wet_pack: "",
                    wo: "",
                    line: "",
                    turno: "Morning",
                    priority: "",
                    assigned: "",
                    made: "",
                    order_status: "",
                    scan_status: "",
                    comment: "",
                    hargoods: "",
                    hargoods_status: "Pendiente por entregar",
                }
                copy.push(row)
                setRows(copy)
                client.send(
                    JSON.stringify({
                        day: props.day,
                        type: "add",
                        data: row,
                        dataRows: rows,
                        row: rows.length === 0 ? 0 : rows[rows.length - 1].id
                    })
                )
            }
        }
        return (
            <Dialog height="100%" fullWidth open={dialogAdd}>
                <DialogContent >
                    <Grid container spacing={4}>
                        <Grid item xs={6}>
                            <Autocomplete
                                id="product-autocomplete"
                                onChange={(e) => {
                                    console.log("cuando hay error esto es")
                                    console.log(e)
                                    setNewCustomer(items[e.target.outerText] !== undefined ? items[e.target.outerText].poDetails[0].customer : "")
                                    setNewProduct(e.target.outerText)
                                }}
                                options={items !== undefined ?
                                    Object.keys(items).sort().map((product, index) => ({ "label": product, id: index })) : {}}

                                renderInput={(params) => <TextField {...params} value={newProduct} label="Product" />} />

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
                            Añadir
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
                                    items[tempItem].poDetails.map((detail, idx) => {
                                        return (
                                            <List key={idx}>
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

    const renderDialogProuctividadLineas = () => {
        return (<Dialog open={lineStatistics}>
            <DialogContent>
                <Grid container spacing={1}>
                    {
                        Object.keys(lineProduction).sort().map(key => {
                            return <Grid item key={key} xs={6}>
                                <Typography>
                                    {key}: {Math.round(lineProduction[key]).toString().padStart(2, '0')}:{(Math.round((lineProduction[key] - Math.round(lineProduction[key])) * 60)).toString().padStart(2, '0')} H
                                </Typography>
                            </Grid>
                        })
                    }
                </Grid>

                <Button onClick={() => { setLineStatistics(false) }}>
                    Cerrar
                </Button>
            </DialogContent>
        </Dialog>)
    }


    const handleOnExport = () => {
        let objectMaxLength = Array(21).fill(10)
        let bodyTemp = rows.map(item => {
            const tempRetorno = JSON.parse(JSON.stringify(item))
            let tempPo = ""
            for (var i = 0; i < item.po.length; i++) {
                tempPo = tempPo + item.po[i].split(" ")[0] + " " + item.poDescription[Object.keys(item.poDescription)[i]] + item.po[i].charAt(item.po[i].length - 1) + "    "
            }
            tempRetorno["po"] = tempPo
            let temp_dry = ""
            Object.keys(item.dry_boxes).forEach((key) => {
                temp_dry = temp_dry + item.dry_boxes[key] + key + "\n"
            })
            tempRetorno["dry_boxes"] = temp_dry
            delete tempRetorno["poDescription"]
            for (var j = 0; j < Object.keys(tempRetorno).length; j++) {
                if (Object.keys(tempRetorno)[j] === "po") {
                    console.log(Object.keys(tempRetorno)[j].length)
                }
                if (objectMaxLength[j] < tempRetorno[Object.keys(tempRetorno)[j]].length) {
                    objectMaxLength[j] = tempRetorno[Object.keys(tempRetorno)[j]].length
                }
            }
            return tempRetorno
        })
        var wsCols = objectMaxLength.map(val => ({
            width: val
        }))
        const ws = utils.json_to_sheet(bodyTemp)
        ws["!cols"] = wsCols;
        const wb = utils.book_new()
        utils.book_append_sheet(wb, ws, ("SameDay"));
        writeFileXLSX(wb, "Program " + props.day + " " + (new Date()).toLocaleDateString() + ".xlsx")
    }

    const handleLineStatistics = () => {
        const tempLineProdcution = {
            "Línea 1": 0,
            "Línea 2": 0,
            "Línea 3": 0,
            "Línea 4": 0,
            "Línea 5": 0,
            "Vases 1": 0,
            "Vases 2": 0,
            "Línea 10 (eComerce)": 0,
        }
        rows.forEach(row => {

            if (row.wo !== "" && row.wo in workOrders) {
                console.log(row.wo + "   " + workOrders[row.wo].task)
                tempLineProdcution[row.line] = (tempLineProdcution[row.line] === undefined ? 0 : tempLineProdcution[row.line]) + (Number(workOrders[row.wo].boxes) / productivities[workOrders[row.wo].task])
            }
        })

        setLineProduction(tempLineProdcution)
        setLineStatistics(true)
    }

    return (
        <div style={{ overflowY: "hidden" }}>
            {items !== undefined && workOrders !== undefined ?
                <>
                    {renderDialogProuctividadLineas()}
                    {renderDialogBuscarProducto()}
                    {renderDialogCrearRow()}

                    <Box sx={{
                        height: "95vh",
                        width: '100%',
                    }}>
                        <DataGrid
                            sx={
                                styleDataGrid
                            }
                            getRowHeight={() => 'auto'}
                            pageSize={100}
                            rowsPerPageOptions={[100]}
                            disableSelectionOnClick
                            onCellEditCommit={(e) => { handleOnRowChange(e) }}
                            rows={rows}
                            columns={columns}
                            getCellClassName={(params) => {
                                switch (params.field) {
                                    case "order_status":
                                        if (params.value === "ARMADO") {
                                            return 'orderStatusArmadoCell'
                                        } else if (params.value === "NO ARMADO") {
                                            return 'orderStatusNoArmadoCell'
                                        } else if (params.value === "EN PROCESO") {
                                            return 'orderStatusEnProcesoCell';
                                        }
                                        break;
                                    case "scan_status":
                                        if (params.value === "ESCANEADO") {
                                            return 'scanStatusEscaneadoCell'
                                        } else if (params.value === "NO ESCANEADO") {
                                            return 'scanStatusNoEscaneadoCell'
                                        }
                                        break;
                                    case "priority":
                                        if (params.row.priority === "Prioridad 1") {
                                            return 'prioridad1Cell'
                                        } else if (params.value === "Prioridad 2") {
                                            return 'prioridad2Cell'
                                        } else if (params.value === "Prioridad 3") {
                                            return 'prioridad3Cell';
                                        } else if (params.value === "Pausada") {
                                            return 'pausadaCell';
                                        }
                                        break;
                                    case "hargoods":
                                        if (params.value === "Disponible") {
                                            return 'hargoodsDisponibleCell'
                                        } else if (params.value === "No en inventario") {
                                            return 'hargoodsNoeninventarioCell'
                                        }
                                        break;
                                    case "hargoods_status":
                                        if (params.value === "Entregado") {
                                            return 'hargoodsStatusEntregadoCell'
                                        } else if (params.value === "Pendiente por entregar") {
                                            return 'hargoodsStatusPendientePorEntregarCell'
                                        }
                                        break;
                                    default:
                                        break;
                                }
                                if (params.row.priority === "Prioridad 1") {
                                    return "prioridad1"
                                } else if (params.row.priority === "Pausada") {
                                    return "pausada"
                                }
                            }}
                        >
                        </DataGrid>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "1rem",
                            position: "absolute",
                            bottom: "6px",
                            width: "max-content",
                            left: "88%",
                        }}>
                            <Fab
                                sx={{
                                    backgroundColor: Paleta.amarillo,
                                    '&:hover': {
                                        backgroundColor: Paleta.amarilloHover
                                    }
                                }}
                                onClick={handleLineStatistics}
                            >
                                <QueryStatsRoundedIcon />
                            </Fab>
                            <Fab
                                sx={{ backgroundColor: "#fff" }}
                                onClick={handleOnExport}
                            >
                                <img
                                    alt="Excel"
                                    style={{
                                        color: "#fff",
                                        height: "30px",
                                        width: "30px"
                                    }}
                                    src={Excel}></img>
                            </Fab>
                            <Fab
                                sx={{ backgroundColor: Paleta.azulOscuro }}
                                style={{
                                    marginRight: "1rem"
                                }} onClick={() => {
                                    setNewCustomer("")
                                    setDialogAdd(true)
                                }} color="primary" aria-label="add">
                                <AddIcon />
                            </Fab>
                        </div>

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