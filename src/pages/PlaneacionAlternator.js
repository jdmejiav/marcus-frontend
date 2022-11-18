import React, { useState } from "react";
import PlaneacionPage from "./PlaneacionPage";
import Button from "@mui/material/Button";
import Paleta from "../util/Pallete";

export default function PlaneacionAlternator({ children }) {
    const [selected, setSelected] = useState(1)
    return (
        <div style={{ height: "100vh" }}>

            <div style={{ height: "95vh" }}>
                {
                    selected === 1 ? <PlaneacionPage day={"sameday"} style={{ position: "absolute", left: 0, top: 0 }} /> : <PlaneacionPage day={"nextday"} style={{ position: "absolute", left: 0, top: 0 }} />
                }
            </div>
            <div style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: "5vh", backgroundColor: Paleta.amarilloClaro, display: "flex", flexDirection: "row" }}>
                <Button variant="contained" onClick={() => {
                    setSelected(1)
                }}
                    style={{
                        height: selected === 1 ? "85%" : "70%",
                        marginTop: "auto",
                        backgroundColor: selected === 1 ? Paleta.amarillo : Paleta.amarilloNoSeleccionado,
                        transform: "skew(-20deg)"
                    }}>

                    Same Day
                </Button>
                <Button variant="contained" style={{
                    height: selected === 2 ? "85%" : "70%",
                    marginTop: "auto",
                    backgroundColor: selected === 2 ? Paleta.amarillo : Paleta.amarilloNoSeleccionado,
                    transform: "skew(-20deg)"
                }}
                    onClick={() => {
                        setSelected(2)
                    }}
                >
                    Next Day
                </Button>
            </div>

        </div>
    )
}