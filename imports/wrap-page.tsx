import { ApolloProvider } from "@apollo/react-hooks";
import { initApollo } from "./apollo";
import { getDataFromTree } from "@apollo/react-ssr";
import { PassportProvider } from './packages/passports/react';
import Cookie from 'js-cookie';

export const wrapPage = (
  Component: () => any,
) => {
  const Container = ({ apolloClient, token }) => (
    <ApolloProvider client={apolloClient}>
      <PassportProvider defaultToken={token}>
        <Component/>
      </PassportProvider>
    </ApolloProvider>
  );
  
  const Page = ({ apolloState, token }) => {
    const apolloClient = initApollo(apolloState, token);
    const container = <Container apolloClient={apolloClient} token={token}/>;
    apolloClient.stop();
    return container;
  };
  
  Page.getInitialProps = async ({ req: { cookies } }) => {
    const token = cookies ? cookies.token : undefined;
    const apolloClient = initApollo({}, token);
    await getDataFromTree(<Container apolloClient={apolloClient} token={token}/>);
    const apolloState = apolloClient.extract();
    apolloClient.stop();
    return { apolloState, token };
  }
  
  return Page;
};
