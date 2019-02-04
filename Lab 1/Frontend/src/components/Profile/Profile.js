import React, {Component} from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import ha from './ha.svg'
import birdhouse from './birdhouse.svg'
import {Link} from 'react-router-dom';
import './Profile.css';
//var redirectVar = null;
var formData = "";
var tempprofile ="";
//Define a Login Component
class Profile extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        
        //maintain the state required for this component
        this.state = {
            uemail : "",
            ufirstname : "",
            ulastname : "",
            aboutme: "",
            citycountry: "",
            company: "",
            school: "",
            hometown: "",
            languages: "",
            phone: "",
            gender: "",
            profileCreated : false,
            ufirstnameFlag : false,
            ulastnameFlag : false,
            aboutmeFlag: false,
            citycountryFlag: false,
            companyFlag: false,
            schoolFlag: false,
            hometownFlag: false,
            languagesFlag: false,
            phoneFlag: false,
            genderFlag: false,
            profilefields: [],
            profileUpdated : false,
            description: '',
            selectedFile: '',
        }
        //Bind the handlers to this class
        this.ufirstnameChangeHandler = this.ufirstnameChangeHandler.bind(this);
        this.ulastnameChangeHandler = this.ulastnameChangeHandler.bind(this);
        this.aboutmeChangeHandler = this.aboutmeChangeHandler.bind(this);
        this.ccChangeHandler = this.ccChangeHandler.bind(this);
        this.companyChangeHandler = this.companyChangeHandler.bind(this);
        this.schoolChangeHandler = this.schoolChangeHandler.bind(this);
        this.hometownChangeHandler = this.hometownChangeHandler.bind(this);
        this.languagesChangeHandler = this.languagesChangeHandler.bind(this);
        this.phoneChangeHandler = this.phoneChangeHandler.bind(this);
        this.genderChangeHandler = this.genderChangeHandler.bind(this);
        this.createProfile = this.createProfile.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout = () => {
        cookie.remove('cookie', { path: '/' })
    }
    //username change handler to update state variable with the text entered by the user
    
    onChange = (e) =>
    {
       for(let size=0; size < e.target.files.length; size++){
           console.log('Selected file:', e.target.files[size]);
           let file = e.target.files[size];
           var useremail = document.cookie.substring(7)
           console.log("uploading screenshot file for:", useremail)
           formData = new FormData();
           formData.append('selectedFile', file);
          
           axios.post(`http://localhost:3001/profilepic/${useremail}`, formData)
           .then((result) => {
             // access results...
           });
       }
   }

    ufirstnameChangeHandler = (e) => {
        this.setState({
            ufirstname : e.target.value,
            ufirstnameFlag : true
        })
    }
    
    ulastnameChangeHandler = (e) => {
        this.setState({
            ulastname : e.target.value,
            ulastnameFlag :true
        })
    }

    aboutmeChangeHandler = (e) => {
        this.setState({
            aboutme : e.target.value,
            aboutmeFlag : true
        })
    }

    ccChangeHandler = (e) => {
        this.setState({
            citycountry : e.target.value,
            citycountryFlag : true
        })
    }

    companyChangeHandler = (e) => {
        this.setState({
            company : e.target.value,
            companyFlag : true
        })
    }

    schoolChangeHandler = (e) => {
        this.setState({
            school : e.target.value,
            schoolFlag : true
        })
    }

    hometownChangeHandler = (e) => {
        this.setState({
            hometown : e.target.value,
            hometownFlag : true
        })
    }

    languagesChangeHandler = (e) => {
        this.setState({
            languages : e.target.value,
            languagesFlag : true
        })
    }

    phoneChangeHandler = (e) => {
        this.setState({
            phone : e.target.value,
            phoneFlag : true
        })
    }
    
    
    genderChangeHandler = (e) => {
        this.setState({
            gender : e.target.value,
            genderFlag : true
        })
    }

    //saveChanges handler to send a request to the node backend
    createProfile = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            uemail : document.cookie.substring(7),
            ufirstname : this.state.ufirstname,
            ulastname : this.state.ulastname,
            aboutme : this.state.aboutme,
            citycountry : this.state.citycountry,
            company : this.state.company,
            school : this.state.school,
            hometown : this.state.hometown,
            phone : this.state.phone,
            languages : this.state.languages,
            gender : this.state.gender,
        }
            axios.put('http://localhost:3001/profile', data)
                .then(response => {
                    console.log("Status Code : ",response.status);
                    console.log("Data Sent ",response.data);
                    if(response.status === 200){
                        //redirectVar = <Redirect to= "/pdetails"/>
                        this.setState({
                            profileCreated : true
                        })
                    }else{
                        this.setState({
                            profileCreated : false
                        })
                    }
                
                });
           
        }
    
        componentWillMount(){
        console.log("Profile get")
        var lemail = document.cookie.substring(7)
        console.log("Profile email" , lemail)
        axios.get("http://localhost:3001/profile/"+lemail)
                    .then((response) => {
                        console.log(response.data)
                    this.setState({
                        profilefields : response.data
                    });
                    console.log("Checking whether profile array is there or not in component will mount ",this.state.profilefields)
                    
                    if(this.state.ufirstnameFlag==false){
                        console.log("Previous value for firstname", this.state.profilefields[0].ufirstname)
                        this.setState({
                            ufirstname : this.state.profilefields[0].ufirstname
                        })
                    }
            
                    if(this.state.ulastnameFlag==false){
                        console.log("Previous value for lastname", this.state.profilefields[0].ulastname)
                        this.setState({
                            ulastname : this.state.profilefields[0].ulastname
                        })
                    }
            
                    if(this.state.aboutmeFlag==false){
                        console.log("Previous value for aboutme", this.state.profilefields[0].aboutme)
                        this.setState({
                            aboutme : this.state.profilefields[0].aboutme
                        })
                    }

                    if(this.state.citycountryFlag==false){
                        console.log("Previous value for citycountry", this.state.profilefields[0].citycountry)
                        this.setState({
                            citycountry : this.state.profilefields[0].citycountry
                        })
                    }

                    if(this.state.companyFlag==false){
                        console.log("Previous value for company", this.state.profilefields[0].company)
                        this.setState({
                            company : this.state.profilefields[0].company
                        })
                    }

                    if(this.state.schoolFlag==false){
                        console.log("Previous value for school", this.state.profilefields[0].school)
                        this.setState({
                            school : this.state.profilefields[0].school
                        })
                    }

                    if(this.state.hometownFlag==false){
                        console.log("Previous value for hometown", this.state.profilefields[0].hometown)
                        this.setState({
                            hometown : this.state.profilefields[0].hometown
                        })
                    }

                    if(this.state.languagesFlag==false){
                        console.log("Previous value for languages", this.state.profilefields[0].languages)
                        this.setState({
                            languages : this.state.profilefields[0].languages
                        })
                    }

                    if(this.state.phoneFlag==false){
                        console.log("Previous value for phone", this.state.profilefields[0].phone)
                        this.setState({
                            phone : this.state.profilefields[0].phone
                        })
                    }

                    if(this.state.genderFlag==false){
                        console.log("Previous value for gender", this.state.profilefields[0].gender)
                        this.setState({
                            gender : this.state.profilefields[0].gender
                        })
                    }

                });
    
        }
    
componentDidMount(){
var lemail = document.cookie.substring(7)
axios.get("http://localhost:3001/profile/"+lemail)
        .then((response) => {
            console.log("Profile get response data",response.data)
        this.setState({
            profilefields : response.data
        });
        console.log("Checking whether profile array is there or not",this.state.profilefields)
    tempprofile = response.data;
    console.log("Temp profile", tempprofile[0])
    

    var imageArr = [];
        axios.post('http://localhost:3001/download/' + tempprofile[0].profilepicname.split(',')[0])
            .then(response => {
                //console.log("Imgae Res : ", response);
                let imagePreview = 'data:image/jpg;base64, ' + response.data;
                imageArr.push(imagePreview);
                //const propertyArr = this.state.Properties.slice();
                tempprofile[0].profilepicname = imagePreview;
                this.setState({
                    profilefields: tempprofile
                });
            });
        });
}


    render(){

        let toshowdetails = this.state.profilefields.map(profileref => {
            return(
                <div>
                <div class="imagediv">
                <img class = "profileimage" src={profileref.profilepicname}/>
                </div>

                
                
                <div class="profilepicuploadbutton">
                <label for="uploadpic" name ="description" /*value={description}*/ onChange={this.onChange} multiple class = "btn btn-success">SELECT PHOTO TO UPLOAD</label>
                <input type = "file" id ="uploadpic"  class ="hidethis" multiple name="selectedFile" onChange={this.onChange}/>
                </div>
        

                <div class="main-div1">
                <div class="panel1">
                    <h2><strong>Profile Information</strong></h2>
                </div>
                <div class="form-group1">
                <h5><strong>First Name:</strong></h5>
                <input onChange = {this.ufirstnameChangeHandler} type="text" class="form-control1" name="fname" placeholder={profileref.ufirstname} disabled/>
            </div>
            <div class="form-group1">
            <h5><strong>Last Name:</strong></h5>
                <input onChange = {this.ulastnameChangeHandler} type="text" class="form-control1" name="lname" placeholder={profileref.ulastname} disabled/>
            </div>
            <div class="form-group1">
            <h5><strong>About Me:</strong></h5>
                <input onChange = {this.aboutmeChangeHandler} type="text" class="form-control2" name="aboutme" placeholder={profileref.aboutme}/>
            </div>
            <div class="form-group1">
            <h5><strong>City and Country:</strong></h5>
                <input onChange = {this.ccChangeHandler} type="text" class="form-control1" name="cc" placeholder={profileref.citycountry}/>
            </div>
            <div class="form-group1">
            <h5><strong>Company:</strong></h5>
                <input onChange = {this.companyChangeHandler} type="text" class="form-control1" name="company" placeholder={profileref.company}/>
            </div>
            <div class="form-group1">
            <h5><strong>School:</strong></h5>
                <input onChange = {this.schoolChangeHandler} type="text" class="form-control1" name="school" placeholder={profileref.school}/>
            </div>
            <div class="form-group1">
            <h5><strong>Hometown:</strong></h5>
                <input onChange = {this.hometownChangeHandler} type="text" class="form-control1" name="hometown" placeholder={profileref.hometown}/>
            </div>
            <div class="form-group1">
            <h5><strong>Phone No:</strong></h5>
                <input onChange = {this.phoneChangeHandler} type="number" class="form-control1" name="number" placeholder={profileref.phone}/>
            </div>
            <div class="form-group1">
            <h5><strong>Languages:</strong></h5>
                <input onChange = {this.languagesChangeHandler} type="text" class="form-control1" name="languages" placeholder={profileref.languages}/>
            </div>
            <div class="form-group1">
            <h5><strong>Gender:</strong></h5>
            <input onChange = {this.genderChangeHandler} type="text" class="form-control1" name="gender" placeholder={profileref.gender}/>
            </div>
            <button onClick = {this.createProfile} class="btn btn-primary btn-lg btn-block ">Save Changes</button>  
        </div>
        </div>      
            )
        })


        //redirect based on successful login
        let redirectVar = null;
        if(cookie.load('cookie')){
            //redirectVar = <Redirect to= "/"/>
            console.log("Able to read cookie")
        }
        else{ 
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
    
        <div class="background1">
            <div class="container1">
                <div class="login-form1">
                   
                      {toshowdetails}     
                            
                                                    
            </div>
            </div>
        </div>
        </div>
        )
    }
}
//export Login Component
export default Profile;