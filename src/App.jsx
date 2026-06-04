import React from 'react';
import Hero from './components/Hero';
import ImpactMetrics from './components/ImpactMetrics';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { buildProfileForUi, portfolioContent } from './content/portfolioContent';

export default function App() {
  const about = portfolioContent.about;
  const projects = [...(portfolioContent.projects || [])].sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
  const experience = [...(portfolioContent.experience || [])].sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
  const skills = Array.isArray(about?.skills) && about.skills.length ? about.skills : (portfolioContent.skills || []);
  const education = Array.isArray(about?.education) && about.education.length ? about.education : (portfolioContent.education || []);
  const profile = buildProfileForUi(about);
  const navItems = [
    experience?.length ? 'experience' : null,
    projects?.length ? 'projects' : null,
    skills.length ? 'skills' : null,
    education.length ? 'education' : null,
  ].filter(Boolean);

  return (
    <main>
      <div className="bg-mesh" />
      <Hero profile={profile} navItems={navItems} />
      <ImpactMetrics />
      <Experience experience={experience} />
      <Projects projects={projects} />
      <Skills skills={skills} />
      <Education education={education} />
      <Contact />
      <Footer profile={profile} />
    </main>
  );
}
