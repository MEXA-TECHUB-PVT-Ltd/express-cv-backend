CREATE SEQUENCE IF NOT EXISTS my_sequence START 200000;

CREATE TABLE IF NOT EXISTS users (
  user_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_name TEXT  ,
  email TEXT UNIQUE NOT NULL ,
  phone TEXT ,
  profile_img TEXT ,
  education INT[],
  experience INT[],
  password TEXT NOT NULL ,
  status TEXT DEFAULT 'unblock'
);
CREATE TABLE IF NOT EXISTS admins (
  admin_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  img TEXT  ,
  user_name TEXT ,
  email TEXT ,
  password TEXT
);
CREATE TABLE IF NOT EXISTS objectives(
    objective_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
    objective TEXT NOT NULL ,
    user_id INT NOT NULL
);
CREATE TABLE IF NOT EXISTS skills(
    skill_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
    skill TEXT NOT NULL ,
    level TEXT ,
    user_id INT NOT NULL
);
CREATE TABLE IF NOT EXISTS personal_info (
    personal_info_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
    email TEXT , 
    address TEXT ,
    phone TEXT ,
    name TEXT,
    user_id INT NOT NULL
);
CREATE TABLE IF NOT EXISTS languages(
    language_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
    language TEXT NOT NULL ,
    fluency TEXT ,
    user_id INT NOT NULL
);
CREATE TABLE IF NOT EXISTS workExperience(
    work_experience_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY ,
    title TEXT NOT NULL ,
    location TEXT ,
    started_from TEXT ,
    ended_at TEXT ,
    description TEXT ,
    user_id INT NOT NULL
);
CREATE TABLE IF NOT EXISTS educations(
    education_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
    title TEXT NOT NULL ,
    institute TEXT ,
    started_from TEXT ,
    ended_at TEXT ,
    description TEXT ,
    user_id INT NOT NULL
);
CREATE TABLE IF NOT EXISTS templates (
    template_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
    template_name TEXT,
    template_image TEXT
);
CREATE TABLE IF NOT EXISTS resumes (
  resumes_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  resume_template_id INT NOT NULL ,
  user_id INT NOT NULL ,
  title TEXT,
  skills INT[] ,
  interests TEXT[],
  objective INT ,
  personal_info INT ,
  languages INT[] ,
  work_experience INT[] ,
  educations INT[] ,
  created_at DATE DEFAULT NOW(),
  updated_at DATE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS resume_downloads (
  resume_downloads_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  resume_id INT ,
  user_id INT ,
  created_at DATE DEFAULT NOW(),
  updated_at DATE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS otpStored(
  otp_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY ,
  email  TEXT ,
  otp TEXT 
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
CREATE TABLE IF NOT EXISTS blogs(
  blog_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  title TEXT,
  description TEXT,
  cover_image TEXT,
  sub_headings INT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS sub_headings(
  sub_headings_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  heading TEXT,
  ddetails TEXT,
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
CREATE TABLE IF NOT EXISTS contact_us(
  contact_us_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  email TEXT,
  name TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);