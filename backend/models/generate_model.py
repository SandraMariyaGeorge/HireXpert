from pydantic import BaseModel, Field
from typing import List, Optional
import os
import shutil
import subprocess
from openai import OpenAI

client = OpenAI(api_key='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')

class GenerateResume(BaseModel):
    def get_user_details(self, userdetails, job_desc):
        try:
            resume = generate_optimized_resume(userdetails, job_desc)
            latex_code = generate_latex(resume)
            tex_file = "resume.tex"
            output_dir = "output"
            with open(tex_file, "w", encoding="utf-8") as f:
                f.write(latex_code)
            subprocess.run([
                "pdflatex", "-output-directory", output_dir, tex_file
            ], check=True)
            print(f"PDF generated successfully in '{output_dir}' directory.")
            return "PDF generated successfully"
        except subprocess.CalledProcessError as e:
            print("Error in LaTeX compilation:", e)
            compile_latex(tex_file)
            return "Error in LaTeX compilation"

class EducationItem(BaseModel):
    institution: str = Field(..., description="Name of the institution")
    location: str = Field(..., description="Location of the institution")
    degree: str = Field(..., description="Degree obtained")
    dates: str = Field(..., description="Dates of attendance")

class ExperienceItem(BaseModel):
    title: str = Field(..., description="Job title")
    dates: str = Field(..., description="Dates of employment")
    company: str = Field(..., description="Company name")
    location: str = Field(..., description="Location of the company")
    responsibilities: List[str] = Field(..., description="List of responsibilities")

class ProjectItem(BaseModel):
    name: str = Field(..., description="Name of the project")
    technologies: str = Field(..., description="Technologies used")
    dates: str = Field(..., description="Dates of the project")
    description: List[str] = Field(..., description="List of project details")

class ContactInfo(BaseModel):
    phone: str = Field(..., description="Phone Number")
    email: str = Field(..., description="Email Address")
    linkedin: str = Field(..., description="LinkedIn Profile URL")
    github: str = Field(..., description="GitHub Profile URL")

class TechnicalSkills(BaseModel):
    languages: str = Field(..., description="List of Programming Languages")
    frameworks: str = Field(..., description="List of Frameworks")
    developer_tools: str = Field(..., description="List of Developer Tools")
    libraries: str = Field(..., description="List of Libraries")

class Resume(BaseModel):
    name: str = Field(..., description="Full Name")
    contact_info: ContactInfo = Field(..., description="Contact information")
    education: List[EducationItem] = Field(..., description="List of Education entries")
    experience: List[ExperienceItem] = Field(..., description="List of Experience entries")
    projects: List[ProjectItem] = Field(..., description="List of Project entries")
    technical_skills: TechnicalSkills = Field(..., description="Technical Skills")

def escape_latex_special_chars(text: str) -> str:
    """Escapes LaTeX special characters in a given text."""
    if not isinstance(text, str):
        return str(text)  # Convert to string if not already

    # Check if already escaped by looking for backslashes before special chars
    if any(char in text for char in ['&', '%', '$', '#', '_', '{', '}', '~', '^', '\\']) and "\\" not in text:
        special_chars = {
            '&': r'\&',
            '%': r'\%',
            '$': r'\$',
            '#': r'\#',
            '_': r'\_',
            '{': r'\{',
            '}': r'\}',
            '~': r'\textasciitilde{}',
            '^': r'\textasciicircum{}',
            '\\': r'\textbackslash{}',
            '+': r'\texttt{+}',
        }
        escaped_text = ""
        for char in text:
            escaped_text += special_chars.get(char, char)  # Use the escaped char if it's special
        return escaped_text
    else:
        return text # Return original text if already escaped

def generate_latex(resume_data: Resume) -> str:
    """Generates a LaTeX resume from a Resume object."""
    latex_string = r"""
\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\input{glyphtounicode}


%----------FONT OPTIONS----------
% sans-serif
% \usepackage[sfdefault]{FiraSans}
% \usepackage[sfdefault]{roboto}
% \usepackage[sfdefault]{noto-sans}
% \usepackage[default]{sourcesanspro}

% serif
% \usepackage{CormorantGaramond}
% \usepackage{charter}


\pagestyle{fancy}
\fancyhf{} % clear all header and footer fields
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

% Adjust margins
\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.0in}

\urlstyle{same}

\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

% Sections formatting
\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\pdfgentounicode=1

%-------------------------
% Custom commands
\newcommand{\resumeItem}[1]{
  \item\small{
    {#1 \vspace{-2pt}}
  }
}

\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{\small#3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubSubHeading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \textit{\small#1} & \textit{\small #2} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeProjectHeading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \small#1 & #2 \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubItem}[1]{\resumeItem{#1}\vspace{-4pt}}

\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%


\begin{document}

%----------HEADING----------
% \begin{tabular*}{\textwidth}{l@{\extracolsep{\fill}}r}
%   \textbf{\href{http://sourabhbajaj.com/}{\Large Sourabh Bajaj}} & Email : \href{mailto:sourabh@sourabhbajaj.com}{sourabh@sourabhbajaj.com}\\
%   \href{http://sourabhbajaj.com/}{http://www.sourabhbajaj.com} & Mobile : +1-123-456-7890 \\
% \end{tabular*}

\begin{center}
    \textbf{\Huge \scshape """ + escape_latex_special_chars(resume_data.name) + r"""} \\ \vspace{1pt}
    \small """ + escape_latex_special_chars(resume_data.contact_info.phone) + r""" $|$ \href{mailto:""" + escape_latex_special_chars(resume_data.contact_info.email) + r"""}{\underline{""" + escape_latex_special_chars(resume_data.contact_info.email) + r"""}} $|$ 
    \href{""" + escape_latex_special_chars(resume_data.contact_info.linkedin) + r"""}{\underline{""" + escape_latex_special_chars(resume_data.contact_info.linkedin) + r"""}} $|$
    \href{""" + escape_latex_special_chars(resume_data.contact_info.github) + r"""}{\underline{""" + escape_latex_special_chars(resume_data.contact_info.github) + r"""}}
\end{center}

%-----------EDUCATION-----------
\section{Education}
  \resumeSubHeadingListStart
"""
    for edu in resume_data.education:
        latex_string += r"""
    \resumeSubheading
      {""" + escape_latex_special_chars(edu.institution) + r"""}{""" + escape_latex_special_chars(edu.location) + r"""}
      {""" + escape_latex_special_chars(edu.degree) + r"""}{""" + escape_latex_special_chars(edu.dates) + r"""}
"""
    latex_string += r"""
  \resumeSubHeadingListEnd

%-----------EXPERIENCE-----------
\section{Experience}
  \resumeSubHeadingListStart
"""
    for exp in resume_data.experience:
        latex_string += r"""
    \resumeSubheading
      {""" + escape_latex_special_chars(exp.title) + r"""}{""" + escape_latex_special_chars(exp.dates) + r"""}
      {""" + escape_latex_special_chars(exp.company) + r"""}{""" + escape_latex_special_chars(exp.location) + r"""}
      \resumeItemListStart
"""
        for resp in exp.responsibilities:
            latex_string += r"""
        \resumeItem{""" + escape_latex_special_chars(resp) + r"""}
"""
        latex_string += r"""
    \resumeItemListEnd
"""

    latex_string += r"""
  \resumeSubHeadingListEnd

%-----------PROJECTS-----------
\section{Projects}
    \resumeSubHeadingListStart
"""
    for project in resume_data.projects:
        latex_string += r"""
      \resumeProjectHeading
          {\textbf{""" + escape_latex_special_chars(project.name) + r"""} $|$ \emph{""" + escape_latex_special_chars(project.technologies) + r"""}}{""" + escape_latex_special_chars(project.dates) + r"""}
          \resumeItemListStart
"""
        for detail in project.description:
            latex_string += r"""
            \resumeItem{""" + escape_latex_special_chars(detail) + r"""}
"""
        latex_string += r"""
          \resumeItemListEnd
"""
    latex_string += r"""
    \resumeSubHeadingListEnd

%-----------PROGRAMMING SKILLS-----------
\section{Technical Skills}
 \begin{itemize}[leftmargin=0.15in, label={}]
    \small{\item{
     \textbf{Languages}{: """ + escape_latex_special_chars(resume_data.technical_skills.languages) + r"""} \\
     \textbf{Frameworks}{: """ + escape_latex_special_chars(resume_data.technical_skills.frameworks) + r"""} \\
     \textbf{Developer Tools}{: """ + escape_latex_special_chars(resume_data.technical_skills.developer_tools) + r"""} \\
     \textbf{Libraries}{: """ + escape_latex_special_chars(resume_data.technical_skills.libraries) + r"""}
    }}
 \end{itemize}

%-------------------------------------------
\end{document}
"""
    return latex_string

def compile_latex(tex_file, output_dir="output"):
    """Compiles a .tex file into a PDF and saves it in the specified directory."""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Check if pdflatex is available
    if not shutil.which("pdflatex"):
        print("Error: pdflatex command not found. Please ensure LaTeX is installed and added to your PATH.")
        return

    # Run pdflatex command
    try:
        subprocess.run([
            "pdflatex", "-output-directory", output_dir, tex_file
        ], check=True)
        print(f"PDF generated successfully in '{output_dir}' directory.")
    except subprocess.CalledProcessError as e:
        print("Error in LaTeX compilation:", e)

def generate_optimized_resume(resume_data:str, job_description: str) -> Resume:
    """
    Generates an optimized resume using OpenAI based on the resume data and job description.
    """
    prompt = f"""
    Optimize the following resume for the job description below.

    Resume Data:
    {resume_data}

    Job Description:
    {job_description}

    Focus on tailoring the experience, skills, and projects to match the requirements of the job.  Use concise and impactful language.  Ensure all information is accurate and truthful. Make the resume ats friendly and lengthy .
    """

    try:
        completion = client.beta.chat.completions.parse(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert resume optimizer. Do not escape any special characters in the resume. only add valid info"},
                {"role": "user", "content": prompt},
            ],
            response_format=Resume,
        )

        optimized_resume = completion.choices[0].message.parsed
        print(optimized_resume)
        return optimized_resume
        

    except Exception as e:
        print(f"Error during OpenAI API call: {e}")




