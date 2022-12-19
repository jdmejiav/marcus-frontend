import React from "react";

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import KeyboardTabRoundedIcon from '@mui/icons-material/KeyboardTabRounded';

/**
 * 
 * @param {{
 *  openSideBar: boolean
 *  onClose: function
 *  onOpen: boolean
 *  rol: string
 *  onRefreshInventory: function
 *  onRecipes: function
 *  onNewDay: function
 *  onLogout: function
 * }}} props 
 * @returns 
 */
export default function SettingsDrawerComponent(props) {
    const { openSideBar, onClose, onOpen, rol, onRefreshInventory, onRecipes, onNewDay, onLogout } = props


    return <SwipeableDrawer
        open={openSideBar}
        anchor="bottom"
        onClose={onClose}
        onOpen={onOpen}
    >
        <List>
            <ListItem sx={{
                display: (rol === 'planeacion' || rol === 'admin' ? 'inline-flex' : 'none')
            }}>
                <ListItemButton
                    onClick={onRefreshInventory}>
                    <ListItemIcon>
                        <SyncRoundedIcon />
                    </ListItemIcon>
                    <ListItemText>Refrescar Inventario</ListItemText>
                </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem sx={{
                display: (rol === 'planeacion' || rol === 'admin' ? 'inline-flex' : 'none')
            }}>
                <ListItemButton
                    onClick={onRecipes}>
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
                    onClick={onNewDay}>
                    <ListItemIcon>
                        <KeyboardTabRoundedIcon />
                    </ListItemIcon>
                    <ListItemText>Cambio de día</ListItemText>
                </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemButton
                    onClick={onLogout}>
                    <ListItemIcon>
                        <LogoutRoundedIcon />
                    </ListItemIcon>
                    <ListItemText>Cerrar Sesión</ListItemText>
                </ListItemButton>
            </ListItem>
        </List>
    </SwipeableDrawer>
}