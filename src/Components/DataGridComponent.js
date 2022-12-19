import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Roles, RolesLineas } from "../util/RolesDiagram";
import { styleDataGrid } from "./DataGridStyles";


/**
 * 
 * @param {{
 *  rows: array
 *  columns: array
 *  items: object
 *  workOrders: object
 *  onRowchange: function
 *  rol: string
 * }} props Props for the component
 * @returns React.
 */
export default function DataGridComponent(props) {
    const { rows, columns, items, workOrders, onRowchange, rol } = props
    return <DataGrid
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
        onCellEditCommit={onRowchange}
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
}