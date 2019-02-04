import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import ha from './ha.svg'
import birdhouse from './birdhouse.svg'

//Define a Login Component
class TravelerLogin extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            uemail : "",
            upassword : "",
            authFlag : false
        }
        //Bind the handlers to this class
        this.uemailChangeHandler = this.uemailChangeHandler.bind(this);
        this.upasswordChangeHandler = this.upasswordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            authFlag : false
        })
    }
    //username change handler to update state variable with the text entered by the user
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
    submitLogin = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            uemail : this.state.uemail,
            upassword : this.state.upassword
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/tlogin',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                console.log("Status Code : ",response.data);
                if(response.status === 200){
                    this.setState({
                        authFlag : true
                    })
                }else{
                    this.setState({
                        authFlag : false
                    })
                }
            });
    }

    render(){
        //redirect based on successful login
        let redirectVar = null;
        if(cookie.load('cookie')){
            redirectVar = <Redirect to= "/home"/>
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
                    <h1>Log in to HomeAway</h1>
                    Need an account?<a href="/tsignup"> Sign up</a>
                    <div class="main-div">
                        <div class="panel">
                            <h2>Account login</h2>
                        </div>
                        <form onSubmit={this.submitLogin}>
                            <div class="form-group">
                                <input onChange = {this.uemailChangeHandler} type="email" class="form-control" name="email" placeholder="Email address" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.upasswordChangeHandler} type="password" class="form-control" name="password" placeholder="Password" required/>
                            </div>
                            <div>
                                <a href="#">Forgot password?</a>
                            </div>
                            <br></br>
                            <div>
                            <button /*onClick = {this.submitLogin}*/ class="btn btn-warning btn-lg btn-block">Log In</button>  
                            </div>
                            
                            <br></br>
                            <div>
                            <input type="checkbox" name="signedin" value="signedin" checked/> Keep me signed in<br/>
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
export default TravelerLogin;