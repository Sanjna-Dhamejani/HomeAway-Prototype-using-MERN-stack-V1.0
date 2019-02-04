import React, {Component} from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import lp from './lp.svg'
import {Link} from 'react-router-dom';
import './property.css';
var redirectVar = null;

class Plocation extends Component{
    
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component

        this.state = {
            email : "",
            city : "City",
            cityFlag : false,
            ostate : "State",
            stateFlag: false,
            country :"Country",
            countryFlag : false,
            locationCreated : false,
            locationsfields : [],
            locationUpdated : false
        }
        this.handleLogout = this.handleLogout.bind(this);
        this.cityChangeHandler = this.cityChangeHandler.bind(this);
        this.ostateChangeHandler = this.ostateChangeHandler.bind(this);
        this.countryChangeHandler = this.countryChangeHandler.bind(this);
        this.handleLocationCreate = this.handleLocationCreate.bind(this); 
    }
    //handle logout to destroy the cookie
    handleLogout = () => {
        cookie.remove('cookie', { path: '/' })
    }

    cityChangeHandler = (e) => {
        this.setState({
            city : e.target.value,
            cityFlag : true
        })
    }

    ostateChangeHandler = (e) => {
        this.setState({
            ostate : e.target.value,
            stateFlag : true
        })
    }

    countryChangeHandler = (e) => {
        this.setState({
            country : e.target.value,
            countryFlag : true
        })
    }


    handleLocationCreate = (e) => {
        e.preventDefault();

        var data = {
            email : document.cookie.substring(7),
            ostate : this.state.ostate,
            city : this.state.city,
            country : this.state.country,
        }
        console.log("JUST ABOVE TEST" + this.state.locationsfields[0])
        console.log("TESTING THIS" + this.state.locationsfields[0].propertyid)
        if(this.state.locationsfields[0].propertyid == 0){
        console.log("Posting location details for : ", this.state.email);
        axios.post('http://localhost:3001/plocation', data)
            .then(response => {
                console.log("Status Code : ",response.status);
                console.log("Data Sent ",response.data);
                if(response.status === 200){
                    //redirectVar = <Redirect to= "/pdetails"/>
                    this.setState({
                        locationCreated : true
                    })
                        
                }else{
                    this.setState({
                        locationCreated : false
                    })
                }
            
            });
        }
        else{
            console.log("Updating location details for : ", this.state.email);
            axios.put('http://localhost:3001/plocation', data)
            .then(response => {
                console.log("Status Code : ",response.status);
                console.log("Data Sent ",response.data);
                if(response.status === 200){
                    //redirectVar = <Redirect to= "/pdetails"/>
                    this.setState({
                        locationUpdated : true
                    }) 
                }else{
                    this.setState({
                        locationUpdated : false
                    })
                }
            
            })

        }
    }

    componentWillMount(){
        console.log("plocation get")
        var lemail = document.cookie.substring(7)
        console.log("location email" , lemail)
        axios.get("http://localhost:3001/plocation/"+lemail)
                .then((response) => {
                    console.log(response.data)
                this.setState({
                    locationsfields : response.data
                });
                console.log("Checking whether location array is there or not in component will mount ",this.state.locationsfields)
                console.log(this.state.locationsfields[0].propertyid)
                if(this.state.cityFlag==false){
                    console.log("Previous value for city", this.state.locationsfields[0].city)
                    this.setState({
                        city : this.state.locationsfields[0].city
                    })
                }
        
                if(this.state.stateFlag==false){
                    console.log("Previous value for state", this.state.locationsfields[0].state)
                    this.setState({
                        ostate : this.state.locationsfields[0].state
                    })
                }
        
                if(this.state.countryFlag==false){
                    console.log("Previous value for country", this.state.locationsfields[0].country)
                    this.setState({
                        country : this.state.locationsfields[0].country
                    })
                }
            });
    }

    componentDidMount(){
        var lemail = document.cookie.substring(7)
        axios.get("http://localhost:3001/plocation/"+lemail)
                .then((response) => {
                    console.log(response.data)
                this.setState({
                    locationsfields : response.data
                });
                console.log("Checking whether location array is there or not",this.state.locationsfields[0])
            });
    }

render(){

    let toshowdetails = this.state.locationsfields.map(locationref => {
        return(
            <div>
            <div class="form-group">
                    <h5><strong>City:</strong></h5>
                    <input onChange = {this.cityChangeHandler} type="text" class="city" name="address" placeholder={locationref.city}/>
                    </div>
                    <br></br>
                    <div class="form-group"> 
                    <h5><strong>State:</strong></h5> 
                    <input onChange = {this.ostateChangeHandler} type="text" class="state" name="address" placeholder={locationref.state} />
                    </div>
                    <br></br>
                    <div class="form-group">
                    <h5><strong>Country:</strong></h5>
                    <input onChange = {this.countryChangeHandler} type="text" class="country" name="address" placeholder={locationref.country} />
            </div>
            <br></br>
            </div> 
        )
    })

    let navLogin = null;
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

    //if Cookie is set render Logout Button
    if(cookie.load('cookie')){
        console.log("Able to read cookie:", document.cookie);
        //redirectVar = <Redirect to= "/pdetails"/>
    }    
    //redirect based on successful login
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
                <h4><strong>Verify the location of your rental </strong></h4>
                <hr></hr>
                <br></br>
                <div>
                {toshowdetails}
                </div>
                <div>
                 <button onClick = {this.handleLocationCreate} class="btn btn-warning">Submit</button>  
                </div>
                <br></br><br></br>
                <div class="locationbuttons">
                <a href="/property" class="btn btn-default">Back</a> &nbsp;
                <a href="/pdetails" class="btn btn-primary">Next</a></div><br></br><br></br>
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
export default Plocation;