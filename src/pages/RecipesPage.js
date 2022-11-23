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
const RecipesPage = () => {

    const [recipes, setRecipes] = useState(undefined)
    useEffect(() => {
        getRecipes()
    }, [])
    const getRecipes = async () => {
        const data = await axios.get(`${process.env.REACT_APP_REST_BACKEND_URL}/getRecipes`).then(res => res.data).catch(err => console.log(err))
        let copy = data
        Object.keys(copy).forEach(item => {
            copy[item].edit = true
        })
        setRecipes(copy)

    }

    return <Box sx={{ m: 4 }}>
        {recipes === undefined ?
            <></>
            :
            <Grid container spacing={4}>
                {Object.keys(recipes).sort().map(res =>
                    <Grid item xs={3}>
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
                                        <TextField type="number" fullWidth disabled={recipes[res].edit} id="outlined-basic" label="Wet Packs" variant="outlined" value={recipes[res].wp} onChange={(e) => {
                                            let copy = { ...recipes }
                                            copy[res].wp = e.target.value
                                            setRecipes(copy)
                                        }}>
                                        </TextField>
                                    </ListItem>
                                    <ListItem>
                                        <TextField type="number" fullWidth disabled={recipes[res].edit} id="outlined-basic" label="Dry" variant="outlined" value={recipes[res].dry} onChange={(e) => {
                                            let copy = { ...recipes }
                                            copy[res].dry = e.target.value
                                            setRecipes(copy)
                                        }}></TextField>
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
    </Box>
}

export default RecipesPage