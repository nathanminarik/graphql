import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo'
import SongList from './components/SongList';
import App from './components/App';
import SongCreate from './components/SongCreate';
import SongDetail from './components/SongDetail';
import './style/style.css';

const client = new ApolloClient({
  // this takes every piece of information that is fetched by Apollo
  // and runs it through the function. The returned data is used
  // to identify the data.
  // Apollo doesn't assume you want to use the id record of every piece of data.
  // This only works when all the ids in the application are unique.
  // This means we need to ask for the id in every query since Apollo is expecting it.
  // This also makes it so that we don't have to manually refetch data
  // since Apollo is now looking for changes and selectively updating React
  // see the LyricCreate component and AddLyricToSong method as an example.
  dataIdFromObject: o => o.id
});

const Root = () => {
  return (
    <ApolloProvider client={client}>
      <Router history={hashHistory}>
        <Route path='/' component={App}>
          <IndexRoute component={SongList}/>
          <Route path='songs/new' component={SongCreate}/>
          <Route path='songs/:id' component={SongDetail}/>
        </Route>
      </Router>
    </ApolloProvider>
  )
};

ReactDOM.render(
  <Root />,
  document.querySelector('#root')
);
