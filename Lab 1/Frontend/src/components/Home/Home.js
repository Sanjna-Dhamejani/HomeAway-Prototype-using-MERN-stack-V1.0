import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import {BrowserRouter} from 'react-router-dom';
import logoha from './logoha.png'
import { throws } from 'assert';
let redirectVar = null;
       

class Home extends Component {

    //call the constructor method
    constructor(props){
      //Call the constructor of Super class i.e The Component
      super(props);
      //maintain the state required for this component

      this.state = {
          uemail: "",
          destination : "",
          arrive : "",
          depart : "",
          guests : "",
          destinationFlag: false,
          arriveFlag : false,
          departFlag : false,
          guestsFlag : false,
          searchSuccess: false
      }

      this.handleLogout = this.handleLogout.bind(this);
      this.destinationChangeHandler = this.destinationChangeHandler.bind(this);
      this.arriveChangeHandler = this.arriveChangeHandler.bind(this);
      this.departChangeHandler = this.departChangeHandler.bind(this);
      this.guestsChangeHandler = this.guestsChangeHandler.bind(this);
      this.search = this.search.bind(this); 
  }
  //handle logout to destroy the cookie
  handleLogout = () => {
      cookie.remove('cookie', { path: '/' })
  }

  destinationChangeHandler = (e) => {
      this.setState({
          destination : e.target.value,
          destinationFlag : true
      })
  }

  arriveChangeHandler = (e) => {
      this.setState({
          arrive : e.target.value,
          arriveFlag : true
      })
  }

  departChangeHandler = (e) => {
      this.setState({
          depart : e.target.value,
          departFlag : true
      })
  }

  guestsChangeHandler = (e) => {
    this.setState({
        guests : e.target.value,
        guestsFlag : true
    })
}


  search = (e) => {
      e.preventDefault();

      var data = {
          uemail : document.cookie.substring(7),
          arrive : this.state.arrive,
          depart : this.state.depart,
          destination : this.state.destination,
          guests : this.state.guests,
      }

      axios.post('http://localhost:3001/home', data)
          .then(response => {
              console.log("Status Code : ",response.status);
              console.log("Data Sent ",response.data);
              localStorage.setItem("listingresult",JSON.stringify(response.data))
              if(response.status === 200){
                  redirectVar = <Redirect to= "/listings"/>
                  console.log("Taking search with data :", response.data)
                  this.setState({
                      searchSuccess : true
                  }) 
                         
              }else{
                  this.setState({
                      searchSuccess : false
                  })

              }
          
          });
      }
    


  render(){
    let navLogin = null;
        if(cookie.load('cookie')){
        navLogin = (
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#"></a>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
              <ul class="nav navbar-nav navbar-right">
                <li class="nav-item active">
                  <a class="nav-link" href="/mytrips">Tripboards <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item active">
                  <a class="nav-link" href="#">Help <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    My Account
                </a>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" href="/profile">My Profile</a><br></br>
                <li><Link to="/home" onClick = {this.handleLogout}><span class="dropdown-item"></span>Logout</Link></li>
                </div></li>
                <li class="nav-item">
                <a class="btn btn-default" href="/osignup">List your property</a>
                </li>
                <li class="nav-item">
                <a class="site-header-birdhouse" title="Learn more"><img alt="HomeAway birdhouse" class="site-header-birdhouse__image" role="presentation" src="//csvcus.homeaway.com/rsrcs/cdn-logos/2.11.0/bce/moniker/homeaway_us/birdhouse-bceheader-white.svg"/></a>
                </li>
              </ul>
            </div>
          </nav>
        
        )
        }
        else{
            navLogin = (
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <a class="navbar-brand" href="#"></a>
                <div class="collapse navbar-collapse" id="navbarNavDropdown">
                  <ul class="nav navbar-nav navbar-right">
                    <li class="nav-item active">
                      <a class="nav-link" href="#">Tripboards <span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item active">
                      <a class="nav-link" href="#">Help <span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Login
                    </a>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="/tlogin">Traveler Login</a><br></br>
                    <a class="dropdown-item" href="/ologin">Owner Login</a>
                    </div></li>
                    <li class="nav-item">
                    <a class="btn btn-default" href="/osignup">List your property</a>
                    </li>
                    <li class="nav-item">
                    <a class="site-header-birdhouse" title="Learn more"><img alt="HomeAway birdhouse" class="site-header-birdhouse__image" role="presentation" src="//csvcus.homeaway.com/rsrcs/cdn-logos/2.11.0/bce/moniker/homeaway_us/birdhouse-bceheader-white.svg"/></a>
                    </li>
                  </ul>
                </div>
              </nav>
            
            )
        }
        return(
           
            
                <div>
                {redirectVar}
                    <div className = "backgroundimage">
                    <nav class="navbar">
                    <div class="container-fluid">
                        <div class="navbar-header">
                        <img src={logoha}></img>
                        </div>
                        {navLogin}
                    </div>
                </nav>
                        <div class="Jumbotron">
                            <div class="Jumbotron__wrapper">
                                <div class="Jumbotron__content">
                                <div class="home_search ">
                                    <h1 class="Intro">
                                        <span class="HeadLine__text">Book beach houses, cabins,</span>
                                        </h1>
                                    <h1 class="Intro">
                                        <span class="HeadLine__text">condos and more, worldwide.</span>
                                    </h1>
                                    <form class="form_inline " method="post">
                                    <div class="home_inputs">
                                    
                                    <input onChange = {this.destinationChangeHandler} class="destination"type="text" name="destination"  placeholder="Where do you want to go?"/>
                                    &nbsp;&nbsp;
                                    <input onChange = {this.arriveChangeHandler} class="belowwhere" type="date" placeholder="Arrive"/>&nbsp;&nbsp;
                                    <input onChange = {this.departChangeHandler} class="belowwhere" type="date" placeholder="Depart"/>&nbsp;&nbsp;
                                    <input onChange = {this.guestsChangeHandler} class="belowwhere" type="number" placeholder="Guests"/>&nbsp;&nbsp;
                                    
                                    <button onClick = {this.search} class="btn btn-primary" type="submit">Search</button>
                                    </div>
                                    </form>
                                    <div class="flex-container">
                                        <div><p><strong>Your whole vacation starts here.</strong></p>
                                                <p>Choose a rental from the world's best selection.</p>
                                        </div>
                                        <div>
                                        <p><strong>Book and stay with confidence.</strong></p>
                                        <a href="https://www.homeaway.com/info/ha-guarantee/travel-with-confidence?icid=il_o_link_bwc_homepage">Secure payments, peace of mind</a>
                                        </div>
                                        <div>
                                        <p><strong>Your vacation your way.</strong></p>
                                        <p>More space, more privacy, no compromises.</p>
                                        </div>
                                        </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              
<footer class="page-footer font-small teal pt-4">
    <div class="container-fluid text-center">
      <div class="row">
        
          
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<p>Use of this website constitutes acceptance of the HomeAway.com Terms and Conditions and Privacy Policy.</p>
            <br></br>
          <p>©2006-Present HomeAway.com, Inc. All rights reserved.</p>
        
        
        </div>
      </div>
    <div class="footer-copyright text-center py-3">© 2018 Copyright:
      <a href="https://homeaway.com"> HomeAway.com</a>
    </div>
  </footer>

            </div>
                 
        )

    }
}

export default Home;