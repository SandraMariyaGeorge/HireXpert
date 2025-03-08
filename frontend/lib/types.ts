export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  companyLogo?: string;
  applyLink?: string;
}

export interface Resume {
  id: string;
  title: string;
  lastModified: string;
  content: string;
}