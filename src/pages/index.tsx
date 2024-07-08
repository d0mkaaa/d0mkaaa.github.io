import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import Layout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from 'react';
import axios from 'axios';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const languages = [
  { name: "Python", proficiency: 90 },
  { name: "Lua", proficiency: 80 },
  { name: "HTML", proficiency: 95 },
  { name: "CSS", proficiency: 85 },
  { name: "JavaScript", proficiency: 88 },
  { name: "C#", proficiency: 75 },
  { name: "Java", proficiency: 70 },
];

interface Repository {
  name: string;
  description: string;
  html_url: string;
}

export default function Home() {
  const [projects, setProjects] = useState<Repository[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('https://api.github.com/users/lmaoleonix/repos');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Layout>
      <motion.div 
        className="text-4xl font-bold mb-6 text-center"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <TypeAnimation
          sequence={[
            'welcome to my profile.',
            2000,
            'have a nice day!',
            2000,
            'check out my projects.',
            2000,
            'thanks for visiting!',
            2000,
          ]}
          wrapper="span"
          speed={50}
          style={{ display: 'inline-block' }}
          repeat={Infinity}
          cursor={true}
        />
      </motion.div>
      
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Hi, I&apos;m lmaoleonix. I&apos;m a passionate developer with a love for creating awesome websites and applications. I specialize in full-stack development and enjoy working with a variety of programming languages and technologies. I am also interested into racing like F1 or karting. I also play various instruments like: drums, guitar, piano.</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>My Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {languages.map((lang, index) => (
                  <div key={lang.name} className="space-y-2">
                    <div className="flex justify-between">
                      <span>{lang.name}</span>
                      <span>{lang.proficiency}%</span>
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Progress value={lang.proficiency} className="h-2" />
                    </motion.div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>My Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {projects.map((project) => (
                  <li key={project.name}>
                    <a href={project.html_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      {project.name}
                    </a>
                    : {project.description || 'No description available'}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
      </motion.div>

      </motion.div>
    </Layout>
  );
}