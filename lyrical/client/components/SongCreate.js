import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { graphql, compose } from 'react-apollo';
import FetchSongs from './../queries/FetchSongs';
import AddSong from './../mutations/AddSong';

class SongCreate extends Component {
    constructor (props) {
        super(props);

        this.state ={
            title: ''
        }
    }

    handleChange (e) {
        const title = e.target.value;
        this.setState(() => ({title}));
    }

    handleSubmit (e) {
        e.preventDefault();
        this.props.AddSong({
            variables: {
                title: this.state.title
            },
            // query is the name of the query we want to refetch. Hence the naming convention of query.
            // the second key of the object in the refetch Queries array are the variables we need  for a query if they are required
            refetchQueries: [
                { query: FetchSongs, variables: {} }
            ]
        })
        .then(() => {
            hashHistory.push('/');
        })
        .catch((err) => cosole.log(err))
    }

    render () {
        return (
            <div>
                <Link to='/'><button className='btn btn-default'>Back</button></Link>
                <h3>Create a new Song</h3>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <label>Song Title</label>
                    <input 
                        value={this.state.title}
                        onChange={this.handleChange.bind(this)}
                    />
                    <button type='submit' className='btn btn-default'>Submit</button>
                </form>
            </div>
        )
    }
}

// const mutation = gql`
//  The name needs to be delcared after the keyword mutation
//  A mutation is similar to a function so we need to pass in the argument list
//  $title is the variable  - String is the type    
//     mutation {
//         addSong (title: "Hey there") {
//             title
//             id
//         }
//     }
// `

export default compose(
    graphql(AddSong, {name: 'AddSong'})
)(SongCreate);