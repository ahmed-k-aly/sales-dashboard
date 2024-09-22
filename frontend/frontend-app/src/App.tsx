import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile';
import DefaultLayout from './layout/DefaultLayout';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Sales Dashboard | Unwind Finance Task" />
              <Dashboard />
            </>
          }
        />
               <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | Unwind Finance Task" />
              <Profile />
            </>
          }
        />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
