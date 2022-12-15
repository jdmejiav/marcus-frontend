import React from "react";
import { RolesBotones } from "../util/RolesDiagram";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add'
import Paleta from "../util/Pallete";
import Excel from '../images/excel-icon.svg'
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
export default function BotonesAdminComponent(props) {
    const { items, workOrders, onOpenSideBar, onWetPacksInfo, onExport, onAdd, rol } = props

    return <div
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
            onClick={onOpenSideBar}
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
            onClick={onWetPacksInfo}
        >
            <QueryStatsRoundedIcon />
        </Fab>
        <Fab
            disabled={!(items !== undefined && workOrders !== undefined)}
            sx={{ backgroundColor: "#fff" }}
            onClick={onExport}
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
            }} onClick={onAdd} color="primary" aria-label="add">
            <AddIcon />
        </Fab>
    </div >
}