import React from 'react';
import { Canvas } from 'react-three-fiber';
import Scene from '../Scene';
import Gui from '../Gui';
import ProviderCompositionHOC, { Bridge } from './ProviderCompositionHOC';
import { Provider as CannonProvider } from '../../use-cannon';
import useStyles from './style';
import 'pepjs';

/**
 * Can't access any outer Provider from inside react-three-fiber's Canvas.
 * As workaround we use bridge of consumers.
 */
export default function ThreeActive() {
  if (!process.browser) return <div>Loading....</div>

  const CanvasLayer = props => (
    <Canvas touch-action="none">
      <Bridge {...props}>
        <CannonProvider>
          <Scene/>
        </CannonProvider>
      </Bridge>
    </Canvas>
  );

  const GuiLayer = props => (
    <Bridge {...props}>
      <Gui />
    </Bridge>
  );

  const Layers = props => (
    <>
      <CanvasLayer {...props} />
      <GuiLayer {...props} />
    </>
  );
  
  const View = ProviderCompositionHOC(Layers);
  
  const classes = useStyles();
  
  return (
    <div className={classes.threeactive}>
      <View />
    </div>
  );
};
