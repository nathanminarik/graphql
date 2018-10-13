import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class LyricList extends Component {
    constructor(props) {
        super(props);
    }

    handleClick (id, likes) {
        this.props.mutate({
            variables: { id },
            optimisticResponse: {
                __typename: 'Mutation',
                likeLyric: {
                    id,
                    __typename: 'LyricType',
                    likes: ++likes
                }
            }
        })
        .then(() => {
            console.log('Hey')
        });
    }

    renderLyrics() {
        return this.props.lyrics.map(({content, id, likes}) => {
            return (
                <li key={id} className="collection-item">
                    {content}
                    <div className='vote-box'>
                        <i 
                            className="material-icons"
                            onClick={(e) => this.handleClick(id, likes)}
                        >thumb_up</i>
                        {likes}
                    </div>
                </li>
            )
        })
    }

    render() {
        return (
            <ul className="collection">
                {this.renderLyrics()}
            </ul>
        )
    }
}

const mutation = gql`
    mutation LikeLyric($id: ID) {
        likeLyric(id: $id) {
            id
            likes
            song {
                id
                title
            }
        }
    }
`

export default graphql(mutation)(LyricList);