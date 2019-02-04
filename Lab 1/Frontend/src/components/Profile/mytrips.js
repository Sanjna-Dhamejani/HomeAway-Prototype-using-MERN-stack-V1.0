import React, {Component} from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import ha from './ha.svg'
import birdhouse from './birdhouse.svg'
import {Link} from 'react-router-dom';
import './listings.css';
//var redirectVar = null;
var uemail = document.cookie.substring(7)
class DisplayProp extends Component {
    constructor(props){
        super(props);
        this.state = {  
            userdata : [],
            ownerdata : false,
            bookingdata :[] 
        }
        this.handleLogout = this.handleLogout.bind(this);
        //this.submitBooking = this.submitBooking.bind(this);
    }  

    handleLogout = () => {
        cookie.remove('cookie', { path: '/' })
    }

    componentDidMount(){
                console.log("User email:", uemail)
                axios.get("http://localhost:3001/mytrips/"+uemail)
                    .then((response) => {
                        console.log(response.data)
                    this.setState({
                        bookingdata : response.data
                    });
                    console.log("Checking whether booking details are there or not",this.state.bookingdata)
                });
        }

        componentWillMount(){
            axios.get("http://localhost:3001/mytrips/"+uemail)
            .then((response) => {
                console.log(response.data)
            this.setState({
                bookingdata : response.data
            });
            console.log("Checking whether booking details are there or not",this.state.bookingdata)
        });
        }
        
        
    render(){
        let details = this.state.bookingdata.map((bookingdata,j) => {
            return(
                <div class ="flex-container7">
                <div><tr key={j}>
                <tr><h4>{bookingdata.headline}</h4></tr>
                    <tr><td>{bookingdata.city}, {bookingdata.country}</td></tr>
                    <tr><td>{bookingdata.propertytype}&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</td>
                    <td>{bookingdata.bedrooms}BR</td>&nbsp; &nbsp; &nbsp;
                    <td>{bookingdata.bathrooms}BA</td>&nbsp; &nbsp; &nbsp;
                    <td>Sleeps {bookingdata.accomodates}</td>&nbsp; &nbsp; &nbsp;
                    <td>{bookingdata.descript}</td></tr><hr></hr>
                    <hr></hr><tr>$<td>{bookingdata.currency} per night</td></tr><hr></hr>
                    <tr><td>Booked from {bookingdata.startdate.substring(0,10)} to {bookingdata.enddate.substring(0,10)}</td></tr>
                    <tr><a href="/home" class="btn btn-success">Home</a></tr>
                    </tr>
                    </div>
                </div>
            )
            })
            
        //if not logged in go to login page
        let redirectVar = null;
        if(!cookie.load('cookie')){
            redirectVar = <Redirect to= "/tlogin"/>
        }
        return(
                <div>
                {redirectVar}
                <div class="navbarborder">
                <nav class="navbar navbar">
        <div class="container-fluid">
        <div class="navbar-header">
        <img src = {ha} height="50" width="200"></img>
        </div>
        <ul class="nav navbar-nav navbar-right">
        <li><a href="#">Tripboards</a></li>
                <li><Link to="/home" onClick = {this.handleLogout}><span class="glyphicon glyphicon-user"></span>Logout</Link></li>
                <li><a href="/help">Help</a></li>
                <li >
                <button class="btn btn-default" href="/property">List your property</button>
                </li>
                <li><img src = {birdhouse} height="50" width="50"></img></li>
                <hr color></hr>
        </ul>
        </div>
        </nav>
        </div>
        <div class = "navbarborder">
        <div class="collapse navbar-collapse">
		<ul class="nav navbar-nav pull-left">
			<li><a href="/mytrips">My Trips</a></li>
			<li><a href="/profile">Profile</a></li>
		</ul>
    </div>
    </div>
                <div class="container">
                    <h2>Your Bookings:</h2>
                        <table class="table">
                        <br></br><br></br>
                            <thead>
                                <tr>
                                </tr>
                            </thead>
                            <tbody>
                                {details}
                            </tbody>
                        </table>
                </div> 
            </div> 
        )
    }
}
//export Home Component
export default DisplayProp;