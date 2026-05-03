/* global React */
const { useState, useEffect, useRef, useMemo } = React;

// ============================================================
// CAREER DATA
// ============================================================
const CAREER = [
  {
    id: 'btu',
    date: 'NOV 2025 - PRESENT',
    year: 2025.9,
    role: 'Invited AI Trainer',
    org: 'BTU - Business and Technology University',
    desc: 'Teaching applied AI to professionals and students - bridging theory with real-world marketing and product use cases.',
    tags: ['Teaching', 'Applied AI', 'Curriculum'],
    current: true,
    weight: 0.7,
  },
  {
    id: 'growth',
    date: 'SEP 2025 - PRESENT',
    year: 2025.7,
    role: 'Senior Marketing Manager & PM',
    org: 'Growth Hunters',
    desc: 'Leading end-to-end marketing for Tegeta, Ambassador, Pitstop Moto and real-estate developers. Built an AI-based predictive analytics product for marketing decisions. Delivered campaigns for Bank of Georgia\'s TikTok.',
    tags: ['Strategy', 'Cross-functional', 'AI product', 'TikTok'],
    current: true,
    weight: 0.9,
  },
  {
    id: 'alte',
    date: 'FEB 2025',
    year: 2025.15,
    role: 'Invited AI Trainer',
    org: 'Alte University',
    desc: 'Designed and delivered "AI from theory to practice" - a continuing-education course for companies and individuals.',
    tags: ['Teaching', 'AI'],
    weight: 0.5,
  },
  {
    id: 'ucraft',
    date: 'MAR 2023 - APR 2025',
    year: 2024,
    role: 'Co-Founder (Startup)',
    org: 'uCraft',
    desc: 'Built and scaled an AI translation service to 25,000 monthly active users. Ran strategy, product and marketing. Pivoted the company away from the hyper-competitive automation platform toward high-growth translation tools.',
    tags: ['SaaS', '25K MAU', 'AI', 'Pivot'],
    weight: 1,
  },
  {
    id: 'gladus',
    date: '2022 - 2023',
    year: 2022.5,
    role: 'Senior SEO Specialist',
    org: 'Gladus',
    desc: 'Grew organic traffic from 300 to 175,000 monthly visits in 6 months. Led on-page, off-page, content and technical SEO across a team of three.',
    tags: ['SEO', '583× growth', 'Content'],
    weight: 0.95,
  },
  {
    id: 'arc',
    date: 'APR 2020 - MAY 2023',
    year: 2021.5,
    role: 'Digital Marketing Lead',
    org: 'ARC Digits',
    desc: 'Set digital strategy and oversaw execution for mainly US-based clients across real-estate, HoReCa and HR. Led a team of four.',
    tags: ['Strategy', 'US market', 'Team lead'],
    weight: 0.7,
  },
  {
    id: 'rembow',
    date: 'NOV 2021 - MAY 2023',
    year: 2022,
    role: 'Digital Marketing & SEO Lead',
    org: 'Rembow',
    desc: 'Full-cycle strategy from ICP and persona design to overseeing active campaigns for a Tbilisi event agency.',
    tags: ['Strategy', 'ICP'],
    weight: 0.4,
  },
  {
    id: 'msg',
    date: 'JUN 2018 - DEC 2022',
    year: 2020,
    role: 'Founder & CMO',
    org: 'Marketing Solutions Georgia',
    desc: 'Ran my own agency. Delivered 45+ digital projects for McDonald\'s, Coca-Cola, Herbalife and others. Managed ~$550K in ad spend across Meta, Google and LinkedIn. Team of 4 marketers, 2 designers, 2 developers.',
    tags: ['Agency', '$550K ad spend', '45+ projects', 'CMO'],
    weight: 1,
  },
  {
    id: 'maxim',
    date: 'NOV 2017 - DEC 2018',
    year: 2018,
    role: 'Marketing Specialist',
    org: 'Maxim Order Service',
    desc: 'Content and advertising for an international taxi service operating across 14+ countries.',
    tags: ['Content', 'Paid social'],
    weight: 0.3,
  },
];

const CLIENTS = [
  "McDonald's", 'Coca-Cola', 'Herbalife', 'Bank of Georgia',
  'Tegeta', 'Ambassador', 'Pitstop Moto', 'uCraft',
  'Alte University', 'BTU', 'Gladus', 'ARC Digits', 'Maxim',
];

const SKILLS = {
  'AI & Automation': [
    { name: 'n8n', badge: 'AUTOMATION' },
    { name: 'Claude', badge: 'LLM' },
    { name: 'OpenAI', badge: 'LLM' },
    { name: 'Gemini', badge: 'LLM' },
    { name: 'API', badge: 'INTEGRATION' },
    { name: 'AI Automation', badge: 'STACK' },
  ],
  'Paid Media': [
    { name: 'Google Ads', badge: 'SEM' },
    { name: 'Meta Ads', badge: 'SOCIAL' },
    { name: 'LinkedIn Ads', badge: 'B2B' },
    { name: 'TikTok Ads', badge: 'SOCIAL' },
    { name: 'Instagram Ads', badge: 'SOCIAL' },
  ],
  'Analytics & SEO': [
    { name: 'Google Analytics', badge: 'ANALYTICS' },
    { name: 'Google Tag Manager', badge: 'TRACKING' },
    { name: 'Hotjar', badge: 'UX' },
    { name: 'SproutSocial', badge: 'SOCIAL' },
    { name: 'Semrush', badge: 'SEO' },
    { name: 'MOZ', badge: 'SEO' },
    { name: 'ScreamingFrog', badge: 'TECHNICAL' },
    { name: 'Content SEO', badge: 'CRAFT' },
    { name: 'Technical SEO', badge: 'CRAFT' },
    { name: 'Link Building', badge: 'OFF-PAGE' },
  ],
  'Build & Ship': [
    { name: 'HTML', badge: 'CODE' },
    { name: 'CSS', badge: 'CODE' },
    { name: 'JS', badge: 'CODE' },
    { name: 'Cursor', badge: 'VIBE-CODE' },
    { name: 'Lovable', badge: 'VIBE-CODE' },
    { name: 'WordPress', badge: 'CMS' },
    { name: 'HubSpot', badge: 'CRM' },
  ],
};

const STATS = [
  { val: '8', unit: '+', lab: 'Years in marketing' },
  { val: '$550', unit: 'K', lab: 'Ad spend managed' },
  { val: '25', unit: 'K', lab: 'MAU built at uCraft' },
  { val: '583', unit: '×', lab: 'SEO traffic growth' },
  { val: '45', unit: '+', lab: 'Projects delivered' },
];

// expose globally
Object.assign(window, { CAREER, CLIENTS, SKILLS, STATS });
