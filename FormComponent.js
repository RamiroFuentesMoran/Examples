import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios'

class Training_form extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
                    // form state
                    id: '',
                    name :'', 
                    description:'',
                    active:true,
                    // internal state
                    message:'',
                    isUpdate: false,
                };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.changeUpdateMode = this.changeUpdateMode.bind(this);
      this.changeCreateMode = this.changeCreateMode.bind(this);
      this.toggleChangeCheckBox = this.toggleChangeCheckBox.bind(this);
      this.deleteItem = this.deleteItem.bind(this);
     
    }
    //----
    deleteItem(){
          
      const path = 'http://localhost:8000/api/sortOfTraining/delete' 

      const userSessionData = JSON.parse(window.localStorage.getItem("portofolioUserDataSession"))
      const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userSessionData.token}`
      }
      
      this.setState({message: "Sending request..."});
      
      const aux_json = {id:this.state.id};

      axios.post(path, aux_json, {headers: headers}).
      then( response => {

          let response_message = "";
          if (response.data.message=="does_not_exist") { response_message = "Selected element does not exist"; }

          if (response.data.message=="deleted") { 

            this.props.renderListMethod();
            this.changeCreateMode();
            response_message = "Deleted !";
                          
          }

          this.setState({message: response_message});

        }).catch( error => {
          console.log(error.message);

          })

        this.setState({isUpdate: true, id: auxid});
      
    }

    //---
    changeUpdateMode(auxid){
          
          const path = 'http://localhost:8000/api/sortOfTraining/getElement' 

          const userSessionData = JSON.parse(window.localStorage.getItem("portofolioUserDataSession"))
          const headers = {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userSessionData.token}`
          }
          
          this.setState({message: "Submiting"});
          
          const aux_json = {id:auxid};

          axios.post(path, aux_json, {headers: headers}).
          then( response => {

              let response_message = "";
              if (response.data.message=="does_not_exist") { response_message = "Selected element does not exist"; }

              if (response.data.message=="exists") { 

                this.setState({
                  name: response.data.data.name,
                  description: response.data.data.description,
                  active: response.data.data.active === 1 ? true : false
                });
                              
              }

              this.setState({message: response_message});

            }).catch( error => {
              console.log(error.message);

          })

        this.setState({isUpdate: true, id: auxid});
      
    }

    //---
    toggleChangeCheckBox(e){
      
      this.setState({active: !this.state.active});
    }

    //---
    changeCreateMode(){

      this.setState({
                    isUpdate: false, 
                    name: "", 
                    description: "", 
                    id: ""});
      
    }
    
    // with this method we set the data in the state each time users type something in the input
    handleChange(event) {

      this.setState({[event.target.name]: event.target.value});

      console.log(this.state);

    }

    // this works either create or update
    handleSubmit(event) {

      event.preventDefault();

      if(this.state.name.length>0){
        
        if (this.state.description.length>0) {
          
          let action = "create";
          if(this.state.isUpdate){
            action="update";
          }

          const path = 'http://localhost:8000/api/sortOfTraining/'+action+'' 

          const userSessionData = JSON.parse(window.localStorage.getItem("portofolioUserDataSession"))
          const headers = {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userSessionData.token}`
          }
          
          this.setState({message: "Submiting"});
          
          const postData = {
            id: this.state.id,
            name: this.state.name,
            description: this.state.description,
            active: this.state.active === true ? 1 : 0
          }

          axios.post(path, postData, {headers: headers}).
          then( response => {

              let response_message = "";
              if (response.data.message=="already_exists") { response_message = "Already exists"; }

              if (response.data.message=="successfully_created") { response_message = "Created ! "; }

              this.setState({message: response_message});
              this.props.renderListMethod();

              
            }).catch( error => {
              console.log(error.message);

          })        
                    
        }else{
          
          this.setState({message: "Insert a description"});        
          
        }

      }else{
        
        this.setState({message: "Insert a name"});        

      }
 
    }
  
    //---
    render() {

      const isUpdate = this.state.isUpdate;
      let buttonText="Create", 
          mainText="Create new Training",
          checkBox_active_field='',
          deleteButton='';

      if(isUpdate){
        
        console.log("its update from render method")
        console.log(this.state.active)
        mainText="Update an Existing Training";
        buttonText="Update";
        checkBox_active_field = <div className="form-check">
                                  <input type="checkbox"
                                    checked={this.state.active}
                                    onChange={this.toggleChangeCheckBox}
                                    className="form-check-input"
                                  />
                                  Active
                                </div>;

        deleteButton= <button onClick={this.deleteItem} className="btn btn-danger"> Delete </button>

      }

      return (
        <div style={{marginLeft: "30px"}} className="col-9">
          <br/> 
          <span>{mainText}</span>
          <hr></hr>
          <div className="success">{this.state.message}</div>
          
          <form onSubmit={this.handleSubmit} >
            <div className="row">
              <label> Name: </label>
              <br/>
              <input name="name" type="text" max="45" value={this.state.name} onChange={this.handleChange} />
              <br/>
              <label> Description: </label>
              <br/>
              <input type="text" value={this.state.description} name="description" max="250" onChange={this.handleChange}/>
            </div>
            
            <br/>
            <div className="row">
            <br/>

              <div className="col-4 col-md-4 col-sm-4">{checkBox_active_field}</div>
              <div className="col-4 col-md-4 col-sm-4">
                <button type="submit" className="btn btn-info"> {buttonText} </button>
              </div>
              <div className="col-4 col-md-4 col-sm-4">{deleteButton}</div>

            </div>            
            
            <br/>            
            <input type="hidden" name="id" value={this.state.id}/>
            <br/>
          </form>

        </div> 

      );
    }
  }

export default Training_form;
// console.log("despues de exportar");
 
