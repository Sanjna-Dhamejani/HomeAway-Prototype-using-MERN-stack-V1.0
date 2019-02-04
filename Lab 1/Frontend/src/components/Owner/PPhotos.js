import React, {Component} from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import lp from './lp.svg'
import {Link} from 'react-router-dom';
import './property.css';
var formData = "";
 
class PPhotos extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        this.state = {
            description: '',
            selectedFile: '',
          };
        //maintain the state required for this component
        this.handleLogout = this.handleLogout.bind(this);
        }

        //handle logout to destroy the cookie
    handleLogout = () => {
        cookie.remove('cookie', { path: '/' })
    }

    onChange = (e) =>
     {
        for(let size=0; size < e.target.files.length; size++){
            console.log('Selected file:', e.target.files[size]);
            let file = e.target.files[size];
            console.log("Uploading screenshot file...");
            formData = new FormData();
            formData.append('selectedFile', file);
           
            axios.post('http://localhost:3001/pphotos', formData)
            .then((result) => {
              // access results...
            });
        }
    }


    render(){
        //if Cookie is set render Logout Button
        const { description, selectedFile} = this.state;
        let redirectVar = null;
        let navLogin = null;
        if(cookie.load('cookie')){
            console.log("Able to read cookie");
            navLogin = (
                <div class="navbarborder">
                <nav class="navbar navbar-white">
        <div class="container-fluid">
        <div class="navbar-header">
        <img src = {lp} height="50" width="200"></img>
        </div>
                <ul class="nav navbar-nav navbar-right">
                        <li><Link to="/home" onClick = {this.handleLogout}><span class="glyphicon glyphicon-user"></span>Logout</Link></li>
                </ul>
                </div>
                </nav>
                </div>
            );
        }
        //redirect based on successful login
        else{ 
            redirectVar = <Redirect to= "/home"/>
        }
        return(
            <div>
                {redirectVar}
                {navLogin}
        <div class="row">
            <div class="side">
               <ul class="propertylist">
               <li>Welcome</li>
               <li><a href= "/plocation">Location</a></li> 
               <li><a href= "/pdetails">Details</a></li>
               <li><a href= "/pphotos">Photos</a></li>
               <li><a href= "/ppricing">Pricing</a></li>
               <li><a href= "/odashboard">Owner Dashboard</a></li>
               </ul>
            </div>
            <div class="main">
                <h1><strong>Add up to 50 photos of your property</strong></h1>
                <hr></hr>
                <p>Showcase your property’s best features (no pets or people, please). Requirements: JPEG, at least 1920 x 1080 pixels, less than 20MB file size, 6 photos minimum. Need photos? Hire a professional.</p>
                <hr></hr>
                
                <form onSubmit={this.onSubmit}>
                <div class="photobutton">
                <label for="uploadpic" name ="description" value={description} onChange={this.onChange} multiple class = "btn btn-primary">SELECT PHOTOS TO UPLOAD</label>
                <input type = "file" id ="uploadpic"  class ="hidethis" multiple name="selectedFile" onChange={this.onChange}/>
                </div>
                <div class="photob">
                <a href="/pdetails" class="btn btn-default">Back</a> &nbsp;
                <a  href="/ppricing" class="btn btn-warning">Next</a></div><br></br><br></br>
                </form>
                <p align="center">Use of this Web site constitutes acceptance of the HomeAway.com Terms and conditions and Privacy policy.<br></br>
                ©2018 HomeAway. All rights reserved.<br></br>
                Start Co-browse</p>
            </div>
        </div>
        <div class="footer">
            <p>You will pay-per-booking. Consider a subscription if you plan to book frequently.</p>
        </div>
        
        </div>
        )
    }
}
export default PPhotos;