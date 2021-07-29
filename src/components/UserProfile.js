import React, { useRef, useEffect, useState } from "react";
import Navbar from "./Navbar"
import LogoutHooks from "./LogoutHooks"
import { gql, useMutation } from '@apollo/client';


export const USER_UPDATE = gql`
  mutation($updateUserInput: updateUserData!){
    updateUser(input: $updateUserInput) {
      status,
      errors,
      user {
        id,
        phone,
        address,
        email,
        password,
        name,
        username,
        image
      }
    }
  }
`;

export const SET_PASSWORD = gql`
  mutation($setPasswordInput: setPasswordData!){
    setPassword(input: $setPasswordInput) {
      status,
      errors,
      user{
        id,
        password,
        email,
        name,
        username,
        image,
        address,
        phone
      }
    }
  }
`;

export const CHANGE_PIC = gql`
  mutation($file: Upload!, $id: ID!){
    singleUpload(file: $file, id: $id) {
      status,
      errors,
      user {
        id,
        name,
        email,
        username,
        password,
        image,
        address,
        phone
      }
    }
  }
`;


export default function UserProfile(props){

  let image,usernameElement

  const [user, setUser] = useState({
      email: false,
      google: false,
      imageHash: Date.now(),
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
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    setUser((prevState) => ({
        ...prevState,
        email: loggedUser.email,
        google: loggedUser.google,
        imageHash: Date.now(),
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
    image=<img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Admin" className="rounded-circle" width="150"/>
  }else{
    image=<img src={`${user.data.image}?${user.imageHash}`} alt="Admin" className="rounded-circle" width="150"/>
  }


  const [updateUser] = useMutation(USER_UPDATE,{
    onCompleted({ updateUser }) {
      if (updateUser) {
        // console.log(createUser)
        checkUpdate(updateUser)
      }
    }
  });

  const checkUpdate=(input)=>{
    // console.log(input)
    if(input.status===true){
      // console.log(input)
      const result={
        email:user.email,
        google:user.google,
        imageHash: Date.now(),
        data:input.user
      }
      localStorage.setItem('user', JSON.stringify(result))
      setSave(false)
      setUser((prevState) => ({
          ...prevState,
          email: user.email,
          google: user.google,
          imageHash: Date.now(),
          data: input.user
      }));
    }
    else{
      user.data.username=null
      // console.log(user.data)
      setUsername("")
      alert(JSON.stringify(input.errors));
    }
  }

  const [updatePassword] = useMutation(SET_PASSWORD,{
    onCompleted:(input)=>checkPassword(input.setPassword),
    onError: (error) => console.error("Error", error),
  });

  const checkPassword=(input)=>{
    // console.log(input)
    if(input.status===true){
      const result={
        email:user.email,
        google:user.google,
        imageHash: Date.now(),
        data:input.user
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
          imageHash: Date.now(),
          data: input.user
      }));
    }
    else{
      alert(JSON.stringify(input.errors));
    }
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
    if(user.data.password==="true"){
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
    // console.log(password);
    const data={
      id:user.data.id,
      oldpassword:password.oldpassword,
      newpassword: password.newpassword
    }
    const send={
      variables: { 
        setPasswordInput:data
      }
    }
    // console.log(send)
    updatePassword(send)
  }

  const handleSubmit = event => {
    event.preventDefault();
    if(loggedInUser.data.username===null && user.data.username===null && userName!==""){
      user.data.username=userName
    }

    const data=user.data
    if(data.__typename){
      delete data.__typename;
    }
    const send={
      variables: { 
        updateUserInput:{
          data:data
        }
      }
    }
    // console.log(send)
    updateUser(send)
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


  const [changeimage] = useMutation(CHANGE_PIC,{
    onCompleted:(changeimage)=>checkUpload(changeimage.singleUpload),
    onError: (error) => console.error("Error", error),
  });

  const checkUpload=(input)=>{
    // console.log(input)
    if(input.status===true){
      const result={
        email:user.email,
        google:user.google,
        imageHash: Date.now(),
        data:input.user
      }
      localStorage.setItem('user', JSON.stringify(result))
      setUser((prevState) => ({
          ...prevState,
          email: user.email,
          google: user.google,
          imageHash: Date.now(),
          data: input.user
      }));
      setImageUpload({ raw: "" })
      reset()
    }
    else{
      alert(JSON.stringify(input.errors));
    }
  } 

  const handleUpload =(e) => {
    e.preventDefault();
    const file = imageUpload.raw;
    const id=user.data.id
    const send={
      variables: { file, id }
    }
    changeimage(send)
  };

  if(usernamepresent){
    usernameElement=<input type="text" className="form-control" name="username" value={userName} onChange={handleUsernameChange} disabled={user.data.username?true:false}/>
  }else{
    usernameElement= <button type="button" className="btn btn-secondary px-4" onClick={() => { setUsernamePresent(true)}}>Set Username</button>
  }

  const currentpassword=()=>{
    return(
      <div className="row mb-3">
        <div className="col-sm-3">
          <h6 className="mb-0">Current Password</h6>
        </div>
        <div className="col-sm-9 text-secondary">
          <input type="text" className="form-control" name="oldpassword" value={password.oldpassword} onChange={handlePasswordChange}/>
        </div>
      </div>   
    )
  }

  const renderpasswordcontainer = () => {
      if (passwordcontainer) {
        return (
          <>
          <hr className="my-4"/>
            {user.data.password==="true"?currentpassword():""}
            <div className="row mb-3">
              <div className="col-sm-3">
                <h6 className="mb-0">New Password</h6>
              </div>
              <div className="col-sm-9 text-secondary">
              <input type="text" className="form-control" name="newpassword" value={password.newpassword} onChange={handlePasswordChange}/>
              </div>
            </div>
            <div className="d-flex justify-content-center text-center">
              <button id="user_profile_home_button" className="btn btn-secondary" onClick={() => { setPasswordcontainer(false); setPassword({oldpassword: '',newpassword: ""}) }}>Cancel</button>
              <button className="btn btn-secondary" onClick={handlePasswordSubmit} disabled={!submit?true:false}>Submit</button>
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
    <div className="container">
    <div className="main-body">
      <nav aria-label="breadcrumb" className="main-breadcrumb" id="userprofile-breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a aria-label="home" href="/home">Home</a></li>
          <li className="breadcrumb-item active" aria-current="page">User Profile</li>
        </ol>
      </nav>
      <div className="row">
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex flex-column align-items-center text-center">
                {image}
                <div className="mt-3">
                  <h4>{user.data.name}</h4>
                  <p className="text-secondary mb-1">{user.data.username}</p>
                  <p className="text-muted font-size-sm">{user.data.email}</p>
                  <button id="user_profile_home_button" className="btn btn-secondary" onClick={() => { setPasswordcontainer(true) }} disabled={passwordcontainer?true:false}>{user.data.password==="true"?"Change password":"Set Password"}</button>
                  <button className="btn btn-secondary" onClick={() => { childRef.current.Success() }}>Logout</button>
                </div>
              </div>
              {renderpasswordcontainer()}
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Full Name</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <input type="text" className="form-control" name="name" value={user.data.name} disabled={user.data.name?true:false}/>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Email</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <input type="text" className="form-control" name="email" value={user.data.email} disabled={user.data.email?true:false}/>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Username</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                {usernameElement}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Phone</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <input type="text" className="form-control" name="phone" aria-label="phone" value={user.data.phone} onChange={handleInputChange}/>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Address</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <input type="text" className="form-control" aria-label="address" name="address" value={user.data.address} onChange={handleInputChange}/>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Profile Picture</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <input type="file" onChange={handleImageChange} ref={ref} />
                  <input type="button" className="btn btn-secondary px-4" onClick={handleUpload} value="upload" disabled={imageUpload.raw===""?true:false}/>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3"></div>
                <div className="col-sm-9 text-secondary">
                  <input type="button" aria-label="save" className="btn btn-secondary px-4" onClick={handleSubmit} value="Save Changes" disabled={!save?true:false}/>
                </div>
              </div>
            </div>
          </div>
          {/*<div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="d-flex align-items-center mb-3">Project Status</h5>
                  <p>Web Design</p>
                  <div className="progress mb-3" style={{height: '5px'}}>
                    <div className="progress-bar bg-primary" role="progressbar" style={{width: '80%'}} aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <p>Website Markup</p>
                  <div className="progress mb-3" style={{height: '5px'}}>
                    <div className="progress-bar bg-danger" role="progressbar" style={{width: '72%'}} aria-valuenow="72" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <p>One Page</p>
                  <div className="progress mb-3" style={{height: '5px'}}>
                    <div className="progress-bar bg-success" role="progressbar" style={{width: '89%'}}aria-valuenow="89" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <p>Mobile Template</p>
                  <div className="progress mb-3" style={{height: '5px'}}>
                    <div className="progress-bar bg-warning" role="progressbar" style={{width: '55%'}}aria-valuenow="55" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <p>Backend API</p>
                  <div className="progress" style={{height: '5px'}}>
                    <div className="progress-bar bg-info" role="progressbar" style={{width: '66%'}}aria-valuenow="66" aria-valuemin="0" aria-valuemax="100"></div>
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
