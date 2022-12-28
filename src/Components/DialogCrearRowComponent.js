import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';

/**
 * @param {{
 *  items: object
 *  newProduct: string
 *  newCustomer: string
 *  combo: array
 *  open: boolean
 *  onClose: function
 *  onProductChange: function
 *  onCustomerChange: function
 *  onAddCombo: function
 *  onProductChange: function
 *  onDeleteCombo: function
 *  onAddRecipe: function
 * }} props 
 * @returns 
 */

export default function DialogCrearRowComponent(props) {
    const { items, newProduct, newCustomer, customers, combo, open, onClose, onProductChange, onCustomerChange, onAddCombo, onProductChangeCombo, onDeleteCombo, onAddRecipe } = props
    return <Dialog onClose={onClose} maxWidth={false} open={open}>
        <DialogTitle>Añadir fila</DialogTitle>
        <DialogContent>

            <Box style={{ width: "50vw", paddingTop: 10 }}>
                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <Autocomplete
                            id="product-autocomplete"
                            onChange={onProductChange}
                            options={items !== undefined ?
                                Object.keys(items).sort().map((product, index) => ({ "label": product, id: index })) : []}
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
                                onChange={onCustomerChange}
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
                        <ListItemButton onClick={onAddCombo} sx={{ height: "100%" }}>
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
                                    onChange={(_, value) => { onProductChangeCombo(value, idx) }}
                                    options={items !== undefined ?
                                        Object.keys(items).sort().map((product, idx) => ({ "label": product, id: idx })) : []}

                                    renderInput={(params) => <TextField fullWidth {...params} value={item} label="Product" />} />
                            </Grid>
                            <Grid item xs={5}></Grid>
                            <Grid item xs={1}>
                                <ListItemButton onClick={() => onDeleteCombo(idx)} sx={{ height: "100%" }}>
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
                        variant="contianed" onClick={onAddRecipe}>
                        Añadir
                    </Button>
                </DialogActions>

            </Box>
        </DialogContent>
    </Dialog>
}