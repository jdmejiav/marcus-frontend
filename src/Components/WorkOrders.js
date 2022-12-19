import axios from "axios"

/**
 * Get Workorders array from WebFlowers API
 * @returns object
 */
export async function workOrdersFetch() {
    const workOrders = await axios.get(`${process.env.REACT_APP_REST_BACKEND_URL}/fetchWorkOrders`).then(res => res.data)
    return workOrders
}