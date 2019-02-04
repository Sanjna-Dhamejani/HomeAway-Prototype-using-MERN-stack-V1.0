import React, {Component} from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import lp from './lp.svg'
import {Link} from 'react-router-dom';
import './property.css';

class PDetails extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        
        this.state = {
            email : "",
            headline : "Headline",
            descript : "Description",
            propertytype :"Property Type",
            bedrooms : "Bedrooms",
            accomodates : "Accomodates",
            bathrooms : "Bathrooms",
            detailsfields : [],
            headlineFlag: false,
            descriptFlag : false,
            propertytypeFlag : false,
            bedroomsFlag : false,
            accomodatesFlag : false,
            bathroomsFlag : false,
            detailsCreated : false,
            detailsUpdated : false
        }

        this.handleLogout = this.handleLogout.bind(this);
        this.headlineChangeHandler = this.headlineChangeHandler.bind(this);
        this.descriptChangeHandler = this.descriptChangeHandler.bind(this);
        this.ptypeChangeHandler = this.ptypeChangeHandler.bind(this);
        this.bedsChangeHandler = this.bedsChangeHandler.bind(this);
        this.accChangeHandler = this.accChangeHandler.bind(this);
        this.bathChangeHandler = this.bathChangeHandler.bind(this);
        this.handlePropertyCreate = this.handlePropertyCreate.bind(this);
    }

        //handle logout to destroy the cookie
    handleLogout = () => {
        cookie.remove('cookie', { path: '/' })
    }

    headlineChangeHandler = (e) => {
        this.setState({
            headline : e.target.value,
            headlineflag : true
        })
    }

    ptypeChangeHandler = (e) => {
        this.setState({
            propertytype : e.target.value,
            propertytypeflag : true
        })
    }

    descriptChangeHandler = (e) => {
        this.setState({
            descript : e.target.value,
            descriptflag : true
        })
    }

    bedsChangeHandler = (e) => {
        this.setState({
            bedrooms : e.target.value,
            bedroomsflag : true
        })
    }
   
    accChangeHandler = (e) => {
        this.setState({
            accomodates : e.target.value,
            accomodatesflag : true
        })
    }

    bathChangeHandler = (e) => {
        this.setState({
            bathrooms : e.target.value,
            bathroomsflag : true
        })
    }

    handlePropertyCreate = (e) => {
        e.preventDefault();
        var data = {
            email : document.cookie.substring(7),
            headline : this.state.headline,
            descript : this.state.descript,
            propertytype : this.state.propertytype,
            bedrooms : this.state.bedrooms,
            accomodates : this.state.accomodates,
            bathrooms : this.state.bathrooms,

        }
        if(this.state.detailsfields[0].propertyid == 0){
        console.log("Posting details for : ", this.state.email);
        axios.post('http://localhost:3001/pdetails', data)
            .then(response => {
                console.log("Status Code : ",response.status);
                console.log("Data Sent ",response.data);
                if(response.status === 200){
                    this.setState({
                        detailsCreated : true
                    })
                }else{
                    this.setState({
                        detailsCreated : false
                    })
                }
            
            });
    }
    else{
        console.log("Updating details details for : ", this.state.email);
            axios.put('http://localhost:3001/pdetails', data)
            .then(response => {
                console.log("Status Code : ",response.status);
                console.log("Data Sent ",response.data);
                if(response.status === 200){
                    //redirectVar = <Redirect to= "/pdetails"/>
                    this.setState({
                        detailsUpdated : true
                    }) 
                }else{
                    this.setState({
                        detailsUpdated : false
                    })
                }
            
            });

        }
    }

    componentWillMount(){
        var lemail = document.cookie.substring(7)
        console.log("location email" , lemail)
        axios.get("http://localhost:3001/pdetails/"+lemail)
                .then((response) => {
                    console.log(response.data)
                this.setState({
                    detailsfields : response.data
                });
                console.log("Checking whether details array is there or not in component will mount ",this.state.detailsfields)
                
                if(this.state.headlineFlag==false){
                    console.log("Previous value for city", this.state.detailsfields[0].headline)
                    this.setState({
                        headline : this.state.detailsfields[0].headline
                    })
                }

                if(this.state.descriptFlag==false){
                    console.log("Previous value for city", this.state.detailsfields[0].descript)
                    this.setState({
                        descript : this.state.detailsfields[0].descript
                    })
                }

                if(this.state.propertytypeFlag==false){
                    console.log("Previous value for city", this.state.detailsfields[0].propertytype)
                    this.setState({
                        propertytype : this.state.detailsfields[0].propertytype
                    })
                }

                if(this.state.bedroomsFlag==false){
                    console.log("Previous value for city", this.state.detailsfields[0].bedrooms)
                    this.setState({
                        bedrooms : this.state.detailsfields[0].bedrooms
                    })
                }
        
                if(this.state.accomodatesFlag==false){
                    console.log("Previous value for state", this.state.detailsfields[0].accomodates)
                    this.setState({
                        accomodates : this.state.detailsfields[0].accomodates
                    })
                }
        
                if(this.state.bathroomsFlag==false){
                    console.log("Previous value for country", this.state.detailsfields[0].bathrooms)
                    this.setState({
                        bathrooms : this.state.detailsfields[0].bathrooms
                    })
                }
            
            });

    }

    componentDidMount(){
        var lemail = document.cookie.substring(7)
        console.log("location email" , lemail)
        axios.get("http://localhost:3001/pdetails/"+lemail)
                .then((response) => {
                    console.log(response.data)
                this.setState({
                    detailsfields : response.data
                });
                console.log("Checking whether details array is there or not",this.state.detailsfields)
            });
    }



    render(){

        let toshowdetails = this.state.detailsfields.map(detailsref => {
            return(
                <div class="main">
                <div class="pdetailform">
                <h5><strong>Headline:</strong></h5>
                    <input onChange = {this.headlineChangeHandler} type="text" class="pdinput" name="headline" placeholder={detailsref.headline}/>
                    <p>(minimum 20) 80 characters left</p>
                </div>
                <br></br>
                <div class="pdetailform">
                <h5><strong>Description:</strong></h5>
                    <input onChange = {this.descriptChangeHandler} type="text" class="pdescription" name="pdescription" placeholder={detailsref.descript}/>
                    <p>(minimum 400) 10,000 characters left</p>
                </div>
                <br></br>
                <div class="pdetailform">
                <h5><strong>Property Type:</strong></h5>
                    <input onChange = {this.ptypeChangeHandler} type="text" class="pdinput" name="ptype" placeholder={detailsref.propertytype}/>
                </div>
                <br></br>
                <div class="pdetailform">
                <h5><strong>Bedrooms:</strong></h5>
                    <input onChange = {this.bedsChangeHandler} type="number"  class="pdinput" name="beds" placeholder={detailsref.bedrooms}/>
                </div>
                <div class="pdetailform">
                <h5><strong>Accomodates:</strong></h5>
                    <input onChange = {this.accChangeHandler} type="number"  class="pdinput" name="acc" placeholder={detailsref.accomodates}/>
                </div>
                <br></br>
                <div class="pdetailform">
                <h5><strong>Bathrooms:</strong></h5>
                    <input onChange = {this.bathChangeHandler} type="number" class="pdinput" name="bath" placeholder={detailsref.bathrooms}/>
                </div>
                
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
        let redirectVar = null;
        
        if(cookie.load('cookie')){
            console.log("Able to read cookie : ", document.cookie)
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
                <h4><strong>Describe your property</strong></h4>
                <hr></hr>
                <p>Start out a descriptive headline and a detailed summary of your property. </p>
               
                {toshowdetails}
                
                <div>
                 <button onClick = {this.handlePropertyCreate} class="btn btn-warning">Submit</button>  
                </div>
                <br></br><br></br>
                <hr></hr>
                <div class="locationbuttons">
                <a href="/plocation" class="btn btn-default">Back</a> &nbsp;
                <a href="/pphotos" class="btn btn-primary">Next</a></div><br></br><br></br>
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
export default PDetails;