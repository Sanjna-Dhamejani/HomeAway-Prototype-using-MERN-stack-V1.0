import React, {Component} from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import lp from './lp.svg'
import {Link} from 'react-router-dom';
import './property.css';

class PPricing extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component

        this.state = {
            email : "",
            startdate : "mm/dd/yy",
            enddate : "mm/dd/yy",
            currency : "Nightly Base Rent",
            currencyFlag : false,
            startdateFlag : false,
            enddateFlag : false,
            pricingCreated : false,
            pricingfields : [],
            pricingUpdated : false
        }

        this.handleLogout = this.handleLogout.bind(this);
        this.startdateChangeHandler = this.startdateChangeHandler.bind(this);
        this.enddateChangeHandler = this.enddateChangeHandler.bind(this);
        this.currencyChangeHandler = this.currencyChangeHandler.bind(this);
        this.handlePricingCreate = this.handlePricingCreate.bind(this);
        }

        //handle logout to destroy the cookie
    handleLogout = () => {
        cookie.remove('cookie', { path: '/' })
    }

    startdateChangeHandler = (e) => {
        this.setState({
            startdate : e.target.value,
            startdateFlag : true
        })
    }

    enddateChangeHandler = (e) => {
        this.setState({
            enddate : e.target.value,
            enddateFlag : true
        })
    }

    currencyChangeHandler = (e) => {
        this.setState({
            currency : e.target.value,
            currencyFlag : true
        })
    }
   
    handlePricingCreate = (e) => {
        e.preventDefault();
        var data = {
            email : document.cookie.substring(7),
            startdate : this.state.startdate,
            enddate : this.state.enddate,
            currency : this.state.currency,
        }
        console.log("JUST ABOVE TEST" + this.state.pricingfields[0])
        console.log("TESTING THIS" + this.state.pricingfields[0].propertyid)
        if(this.state.pricingfields[0].propertyid == 0){
        console.log("Posting pricing for : ", this.state.email);
        axios.post('http://localhost:3001/ppricing', data)
            .then(response => {
                console.log("Status Code : ",response.status);
                console.log("Data Sent ",response.data);
                if(response.status === 200){
                    this.setState({
                        pricingCreated : true
                    })
                }else{
                    this.setState({
                        pricingCreated : false
                    })
                }
            
            });
    }
    else{
        console.log("Updating pricing for : ", this.state.email);
        axios.put('http://localhost:3001/ppricing', data)
        .then(response => {
            console.log("Status Code : ",response.status);
            console.log("Data Sent ",response.data);
            if(response.status === 200){
                //redirectVar = <Redirect to= "/pdetails"/>
                this.setState({
                    pricingUpdated : true
                }) 
            }else{
                this.setState({
                    pricingUpdated : false
                })
            }
        
        });

    }
}

componentWillMount(){
    console.log("plocation get")
        var lemail = document.cookie.substring(7)
        console.log("location email" , lemail)
        axios.get("http://localhost:3001/ppricing/"+lemail)
            .then((response) => {
                console.log(response.data)
            this.setState({
                pricingfields : response.data
            });
            console.log("Checking whether pricing array is there or not in component will mount ",this.state.pricingfields)
            if(this.state.pricingfields){
            if(this.state.startdateFlag==false){
                console.log("Previous value for startdate", this.state.pricingfields[0].startdate)
                this.setState({
                    startdate : this.state.pricingfields[0].startdate
                })
            }
    
            if(this.state.enddateFlag==false){
                console.log("Previous value for enddate", this.state.pricingfields[0].enddate)
                this.setState({
                    enddate : this.state.pricingfields[0].enddate
                })
            }
    
            if(this.state.currencyFlag==false){
                console.log("Previous value for currency", this.state.pricingfields[0].currency)
                this.setState({
                    currency : this.state.pricingfields[0].currency
                })
            }
        }

        });

}

componentDidMount(){
    console.log("plocation get")
        var lemail = document.cookie.substring(7)
        console.log("location email" , lemail)
        axios.get("http://localhost:3001/ppricing/"+lemail)
            .then((response) => {
                console.log(response.data)
            this.setState({
                pricingfields : response.data
            });
            console.log("Checking whether pricing array is there or not",this.state.pricingfields)
        });
}

render(){

let toshowdetails = this.state.pricingfields.map(pricingref => {
    return(
        <div>
        <h5><strong>Start Date:</strong></h5>
        <div class="ppricingform">
            <input onChange = {this.startdateChangeHandler} type="date" class="pdinput" name="startdate" placeholder= {pricingref.startdate}/>
        </div>
        <h5><strong>End Date:</strong></h5>
        <div class="ppricingform">
            <input onChange = {this.enddateChangeHandler} type="date" class="pdinput" name="enddate" placeholder={pricingref.enddate}/>
        </div>
        <div>
        <h1><strong>How much do you want to charge?</strong></h1>
        <hr></hr>
        <p>We recommend starting with a low price to get a few bookings and earn some initial guest reviews. You can update your rates at any time.</p>
        <hr></hr>
        </div>
        <div class="ppricingform">
        <h5><strong>Currency:</strong></h5>
            <input type="text" class="prenttype" name="currencytype" placeholder=" $" disabled/> &nbsp;
            <input onChange = {this.currencyChangeHandler} type="text" class="prent" name="currency" placeholder={pricingref.currency}/>
        </div></div>
           
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
        let redirectVar = null;
        
        if(cookie.load('cookie')){
            console.log("Able to read cookie")
            //redirectVar = <Redirect to= "/ppricing"/> 
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
               <li><a href= "/ppricing">Pricing</a>
               <li><a href= "/odashboard">Owner Dashboard</a></li>
               </li>
               </ul>
            </div>
            <div class="main">
                <h1><strong>Availability</strong></h1>
                <hr></hr>
                <p>Already know when you would like your property to be available? </p>
                <p>You can also make changes after publishing you listing.</p>
                <br></br><br></br>
                {toshowdetails}
                <hr></hr>
                <div>
                <button onClick = {this.handlePricingCreate} class="btn btn-warning">Submit</button></div><br></br><br></br>
                </div>
                <div class="locationbuttons">
                <a href="/pphotos" class="btn btn-default">Back</a> &nbsp;
                <a href="/odashboard" class="btn btn-default">Next</a>
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
export default PPricing;