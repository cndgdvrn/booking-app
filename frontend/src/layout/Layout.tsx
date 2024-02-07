import Footer from "../components/Footer";
import Header from "../components/Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <div className="mt-auto">
        <Footer/>
      </div>
    </div>
  );
};

export default Layout;
