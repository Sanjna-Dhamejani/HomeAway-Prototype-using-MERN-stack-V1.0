import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import ha from './ha.svg'
import birdhouse from './birdhouse.svg'

//Define a Login Component
class OwnerSignUp extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            firstname : null,
            lastname : null,
            email : null,
            password : null,
            ownerCreated: false,
            error : ""

        }
        
        //Bind the handlers to this class
        this.firstnameChangeHandler = this.firstnameChangeHandler.bind(this);
        this.lastnameChangeHandler = this.lastnameChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.handleOwnerCreate = this.handleOwnerCreate.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            ownerCreated : false
        })
    }
    //username change handler to update state variable with the text entered by the user
    
    
    firstnameChangeHandler = (e) => {
        this.setState({
            firstname : e.target.value
        })
    }
    
    lastnameChangeHandler = (e) => {
        this.setState({
            lastname : e.target.value
        })
    }
    
    emailChangeHandler = (e) => {
        this.setState({
            email : e.target.value
        })
    }
    //password change handler to update state variable with the text entered by the user
    passwordChangeHandler = (e) => {
        this.setState({
            password : e.target.value
        })
    }
    //submit Login handler to send a request to the node backend
    handleOwnerCreate = (e) => {
        e.preventDefault();
        var data = {
            firstname : this.state.firstname,
            lastname : this.state.lastname,
            email : this.state.email,
            password : this.state.password
        }
        axios.post('http://localhost:3001/osignup',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                console.log("Data Sent ",response.data);
                if(response.status === 200){
                    this.setState({
                        ownerCreated : true,
                    })
                }else if(response.status === 202){
                    this.setState({
                        ownerCreated : false,
                        error : response.data
                    })
                    
                }
            
            });
    }

    render(){
        //redirect based on successful login
        let redirect = null;
        if(this.state.ownerCreated){
            redirect = <Redirect to= "/ologin"/>
        }
        return(
            <div>
                {redirect}
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
                    Already have an account?<a href="/ologin"> Log in</a>
                    <div class="main-div">
                        <div class="panel">
                    <p><font color="red">{this.state.error}</font></p>
                        </div>                        
                        <form onSubmit={this.handleOwnerCreate}>
                            <div class="form-group">
                                <input onChange = {this.firstnameChangeHandler} type="text" class="form-control" name="fname" placeholder="First Name" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.lastnameChangeHandler} type="text" class="form-control" name="lname" placeholder="Last Name" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.emailChangeHandler} type="email" class="form-control" name="email" placeholder="Email address" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.passwordChangeHandler} type="password" class="form-control" name="password" placeholder="Password" required/>
                            </div>
                            <div>
                            <button class="btn btn-warning btn-lg btn-block">Sign Me Up</button>  
                            </div>
                            </form>                     
            </div>
            </div>
        </div>
        </div>
        </div>
        )
    }
}
//export Login Component
export default OwnerSignUp;