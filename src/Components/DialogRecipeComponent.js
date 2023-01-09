import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

/**
 * 
 * @param {{
 * dry: number
 * wet: number
 * open: boolean
 * onClose: function
 * newProduct: string
 * onDryChange: function
 * onWetChange: function
 * onAddRecipe: function
 * children: React.Component
 * }} props 
 * @returns 
 */
export default function DialogRecipeComponent(props) {
    const { dry, wet, open, onClose, newProduct, onDryChange, onWetChange, onAddRecipe, children } = props;
    return <Dialog onClose={onClose} maxWidth={false} open={open}>
        <DialogTitle>
            Receta: {newProduct}
        </DialogTitle>
        <DialogContent >
            <Box style={{ width: "50vw", paddingTop: 10 }}>
                {children === undefined ? <></> : <>{children}</>}
                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <TextField onChange={onWetChange} value={wet} fullWidth type="number" id="outlined-basic" label="Wet" variant="outlined" />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField onChange={onDryChange} value={dry} fullWidth type="number" id="outlined-basic" label="Dry" variant="outlined" />
                    </Grid>
                </Grid>
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
                    <Button
                        sx={{
                            color: "#fff",
                            backgroundColor: "RGBA(152, 208, 70, 1)",
                            "&:hover": {
                                backgroundColor: "RGBA(152, 208, 70, 0.8)"
                            }
                        }}
                        variant="contianed"
                        onClick={onAddRecipe}>
                        Añadir
                    </Button>

                </DialogActions>
            </Box>
        </DialogContent >
    </Dialog>
}