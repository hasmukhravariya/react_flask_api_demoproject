import React from "react";
import { useState } from "react";
import Modal from "react-bootstrap/Modal"
import { useHistory } from "react-router";
import { gql, useMutation } from '@apollo/client';


export const TASK_REGISTER = gql`
  mutation($createTaskInput: taskcreater!){
    createTask(input: $createTaskInput) {
      status,
      errors,
      task {
        id
      }
    }
  }
`;

function TaskRegister(props){
  
  const Props = Object.assign({}, props);
  delete Props.CloseModal;
  delete Props.gettasksData;

  const history = useHistory();
  const[task,setTask]=useState({
    title: '',
    creater: '',
    assigned: '',
    description: '',
    status: 'Open'
  });


  const [createTask] = useMutation(TASK_REGISTER,{
    onCompleted({ createTask }) {
      if (createTask) {
        // console.log(createUser)
        check(createTask)
      }
    }
  });

  const check=(input)=>{
    // console.log(input);
    if(input.status===true){
      props.CloseModal()
      setTask({
        title: '',
        creater: '',
        assigned: '',
        description: '',
        status: 'Open'
      })
      if(props.page==="homePage"){
        props.gettasksData()
      }else{
        history.push("/home")
      }
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
    // console.log(task)
    const new_task = {
      "title": task.title,
      "creater": props.name,
      "assigned": task.assigned,
      "description": task.description,
      "status": task.status
    };
    // console.log(new_task)
    const send={
      variables: { 
        createTaskInput: new_task
      }
    }
    // console.log(send)
    createTask(send)
  }


    return (
      <Modal {...Props} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Body>
          <form className="task_form_wrapper" onSubmit={handleSubmit}>
              <center><h3>Task Form</h3></center>

              <div className="form-group">
                  <label>Title</label>
                  <input type="text" aria-label="title" name="title" className="form-control" placeholder="Title" onChange={handleInputChange} required/>
              </div>

              <div className="form-group">
                  <label>Creater</label>
                  <input type="text" aria-label="creater" name="creater" className="form-control" value={props.name} onChange={handleInputChange} disabled/>
              </div>

              <div className="form-group">
                  <label>Assigned</label>
                  <input type="text" aria-label="assigned" name="assigned" className="form-control" placeholder="Assigned" onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                  <label>Description</label>
                  <input type="text" aria-label="description" name="description" className="form-control" placeholder="Enter Description" onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                  <label>Status</label>
                  <select defaultValue="Open" aria-label="status" className="browser-default custom-select" name="status" onChange={handleInputChange}>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Hold">Hold</option>
                    <option value="Closed">Closed</option>
                  </select>
              </div>

              <button type="submit" className="btn btn-dark btn-lg btn-block">Submit</button>
          </form>
        </Modal.Body>
      </Modal>
    );
}

export default TaskRegister