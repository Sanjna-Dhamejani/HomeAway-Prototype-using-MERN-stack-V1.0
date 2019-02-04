import React, {Component} from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import ha from './ha.svg'
import birdhouse from './birdhouse.svg'
import {Link} from 'react-router-dom';
import './listings.css';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
//var redirectVar = null;

class Listings extends Component {
    constructor(props){
        super(props);
        this.state = {  
            searchresults : [],
            pics:[],   
        }
        this.handleLogout = this.handleLogout.bind(this);
    }  

    handleLogout = () => {
        cookie.remove('cookie', { path: '/' })
    }

    componentWillMount(){
        var temp = localStorage.getItem("listingresult")
        var tempparse = JSON.parse(temp)          
                this.setState({
                    searchresults : tempparse, 
                });
                console.log("Local storage item: in will mount ", tempparse)
    }

    //get the books data from backend  
    componentDidMount(){
        var temp = localStorage.getItem("listingresult")
        var tempparse = JSON.parse(temp)          
                this.setState({
                    searchresults : tempparse, 
                });
                console.log("Local storage item: in did mount ", tempparse)
                // for(let i = 0;i < tempparse.length;i++){
                //     justpicname[i]=tempparse[i].picname
                //     console.log("Justpicnames:",justpicname[i])
                // }

                var imageArr = [];
                for (let i = 0; i < tempparse.length; i++) {
                    axios.post('http://localhost:3001/download/' + tempparse[i].picname.split(',')[0])
                        .then(response => {
                            //console.log("Imgae Res : ", response);
                            let imagePreview = 'data:image/jpg;base64, ' + response.data;
                            imageArr.push(imagePreview);
                            //const propertyArr = this.state.Properties.slice();
                            tempparse[i].picname = imagePreview;
                            this.setState({
                                searchresults: tempparse
                            });
                        });
                }
            
    }

    render(){
        //iterate over books to create a table row
        let details = this.state.searchresults.map((searchresult,j) => {
            return(
    
                <div class ="flex-container7" key={j}  >
                <div class = "row">
                <div class = "column left">
                <img class = "listingimage1" src={searchresult.picname}/></div>
                <br></br>
                <div class = "column right"><h4><Link to={`/displayprop/${searchresult.email}`}>{searchresult.headline}</Link></h4><hr></hr><br></br>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;{searchresult.propertytype}&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    {searchresult.bedrooms}BR &nbsp; &nbsp; &nbsp;
                    {searchresult.bathrooms}BA&nbsp; &nbsp; &nbsp;
                    Sleeps {searchresult.accomodates}&nbsp; &nbsp; &nbsp;
                    {searchresult.descript}<br></br><br></br><br></br><br></br><br></br><br></br><br></br>
                    <hr></hr>$ {searchresult.currency} per night
                    </div>
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
        <li><a href="/mytrips">Tripboards</a></li>
                <li><Link to="/home" onClick = {this.handleLogout}><span class="glyphicon glyphicon-user"></span>Logout</Link></li>
                <li><a href="/help">Help</a></li>
                <li >
                <button class="btn btn-default" href="/osignup">List your property</button>
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
                    <h2>List of All Available Properties</h2>
                    
                        
                                {details}
                           
                </div> 
            </div> 
        )
    }
}
//export Home Component
export default Listings;