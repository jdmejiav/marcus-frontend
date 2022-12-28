import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import Paleta from "../util/Pallete";
import AddIcon from '@mui/icons-material/Add'
import Fab from '@mui/material/Fab';
import DialogRecipeComponent from "../Components/DialogRecipeComponent";
import Autocomplete from "@mui/material/Autocomplete";

/**
 * Page to see and edit the wetpacks recipes
 */

const RecipesPage = () => {
    /**
     * @property {object} 0 - Recipes object dry, and wp keys
     * @property {function} 1 - Set Method for recipes
     */
    const [recipes, setRecipes] = useState(undefined)

    const [dialogAddRecipe, setDialogAddRecipe] = useState(false)
    const [dry, setDry] = useState(0)
    const [wet, setWet] = useState(0)
    const [newProduct, setNewProduct] = useState("")
    const [items, setItems] = useState(undefined)

    useEffect(() => {
        getItems()
        getRecipes()

    }, [])
    const getItems = async () => {
        const info = await axios.get(`${process.env.REACT_APP_REST_BACKEND_URL}/fetchInventory`).then(res => { return res.data; }).catch(err => console.log(err))
        setItems(info.items)
        console.log(items)
    }
    const getRecipes = async () => {
        const data = await axios.get(`${process.env.REACT_APP_REST_BACKEND_URL}/getRecipes`).then(res => res.data).catch(err => console.log(err))
        let copy = data
        Object.keys(copy).forEach(item => {
            copy[item].edit = true
        })
        setRecipes(copy)
    }

    return <Box sx={{ m: 4 }}>
        <DialogRecipeComponent
            dry={dry} wet={wet} newProduct={newProduct} open={dialogAddRecipe} onClose={() => { setDialogAddRecipe(false) }} onWetChange={(e) => setWet(e.target.value)} onDryChange={(e) => setDry(e.target.value)}
            onAddRecipe={async () => {
                await axios.post(`${process.env.REACT_APP_REST_BACKEND_URL}/addRecipe`, { product: newProduct, wp: wet, dry: dry })
                setDialogAddRecipe(false)
                setWet(0)
                setDry(0)
                getRecipes()
            }}
        >
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Autocomplete
                        sx={{ mb: 2 }}
                        id="product-autocomplete"
                        onChange={(_, value) => {
                            if (value !== null) {
                                setNewProduct(value.label)
                            } else {
                                setNewProduct("")
                            }
                        }}
                        options={items !== undefined ?
                            Object.keys(items).sort().map((product, index) => ({ "label": product, id: index })) : []}
                        renderInput={(params) => <TextField fullWidth {...params} value={newProduct} label="Product" />} />
                </Grid>
            </Grid>
        </DialogRecipeComponent>

        {
            recipes === undefined ?
                <></>
                :
                <Grid container spacing={4}>
                    {Object.keys(recipes).sort().map((res, idx) =>
                        <Grid key={idx} item xs={3}>
                            <Card>
                                <CardHeader
                                    title={res}
                                    action={
                                        <IconButton onClick={() => {
                                            let copy = { ...recipes }
                                            copy[res].edit = !copy[res].edit
                                            setRecipes(copy)
                                        }} aria-label="settings">
                                            <EditRoundedIcon />
                                        </IconButton>
                                    } />
                                <CardContent>
                                    <List>
                                        <ListItem>
                                            <TextField type="number" fullWidth disabled={recipes[res].edit} id="outlined-basic" label="Bunch x Wet Pack" variant="outlined" value={recipes[res].wp} onChange={(e) => {
                                                let copy = { ...recipes }
                                                copy[res].wp = e.target.value
                                                setRecipes(copy)
                                            }}>
                                            </TextField>
                                        </ListItem>
                                        <ListItem>
                                            <TextField type="number" fullWidth disabled={recipes[res].edit} id="outlined-basic" label="Bunch x Dry Full" variant="outlined" value={recipes[res].dry} onChange={(e) => {
                                                let copy = { ...recipes }
                                                copy[res].dry = e.target.value
                                                setRecipes(copy)
                                            }}>
                                            </TextField>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemButton
                                                onClick={async () => {
                                                    await axios.post(`${process.env.REACT_APP_REST_BACKEND_URL}/updateRecipe/${recipes[res]._id}`, recipes[res])
                                                        .then(res => getRecipes())
                                                        .catch(err => console.log(err))
                                                }}
                                                sx={{
                                                    backgroundColor: Paleta.azulOscuro, color: "white", borderRadius: "5px", "&:hover": {
                                                        backgroundColor: Paleta.azulHover
                                                    }
                                                }} disabled={recipes[res].edit}>
                                                <ListItemText>
                                                    Guardar
                                                </ListItemText>
                                                <ListItemIcon>
                                                    <SaveRoundedIcon sx={{ color: "white", marginLeft: "auto" }}></SaveRoundedIcon>
                                                </ListItemIcon>

                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>)}
                </Grid>
        }
        <div style={{
            position: "sticky",
            bottom: 10
        }}>
            <Fab
                onClick={() => setDialogAddRecipe(true)}
                sx={{ backgroundColor: Paleta.azulOscuro }}
                style={{
                    marginRight: "1rem"
                }} color="primary" aria-label="add">
                <AddIcon />
            </Fab>
        </div>
    </Box >
}

export default RecipesPage