import React, { Component } from 'react';
import FetchSong from './../queries/FetchSong';
import { graphql, compose } from 'react-apollo';
import { Link } from 'react-router';

import LyricCreate from './LyricCreate';
import LyricList from './LyricList';

class SongDetail extends Component {

    render () {
        if (this.props.FetchSong.loading) return <div>Loading...</div>;
        
        const {title, id, lyrics} = this.props.FetchSong.song;
        return (
            <div>
                <div>
                    <Link to='/'>Back</Link>
                </div>
                <div>
                    <h3>Song Detail</h3>
                    <p>{ title } </p>
                </div>
                <LyricList lyrics={lyrics} />
                <LyricCreate songId={this.props.params.id}/>
            </div>
        );
    }
}

// We could call this automatically like so:
export default compose(
    graphql(FetchSong, {
        options: (props) => ({ 
            variables: { id: props.params.id }
        }),
        name: 'FetchSong'
    })
)(SongDetail);

// export default SongDetail;