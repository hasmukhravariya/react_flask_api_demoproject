import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar"
import LogoutHooks from "./LogoutHooks"

export default function UserProfile(props){

  let image,usernameElement

  const [user, setUser] = useState({
      email: false,
      google: false,
      data:{}
    });
  const [password, setPassword] = useState({
      oldpassword: '',
      newpassword: ""
    });

  const childRef = useRef();
  const ref = useRef();
  const [save, setSave]=useState(false);
  const [submit, setSubmit]=useState(false);
  const [usernamepresent, setUsernamePresent]=useState(true);
  const [userName, setUsername]=useState('');
  const [passwordcontainer,setPasswordcontainer]=useState(false);
  const [imageUpload,setImageUpload]=useState({ raw: "" });
  // const [image, setImage] = useState({ raw: "" });
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    setUser((prevState) => ({
        ...prevState,
        email: loggedUser.email,
        google: loggedUser.google,
        data: loggedUser.data
    }));
    if(loggedUser.data.username){
      setUsernamePresent(true)
      setUsername(loggedUser.data.username)
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

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPassword((prevState) => ({
        ...prevState,
        [name]: value
    }));
    if(user.data.password){
      if(password.oldpassword!=="" && password.newpassword!==""){
        setSubmit(true)
      }
    }else{
      if(password.newpassword!==""){
        setSubmit(true)
      }
    }
    
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
    setSave(true)
  };

  const handlePasswordSubmit= (event) =>{
    event.preventDefault();
    console.log(password);
    axios.post(`/api/setpassword/${user.data.id}`,  password )
      .then(res=>{
        if(res.data.status===true){
          const result={
            email:user.email,
            google:user.google,
            data:res.data.user
          }
          localStorage.setItem('user', JSON.stringify(result))
          setPasswordcontainer(false);
          setSubmit(false)
          setPassword({
            oldpassword: '',
            newpassword: ""
          })
          setUser((prevState) => ({
              ...prevState,
              email: user.email,
              google: user.google,
              data: res.data.user
          }));
        }
        else{
          alert(JSON.stringify(res.data.errors));
        }
      })
  }

  const handleSubmit = event => {
    event.preventDefault();
    if(loggedInUser.data.username===null && user.data.username===null){
      user.data.username=userName
    }
    console.log(user)
    axios.patch(`/api/users/${user.data.id}`,  user )
      .then(res => {
        if(res.data.status===true){
          const result={
            email:user.email,
            google:user.google,
            data:res.data.user
          }
          localStorage.setItem('user', JSON.stringify(result))
          setSave(false)
          setUser((prevState) => ({
              ...prevState,
              email: user.email,
              google: user.google,
              data: res.data.user
          }));
        }
        else{
          user.data.username=null
          alert(JSON.stringify(res.data.errors));
        }
      })
  }

  const handleImageChange = e => {
    if (e.target.files.length) {
      setImageUpload({
        raw: e.target.files[0]
      });
    }
  };

  const reset = () => {
    ref.current.value = "";
  };

  const handleUpload =(e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", imageUpload.raw);
    formData.append('id', user.data.id);
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };

    axios.post('/api/upload', formData, config)
      .then((res) => {
        console.log(res)
        if(res.data.status===true){
          const result={
            email:user.email,
            google:user.google,
            data:res.data.user
          }
          localStorage.setItem('user', JSON.stringify(result))
          setUser((prevState) => ({
              ...prevState,
              email: user.email,
              google: user.google,
              data: res.data.user
          }));
          setImageUpload({ raw: "" })
          reset()
        }
        else{
          alert(JSON.stringify(res.data.errors));
        }
        
      })

  };



  if(usernamepresent){
    usernameElement=<input type="text" class="form-control" name="username" value={userName} onChange={handleUsernameChange} disabled={user.data.username?true:false}/>
  }else{
    usernameElement= <input type="button" class="btn btn-secondary px-4" onClick={() => { setUsernamePresent(true)}} value="Set Username"/>
  }

  const currentpassword=()=>{
    return(
      <div class="row mb-3">
        <div class="col-sm-3">
          <h6 class="mb-0">Current Password</h6>
        </div>
        <div class="col-sm-9 text-secondary">
          <input type="text" class="form-control" name="oldpassword" value={password.oldpassword} onChange={handlePasswordChange}/>
        </div>
      </div>   
    )
  }

  const renderpasswordcontainer = () => {
      if (passwordcontainer) {
        return (
          <>
          <hr class="my-4"/>
            {user.data.password?currentpassword():""}
            <div class="row mb-3">
              <div class="col-sm-3">
                <h6 class="mb-0">New Password</h6>
              </div>
              <div class="col-sm-9 text-secondary">
              <input type="text" class="form-control" name="newpassword" value={password.newpassword} onChange={handlePasswordChange}/>
              </div>
            </div>
            <div class="d-flex justify-content-center text-center">
              <button id="user_profile_home_button" class="btn btn-secondary" onClick={() => { setPasswordcontainer(false); setPassword({oldpassword: '',newpassword: ""}) }}>Cancel</button>
              <button class="btn btn-secondary" onClick={handlePasswordSubmit} disabled={!submit?true:false}>Submit</button>
            </div>
          </>
        )
      } else {
        return null;
      }
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
                  <button id="user_profile_home_button" class="btn btn-secondary" onClick={() => { setPasswordcontainer(true) }} disabled={passwordcontainer?true:false}>{user.data.password?"Change password":"Set Password"}</button>
                  <button class="btn btn-secondary" onClick={() => { childRef.current.Success() }}>Logout</button>
                </div>
              </div>
              {renderpasswordcontainer()}
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
                  <h6 class="mb-0">Profile Picture</h6>
                </div>
                <div class="col-sm-9 text-secondary">
                  <input type="file" onChange={handleImageChange} ref={ref} />
                  <input type="button" class="btn btn-secondary px-4" onClick={handleUpload} value="upload" disabled={imageUpload.raw===""?true:false}/>
                </div>
              </div>
              <div class="row mb-3">
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
