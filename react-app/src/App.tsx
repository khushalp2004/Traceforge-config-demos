import { Toaster } from 'sonner';
import { Home } from './pages/Home';

function App() {
  return (
    <>
      <Home />
      <Toaster position="bottom-right" theme="system" />
    </>
  );
}

export default App;
