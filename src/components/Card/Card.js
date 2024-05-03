import { Alert, Form, FormControl, FormGroup, FormLabel, FormSelect, Modal } from "react-bootstrap"
import { ActionButton } from "../Button/ActionButton"
import { useEffect, useState } from "react"

export const Card = ({
    show,
    handleClose,
    addCard,
    selected_task,
    edit_mode,
    cards,
    set_cards,
}) => {
    const [task_title, set_task_title]= useState("");
    const [task_description, set_task_description] = useState("");
    const [status, set_status] = useState("todo")
    const [validation_error, set_validation_error] =useState("");

    useEffect(() => {
        if(selected_task){
            set_task_title(selected_task.title);
            set_task_description(selected_task.description);
            set_status(selected_task.status);
        }
    },[selected_task])

    const handleSubmit = (event) => {
        event.preventDefault();
        //In edit mode, remove the selected task from its initial column
        if(edit_mode) {
            const column = selected_task.status.toLowerCase();
            const updatedCards = {...cards};
            updatedCards[column]= updatedCards[column].filter(task => task.title !== selected_task.title);
            set_cards(updatedCards);
        }
        // Validate the task title
        const titleRegex = /^[A-Za-z\s]+$/; //Found this from Chatgpt
        if(!titleRegex.test(task_title)){
            set_validation_error("Title should only contain alphabets");
            return;
        }
        //Validate the description
        if(task_description.length > 25){
            set_validation_error("Description can have 25 characters only");
            return;
        }
        //Clear error
        set_validation_error("");
        //Calling addCard function with the new card data
        addCard({
            title: task_title,
            description: task_description,
            status: status,
        })
        // //Clear input fileds
        // set_task_title("");
        // set_task_description("");
        // set_status("todo");
        // Close modal
        handleClose();
    };

    const handleDelete = (taskToDelete) => {
        //get the column of the task
        const column = taskToDelete.status.toLowerCase();
         const updatedCards = {
            ...cards,
            [column]: cards[column].filter(task => task.title !== taskToDelete.title),
         };
         set_cards(updatedCards);
         handleClose();
    };

    const handleCloseWithoutSave = () => {
        // If modal is opened for editing, reset state to selected task values
        if (edit_mode && selected_task) {
            set_task_title(selected_task.title);
            set_task_description(selected_task.description);
            set_status(selected_task.status);
        } else {
            // Reset input fields
            set_task_title("");
            set_task_description("");
            set_status("todo");
            // Clear error
        }
        set_validation_error("");
        // Close modal
        handleClose();
    };


    return(
        <Modal show={show} onHide={handleCloseWithoutSave}>
            <Modal.Header closeButton>
                <Modal.Title>Add Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <FormGroup controlId="task_title" className="pb-3">
                        <FormLabel>Task Title</FormLabel>
                        <FormControl
                        type="text"
                        placeholder="Enter Task Title"
                        value={task_title}
                        onChange={(e) => set_task_title(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup controlId="task_description" className="pb-3">
                        <FormLabel>Description</FormLabel>
                        <FormControl
                        type="text"
                        placeholder="Enter Description"
                        value={task_description}
                        onChange={(e) => set_task_description(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup className="pb-3">
                        <FormLabel htmlFor="taskStatus">Status</FormLabel>
                        <FormSelect 
                        aria-label="Select Status" 
                        id="taskStatus"
                        value={status}
                        onChange={(e) => set_status(e.target.value)}>
                            <option value="todo">To-Do</option>
                            <option value="doing">Doing</option>
                            <option value="done">Done</option>
                        </FormSelect>
                    </FormGroup>
                    <div/>
                    {validation_error && <Alert variant="danger">{validation_error}</Alert>}
                    { edit_mode ? (
                    <>
                    <div className="d-flex align-items-center justify-content-between">
                        <ActionButton
                        onClick={() => handleDelete(selected_task)}
                        text="Delete"
                        />
                        <ActionButton
                        // type = "submit"
                        onClick={handleSubmit}
                        text="Save"
                        />
                    </div>
                    </>
                    ) : (
                    <div className="d-flex justify-content-end">
                    <ActionButton
                    // type = "submit"
                    onClick={handleSubmit}
                    text="Save"
                    />
                    </div> 
                    )}
                </Form>
            </Modal.Body>
        </Modal>
    )
}