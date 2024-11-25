import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './Contexts/authContext';
import ThemeProvider from './Components/ThemeProvider';
import { router } from './router/routes';

function App(): JSX.Element {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
