import React, { useState, useEffect } from "react"
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
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
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from '@mui/material/FormControl';
import InputLabel from "@mui/material/InputLabel";
import { DataGrid } from "@mui/x-data-grid";
import { w3cwebsocket as W3CWebSocket } from "websocket"
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
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
import { Roles, RolesLineas, RolesBotones } from "../util/RolesDiagram";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import KeyboardTabRoundedIcon from '@mui/icons-material/KeyboardTabRounded';
import { Divider } from "@mui/material";
import axios from "axios";
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import WetPackLineasComponent from "../Components/WetPackLineasComponent";

const client = new W3CWebSocket(process.env.REACT_APP_SOCKET_SERVER_URL)

export default function PlaneacionPage(props) {
    // States Definition
    const [customers, setCustomers] = useState([])
    const [dialogAdd, setDialogAdd] = useState(false)
    const [dialogBuscar, setDialogBuscar] = useState(false)
    const [day, setDay] = useState(props.day)
    const [rol, setRol] = useState("default")
    const [recipes, setRecipes] = useState(undefined)
    const [items, setItems] = useState(undefined)
    const [newCustomer, setNewCustomer] = useState("")
    const [newProduct, setNewProduct] = useState("")
    const [dialogRecipe, setDialogRecipe] = useState(false)
    const [dry, setDry] = useState(0)
    const [wet, setWet] = useState(0)
    const [openWetPackDialog, setOpenWetPackDialog] = useState(false)

    const [rows, setRows] = useState([])
    const [openSideBar, setOpenSideBar] = useState(false)
    const [tempItem, setTempItem] = useState("")
    const [workOrders, setWorkOrders] = useState(undefined)
    // UseEffect definitions
    useEffect(() => {
        getItems()
        fetchWo()
        getRecipes()
    }, [])

    const getRecipes = async () => {
        const data = await axios.get(`${process.env.REACT_APP_REST_BACKEND_URL}/getRecipes`).then(res => res.data).catch(err => console.log(err))
        console.log(data)
        setRecipes(data)
    }

    const fetchWo = async () => {

        setWorkOrders(await workOrdersFetch())
    }
    useEffect(() => {
        setRol(localStorage.getItem("rol") === null ? "default" : localStorage.getItem("rol"))
        if (client.readyState === 1) {
            setDay(props.day)
            fetchContent(props.day)
        }
    }, [props.day])

    useEffect(() => {
        if (localStorage.getItem("token") === null) {
            window.location.href = "/login"
        }
        client.onopen = () => {
            console.log("WebScoket Client connected");
            fetchContent(day)
        }
        client.onmessage = async (message) => {
            const dataFromServer = JSON.parse(message.data);
            if (dataFromServer.day === props.day) {
                if (dataFromServer.type === "update") {
                    const rowsUpdated = await axios.get(`${process.env.REACT_APP_REST_BACKEND_URL}/${props.day}/getRows`).then(res => res.data)
                    setRows(rowsUpdated)
                }
            }
        }
    })
    const fetchContent = async (day) => {
        const data = await axios.get(`${process.env.REACT_APP_REST_BACKEND_URL}/${props.day}/getRows`).then((res) => (res.data)).catch((err) => (console.log(err)));
        console.log(data)
        setRows(data)
    }
    const handleOnRowChange = async (e) => {
        let rowPayload = {}
        rowPayload[e.field] = e.value
        let { _id } = e
        let id = _id
        let actualDate = new Date()
        if (_id === undefined) {
            for (var i = 0; i < rows.length; i++) {
                if (rows[i]["id"] === e.id) {
                    id = rows[i]["_id"]
                    actualDate = rows[i]["date"]
                    break
                }
            }
        }
        if (e.field === "product") {
            rowPayload["po"] = []
            rowPayload["poDescription"] = {}
        } else {
            if (e.field === "wo") {
                if (workOrders[e.value] !== undefined) {
                    //rowPayload["wet_pack"] = workOrders[e.value].boxes
                    rowPayload["box_code"] = workOrders[e.value].boxCode
                }
            }
        }
        if (e.field === "date" && props.day === "sameday" && new Date(actualDate) < e.value) {
            await axios.post(`${process.env.REACT_APP_REST_BACKEND_URL}/moveDay`, { id: id, date: e.value })
                .then((res) => res.data)
                .catch(err => console.log(err))
            client.send(
                JSON.stringify({
                    day: "sameday",
                    type: "update",
                })
            )
            client.send(
                JSON.stringify({
                    day: "nextday",
                    type: "update",
                })
            )
        } else {
            await axios.post(`${process.env.REACT_APP_REST_BACKEND_URL}/${props.day}/updateRow/${id}`, rowPayload)
                .then((res) => res.data)
                .catch(err => console.log(err))
            client.send(
                JSON.stringify({
                    day: props.day,
                    type: "update",
                })
            )
        }
    }
    const columns = [
        {
            field: 'id', headerName: '#', width: 20,
            editable: Roles[rol].id.edit,
            hideable: Roles[rol].id.hideable
        },
        {
            field: '_id', headerName: '_id', width: 0,
            editable: false,
            hideable: false
        },
        {
            width: 100, field: "actions", headerName: "Acciones", sortable: false,
            editable: false,
            hideable: Roles[rol].actions.hideable,
            renderCell: (params) => {
                return (
                    <>
                        <IconButton
                            disabled={!Roles[rol].actions.edit}
                            sx={{ color: "inherit" }} onClick={(e) => {
                                sendDeleteItem(params.row._id)
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
        {
            width: 100, field: "date", headerName: "Date", type: 'date', sortable: true,
            editable: Roles[rol].date.edit,
            hideable: Roles[rol].date.hideable,
            valueFormatter: params => moment(params.value).format("DD/MM/YYYY")
        },
        {
            width: 110, field: "customer", headerName: "Customer", sortable: true,
            editable: Roles[rol].customer.edit,
            hideable: Roles[rol].customer.hideable,
            type: "singleSelect", valueOptions: customers,
        },
        {
            width: 250, field: "product", headerName: "Product", sortable: true, type: "singleSelect", valueOptions: Object.keys(items === undefined ? {} : items),
            editable: Roles[rol].product.edit,
            hideable: Roles[rol].product.hideable,
        },
        {
            width: 240, field: "po", sortable: false, headerName: "P.O.",
            editable: false,
            hideable: Roles[rol].po.hideable,
            renderCell: (params) => {
                const [pos, setPos] = useState(params.row === undefined ? [] : params.row.po)

                useEffect(() => {
                    setPos(params.row === undefined ? [] : params.row.po)
                }, [rows])
                const handleChange = async (event) => {
                    let id = params.row._id
                    const {
                        target: { value },
                    } = event;
                    let rowPayload = params.row
                    // Add items that are on POs Columns but not in te PO Details (When adding items)
                    let copyPoDetails = rowPayload.poDescription;
                    for (var key of (typeof value === 'string' ? value.splvalue.split(',') : value)) {
                        if (!Object.keys(rowPayload.poDescription).includes(key)) {
                            copyPoDetails[key] = 0
                        }
                    }
                    // Remove elements that are not on the POs Column but are on PO Details Column (when deleting items)
                    let finalCopy = Object.fromEntries(value.map((key) => [key, copyPoDetails[key]]))
                    rowPayload.po = value
                    rowPayload.poDescription = finalCopy
                    let cajas = rowPayload.poDescription
                    let count = {}
                    Object.keys(cajas).map((key) => (
                        count[key.charAt(key.length - 1)] = (count[key.charAt(key.length - 1)] === undefined ? Number.parseInt(cajas[key]) : Number.parseInt(count[key.charAt(key.length - 1)]) + Number.parseInt(cajas[key]))
                    ))
                    let qc = false


                    rowPayload.product.split(", ").forEach(productName => {
                        Object.keys(items[productName]).forEach(name => {
                            if (items[productName][name].reference.includes("QC")) {
                                Object.keys(rowPayload.poDescription).forEach(po => {
                                    if (po.split(" ")[0] === items[productName][name].po)
                                        qc = true
                                })
                            }
                        })
                    })


                    if (qc) {
                        const tempCommentSplit = rowPayload.comment.split("|")
                        let tempComment = ""
                        if (!rowPayload.comment.includes("Quality Check"))
                            if (tempCommentSplit.length > 1) {
                                rowPayload.comment = rowPayload.comment + " Quality Check"
                            } else {
                                tempComment = tempCommentSplit[0] + "| Quality Check"
                                rowPayload.comment = tempComment
                            }
                    } else {
                        rowPayload.comment = rowPayload.comment.replace("| Quality Check", '')
                    }
                    rowPayload.dry_boxes = count
                    let tempComment = ""
                    Object.keys(rowPayload.poDescription).forEach((item) => {
                        tempComment = tempComment + item.split(" ")[0] + " " + rowPayload.poDescription[item] + item.charAt(item.length - 1) + "  "
                    })
                    const tempCommentSplit = rowPayload.comment.split("|")

                    if (tempCommentSplit.length > 1) {
                        let tempCommentFinal = ""
                        for (var i = 1; i < tempCommentSplit.length; i = i + 1) {
                            tempCommentFinal = tempCommentFinal + tempCommentSplit[i]
                        }
                        rowPayload.comment = tempComment + " | " + tempCommentFinal
                    } else {
                        rowPayload.comment = tempComment
                    }

                    await axios.post(`${process.env.REACT_APP_REST_BACKEND_URL}/${props.day}/updateRow/${id}`, rowPayload)
                        .then((res) => res.data)
                        .catch(err => console.log(err))
                    client.send(
                        JSON.stringify({
                            day: props.day,
                            type: "update",
                        })
                    )
                };
                return (
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="multiple-chip-label">P.Os</InputLabel>
                        <Select
                            disabled={!Roles[rol].po.edit}
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
                            {
                                items === undefined ? <MenuItem value=""></MenuItem> :
                                    (params.row.product.split(", ").map(productName => (
                                        items[productName] !== undefined ?
                                            (Object.keys(items[productName]).map((name) => (
                                                <MenuItem
                                                    key={items[productName][name].po + " Age: " + items[productName][name].age + ", " + items[productName][name].numBoxes + items[productName][name].boxType}
                                                    value={items[productName][name].po + " Age: " + items[productName][name].age + ", " + items[productName][name].numBoxes + items[productName][name].boxType}
                                                >
                                                    <ListItemText key={items[productName][name].po + " Age: " + items[productName][name].age + ", "
                                                        + items[productName][name].numBoxes + items[productName][name].boxType}>
                                                        {items[productName][name].po + " Age: " + items[productName][name].age + ", " + items[productName][name].numBoxes +
                                                            items[productName][name].boxType}
                                                    </ListItemText>
                                                </MenuItem>
                                            )))
                                            :
                                            <MenuItem value=""></MenuItem>
                                    )
                                    ))
                            }
                        </Select>
                    </FormControl>
                )
            },
        },
        {
            width: 130, field: "poDescription", headerName: "P.O. Description", sortable: false,
            editable: false,
            hideable: Roles[rol].poDescription.hideable,
            renderCell: (params) => {
                return (
                    (params.row === undefined ?
                        <></> :
                        (params.row.poDescription === undefined ? <></> :
                            <List disablePadding
                                sx={{
                                    '& .MuiMenuItem-root ': {
                                        padding: "0px"
                                    },
                                }}>
                                {
                                    Object.keys(params.row.poDescription).map((key, idx) => {
                                        const handleOnPONumberChange = (e) => {
                                            let copy = [...rows]
                                            const boxesTemp = key.split(" ");
                                            let maxBoxes = + Number.parseInt(boxesTemp[boxesTemp.length - 1].substring(0, boxesTemp[boxesTemp.length - 1].length - 1))
                                            if ((Number.parseInt(e.target.value) <= Number.parseInt(maxBoxes) && Number.parseInt(e.target.value) >= 0) || e.target.value === '') {
                                                params.row.poDescription[key] = (e.target.value === '' ? 0 : Number.parseInt(e.target.value))
                                            }
                                            let tempComment = ""
                                            Object.keys(params.row.poDescription).forEach((item) => {
                                                tempComment = tempComment + item.split(" ")[0] + " " + params.row.poDescription[item] + item.charAt(item.length - 1) + "  "
                                            })
                                            const tempCommentSplit = params.row.comment.split("|")

                                            if (tempCommentSplit.length > 1) {
                                                let tempCommentFinal = ""
                                                for (var i = 1; i < tempCommentSplit.length; i = i + 1) {
                                                    tempCommentFinal = tempCommentFinal + tempCommentSplit[i]
                                                }
                                                params.row.comment = tempComment + " |" + tempCommentFinal
                                            } else {
                                                params.row.comment = tempComment
                                            }
                                            setRows(copy)
                                            let cajas = params.row.poDescription
                                            let count = {}
                                            Object.keys(cajas).map((key) => (
                                                count[key.charAt(key.length - 1)] = (count[key.charAt(key.length - 1)] === undefined ? Number.parseInt(cajas[key]) : Number.parseInt(count[key.charAt(key.length - 1)]) + Number.parseInt(cajas[key]))
                                            ))
                                            let qc = false
                                            params.row.product.split(", ").forEach(
                                                productName => {
                                                    Object.keys(items[productName]).forEach(name => {
                                                        if (items[productName][name].reference.includes("QC")) {
                                                            Object.keys(params.row.poDescription).forEach(po => {
                                                                if (po.split(" ")[0] === items[productName][name].po)
                                                                    qc = true
                                                            })
                                                        }
                                                    })
                                                }
                                            )
                                            if (qc) {
                                                const tempCommentSplit = params.row.comment.split("|")
                                                let tempComment = ""
                                                if (!params.row.comment.includes("Quality Check"))
                                                    if (tempCommentSplit.length > 1) {
                                                        params.row.comment = params.row.comment + " Quality Check"
                                                    } else {
                                                        tempComment = tempCommentSplit[0] + "| Quality Check"
                                                        params.row.comment = tempComment
                                                    }
                                            } else {
                                                params.row.comment = params.row.comment.replace("| Quality Check", '')
                                            }
                                            params.row.dry_boxes = count
                                        }
                                        const updateRow = async (e) => {
                                            await axios.post(`${process.env.REACT_APP_REST_BACKEND_URL}/${props.day}/updateRow/${params.row._id}`, params.row)
                                                .then(res => res.data)
                                                .catch(err => console.log(err))
                                            client.send(
                                                JSON.stringify({
                                                    day: props.day,
                                                    type: "update",
                                                })
                                            )
                                        }
                                        return (
                                            <MenuItem key={idx}>
                                                <input
                                                    min="0"
                                                    disabled={!Roles[rol].poDescription.edit}
                                                    placeholer={key.split("")}
                                                    style={{
                                                        padding: "10px 0px 10px 5px",
                                                        margin: "2px 0px",
                                                        border: "1px solid",
                                                        borderColor: "rgba(60,60,60,0.5)",
                                                        borderRadius: "5px", width: "100%",
                                                        backgroundColor: "inherit"
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-input': {
                                                            padding: "10px 0px 10px 5px"
                                                        }, p: 0, m: 0
                                                    }} type="number" onBlur={updateRow} onChange={handleOnPONumberChange} value={Number.parseInt(params.row.poDescription[key])} />
                                            </MenuItem>
                                        )
                                    })}
                            </List>
                        )
                    )
                )
            }
        },
        {
            width: 110, field: "dry_boxes", headerName: "Dry Boxes",
            editable: false,
            hideable: Roles[rol].dry_boxes.hideable,
            renderCell: (params) => {
                const wetValue = () => {
                    let tempDry = 0
                    params.row.product.split(", ").forEach(productName => {
                        Object.keys(params.row.poDescription).forEach((key) => {
                            let tempPo = key.split(" ")[0] + key.charAt(key.length - 1)

                            if (items[productName][tempPo] !== undefined) {
                                let pack = items[productName][tempPo].pack
                                let packWet = recipes[productName].wp
                                tempDry = tempDry + (Math.round(((pack * params.row.poDescription[key]) / packWet) * 100) / 100)
                            }
                        })
                    })
                    return tempDry
                }
                return <List>
                    {
                        params.row.dry_boxes === undefined ?
                            <></> :
                            <>
                                {Object.keys(params.row.dry_boxes).map((key) => (<Typography key={key}>{params.row.dry_boxes[key]}{key}</Typography>))}
                                <br></br>
                                {recipes[params.row.product] === undefined || items === undefined ? undefined : "Wet => " + wetValue()}
                            </>
                    }
                </List >
            }
        },
        {
            width: 250, field: "comment", headerName: "Comment",
            editable: Roles[rol].comment.edit,
            hideable: Roles[rol].comment.hideable,
        },
        {
            width: 110, field: "pull_date", headerName: "Pull Date",
            editable: Roles[rol].pull_date.edit,
            hideable: Roles[rol].pull_date.hideable,
        },
        {
            width: 110, field: "wet_pack", headerName: "Wet Pack", type: "number",
            editable: Roles[rol].wet_pack.edit,
            renderCell: (params => {
                const dryValue = () => {
                    let dry_boxes = 0;
                    params.row.product.split(", ").forEach(productName => {
                        dry_boxes = dry_boxes + Math.round(((params.value * recipes[productName].wp) / recipes[productName].dry) * 100) / 100
                    })
                    return dry_boxes
                }
                if (params.row.product in recipes) {
                    return <Typography>
                        Wet: {
                            params.value !== undefined ?
                                Math.round(params.value * 100) / 100 : 0
                        }
                        <br></br>
                        Dry: {
                            (params.value !== undefined ?
                                dryValue() : 0)
                        }
                        <br></br>
                    </Typography>
                } else {
                    return <Typography>{params.value}</Typography>
                }
            })
        },
        {
            width: 110, field: "wo", headerName: "W.O.",
            editable: Roles[rol].wo.edit,
            hideable: Roles[rol].wo.hideable,
        },
        {
            width: 110, field: "line", headerName: "Line", type: "singleSelect",
            editable: Roles[rol].line.edit,
            hideable: Roles[rol].line.hideable,
            valueOptions: (params) => {
                if (params.row !== undefined) {
                    return params.row.turno === "Morning" ? ["LINE 1", "LINE 2", "LINE 3", "LINE 4", "LINE 5", "Vase L1", "Vase L2", "LINE 10 (eComerce)", "Line Dry"] : ["LINE 6", "LINE 7", "LINE 8", "LINE 9", "LINE 11", "Vase L3", "Vase L4", "Linea 10 (eComerce)", "Line Dry"]
                }
                return ["LINE 1", "LINE 2", "LINE 3", "LINE 4", "LINE 5", "LINE 6", "LINE 7", "LINE 8", "LINE 9", "LINE 11", "Vase L1", "Vase L2", "Vase L3", "Vase L4", "LINE 10 (eComerce)", "Line Dry"]
            },
        },
        {
            width: 110, field: "priority", headerName: "Priority", sortable: true, type: "singleSelect",
            editable: Roles[rol].priority.edit,
            hideable: Roles[rol].priority.hideable,
            valueOptions: ["", "Prioridad 1", "Prioridad 2", "Prioridad 3", "Pausada"]
        },
        {
            width: 110, field: "exit_order", headerName: "Orden Salida", type: "number",
            editable: Roles[rol].exit_order.edit,
            hideable: Roles[rol].exit_order.hideable,
        },
        {
            width: 110, field: "turno", headerName: "Turno", type: "singleSelect",
            editable: Roles[rol].turno.edit,
            hideable: Roles[rol].turno.hideable,
            valueOptions: ["Morning", "Afternoon"]
        },
        {
            width: 110, field: "assigned", headerName: "Assigned To",
            editable: Roles[rol].assigned.edit,
            hideable: Roles[rol].assigned.hideable,
        },
        {
            width: 110, field: "made", headerName: "Made By",
            editable: Roles[rol].made.edit,
            hideable: Roles[rol].made.hideable,
        },
        {
            width: 110, field: "order_status", headerName: "Order Status", sortable: true, type: "singleSelect", valueOptions: ["ARMADO", "NO ARMADO", "EN PROCESO"],
            editable: Roles[rol].order_status.edit,
            hideable: Roles[rol].order_status.hideable,
        },
        {
            width: 110, field: "scan_status", headerName: "Scan Status", sortable: true, type: "singleSelect", valueOptions: ["ESCANEADO", "NO ESCANEADO"],
            editable: Roles[rol].scan_status.edit,
            hideable: Roles[rol].scan_status.hideable,
        },
        {
            width: 110, field: "box_code", headerName: "Box Hargoods",
            editable: Roles[rol].box_code.edit,
            hideable: Roles[rol].box_code.hideable,
        },
        {
            width: 110, field: "hargoods", headerName: "Hargoods", type: "singleSelect", valueOptions: ["Disponible", "No en inventario"],
            editable: Roles[rol].hargoods.edit,
            hideable: Roles[rol].hargoods.hideable,
        },
        {
            width: 110, field: "hargoods_status", headerName: "Hargoods Status", type: "singleSelect", valueOptions: ["Entregado", "Pendiente por entregar"],
            editable: Roles[rol].hargoods_status.edit,
            hideable: Roles[rol].hargoods_status.hideable,
        },
    ]
    const refreshItems = async () => {
        const info = await axios.get(`${process.env.REACT_APP_REST_BACKEND_URL}/refreshInventory`).then(res => res.data).catch(err => console.log(err))
        console.log(info)
        setItems(info.items)
        setCustomers(info.customers)
    }
    const getItems = async () => {
        const info = await axios.get(`${process.env.REACT_APP_REST_BACKEND_URL}/fetchInventory`).then(res => res.data).catch(err => console.log(err))
        console.log(info.items["BH EURO BQT WINTER"]["114079F"])
        setItems(info.items)
        setCustomers(info.customers)
    }
    const sendDeleteItem = async (_id) => {
        await axios.delete(`${process.env.REACT_APP_REST_BACKEND_URL}/${props.day}/deleteRow/${_id}`).then(_ => {
            client.send(JSON.stringify({
                day: props.day,
                type: "update",
            }))
        }).catch(err => console.log(err))
    }
    const renderDialogCrearRow = () => {

        const [combo, setCombo] = useState([])

        const handleAddRow = async () => {
            if (newProduct !== "") {
                var copyNewProduct = ""
                if (combo.length > 0) {
                    console.log("entra acá jje")
                    let copy = [...combo]
                    copy.push(newProduct)
                    copy.sort()
                    for (var i = 0; i < copy.length; i++) {
                        if (i === copy.length - 1) {
                            copyNewProduct = copyNewProduct + copy[i]
                        } else {
                            copyNewProduct = copyNewProduct + copy[i] + ", "
                        }
                    }
                } else {
                    copyNewProduct = newProduct
                }

                let row = {
                    id: rows.length === 0 ? 1 : rows[rows.length - 1].id + 1,
                    actions: "",
                    date: new Date(),
                    customer: newCustomer,
                    product: copyNewProduct,
                    po: [],
                    poDescription: {},
                    dry_boxes: {},
                    pull_date: "",
                    //wet_pack: 0,
                    comment: "",
                    priority: "",
                    wo: "",
                    //exit_order: null,
                    line: "",
                    turno: "Morning",
                    assigned: "",
                    made: "",
                    order_status: "",
                    scan_status: "",
                    box_code: "",
                    hargoods: "",
                    hargoods_status: "Pendiente por entregar",
                }
                const data = await axios.post(`${process.env.REACT_APP_REST_BACKEND_URL}/${props.day}/addRow`, row).then(res => res.data).catch(err => console.log(err));
                client.send(
                    JSON.stringify({
                        day: props.day,
                        type: "update",
                        _id: data._id,
                    })
                )

            }
        }
        return (

            <Dialog onClose={() => { setDialogAdd(false) }} maxWidth open={dialogAdd}>
                <DialogTitle>Añadir fila</DialogTitle>
                <DialogContent>
                    <Box style={{ width: "50vw", paddingTop: 10 }}>
                        <Grid container spacing={4}>
                            <Grid item xs={6}>
                                <Autocomplete
                                    id="product-autocomplete"
                                    onChange={(_, value) => {
                                        if (value !== null) {
                                            setNewCustomer(items[value.label] !== undefined ? items[value.label][Object.keys(items[value.label])[0]].customer : "")
                                            setNewProduct(value.label)
                                        } else {
                                            setNewCustomer("")
                                            setNewProduct("")
                                        }
                                    }}
                                    options={items !== undefined ?
                                        Object.keys(items).sort().map((product, index) => ({ "label": product, id: index })) : {}}

                                    renderInput={(params) => <TextField fullWidth {...params} value={newProduct} label="Product" />} />
                            </Grid>
                            <Grid item xs={5}>
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
                            <Grid item xs={1}>
                                <ListItemButton onClick={() => {
                                    let copy = [...combo]
                                    copy.push("")
                                    setCombo(copy)
                                }} sx={{ height: "100%" }}>
                                    <ListItemIcon sx={{ height: "100%" }}>
                                        <AddRoundedIcon sx={{ height: "100%" }} />
                                    </ListItemIcon>
                                </ListItemButton>
                            </Grid>
                        </Grid>
                        {
                            combo.map((item, idx) => (
                                <Grid sx={{ mt: 1, mb: 1 }} key={idx} container spacing={4}>
                                    <Grid item xs={6}>
                                        <Autocomplete
                                            id="product-autocomplete"
                                            onChange={(_, value) => {
                                                if (value !== null) {
                                                    let copy = [...combo]
                                                    copy[idx] = value.label
                                                    setCombo(copy)
                                                } else {
                                                    setNewCustomer("")
                                                    setNewProduct("")
                                                }
                                            }}
                                            options={items !== undefined ?
                                                Object.keys(items).sort().map((product, idx) => ({ "label": product, id: idx })) : {}}

                                            renderInput={(params) => <TextField fullWidth {...params} value={item} label="Product" />} />
                                    </Grid>
                                    <Grid item xs={5}></Grid>
                                    <Grid item xs={1}>
                                        <ListItemButton onClick={() => {
                                            let copy = [...combo]
                                            copy.splice(idx, 1)
                                            setCombo(copy)
                                        }} sx={{ height: "100%" }}>
                                            <ListItemIcon sx={{ height: "100%" }}>
                                                <RemoveRoundedIcon sx={{ height: "100%" }} />
                                            </ListItemIcon>
                                        </ListItemButton>
                                    </Grid>
                                </Grid>
                            )
                            )
                        }
                        <DialogActions>
                            <Button variant="contianed" sx={{
                                color: "#fff",
                                backgroundColor: "RGBA(255, 0, 0, 1)",
                                "&:hover": {
                                    backgroundColor: "RGBA(255,0,0,0.8)"
                                }
                            }} onClick={() => { setDialogAdd(false) }}>
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
                                variant="contianed" onClick={() => {
                                    handleAddRow()
                                    setDialogAdd(false)
                                    if (!(newProduct in recipes)) {
                                        setDialogRecipe(true)
                                    }
                                }}>
                                Añadir
                            </Button>
                        </DialogActions>

                    </Box>
                </DialogContent>
            </Dialog>
        )
    }


    const renderDialogRecipe = () => {
        return (
            <Dialog onClose={() => { setDialogRecipe(false) }} maxWidth={false} open={dialogRecipe}>
                <DialogTitle>
                    Receta: {newProduct}
                </DialogTitle>
                <DialogContent >
                    <Box style={{ width: "50vw", paddingTop: 10 }}>

                        <Grid container spacing={4}>
                            <Grid item xs={6}>
                                <TextField onChange={(e) => { setWet(e.target.value) }} value={wet} fullWidth type="number" id="outlined-basic" label="Wet" variant="outlined" />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField onChange={(e) => { setDry(e.target.value) }} value={dry} fullWidth type="number" id="outlined-basic" label="Dry" variant="outlined" />
                            </Grid>
                        </Grid>
                        <DialogActions>
                            <Button variant="contianed" sx={{
                                color: "#fff",
                                backgroundColor: "RGBA(255, 0, 0, 1)",
                                "&:hover": {
                                    backgroundColor: "RGBA(255,0,0,0.8)"
                                }
                            }} onClick={() => { setDialogRecipe(false) }}>
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
                                variant="contianed"
                                onClick={async () => {
                                    await axios.post(`${process.env.REACT_APP_REST_BACKEND_URL}/addRecipe`, { product: newProduct, wp: wet, dry: dry })
                                    setDialogRecipe(false)
                                    setWet(0)
                                    setDry(0)
                                    getRecipes()
                                }}>
                                Añadir
                            </Button>
                        </DialogActions>
                    </Box>
                </DialogContent >
            </Dialog>
        )
    }


    const renderDialogBuscarProducto = () => {
        return (
            <Dialog maxWidth={false} open={dialogBuscar}>
                <DialogTitle>{tempItem}</DialogTitle>
                <DialogContent>
                    {items === undefined ? <></> :
                        tempItem.split(", ").map(productName => (
                            items[productName] !== undefined ?
                                <Grid item style={{ margin: 10, display: "flex", flexDirection: "row", overflow: "auto" }} xs={12}>
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
                                </Grid> : <></>))
                    }
                    <DialogActions>
                        <Button sx={{
                            color: "#fff",
                            backgroundColor: "RGBA(255, 0, 0, 1)",
                            "&:hover": {
                                backgroundColor: "RGBA(255,0,0,0.8)"
                            }
                        }} onClick={() => { setDialogBuscar(false) }}>
                            Cerrar
                        </Button>
                    </DialogActions>

                </DialogContent>
            </Dialog>
        )
    }

    const handleOnExport = async (referenceDay) => {
        console.log(`${process.env.REACT_APP_REST_BACKEND_URL}/${referenceDay}/getRows`)
        const data = await axios.get(`${process.env.REACT_APP_REST_BACKEND_URL}/${referenceDay}/getRows`)
            .then(res => res.data)
            .catch(err => console.log(err))
        console.log(data)
        let objectMaxLength = Array(21).fill(10)
        let bodyTemp = data.map(item => {
            const tempRetorno = JSON.parse(JSON.stringify(item))
            let tempPo = ""
            for (var i = 0; i < item.po.length; i++) {
                tempPo = tempPo + item.po[i].split(" ")[0] + " " + item.poDescription[Object.keys(item.poDescription)[i]] + item.po[i].charAt(item.po[i].length - 1) + "    "
            }
            delete tempRetorno["_id"]
            delete tempRetorno["actions"]
            tempRetorno["po"] = tempPo
            let temp_dry = ""
            Object.keys(item.dry_boxes).forEach((key) => {
                temp_dry = temp_dry + item.dry_boxes[key] + key + " "
            })
            tempRetorno["dry_boxes"] = temp_dry
            delete tempRetorno["poDescription"]
            for (var j = 0; j < Object.keys(tempRetorno).length; j++) {
                if (objectMaxLength[j] < tempRetorno[Object.keys(tempRetorno)[j]].length) {
                    objectMaxLength[j] = tempRetorno[Object.keys(tempRetorno)[j]].length
                }
            }
            return tempRetorno
        })
        var wsCols = objectMaxLength.map(val => ({
            width: val + 2
        }))
        const ws = utils.json_to_sheet(bodyTemp)
        ws["!cols"] = wsCols;
        const wb = utils.book_new()
        utils.book_append_sheet(wb, ws, (referenceDay));
        writeFileXLSX(wb, "Program " + referenceDay + " " + (new Date()).toLocaleDateString() + ".xlsx")
    }
    const handleOpenSideBar = () => {
        setOpenSideBar(true)
    }
    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setOpenSideBar(open);
    };

    const handleOnNewDay = async () => {
        handleOnExport("sameday")
        await axios.get(`${process.env.REACT_APP_REST_BACKEND_URL}/newDay`)
        client.send(
            JSON.stringify({
                day: props.day,
                type: "update",
            })
        )
    }
    return (
        <div style={{ overflowY: "hidden" }}>
            <>
                {renderDialogBuscarProducto()}
                {renderDialogCrearRow()}
                {renderDialogRecipe()}
                <WetPackLineasComponent workOrders={workOrders} open={openWetPackDialog} onClose={() => { setOpenWetPackDialog(false) }} rows={rows} />
                <Box sx={{
                    height: "95vh",
                    width: '100%',
                }}>
                    <SwipeableDrawer
                        open={openSideBar}
                        anchor="bottom"
                        onClose={toggleDrawer("bottom", false)}
                        onOpen={toggleDrawer("bottom", true)}
                    >
                        <List>
                            <ListItem sx={{
                                display: (rol === 'planeacion' || rol === 'admin' ? 'inline-flex' : 'none')
                            }}>
                                <ListItemButton
                                    onClick={refreshItems}>
                                    <ListItemIcon>
                                        <SyncRoundedIcon />
                                    </ListItemIcon>
                                    <ListItemText>Refrescar Inventario</ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <ListItem sx={{
                                display: (rol === 'planeacion' || rol === 'admin' ? 'inline-flex' : 'none')
                            }}>
                                <ListItemButton
                                    onClick={() => {
                                        window.open('/recipes')
                                    }}>
                                    <ListItemIcon>
                                        <CollectionsBookmarkIcon />
                                    </ListItemIcon>
                                    <ListItemText>Recetas</ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <Divider />
                            <ListItem sx={{
                                display: (rol === 'planeacion' || rol === 'admin' ? 'inline-flex' : 'none')
                            }}>
                                <ListItemButton
                                    onClick={handleOnNewDay}>
                                    <ListItemIcon>
                                        <KeyboardTabRoundedIcon />
                                    </ListItemIcon>
                                    <ListItemText>Cambio de día</ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemButton
                                    onClick={() => {
                                        localStorage.clear()
                                        window.location.href = "/login"
                                    }}>
                                    <ListItemIcon>
                                        <LogoutRoundedIcon />
                                    </ListItemIcon>
                                    <ListItemText>Cerrar Sesión</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </SwipeableDrawer>
                    <DataGrid
                        aria-label="Marco"
                        columnVisibilityModel={{
                            _id: false
                        }}
                        loading={!(items !== undefined && workOrders !== undefined)}
                        initialState={
                            {
                                columns: {
                                    columnVisibilityModel: {
                                        columnVisibilityModel: {
                                            id: Roles[rol].id.view,
                                            _id: false,
                                            actions: Roles[rol].actions.view,
                                            date: Roles[rol].date.view,
                                            customer: Roles[rol].customer.view,
                                            product: Roles[rol].product.view,
                                            po: Roles[rol].po.view,
                                            poDescription: Roles[rol].poDescription.view,
                                            dry_boxes: Roles[rol].dry_boxes.view,
                                            pull_date: Roles[rol].pull_date.view,
                                            wet_pack: Roles[rol].wet_pack.view,
                                            comment: Roles[rol].comment.view,
                                            priority: Roles[rol].priority.view,
                                            wo: Roles[rol].wo.view,
                                            exit_order: Roles[rol].exit_order.view,
                                            line: Roles[rol].line.view,
                                            turno: Roles[rol].turno.view,
                                            assigned: Roles[rol].assigned.view,
                                            made: Roles[rol].made.view,
                                            order_status: Roles[rol].order_status.view,
                                            scan_status: Roles[rol].scan_status.view,
                                            box_code: Roles[rol].box_code.view,
                                            hargoods: Roles[rol].hargoods.view,
                                            hargoods_status: Roles[rol].hargoods_status.view,
                                        }
                                    }
                                },
                                filter: {
                                    filterModel: (
                                        rol in RolesLineas ? {
                                            items: [
                                                {
                                                    columnField: "line",
                                                    operatorValue: "is",
                                                    value: rol
                                                }
                                            ]
                                        } : {
                                            items: [
                                                {}
                                            ]
                                        }
                                    )
                                }
                            }
                        }
                        sx={styleDataGrid}
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
                    <Typography sx={{
                        position: "Sticky",
                        bottom: "5px",
                        marginLeft: "10px"

                    }}>
                        Total WetPacks: {rows.map(row => row.wet_pack).reduce((partialSum, a) => partialSum + (a === undefined ? 0 : Math.round(a * 100) / 100), 0)}
                    </Typography>
                    <div
                        style={{
                            display: (rol in RolesBotones ? "flex" : "none"),
                            flexDirection: "row",
                            gap: "1rem",
                            position: "absolute",
                            bottom: "6px",
                            width: "100vw",
                        }}>
                        <Fab
                            disabled={!(items !== undefined && workOrders !== undefined)}
                            sx={{
                                marginLeft: "auto",
                                backgroundColor: "#000",
                                '&:hover': {
                                    backgroundColor: "rgba(0,0,0,0.6)"
                                }
                            }}
                            onClick={handleOpenSideBar}
                        >
                            <SettingsRoundedIcon sx={{ color: "#fff" }} />
                        </Fab>
                        <Fab
                            disabled={!(items !== undefined && workOrders !== undefined)}
                            sx={{
                                backgroundColor: Paleta.amarillo,
                                '&:hover': {
                                    backgroundColor: Paleta.amarilloHover
                                }
                            }}
                            onClick={() => { setOpenWetPackDialog(true) }}
                        >
                            <QueryStatsRoundedIcon />
                        </Fab>
                        <Fab
                            disabled={!(items !== undefined && workOrders !== undefined)}
                            sx={{ backgroundColor: "#fff" }}
                            onClick={() => {
                                handleOnExport(props.day)
                            }}
                        >
                            <img
                                alt="Excel"
                                style={{
                                    opacity: (items !== undefined && workOrders !== undefined ? 1 : 0.1),
                                    color: "#fff",
                                    height: "30px",
                                    width: "30px"
                                }}
                                src={Excel}></img>
                        </Fab>
                        <Fab
                            disabled={!(items !== undefined && workOrders !== undefined)}
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
        </div >
    )
}