import axios from "axios"

export async function workOrdersFetch() {
    const workOrders = await axios.get(`${process.env.REACT_APP_REST_BACKEND_URL}/fetchWorkOrders`).then(res => res.data)
    console.log(workOrders)
    return workOrders
}