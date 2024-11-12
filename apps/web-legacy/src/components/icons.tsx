import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  MoreVertical,
  MoreHorizontal,
  Mail,
  Upload,
  X,
  Trash,
  Plus,
  Folder,
  MoveRight,
  PieChart,
  AlignJustify,
  User,
  SunMedium,
  Moon,
  Laptop,
  Info,
} from 'lucide-react';
import Image from 'next/image';

type IconProps = React.HTMLAttributes<SVGElement>

export const Icons = {
  alertTriangle: (props: IconProps) => <AlertTriangle {...props} />,
  arrowRight: (props: IconProps) => <ArrowRight {...props} />,
  check: (props: IconProps) => <Check {...props} />,
  chevronLeft: (props: IconProps) => <ChevronLeft {...props} />,
  chevronRight: (props: IconProps) => <ChevronRight {...props} />,
  chevronsUpDown: (props: IconProps) => <ChevronsUpDown {...props} />,
  moreVertical: (props: IconProps) => <MoreVertical {...props} />,
  moreHorizontal: (props: IconProps) => <MoreHorizontal {...props} />,
  logo: (props: IconProps) => <Image src="/assets/logo.png" alt="Logo" width={32} height={32} className={props.className} />,
  mail: (props: IconProps) => <Mail {...props} />,
  spinner: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  upload: (props: IconProps) => <Upload {...props} />,
  xmark: (props: IconProps) => <X {...props} />,
  trash: (props: IconProps) => <Trash {...props} />,
  plus: (props: IconProps) => <Plus {...props} />,
  folder: (props: IconProps) => <Folder {...props} />,
  moveRight: (props: IconProps) => <MoveRight {...props} />,
  pieChart: (props: IconProps) => <PieChart {...props} />,
  alignJustify: (props: IconProps) => <AlignJustify {...props} />,
  user: (props: IconProps) => <User {...props} />,
  sun: (props: IconProps) => <SunMedium {...props} />,
  moon: (props: IconProps) => <Moon {...props} />,
  laptop: (props: IconProps) => <Laptop {...props} />,
  info: (props: IconProps) => <Info {...props} />,
  google: (props: IconProps) => (
    <svg viewBox="0 0 48 48" {...props}>
      <title>Google Logo</title>
      <clipPath id="g">
        <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
      </clipPath>
      <g clipPath="url(#g)">
        <path fill="#FBBC05" d="M0 37V11l17 13z" />
        <path fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
        <path fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
        <path fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
      </g>
    </svg>
  ),
};