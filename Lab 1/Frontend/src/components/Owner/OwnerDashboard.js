import React, {Component} from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import lp from './lp.svg'
import {Link} from 'react-router-dom';
import './property.css';
var oemail = document.cookie.substring(7)
console.log("Oemail property outside where initialized", oemail)
class OwnerDashboard extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);

        this.state = {
            propertydisplay:[]
        }
        //maintain the state required for this component
        this.handleLogout = this.handleLogout.bind(this);
        }

        //handle logout to destroy the cookie
    handleLogout = () => {
        cookie.remove('cookie', { path: '/' })
    }

    componentDidMount(){
        console.log("Owner email:", oemail)
        axios.get("http://localhost:3001/odashboard/"+oemail)
            .then((response) => {
                console.log(response.data)
            this.setState({
                propertydisplay : response.data
            });
            console.log("Checking whether booking details are there or not",this.state.propertydisplay)
        });
}

componentWillMount(){
    axios.get("http://localhost:3001/odashboard/"+oemail)
    .then((response) => {
        console.log(response.data)
    this.setState({
        propertydisplay : response.data
    });
    console.log("Checking whether booking details are there or not",this.state.propertydisplay)
});
}


    render(){

        let details = this.state.propertydisplay.map((propertydisplay,j) => {
            return(
                <div class ="flex-container9">
                <div><tr key={j}>
                <tr><h4>{propertydisplay.headline}</h4></tr>
                    <tr><td>{propertydisplay.city}, {propertydisplay.country}</td></tr>
                    <tr><td>{propertydisplay.propertytype}&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</td>
                    <td>{propertydisplay.bedrooms}BR</td>&nbsp; &nbsp; &nbsp;
                    <td>{propertydisplay.bathrooms}BA</td>&nbsp; &nbsp; &nbsp;
                    <td>Sleeps {propertydisplay.accomodates}</td>&nbsp; &nbsp; &nbsp;
                    <td>{propertydisplay.descript}</td></tr><hr></hr>
                    <hr></hr><tr>$<td>{propertydisplay.currency} per night</td></tr><hr></hr>
                    <tr><td>Booked by Email: {propertydisplay.useremail}</td></tr>
                    
                    <tr><a href="/home" class="btn btn-success">Home</a></tr>
                    </tr>
                    </div>
                </div>
            )
            })

        //if Cookie is set render Logout Button
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
        else{ 
            redirectVar = <Redirect to= "/ologin"/>
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
                
                {details}
               
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
export default OwnerDashboard;