import React, { useEffect, useState } from "react"
import { ActionButton } from "../../components/Button/ActionButton"
import { IoAdd, IoMailOutline } from "react-icons/io5"
import { Card } from "../../components/Card/Card"
import { FaLinkedin } from "react-icons/fa"

const TaskCard = ({ task, onEdit, onDragStart }) => {
    const handleTaskClick = () => {
        onEdit(task);
    }
     return(
        <div 
        className="card mb-3" 
        onClick={handleTaskClick}
        draggable="true"
        onDragStart={(e) => onDragStart(e, task)}>
            <div className="card-body">
                <h5 className="card-title">{task.title}</h5>
                <p className="card-description">- {task.description}</p>
            </div>
        </div>
    )
}

export const Dashboard = () => {

    const [show_modal, set_show_modal] = useState(false)
    const [selected_task, set_selected_task] = useState(null);
    const [edit_mode, set_edit_mode] = useState(false);
    const [cards, set_cards] = useState(() => {
        //Load cards from local storage when component mounts
        const savedCards = JSON.parse(localStorage.getItem("tasks"));
        return savedCards || {
        todo : [],
        doing : [],
        done : [],
        }
    });

    //Save cards to local storage whenever cards state changes
    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(cards));
        // console.log("Cards saved to local storage")
    },[cards])

    const handleModalClose = () => {
        set_show_modal(false);
    }
    const handleAddCard = () => {
        set_edit_mode(false)
        set_show_modal(true);
        // console.log("modal open");
    } 

    //Referred from an example shown in a course which is available on Plural Sight
    const addCard = (newCard) => {
        console.log("newCard:", newCard, newCard.status);
        if(newCard && newCard.status){
            const column = newCard.status.toLowerCase();
        set_cards((prevCards) => ({
            ...prevCards,
            [column]: [...prevCards[column], newCard]
        }));
        handleModalClose(); 
    } else {
        console.log("Failed to add")
    }
    }

    const handleEditTask = (task) => {
        set_selected_task(task);
        set_edit_mode(true);
        set_show_modal(true);
    }

    const handleDragStart = (event, task) => {
        event.dataTransfer.setData("text/plain", JSON.stringify(task));
    }

    const handleDrop = (event, column) => {
        try{
            event.preventDefault();
            const droppedTask = JSON.parse(event.dataTransfer.getData("text/plain"));
            const updatedTask = {...droppedTask, status: column};
            const updatePrevColumn = cards[droppedTask.status].filter(task => task.title !== droppedTask.title)
            const updatedCards = {
                ...cards,
                [column]: [...cards[column], updatedTask],
                [droppedTask.status]: updatePrevColumn
            }
            set_cards(updatedCards);
        } catch(error){
            console.log("Error while dropping task: ", error);
        }
    }

    const handleDragOver = (event) => {
        event.preventDefault();
    }

    return(
    <div className="Dashboard">
      <header className="page-header px-3 d-flex align-items-center justify-content-between">
        <h1 style={{color:'white'}} className="py-3">Project: All is well</h1>
        <ActionButton
        onClick={() => {
            set_edit_mode(false)
            console.log(edit_mode)
            handleAddCard()}}
        icon={
            <IoAdd
            style={{height:"2rem", width:"1.5rem"}}/>
        }
        />
      </header>
      {/* Adding three columns for task view */}
      <main className='container'>
        <div className='row pb-3'>
        <div 
        className='col task-view mx-2'
        onDrop={(event) => handleDrop(event, "todo")}
        onDragOver={handleDragOver}>
          <h1 className="mt-3 mx-2 column-heading">To Do</h1>
          <hr/>
            {cards.todo.map((task, index) => (
                <TaskCard
                key={index}
                task={task}
                onEdit={handleEditTask}
                onDragStart={handleDragStart}
                />
            ))}
        </div>
        <div 
        className='col task-view mx-2'
        onDrop={(event) => handleDrop(event, "doing")}
        onDragOver={handleDragOver}>
          <h1 className="mt-3 mx-2 column-heading">Doing</h1>
          <hr/>
          {cards.doing.map((task, index) => (
                <TaskCard
                key={index}
                task={task}
                onEdit={handleEditTask}
                onDragStart={handleDragStart}
                />
            ))}
        </div>
        <div 
        className='col task-view mx-2'
        onDrop={(event) => handleDrop(event, "done")}
        onDragOver={handleDragOver}>
          <h1 className="mt-3 mx-2 column-heading">Done</h1>
          <hr/>
          {cards.done.map((task, index) => (
                <TaskCard
                key={index}
                task={task}
                onEdit={handleEditTask}
                onDragStart={handleDragStart}
                />
            ))}
        </div>
        </div>
      </main>
      <footer>
        <hr/>
        <div className="pt-1 d-flex flex-column align-items-center justify-content-center footer-content">
        <p className="mb-0 align-items-center">
            © 2024 React App by Divya Thakare
        </p>
        <div className="contact-icons">
            <a href="mailto:divyath.17@gmail.com">
                <IoMailOutline style={{color:"whitesmoke", marginRight: '5px'}}/>
            </a>
            <a href="https://www.linkedin.com/in/divya-thakare-77359a162/" target="blank">
                <FaLinkedin style={{color:"whitesmoke", marginLeft: '5px'}}/>
            </a>
        </div>
        </div>
      </footer>
      {/* Rendering card component */}
      <Card 
        show={show_modal} 
        handleClose={handleModalClose} 
        addCard={addCard} 
        selected_task={selected_task}
        edit_mode={edit_mode}
        cards={cards}
        set_cards={set_cards}
        />
    </div>
    );
}