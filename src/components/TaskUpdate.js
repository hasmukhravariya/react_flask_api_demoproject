import React from "react";
import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal"
import { gql, useMutation } from '@apollo/client';

export const TASK_UPDATE = gql`
  mutation($updateTaskInput: updateTaskData!){
    updateTask(input: $updateTaskInput) {
      status,
      msg,
      errors,
      task{
        id
      }
    }
  }
`;

export const TASK_DELETE = gql`
  mutation($deleteTaskInput: ID!){
    deleteTask(input: $deleteTaskInput) {
      status,
      msg 
    }
  }
`;

function TaskUpdate(props){
 
  const Props = Object.assign({}, props);
  delete Props.CloseModal;
  delete Props.gettasksData;
  delete Props.data;

  const[task,setTask]=useState({
    title: '',
    creater: '',
    assigned: '',
    description: '',
    status: 'Open'
  });
  const data=props.data;
    
  useEffect(() => {
    if(data){
      setTask(data)
    }
  }, [data]);

  const [updateTask] = useMutation(TASK_UPDATE,{
    onCompleted({ updateTask }) {
      if (updateTask) {
        // console.log(createUser)
        check(updateTask)
      }
    }
  });

  const [deleteTask] = useMutation(TASK_DELETE,{
    onCompleted({ deleteTask }) {
      if (deleteTask) {
        if(deleteTask.status===true){
          props.CloseModal()
          props.gettasksData()
        }
        else{
          alert(deleteTask.msg);
        }
      }
    },
  });

  const check=(input)=>{
    if(input.status===true){
      props.CloseModal()
      setTask({
        title: '',
        creater: '',
        assigned: '',
        description: '',
        status: 'Open'
      })
      props.gettasksData()
    }
    else if(input.msg!==null){
      alert(input.msg);
    }
    else{
      alert(JSON.stringify(input.errors)); 
    }
  }

  const handleInputChange = (event) => {
      const { name, value } = event.target;
      setTask((prevState) => ({
          ...prevState,
          [name]: value
      }));
    };

  const handleSubmit = event => {
    event.preventDefault();
    const new_task=Object.assign({}, task);
    delete new_task.__typename;
    console.log(new_task)
    const send={
      variables: { 
        updateTaskInput: new_task
      }
    }
    updateTask(send)
  }

  const handleDelete=event=>{
    event.preventDefault(); 
    const send={
      variables: { 
        deleteTaskInput: task.id
      }
    }
    deleteTask(send)   
  }
  return (
    <Modal {...Props} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Body>
        <form className="task_form_wrapper" onSubmit={handleSubmit}>
            <center><h3>Task Update Form</h3></center>

            <div className="form-group">
                <label>Title</label>
                <input type="text" aria-label="title" name="title" className="form-control" value={task.title} placeholder="Title" onChange={handleInputChange} required/>
            </div>

            <div className="form-group">
                <label>Creater</label>
                <input type="text" aria-label="creater" name="creater" className="form-control" value={task.creater} onChange={handleInputChange} required/>
            </div>

            <div className="form-group">
                <label>Assigned</label>
                <input type="text" aria-label="assigned" name="assigned" className="form-control" value={task.assigned} placeholder="Assigned" onChange={handleInputChange} required />
            </div>

            <div className="form-group">
                <label>Description</label>
                <input type="text" aria-label="description" name="description" className="form-control" value={task.description} placeholder="Enter Description" onChange={handleInputChange} required />
            </div>

            <div className="form-group">
                <label>Status</label>
                <select defaultValue={task.status} aria-label="status" className="browser-default custom-select" name="status" onChange={handleInputChange}>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Hold">Hold</option>
                  <option value="Closed">Closed</option>
                </select>
            </div>

            <button type="submit" className="btn btn-dark btn-lg btn-block">Update</button>
            <input type="button" onClick={handleDelete} className="btn btn-dark btn-lg btn-block" value="Delete"/>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default TaskUpdate