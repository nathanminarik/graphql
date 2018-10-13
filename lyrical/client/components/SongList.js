import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
// No longer need to import gql since we're importing the query directly.
// import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import FetchSongs from './../queries/FetchSongs';
import RemoveSong from './../mutations/RemoveSong';


class SongList extends Component {

    handleRemove (e) {
        const id = e.target.closest('li').getAttribute('data-id') || undefined;
        this.props.RemoveSong({
            variables: { id },
            refetchQueries: [{
                query: FetchSongs
            }]
        })
    }

    handleClick (e) {
        const id = e.target.getAttribute('data-id') || undefined;
        hashHistory.push(`songs/${id}`);
    }

    renderSongs () {
        return this.props.FetchSongs.songs.map(({id, title}, index) => {
            return (
                <li
                    key={id}
                    data-id={id}
                    className="collection-item clearfix"
                >
                    <div
                        data-id={id}
                        onClick={this.handleClick.bind(this)}
                    >{title}</div>
                    <button className='btn btn-floating' onClick={this.handleRemove.bind(this)}>
                        <i className='material-icons'>delete</i>
                    </button>
                </li>
            )
        });
    }

    render () {
        if (this.props.FetchSongs.loading) return <div>Loading...</div>;

        return (
            <div>
                <ul className="collection">
                    {this.renderSongs()}
                </ul>

                <Link to='/songs/new'>
                    <button className='btn btn-floating red right'><i className='material-icons'>add</i></button>
                </Link>
            </div>
        )
    }
}

// We no longer explicitly state the query since we're now importing one by the same name.
// const query = gql`
//     {
//         songs {
//             title,
//             id
//         }
//     }
// `


// With compose we are able to combine and name several different mutations.
// The name config allows you to name the data passed into the prop from the query whatever you'd like.
export default compose(
    graphql(FetchSongs, {name: 'FetchSongs'}),
    graphql(RemoveSong, {name: 'RemoveSong'})
)(SongList);