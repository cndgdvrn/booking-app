const whiteLists = [process.env.CLIENT_URL as string, "https://cndgdvrn-booking-app.onrender.com/"];

export const corsOptionsDelegate = function (req: any, callback: any) {
  let corsOptions: any;

  if (whiteLists.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true, credentials: true, methods: ["GET", "PUT", "POST", "DELETE", "PATCH"] };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};
