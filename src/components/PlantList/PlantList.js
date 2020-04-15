import React, { Component } from 'react';
import { connect } from 'react-redux';

const mapStateToProps = reduxState => ({
    reduxState,
});

class PlantList extends Component {
    componentDidMount() {
        // use component did mount to dispatch an action to request the plantList from the API
       this.getPlants();
    }

    getPlants = () =>{
        this.props.dispatch({type:'FETCH_PLANTS'});
    }

    deletePlant = (id)=>{
        this.props.dispatch({type:'DELETE_PLANT', payload: id});
    }

    render() {
        return (
            <div>
                <h3>This is the plant list</h3>
                <pre>{JSON.stringify(this.props.reduxState)}</pre>
                { <ul>
                    {this.props.reduxState.plantList.map((plantItem)=> {
                        return(
                            <li key={plantItem.id}>{plantItem.name}
                            <button onClick={()=>this.deletePlant (plantItem.id)}>Delete</button></li>
                        )})}
                </ul> }
            </div>
        );
    }
}


export default connect(mapStateToProps)(PlantList);
