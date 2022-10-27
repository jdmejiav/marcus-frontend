//import moment from "moment"

export async function workOrdersFetch() {
    const myHeaders = new Headers();
    myHeaders.append("Cache-Control", "no-cache");
    myHeaders.append("Ocp-Apim-Subscription-Key", process.env.REACT_APP_API_KEY);
    myHeaders.append("Access-Control-Allow-Origin", "*");
    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    let workOrders = {}
    const today = new Date() 
    const tumorrow = new Date()
    today.setDate(today.getDate())
    tumorrow.setDate(tumorrow.getDate() + 1)
    //await fetch("/production/GetProductionWorkOrders/BQC/" + moment(today).format("YYYY-MM-DD") + "/" + moment(tumorrow).format("YYYY-MM-DD"), requestOptions)
    await fetch("/production/GetProductionWorkOrders/BQC/2022-10-20/2022-10-28", requestOptions)
        .then(async (res) => {
            const data = await res.json()
            console.log(data)
            data.forEach(item => {
                
                if (item.productionWorkOrderId in workOrders) {
                    workOrders[item.productionWorkOrderId].boxes = Number(workOrders[item.productionWorkOrderId].boxes) + Number(item.boxes)
                }
                else {
                    workOrders[item.productionWorkOrderId] = {
                        boxes: Number(item.boxes),
                        task: item.task + item.subTask,
                    }
                }
            }
            )


        })
        .catch(error => console.log('error', error));
    
    return workOrders
}