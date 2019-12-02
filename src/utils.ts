import jwt from "jsonwebtoken";

interface ISignJWTProps {
  token: string;
  email: string;
  id: number;
  name: string;
}

interface ISignJWTResponse {
  message: string;
  token: string;
}

export const generateToken = (n: number) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  for (let i = 0; i < n; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
};

export const signJWT = ({ token, email, id, name }: ISignJWTProps): ISignJWTResponse => {
  // tslint:disable-next-line: no-console
  // Create JWT Payload
  const payload = {
    email,
    id,
    name,
    token,
  };
  // tslint:disable-next-line: no-console
  console.log(payload);
  // Sign token
  const signedToken = jwt.sign(
    payload,
    process.env.SECRET_OR_KEY,
    {
      expiresIn: 31556926, // 1 year in seconds
    },
  );
  return {
    message: "success",
    token: "Bearer " + signedToken,
  };
};
