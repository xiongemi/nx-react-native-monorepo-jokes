import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

// eslint-disable-next-line @nx/enforce-module-boundaries
import App from '../../techy-jokes/src/app/App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
