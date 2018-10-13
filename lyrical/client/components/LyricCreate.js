import React, { Component } from 'react';
import AddLyricToSong from './../mutations/AddLyricToSong';
import { graphql, compose } from 'react-apollo';
import FetchSong from '../queries/FetchSong';

class LyricCreate extends Component {
    constructor (props) {
        super(props);
        this.state = {
            content: ''
        }
    }

    handleLyricChange (e) {
        const content = e.target.value;
        return this.setState((prevState, props) => ({content}));
    }

    handleSubmit (e) {
        e.preventDefault();
        this.props.AddLyricToSong({
            variables: {
                content: this.state.content,
                id: this.props.songId
            }
        })
        .then(() => this.setState(() => ({
            content: ''
        })));
    }
    
    render () {
        return (
            <form
                onSubmit={this.handleSubmit.bind(this)}
            >
                <label>Add a lyric</label>
                <input 
                    placeholder="Enter a lyric"
                    value={this.state.content}
                    onChange={this.handleLyricChange.bind(this)}
                />
                <div>{this.state.content}</div>
            </form>
        )
    }
}

export default compose(
    graphql(AddLyricToSong)
)(LyricCreate)