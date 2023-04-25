
CREATE SEQUENCE IF NOT EXISTS my_sequence START 200000;

CREATE TABLE IF NOT EXISTS users (
  user_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_name TEXT  ,
  email TEXT ,
  password TEXT,
  image TEXT,
  block BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS otpStored(
  otp_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY ,
  email  TEXT ,
  otp TEXT 
);

CREATE TABLE IF NOT EXISTS admins(
  admin_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_name TEXT,
  password TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  img  TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS blogs(
  blog_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
