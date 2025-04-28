// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import PixiCanvas from './components/PixiCanvas';
import JeuAvecBouton from './components/BoutonStart';


function App({ castContext }) {
  
  return (
    <div style={{  }}>

      <JeuAvecBouton  />
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

window.onload = () => {
  const context = cast.framework.CastReceiverContext.getInstance();
  const options = new cast.framework.CastReceiverOptions();
  const CHANNEL = 'urn:x-cast:testChannel';
  options.customNamespaces = Object.assign({});
  options.customNamespaces[CHANNEL] = cast.framework.system.MessageType.JSON;
  options.disableIdleTimeout = true;

  context.addEventListener(
    cast.framework.system.EventType.READY,
    () => {
      console.log('[RECEIVER] Receiver prêt !');
      root.render(<App castContext={context}/>);
    }
  );

  context.start(options);
};
