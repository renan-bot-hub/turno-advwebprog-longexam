  import { Outlet } from 'react-router-dom';
  import NavBar from '../components/NavBar';
  import Footer from '../components/Footer';

  const Layout = () => {
    return (
      <div className="min-h-screen bg-[#0A192F] text-white">
        <NavBar />
        <main className="pb-16">
          <Outlet />
        </main>
        <Footer/>
      </div>
    );
  };

  export default Layout;