import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeDataFinderService } from '../../service/resume.data.finder.service';
@Component({
  selector: 'app-resume',
  imports: [CommonModule],
  templateUrl: './about-dev.component.html',
  styleUrls: ['./about-dev.component.css']
})

export class AboutDev implements OnInit{
  constructor(private resumeDataFinderService: ResumeDataFinderService) {}
  personalInfo = {
    name: 'Tanmoy Das',
    title: 'Software Developer',
    email: 'dtanmoy169@gmail.com',
    phone: '+91 82405XXX10',
    location: 'Kolkata, WB, India',
    cvUrl: 'resume/Tanmoy_Das_Resume.pdf',
    socialMedia: [
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/alpha-tanmoy', icon: 'fab fa-linkedin' },
      { name: 'GitHub', url: 'https://github.com/AlphaTanmoy', icon: 'fab fa-github' },
      { name: 'LeetCode', url: 'https://leetcode.com/u/Alpha_Tanmoy', icon: 'fas fa-code' }
    ]
  };

  codingProfiles = {
    leetCode: {
      url: 'https://leetcode.com/u/Alpha_Tanmoy/',
      username: 'AlphaTanmoy',
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0
    },
    github: {
      url: 'https://github.com/AlphaTanmoy',
      username: 'AlphaTanmoy',
      repositories: 0,
      stars: 0,
      contributions: 0
    }
  };

  workExperience = [
    {
      company: 'Stable One Software Private Limited',
      position: 'Software Developer',
      duration: 'Sep 2024 - Present',
      responsibilities: [
        'Developed and maintained 10+ backend microservices using Spring Boot and Kotlin/Java, contributing to a 30% performance improvement in data processing workflows.',
        'Designed and implemented RESTful APIs adhering to OpenAPI/Swagger standards for seamless integration with internal and external services.',
        'Integrated and managed third-party APIs (e.g., payment gateways, KYC, geolocation APIs), ensuring secure and scalable data exchange. ',
        'Utilized RabbitMQ for event-driven architecture and asynchronous communication, improving system responsiveness and reliability.',
        'Implemented Redis caching to reduce database load, achieving 40% faster response times for frequently accessed endpoints.',
        'Contributed to UI development using Angular 17+, collaborating closely with UI/UX designers to build responsive interfaces.',
        'Followed Agile methodologies (Scrum), participating in daily stand-ups and sprint reviews, and maintained pipelines using CI/CD tools like Jenkins and GitHub Actions.'
      ]
    },
    {
      company: 'FreeLiencing',
      position: 'Solo Developer',
      duration: 'Jan 2021 - Present',
      responsibilities: [
        'Understand client needs and requirements',
        'Develop Designs and UIs',
        'Implement The Idea To practical implementation',
        'Test and debug according to client needs',
        'Maintain and improve the code if necessary'
      ]
    }
  ];

  projects = [
    {
      name: 'Pet Store',
      description: 'A microservices-driven e-commerce platform for buying and selling pets and pet-related products. Built using Java' +
        '(Spring Boot) for the backend and Angular.js for the frontend, with PostgreSQL as the database. Implements' +
        'RabbitMQ for inter-service communication and integrates AI-driven features for recommendations and automation. It ' +
        'includes Admin, Seller, Master, and Customer views, ensuring a seamless and scalable experience.',
      techStack: ['Java', 'SpringBoot', 'Microservice Architecture', 'Angular', 'PostgreSQL', 'RabbitMQ', 'Redis', 'TypeScript', 'JWT', 'Role-Based Authorization', 'ThirdPartyAPI', 'Google APIS', 'OPEN API', 'AI'],
      livePreview: 'https://pet-store-front-end-alpha.vercel.app/',
      repoLink: '',
      frontend: 'https://github.com/AlphaTanmoy/petStoreFrontEnd',
      backend: 'https://pet-store-api-docx.vercel.app/api-docs'
    },
    {
      name: 'Edu Care',
      description: 'EduMaster is a full-featured web application designed to digitalize and streamline the operations of a computer education academy. '+
      'The platform supports a multi-role architecture comprising Admin, Franchise (Branch Owner), and Student dashboards, each with customized views and access control.'+
      'Built with Angular for the frontend and Node.js with Express.js for the backend, the platform leverages MongoDB as the primary database. '+
      'The application provides a clean, responsive UI/UX and uses JWT-based authentication and role-based authorization for secure access management.',
      techStack: ['Angular', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Role-Based Authorization'],
      livePreview: 'https://edu-care-front-end.vercel.app/',
      repoLink: '',
      frontend: 'https://github.com/AlphaTanmoy/eduCare_frontEnd',
      backend: 'https://github.com/AlphaTanmoy/eduCare_backEnd'
    },
    {
      name: 'ASL Recognizer',
      description: 'ASL Stands for American Sign Language Recognition, build this by using Python, Keras, OpenCV and Tensorflow as ' +
        'Backend. Developed a model then train it from Keras Dataset and Then also deploy it in a web Application using Flask ' +
        'and made a Desktop Application. Model Accuracy - 97.65%',
      techStack: ['Python', 'keras', 'Tensorflow', 'Flask', 'OpenCV', 'Keras Dataset'],
      livePreview: '',
      repoLink: 'https://github.com/AlphaTanmoy/ASL-Recognition',
      frontend: '',
      backend: ''
    },
    {
      name: 'Social media',
      description: 'This is basically a clone of actual Twitter; This uses MERN Stack Implementation Where users can chat, post, re-post, ' +
        'follow, like, reply, delete, edit their contents, upload Specified Avatars.',
      techStack: ['MERN Stack'],
      livePreview: '',
      repoLink: 'https://github.com/AlphaTanmoy/Twitter-Clone',
      frontend: '',
      backend: ''
    },
    {
      name: 'Airline Reservation System',
      description: 'This Website works as an Online Airline reservation system, web page made using HTML, CSS, JS, with JSP and ' +
        'Servlet Mechanism Based on MVC Framework. Also integrated with MySQL Database with Authentication & ' +
        'Authorization. Also has both Client Portal, Admin Portal and a basic view Portal. ',
      techStack: ['Html','Css', 'BootStrap', 'JavaScript','JavaServer Pages','MVC Framework','MySQL Database','Authentication'],
      livePreview: '',
      repoLink: 'https://github.com/AlphaTanmoy/ASL-Recognition',
      frontend: '',
      backend: ''
    }
  ];

  certificates = [
    {
      name: 'PGD-SE (Software Engineering) Certificate',
      issuer: 'Brainware Computer Accademy, Baguihati',
      date: 'May 2023',
      description: 'Full Stack Development Certification Courses',
      imageUrl: 'resume/PGD_SE_Certification.jpg',
      showImage: false
    }
  ];

  achievements = [
    {
      name: 'MCA Gold Medalist',
      issuer: 'Brainware University',
      date: '2024',
      description: 'Got Gold Medal from 2024 MCA Department of Brainware University',
      imageUrl: 'resume/gold_medal.jpg',
      showImage: false
    }
  ];

  education = [
    {
      institution: 'Brainware University',
      degree: 'Master of Computer Applications (MCA)',
      duration: '2022 - 2024',
      description: 'Gold Medalist, Department Topper',
      gpa: '9.92  CGPA'
    },
    {
      institution: 'Derozio Memorial College',
      degree: 'Bachelor of Science (B.Sc.) in Computer Science',
      duration: '2019 - 2022',
      description: 'Under West Bengal State University',
      gpa: '9.74 CGPA'
    }
  ]

  techStack = [
    { name: 'Java', icon: 'fab fa-java', level: 'Advanced' },
    { name: 'Kotlin', icon: 'fas fa-mobile-alt', level: 'Advanced' },
    { name: 'Python', icon: 'fab fa-python', level: 'Intermediate' },
    { name: 'JavaScript', icon: 'fab fa-js', level: 'Intermediate' },
    { name: 'TypeScript', icon: 'fas fa-code', level: 'Intermediate' },
    { name: 'MySQL', icon: 'fas fa-table', level: 'Advanced' },
    { name: 'PostgreSQL', icon: 'fas fa-server', level: 'Advanced' },
    { name: 'MongoDB', icon: 'fas fa-database', level: 'Advanced' },
    { name: 'Angular', icon: 'fab fa-angular', level: 'Intermediate' },
    { name: 'Redis', icon: 'fas fa-memory', level: 'Advanced' },
    { name: 'RabbitMQ', icon: 'fas fa-exchange-alt', level: 'Advanced' },
    { name: 'HTML5', icon: 'fab fa-html5', level: 'Advanced' },
    { name: 'CSS3', icon: 'fab fa-css3-alt', level: 'Advanced' },
    { name: 'Bootstrap', icon: 'fab fa-bootstrap', level: 'Advanced' },
    { name: 'Spring Boot', icon: 'fas fa-leaf', level: 'Advanced' },
    { name: 'Git', icon: 'fab fa-git-alt', level: 'Advanced' },
    { name: 'GitHub', icon: 'fab fa-github', level: 'Advanced' },
    { name: 'Docker', icon: 'fab fa-docker', level: 'Intermediate' },
    { name: 'Node.js', icon: 'fab fa-node-js', level: 'Intermediate' },
    { name: 'Express.js', icon: 'fab fa-js', level: 'Intermediate' },
    { name: 'React.js', icon: 'fa-brands fa-react', level: 'Basic' },
    { name: 'AWS S3', icon: 'fa-brands fa-aws', level: 'Basic' },
    { name: 'AWS EC2', icon: 'fa-brands fa-aws', level: 'Basic' },
    { name: 'Ubuntu Server', icon: 'fa-brands fa-ubuntu', level: 'Basic'},
  ];

  showNotDeployedMessage(): void {
    alert('Repository not deployed yet.');
  }

  toggleCertificateImage(index: number): void {
    this.certificates[index].showImage = !this.certificates[index].showImage;
  }

  toggleAchievementImage(index: number): void {
    this.achievements[index].showImage = !this.achievements[index].showImage;
  }

  ngOnInit(): void {
    this.resumeDataFinderService.getGithubData().subscribe(response => {
      const user = response.data.user;
      const repoNodes = user.repositories.nodes;

      this.codingProfiles.github = {
        url: `https://github.com/AlphaTanmoy`,
        username: 'AlphaTanmoy',
        repositories: repoNodes.length,
        stars: repoNodes.reduce((sum: number, repo: any) => sum + (repo.stargazerCount || 0),0),
        contributions: user.contributionsCollection.contributionCalendar.totalContributions
      };
    });

    this.resumeDataFinderService.getLeetcodeData().subscribe(response => {
      this.codingProfiles.leetCode = {
        url: `https://leetcode.com/AlphaTanmoy/`,
        username: 'AlphaTanmoy',
        easySolved: response.easySolved,
        mediumSolved: response.mediumSolved,
        hardSolved: response.hardSolved,
      };
    });

  }
}
