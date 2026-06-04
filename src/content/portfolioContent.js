import portfolioData from './portfolioData.json';

export const portfolioContent = portfolioData;

export const buildProfileForUi = (about = portfolioData.about) => ({
  name: about?.name || '',
  title: about?.title || '',
  summary: about?.bio || '',
  email: about?.email || '',
  phone: about?.phone || '',
  location: about?.location || '',
  github_url: about?.social?.github || '',
  linkedin_url: about?.social?.linkedin || '',
  twitter_url: about?.social?.twitter || '',
  avatar: about?.avatar || '',
});
