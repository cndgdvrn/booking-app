const Footer = () => {
  return (
    <div className="bg-blue-800 px-60 pt-4 pb-6 text-white">
      <div className="flex justify-between items-center font-semibold">
        <p className="text-3xl">MernHolidays.com</p>
        <div className="space-x-8">
          <span className="cursor-pointer">Privacy Policy</span>
          <span className=" cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
