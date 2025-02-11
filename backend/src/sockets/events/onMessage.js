import { updateTask } from "../../services/taskService.js";

export default (socket, data) => {
    console.log('onMessage', data);
    //const {path, action, payload} = JSON.parse(data);
    // if(path === "tasks") {
    //     console.log(path);
    //     switch(action) {
    //         case "update":
    //             console.log(action); 
    //             const updatedTask = updateTask(payload.id, payload.query);
    //             console.log(updatedTask);
    //         break;
    //     }
    // }
}