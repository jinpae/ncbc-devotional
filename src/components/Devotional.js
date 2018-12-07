import React from 'react';
import PropTypes from 'prop-types';

const _baseURL = `https://api.esv.org/v3/passage/html/`;
const _APIkey = `e774b4f993c184ef6c9a3165f672089e558a6add`;

// Fetches and returns appropriate scripture from api.esv.org.
// @params searchParams: Anything in the format: Romans1:1-2, Romans1.1-2,
// For multiple John1.1;Genesis1.1 is accepted as well.
const fetchScripture = (searchParams) => {
  let url = `${_baseURL}?q=${searchParams}`;
  let obj = {  
    method: 'GET',
    headers: {
      'Authorization': `Token ${_APIkey}`
    }
  }
  return fetch(url, obj).then((res) => res.json());
}

// To be used for anything related to date.
// 'toString' will return todays day in the form "Month Day Year" i.e. "January 04 2019"
// 'number' will return the number value associated with the day from 0-364. January 1st returning a 0.
//          this is to be used for the reading plan in the future. i.e. ... readingPlan[today.number()];
const today = {
  toString: () => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"];
    var dateYear = (new Date()).toString().split(' ').splice(2,2).join(' ');
    return monthNames[(new Date().getMonth())] + " " + dateYear;
  },
  number: () => {
    let now = new Date()
    let start = new Date(now.getFullYear(), 0, 0);
    let diff = now - start;
    let oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay) - 1;
  }
}

export default class Devotional extends React.Component{
  state = {
    search: 'Romans9:1-18',
    passage: 'supposed to be null here.'
  }

  componentDidMount = () => {
    let searchParams = this.state.search;
    this.updatePassage(searchParams);
  }

  updatePassage = (searchParams) => {
    this.setState({search: searchParams})
    fetchScripture(searchParams)
      .then((response) => {
        let passages = ''
        for(let i = 0; i<response.passages.length; i++){
          passages += response.passages[i];
        }
        this.setState( {passage : passages} );
      });
  }
   
  render(){
    return(
      <div className= 'dev-container'>
        <h1 className='dev-header'>Daily Devotion</h1>
        <div className='date'>{today.toString()}</div>
        <div className='scripture'>
          <div className="passage" dangerouslySetInnerHTML={{__html: this.state.passage}}></div>
        </div>
        <UserInput onSubmit={this.updatePassage}/>
      </div>
    );
  }
} 

// Can be removed later. 
export class UserInput extends React.Component {
  state = {
    search : '' 
  };
  handleChange = (event) => {
    var value = event.target.value;
    this.setState({search : value});
  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state.search);
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor='passage'>Search: </label>
        <input
          id='passage'
          placeholder='Romans9:1-18'
          type='text'
          value={this.state.search}
          onChange={this.handleChange}
        />
        <button
          className='button'
          type='submit'>
            Submit
        </button>
      </form>
    )
  }
}

UserInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}
