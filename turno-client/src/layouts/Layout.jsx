  import { Outlet } from 'react-router-dom';
  import NavBar from '../components/NavBar';
  import Footer from '../components/Footer';

  const Layout = () => {
    return (
      <div className="app-shell min-h-screen text-white">
        <NavBar />
        <main className="page-enter pb-16">
          <Outlet />
        </main>
        <Footer/>
      </div>
    );
  };

  export default Layout;