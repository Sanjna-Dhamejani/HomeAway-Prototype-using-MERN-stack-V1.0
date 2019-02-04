import React, {Component} from 'react';
import './Owner.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import ha from './ha.svg';
import birdhouse from './birdhouse.svg';
import ownerlogin from './ownerlogin.jpeg'

//Define a Login Component
class OwnerLogin extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            email : "",
            password : "",
            authFlag : false,
        }
        //Bind the handlers to this class
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitOwnerLogin = this.submitOwnerLogin.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            authFlag : false
        })
    }
    //username change handler to update state variable with the text entered by the user
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
    submitOwnerLogin = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            email : this.state.email,
            password : this.state.password
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/ologin',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                console.log("Data : ",response.data);
                if(response.status === 200){
                    this.setState({
                        authFlag : true
                    })
                }else{
                    this.setState({
                        authFlag : false,
                       
                    })
                    
                }
            
            });
    }

    render(){
        //redirect based on successful login
        let redirectVar = null;
        if(cookie.load('cookie')){
            redirectVar = <Redirect to= "/property"/>
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
        <br></br><br></br><br></br>
        <div>
        <div class="container3">
        <img src = {ownerlogin}></img></div>
            <div class="container4">
                <div class="login-form4">
                   <a href="/osignup"> Sign up</a>
                    <div class="main-div4">
                        <div class="panel4">
                            <h2>Owner login</h2>
                            <p>Need an account?</p>
                            
                            <hr></hr>
                            
                        </div>
                        <form onSubmit={this.submitOwnerLogin}>
                        
                            <div class="form-group4">
                                <input onChange = {this.emailChangeHandler} type="email" class="form-control" name="email" placeholder="Email address" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.passwordChangeHandler} type="password" class="form-control" name="password" placeholder="Password"/>
                            </div>
                            <div>
                                <a href="#">Forgot password?</a>
                            </div>
                            <br></br>
                            <div>
                            <button /*onClick = {this.submitOwnerLogin}*/ class="btn btn-warning btn-lg btn-block">Log In</button>  
                            </div>
                            </form>
                            <br></br>
                            <div>
                            <input type="checkbox" name="signedin" value="signedin" checked/> Keep me signed in<br/>
                  </div>                         
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
export default OwnerLogin;