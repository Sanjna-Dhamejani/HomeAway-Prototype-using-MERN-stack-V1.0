import React, {Component} from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import ha from './ha.svg'
import birdhouse from './birdhouse.svg'
import {Link} from 'react-router-dom';
import './displaprop.css';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

//var redirectVar = null;

class DisplayProp extends Component {
    constructor(props){
        super(props);
        this.state = {  
            property : [],
            bookedFlag : false,
            pics:[],
            oemail : (this.props.history.location.pathname).substring(13),
            photos: []
        }
        this.handleLogout = this.handleLogout.bind(this);
        this.submitBooking = this.submitBooking.bind(this);
    }  

    handleLogout = () => {
        cookie.remove('cookie', { path: '/' })
    }
    

    componentDidMount(){
        var temp = localStorage.getItem("listingresult")
        var tempparse = JSON.parse(temp)
                this.setState({
                    searchresults : tempparse 
                });
                console.log("Local storage item: ",tempparse)
                //console.log(this.props.history.location.pathname)
                //oemail = (this.props.history.location.pathname).substring(13)
                console.log("OWNER EMAIL inside componentdidmount",this.state.oemail)
                axios.get("http://localhost:3001/displayprop/"+this.state.oemail)
                    .then((response) => {
                        console.log(response.data)
                    this.setState({
                        property : response.data
                    });
                    console.log("Checking whether property details are there or not",this.state.property)
                });
                var data = {
                    oemail : this.state.oemail
                }
                console.log("OWNER EMAIL outside get",this.state.oemail)
                axios.post('http://localhost:3001/displaypropphotos', data)
                .then((response) => {
                    console.log("Printing photos response",response.data)
                this.setState({
                    pics : response.data
                });
                console.log("Checking whether pictures are there or not",this.state.pics)
            
            console.log("Outside",this.state.pics)
            for (let i = 0; i < this.state.pics.length; i++) {
                console.log("Inside for loop")
                console.log(this.state.pics[i])
                console.log("-----------")
                console.log("checking state pics", this.state.pics[i])
                axios.post('http://localhost:3001/download/' + this.state.pics[i].split(',')[0])
                    .then(response => {
                        console.log("Inside for post")
                        let imagePreview = 'data:image/jpg;base64, ' + response.data;
                        console.log(imagePreview)
                        //iarr.push(imagePreview);
                        const picsArray = this.state.pics.slice();
                        picsArray[i] = imagePreview;
                        this.setState({
                            pics: picsArray
                        });
                       // console.log('PhotoArr: ', picsArray);
                        console.log('Photo State: ', this.state.pics);
                   });
            }
        });
           
        }

        componentWillMount(){
            axios.get("http://localhost:3001/displayprop/"+this.state.oemail)
            .then((response) => {
                console.log(response.data)
            this.setState({
                property : response.data
            });
            console.log("Checking whether property details are there or not in component will mount",this.state.property)
        });

        }
    
        submitBooking = (e) => {
            var headers = new Headers();
            //prevent page from refresh
            console.log("owner email to be booked " + this.state.oemail)
            console.log("User email is ", document.cookie.substring(7),)
            const data = {
                uemail : document.cookie.substring(7),
                oemail : this.state.oemail,
                totalprice : this.state.property[0].currency,
                startdate : this.state.property[0].startdate,
                enddate : this.state.property[0].enddate,
                propertyid : this.state.property[0].propertyid,
                bookedFlag : this.state.bookedFlag
            }
            console.log(data)
            e.preventDefault();
            //set the with credentials to true
            //axios.defaults.withCredentials = true;

            axios.post('http://localhost:3001/displayprop',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                console.log("Data Sent ",response.data);
                if(response.status === 200){
                    this.setState({
                        bookedFlag : true
                    }) 
                }else{
                    this.setState({
                        bookedFlag : false
                    })
                }
            
            });
        }

           
        
    render(){
        let pictures = this.state.pics.map(images => {
            return(
                <div>
                    <img class = "displaypropimage" src={images}/>
                </div>
            )
        })

        let details = this.state.property.map((pro,j) => {
            return(
                <div class ="flex-container8">
                <div class = "row">
                <div class = "column left">
                <Carousel class="carouselprop" showThumbs={false}>{pictures}</Carousel>
               </div>
               <div class = "column right">
               &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <h4>{pro.headline}</h4><br></br>
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  {pro.propertytype}&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    {pro.bedrooms}BR&nbsp; &nbsp; &nbsp;
                    {pro.bathrooms}BA&nbsp; &nbsp; &nbsp;
                    Sleeps {pro.accomodates}&nbsp; &nbsp; &nbsp;
                    {pro.descript}<hr></hr><br></br><br></br><br></br>
                    <hr></hr>${pro.currency} per night<hr></hr>
                   <button onClick = {this.submitBooking} class="btn btn-success" type="submit">Book Now</button>
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
        <li><a href="/mytrips">My Trips</a></li>
                <li><Link to="/home" onClick = {this.handleLogout}><span class="glyphicon glyphicon-user"></span>Logout</Link></li>
                <li><a href="/#">Help</a></li>
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
                    <h2>Do you want to book this property?</h2>
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