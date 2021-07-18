import React, { useRef, useEffect, useState } from "react";
import { useHistory } from "react-router";
import axios from "axios";
import Navbar from "./Navbar"
import LogoutHooks from "./LogoutHooks"

export default function UserProfile(props){
  const [user, setUser] = useState({
      email: false,
      google: false,
      data:{}
    });

  let image,usernameElement

  const history = useHistory();
  const childRef = useRef();
  const [save, setSave]=useState(false);
  const [usernamepresent, setUsernamePresent]=useState(true);
  const [userName, setUsername]=useState('');
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    setUser((prevState) => ({
        ...prevState,
        email: loggedInUser.email,
        google: loggedInUser.google,
        data: loggedInUser.data
    }));
    if(loggedInUser.data.username){
      setUsernamePresent(true)
    }else{
      setUsernamePresent(false)
    }
  }, []);

  if(user.data.image==null ){
    image=<img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Admin" class="rounded-circle" width="150"/>
  }else{
    image=<img src={user.data.image} alt="Admin" class="rounded-circle" width="150"/>
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prevState) => ({
        ...prevState,
        data:{
          ...prevState.data,
          [name]: value
        }
    }));
    setSave(true)
  };


  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
    setSave(true)
  };

  const handleSubmit = event => {
    event.preventDefault();
    // console.log(user)
    if(loggedInUser.data.username===null && user.data.username===null){
      console.log(userName)
      user.data.username=userName
      console.log(user)
    }
    console.log(user)
    axios.patch(`/api/users/${user.data.id}`,  user )
      .then(res => {
        console.log(res);
        console.log(res.data);
        if(res.data.status===true){
          const result={
            email:user.email,
            google:user.google,
            data:res.data.user
          }
          localStorage.setItem('user', JSON.stringify(result))
          // history.push("/userprofile");
          setSave(false)
          setUser((prevState) => ({
              ...prevState,
              email: user.email,
              google: user.google,
              data: res.data.user
          }));
          console.log(user)
        }
        else{
          user.data.username=null
          alert(JSON.stringify(res.data.errors));
        }
      })
  }

  // console.log(usernamepresent)

  if(usernamepresent){
    usernameElement=<input type="text" class="form-control" name="username" value={user.data.username} onChange={handleUsernameChange} disabled={user.data.username?true:false}/>
  }else{
    usernameElement= <input type="button" class="btn btn-secondary px-4" onClick={() => { setUsernamePresent(true)}} value="Set Username"/>
  }

 
  return (
    <>
    <LogoutHooks ref={childRef}/>
    <Navbar page="userprofilePage"/>
    <div class="container">
    <div class="main-body">
      <nav aria-label="breadcrumb" class="main-breadcrumb" id="userprofile-breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="/home">Home</a></li>
          <li class="breadcrumb-item active" aria-current="page">User Profile</li>
        </ol>
      </nav>
      <div class="row">
        <div class="col-lg-4">
          <div class="card">
            <div class="card-body">
              <div class="d-flex flex-column align-items-center text-center">
                {image}
                <div class="mt-3">
                  <h4>{user.data.name}</h4>
                  <p class="text-secondary mb-1">{user.data.username}</p>
                  <p class="text-muted font-size-sm">{user.data.email}</p>
                  <button id="user_profile_home_button" class="btn btn-secondary" onClick={() => { history.push("/home") }}>Home</button>
                  <button class="btn btn-secondary" onClick={() => { childRef.current.Success() }}>Logout</button>
                </div>
              </div>
              <hr class="my-4"/>
              {/*<ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <h6 class="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-globe me-2 icon-inline"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>Website</h6>
                  <span class="text-secondary">https://bootdey.com</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <h6 class="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-github me-2 icon-inline"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>Github</h6>
                  <span class="text-secondary">bootdey</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <h6 class="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-twitter me-2 icon-inline text-info"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>Twitter</h6>
                  <span class="text-secondary">@bootdey</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <h6 class="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-instagram me-2 icon-inline text-danger"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>Instagram</h6>
                  <span class="text-secondary">bootdey</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <h6 class="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-facebook me-2 icon-inline text-primary"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>Facebook</h6>
                  {user.email ? <span class="text-secondary">bootdey</span> : ''}
                </li>
              </ul>*/}
            </div>
          </div>
        </div>
        <div class="col-lg-8">
          <div class="card">
            <div class="card-body">
              <div class="row mb-3">
                <div class="col-sm-3">
                  <h6 class="mb-0">Full Name</h6>
                </div>
                <div class="col-sm-9 text-secondary">
                  <input type="text" class="form-control" name="name" value={user.data.name} disabled={user.data.name?true:false}/>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-sm-3">
                  <h6 class="mb-0">Email</h6>
                </div>
                <div class="col-sm-9 text-secondary">
                  <input type="text" class="form-control" name="email" value={user.data.email} disabled={user.data.email?true:false}/>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-sm-3">
                  <h6 class="mb-0">Username</h6>
                </div>
                <div class="col-sm-9 text-secondary">
                {usernameElement}
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-sm-3">
                  <h6 class="mb-0">Phone</h6>
                </div>
                <div class="col-sm-9 text-secondary">
                  <input type="text" class="form-control" name="phone" value={user.data.phone} onChange={handleInputChange}/>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-sm-3">
                  <h6 class="mb-0">Address</h6>
                </div>
                <div class="col-sm-9 text-secondary">
                  <input type="text" class="form-control" name="address" value={user.data.address} onChange={handleInputChange}/>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-sm-3">
                  <h6 class="mb-0">Image</h6>
                </div>
                <div class="col-sm-9 text-secondary">
                  <input type="text" class="form-control" value="Bay Area, San Francisco, CA" disabled/>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-3"></div>
                <div class="col-sm-9 text-secondary">
                  <input type="button" class="btn btn-secondary px-4" onClick={handleSubmit} value="Save Changes" disabled={!save?true:false}/>
                </div>
              </div>
            </div>
          </div>
          {/*<div class="row">
            <div class="col-sm-12">
              <div class="card">
                <div class="card-body">
                  <h5 class="d-flex align-items-center mb-3">Project Status</h5>
                  <p>Web Design</p>
                  <div class="progress mb-3" style={{height: '5px'}}>
                    <div class="progress-bar bg-primary" role="progressbar" style={{width: '80%'}} aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <p>Website Markup</p>
                  <div class="progress mb-3" style={{height: '5px'}}>
                    <div class="progress-bar bg-danger" role="progressbar" style={{width: '72%'}} aria-valuenow="72" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <p>One Page</p>
                  <div class="progress mb-3" style={{height: '5px'}}>
                    <div class="progress-bar bg-success" role="progressbar" style={{width: '89%'}}aria-valuenow="89" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <p>Mobile Template</p>
                  <div class="progress mb-3" style={{height: '5px'}}>
                    <div class="progress-bar bg-warning" role="progressbar" style={{width: '55%'}}aria-valuenow="55" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <p>Backend API</p>
                  <div class="progress" style={{height: '5px'}}>
                    <div class="progress-bar bg-info" role="progressbar" style={{width: '66%'}}aria-valuenow="66" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>*/}
        </div>
      </div>
    </div>
  </div>

    </>

  );
}
