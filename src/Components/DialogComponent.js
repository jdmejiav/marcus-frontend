import React, { useEffect, useState } from "react";


export default function DialogComponent(props) {
    const [visible, setVisible] = useState(props.visible)
    useEffect(() => {
        setVisible(props.visible)
    }, [props])
    return (
        <div style={
            {
                transition: "opacity 0.5s",
                opacity: 1,
                top: 0,
                left: 0,
                position: "absolute",
                display: visible ? "flex" : "none",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                zIndex: 1,
                backgroundColor: "rgba(0,0,0,0.6)",
                height: "100vh",
                width: "100vw",
            }
        }>

            {props.children}

        </div>
    )
}