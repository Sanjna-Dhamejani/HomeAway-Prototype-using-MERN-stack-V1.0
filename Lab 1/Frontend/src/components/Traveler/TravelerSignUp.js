import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import ha from './ha.svg'
import birdhouse from './birdhouse.svg'

//Define a Login Component
class TravelerSignUp extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            ufirstname : "",
            ulastname : "",
            uemail : "",
            upassword : "",
            userCreated: false,
            error : ""
        }
        //Bind the handlers to this class
        this.ufirstnameChangeHandler = this.ufirstnameChangeHandler.bind(this);
        this.ulastnameChangeHandler = this.ulastnameChangeHandler.bind(this);
        this.uemailChangeHandler = this.uemailChangeHandler.bind(this);
        this.upasswordChangeHandler = this.upasswordChangeHandler.bind(this);
        this.handleUserCreate = this.handleUserCreate.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            userCreated : false
        })
    }
    //username change handler to update state variable with the text entered by the user
    
    ufirstnameChangeHandler = (e) => {
        this.setState({
            ufirstname : e.target.value
        })
    }
    
    ulastnameChangeHandler = (e) => {
        this.setState({
            ulastname : e.target.value
        })
    }
    
    
    uemailChangeHandler = (e) => {
        this.setState({
            uemail : e.target.value
        })
    }
    //password change handler to update state variable with the text entered by the user
    upasswordChangeHandler = (e) => {
        this.setState({
            upassword : e.target.value
        })
    }
    //submit Login handler to send a request to the node backend
    handleUserCreate = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            ufirstname : this.state.ufirstname,
            ulastname : this.state.ulastname,
            uemail : this.state.uemail,
            upassword : this.state.upassword
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        console.log("Data", data)
        //make a post request with the user data
        axios.post('http://localhost:3001/tsignup',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                console.log("Data sent: ",response.data);
                if(response.status === 200){
                    this.setState({
                        userCreated : true
                    })
                }else if(response.status === 202){
                    this.setState({
                        userCreated : false,
                        error : response.data
                    })
                    
                }
            
            });
    }

    render(){
        //redirect based on successful login
        let redirectVar = null;
        if(this.state.userCreated){
            redirectVar = <Redirect to= "/tlogin"/>
        }
        return(
            <div>
                {redirectVar}
                <div>
                <nav class="navbar navbar-white">
        <div class="container-fluid">
        <div class="navbar-header">
        <img src = {ha} height="50" width="200"></img>
        </div>
        <ul class="nav navbar-nav navbar-right">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<li><img src = {birdhouse} height="50" width="50"></img></li>
        </ul>
    
        </div>
        </nav>
        </div>
        <div class="background">
            <div class="container">
                <div class="login-form">
                    <h1>Sign up for HomeAway</h1>
                    Already have an account?<a href="/tlogin"> Log in</a>
                    <div class="main-div">
                        <div class="panel">
                        <p><font color="red">{this.state.error}</font></p>
                        <form onSubmit={this.handleUserCreate}>
                            <div class="form-group">
                                <input onChange = {this.ufirstnameChangeHandler} type="text" class="form-control" name="fname" placeholder="First Name" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.ulastnameChangeHandler} type="text" class="form-control" name="lname" placeholder="Last Name" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.uemailChangeHandler} type="email" class="form-control" name="email" placeholder="Email address" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.upasswordChangeHandler} type="password" class="form-control" name="password" placeholder="Password" required/>
                            </div>
                            <div>
                            <button /*onClick = {this.handleUserCreate}*/ class="btn btn-warning btn-lg btn-block">Sign Me Up</button>  
                            </div>
                            </form>
                            </div>
                                                    
            </div>
            </div>
        </div>
        </div>
        </div>
        )
    }
}
//export Login Component
export default TravelerSignUp;