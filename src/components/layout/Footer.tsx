'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone, Github, Twitter, Linkedin, Youtube } from 'lucide-react';

const footerSections = [
  {
    title: 'Platform',
    links: [
      { label: 'Courses', href: '/courses' },
      { label: 'Coder Station', href: '/playground' },
      { label: 'Simulation Lab', href: '/simulation' },
      { label: 'Game Arena', href: '/arena' },
      { label: 'Competitions', href: '/competitions' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Project Library', href: '/projects' },
      { label: 'Documentation', href: '/docs' },
      { label: 'AI Tutor', href: '/ai-tutor' },
      { label: 'Blog', href: '/blog' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Forums', href: '/community' },
      { label: 'Marketplace', href: '/marketplace' },
      { label: 'Events', href: '/events' },
      { label: 'Mentorship', href: '/mentorship' },
      { label: 'Partnerships', href: '/partners' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-brand-dark">
      <div className="circuit-overlay" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/images/logo-white.png"
                alt="Robotix Institute"
                width={180}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-white/50 text-sm mb-6 max-w-xs">
              Zambia&apos;s premier robotics education platform. Building Africa&apos;s next generation of innovators and engineers.
            </p>
            <div className="space-y-2 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-accent" />
                <span>Lusaka, Zambia</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-accent" />
                <span>hello@robotixinstitute.co.zm</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-accent" />
                <span>+260 97X XXX XXX</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-heading font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-brand-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Robotix Institute Zambia. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[Github, Twitter, Linkedin, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-2 rounded-lg text-white/40 hover:text-brand-accent hover:bg-white/5 transition-colors"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
