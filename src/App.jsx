import React, { useEffect, useState } from 'react';
import Hero from './components/Hero';
import ImpactMetrics from './components/ImpactMetrics';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { buildProfileForUi, portfolioContent } from './content/portfolioContent';

const THEME_STORAGE_KEY = 'portfolio-theme';

export default function App() {
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window === 'undefined') return 'system';

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'system';
  });

  useEffect(() => {
    const root = document.documentElement;

    if (themeMode === 'system') {
      root.removeAttribute('data-theme');
      window.localStorage.removeItem(THEME_STORAGE_KEY);
      return;
    }

    root.setAttribute('data-theme', themeMode);
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  const handleThemeToggle = () => {
    setThemeMode((current) => {
      if (current === 'light') return 'dark';
      if (current === 'dark') return 'light';

      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'light' : 'dark';
    });
  };

  const about = portfolioContent.about;
  const projects = [...(portfolioContent.projects || [])].sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
  const experience = [...(portfolioContent.experience || [])].sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
  const skills = Array.isArray(about?.skills) && about.skills.length ? about.skills : (portfolioContent.skills || []);
  const education = Array.isArray(about?.education) && about.education.length ? about.education : (portfolioContent.education || []);
  const profile = buildProfileForUi(about);
  const navItems = [
    skills.length ? 'skills' : null,
    experience?.length ? 'experience' : null,
    projects?.length ? 'projects' : null,
    education.length ? 'education' : null,
  ].filter(Boolean);

  return (
    <main>
      <div className="bg-mesh" />
      <Hero profile={profile} navItems={navItems} themeMode={themeMode} onThemeToggle={handleThemeToggle} />
      <ImpactMetrics />
      <Skills skills={skills} />
      <Experience experience={experience} />
      <Projects projects={projects} />
      <Education education={education} />
      <Contact />
      <Footer profile={profile} />
    </main>
  );
}
