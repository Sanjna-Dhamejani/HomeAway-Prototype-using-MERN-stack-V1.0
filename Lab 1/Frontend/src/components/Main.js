import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Home from './Home/Home';
import TravelerLogin from './Traveler/TravelerLogin';
import TravelerSignUp from './Traveler/TravelerSignUp';
import Profile from './Profile/Profile';
import Property from './Owner/Property';
import OwnerLogin from './Owner/OwnerLogin';
import OwnerSignUp from './Owner/OwnerSignUp';
import Plocation from './Owner/Plocation';
import PDetails from './Owner/PDetails';
import OwnerDashboard from './Owner/OwnerDashboard';
import PPhotos from './Owner/PPhotos';
import PPricing from './Owner/PPricing';
import Listings from './Profile/listings';
import MyTrips from './Profile/mytrips';
import DisplayProp from './Profile/displayprop';
//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route path="/home" component={Home}/>
                <Route path="/tlogin" component={TravelerLogin}/>
                <Route path="/tsignup" component={TravelerSignUp}/>
                <Route path="/profile" component={Profile}/>
                <Route path="/displayprop" component={DisplayProp}/>
                <Route path="/listings" component={Listings}/>
                <Route path="/ologin" component={OwnerLogin}/>
                <Route path="/osignup" component={OwnerSignUp}/>
                <Route path="/property" component={Property}/>
                <Route path="/plocation" component={Plocation}/>
                <Route path="/odashboard" component={OwnerDashboard}/>
                <Route path="/pdetails" component={PDetails}/>
                <Route path="/pphotos" component={PPhotos}/>
                <Route path="/ppricing" component={PPricing}/>
                <Route path="/mytrips" component={MyTrips}/>
                </div>
                )
            }
        }
        //Export The Main Component
export default Main;