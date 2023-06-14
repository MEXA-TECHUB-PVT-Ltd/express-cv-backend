
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


CREATE TABLE IF NOT EXISTS objectives(
  objective_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_id Int,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);




CREATE TABLE IF NOT EXISTS contact_details(
  contact_detail_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_id INT, 
  surname TEXT,
  first_name Text ,
  phone TEXT ,
  email TEXT,
  address TEXT ,
  driving_license_number TEXT ,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS educations(
  education_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_id INTEGER,
  university_name TEXT,
  degree Text ,
  location TEXT ,
  graduation_year TEXT,
  end_date TEXT ,
  description TEXT ,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS experiences(
  experience_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_id INTEGER,
  position TEXT,
  company TEXT,
  location TEXT ,
  start_date TEXT ,
  end_date TEXT ,
  description TEXT ,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills(
  skill_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_id INTEGER,
  skill_name TEXT,
  skill_level TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE IF NOT EXISTS interests(
  interest_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_id TEXT,
  text TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE IF NOT EXISTS languages(
  language_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_id TEXT,
  language_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS references_table (
  refrence_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_id TEXT,
  name TEXT,
  email_id TEXT,
  contact_no TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resume_templates(
  template_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  title_name TEXT,
  title_image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resume_table(
  resume_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_id INTEGER,
  resume_title TEXT,
  resume_objective INT[],
  contact_detail INT[],
  education INT[],
  experience INT[],
  interest INT[],
  skill INT[],
  language INT[],
  reference INT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS terms_and_condtions(
  terms_and_condition_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  TEXT TEXT,
  status TEXT DEFAULT 'inactive',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS privacy_policy(
  privacy_policy_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  TEXT TEXT,
  status TEXT DEFAULT 'inactive',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS about_us(
  about_us_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  TEXT TEXT,
  status TEXT DEFAULT 'inactive',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS faqs(
  faq_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  question TEXT,
  answer TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resume_downloads (
  download_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_id INTEGER,
  resume_id INTEGER,
  downloaded_at TIMESTAMP DEFAULT NOW()
);

