import React from 'react';
import {ApolloConsumer, ApolloProvider as ApolloBridge} from '@apollo/react-hooks';
import ThreeActiveProvider, { context as threeActiveContext } from '../../context';
import WsBooster from './ws-booster';

export function Bridge(props) {
  const {
    apolloClient, 
    threeActiveProviderValue,
    children,
  } = props;
  const {
    Provider: ThreeActiveBridge,
  } = threeActiveContext;

  return (
    <ApolloBridge client={apolloClient}>
      <ThreeActiveBridge value={threeActiveProviderValue}>
        <WsBooster>
          {children}
        </WsBooster>
      </ThreeActiveBridge>
    </ApolloBridge>
  );
};

/**
 * Can't access any outer Provider from inside react-three-fiber's Canvas.
 * As workaround we use bridge of consumers.
 */
export default function ProviderCompositionHOC(Component) {
  const {
    Consumer: ThreeActiveConsumer,
  } = threeActiveContext;

  return () => (
    <ApolloConsumer>
      {apolloClient => 
        <ThreeActiveProvider>
          <ThreeActiveConsumer>
            {threeActiveProviderValue => 
              <Component
                apolloClient={apolloClient}
                threeActiveProviderValue={threeActiveProviderValue}
              />
            }
          </ThreeActiveConsumer>
        </ThreeActiveProvider>
      }
    </ApolloConsumer>
  );
};
