import React from "react";
import { useState } from "react";
import axios from "axios";

const TaskRegister = props => {

  const[task,setTask]=useState({
    title: '',
    creater: '',
    assigned: '',
    description: '',
    status: 'Open'
  });

  const handleInputChange = (event) => {
      const { name, value } = event.target;
      setTask((prevState) => ({
          ...prevState,
          [name]: value
      }));
    };

  const handleSubmit = event => {
    event.preventDefault();
    console.log(task)
    const new_task = {
      "title": task.title,
      "creater": task.creater,
      "assigned": task.assigned,
      "description": task.description,
      "status": task.status
    };
    console.log(new_task)
    axios.post(`/api/tasks`,  new_task )
      .then(res => {
        console.log(res);
        console.log(res.data);
        if(res.data.status===true){
          props.onCloseModal()
          setTask({
            title: '',
            creater: '',
            assigned: '',
            description: '',
            status: 'Open'
          })
          props.gettasksData()
        }
        else{
          alert(JSON.stringify(res.data.errors));
        }
      })
    }
    console.log(props.state)

    return (
      <form className="task_form_wrapper" onSubmit={handleSubmit}>
          <center><h3>Task Form</h3></center>

          <div className="form-group">
              <label>Title</label>
              <input type="text" name="title" className="form-control" placeholder="Title" onChange={handleInputChange} required/>
          </div>

          <div className="form-group">
              <label>Creater</label>
              <input type="text" name="creater" className="form-control" value={props.state.user.name} onChange={handleInputChange} disabled/>
          </div>

          <div className="form-group">
              <label>Assigned</label>
              <input type="text" name="assigned" className="form-control" placeholder="Assigned" onChange={handleInputChange} required />
          </div>

          <div className="form-group">
              <label>Description</label>
              <input type="text" name="description" className="form-control" placeholder="Enter Description" onChange={handleInputChange} required />
          </div>

          <div className="form-group">
              <label>Status</label>
              <select class="browser-default custom-select" name="status" onChange={handleInputChange}>
                <option value="Open" selected>Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Hold">Hold</option>
                <option value="Closed">Closed</option>
              </select>
          </div>

          <button type="submit" className="btn btn-dark btn-lg btn-block">Submit</button>
      </form>
    );
}

export default TaskRegister