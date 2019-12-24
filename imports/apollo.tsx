import withApollo from 'next-with-apollo';
import fetch from 'node-fetch';
import { InMemoryCache, HttpLink } from 'apollo-boost';
import ApolloClient from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { split, ApolloLink, concat } from 'apollo-link';
import Debug from 'debug';
import { getDataFromTree } from '@apollo/react-ssr';
import { ApolloProvider } from '@apollo/react-hooks';

const debug = Debug('apollo');

//const GRAPHQL = `${process.env.HASURA_URL}/v1/graphql`;
const GRAPHQL = `enr-threeactive.herokuapp.com/v1/graphql`;

export function initApollo(initialState = {}, token?) {
  debug('initApollo', token);

  const headers = token && false ? {
    'Authorization': `Bearer ${token}`,
  } : {
    'x-hasura-admin-secret': '7777',
  };

  const httpLink = new HttpLink({
    uri: `https://${GRAPHQL}`,
    fetch
  });

  // @ts-ignore
  const wsLink = !process.browser
    ? null
    : new WebSocketLink({
      uri: `wss://${GRAPHQL}`,
      options: {
        lazy: true,
        reconnect: true,
        connectionParams: () => ({
          headers,
        }),
      },
    });

  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers,
    });

    return forward(operation);
  });

  // @ts-ignore
  const link = !process.browser
    ? httpLink
    : split(
        ({ query }) => {
          // TODO wtf is the gql kind operation?
          // const { kind, operation } = getMainDefinition(query);
          // return kind === 'OperationDefinition' && operation === 'subscription';
          return true;
        },
        wsLink,
        httpLink,
      );

  return new ApolloClient({
    ssrMode: true,
    link: concat(authMiddleware, link),
    cache: new InMemoryCache({
      freezeResults: false,
      resultCaching: false,
    }).restore(initialState),
  });
}
