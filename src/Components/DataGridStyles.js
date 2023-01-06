import Paleta from "../util/Pallete"

/**
 * sx Styles for the DataGrdid Component
 */
export const styleDataGrid = {
    '.MuiSvgIcon-root': {
        color: "#fff"
    },
    '.MuiDataGrid-columnHeadersInner': {
        backgroundColor: Paleta.azulOscuro,
        color: "#fff"
    },
    '& .prioridad1': {
        backgroundColor: '#ffff00',
    },
    '& .prioridad1Cell': {
        backgroundColor: '#ffff00',
        fontWeight: 900,
        color: "#FF0000"
    },
    '& .prioridad2Cell': {
        fontWeight: 900,
        color: "#FF8000"
    },
    '& .prioridad3Cell': {
        fontWeight: 900,
        color: "#00C244"
    },
    '& .pausada': {
        backgroundColor: "#FF5050",
    },
    '& .pausadaCell': {
        backgroundColor: "#FF4F4F",
        fontWeight: 900,
    },
    '& .orderStatusArmadoCell': {
        backgroundColor: "#92d050",
        fontWeight: 900
    },
    '& .orderStatusNoArmadoCell': {
        backgroundColor: "#ff0000",
        fontWeight: 900
    },
    '& .orderStatusEnProcesoCell': {
        backgroundColor: "#ffc000",
        fontWeight: 900
    },
    '& .scanStatusEscaneadoCell': {
        backgroundColor: "#92d050",
        fontWeight: 900
    },
    '& .scanStatusNoEscaneadoCell': {
        backgroundColor: "#ff0000",
        fontWeight: 900
    },
    '& .hargoodsDisponibleCell': {
        backgroundColor: "#a9d08e"
    },
    '& .hargoodsNoeninventarioCell': {
        backgroundColor: "#ff6600"
    },
    '& .hargoodsStatusEntregadoCell': {
        backgroundColor: "#a9d08e"
    },
    '& .hargoodsStatusPendientePorEntregarCell': {
        backgroundColor: "#ffcc00"
    }
}