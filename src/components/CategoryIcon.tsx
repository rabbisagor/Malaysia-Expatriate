import React from 'react';
import {
  ShieldAlert,
  BookOpen,
  Compass,
  Building2,
  Landmark,
  Stethoscope,
  BadgeDollarSign,
  Briefcase,
  FileCheck2,
  Plane,
  Scale,
  Car,
  ShieldCheck,
  Newspaper,
  PhoneCall,
  HelpCircle,
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-6 h-6' }) => {
  switch (name) {
    case 'ShieldAlert':
      return <ShieldAlert className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'Building2':
      return <Building2 className={className} />;
    case 'Landmark':
      return <Landmark className={className} />;
    case 'Stethoscope':
      return <Stethoscope className={className} />;
    case 'BadgeDollarSign':
      return <BadgeDollarSign className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'FileCheck2':
      return <FileCheck2 className={className} />;
    case 'Plane':
      return <Plane className={className} />;
    case 'Scale':
      return <Scale className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'Newspaper':
      return <Newspaper className={className} />;
    case 'PhoneCall':
      return <PhoneCall className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};
