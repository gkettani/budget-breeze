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
} from 'lucide-react';

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
  logo: (props: IconProps) => (
    <svg width="93" height="83" viewBox="0 0 93 83" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>

    </svg>
  ),
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
  XMark: (props: IconProps) => <X {...props} />,
  trash: (props: IconProps) => <Trash {...props} />,
  plus: (props: IconProps) => <Plus {...props} />,
  folder: (props: IconProps) => <Folder {...props} />,
  moveRight: (props: IconProps) => <MoveRight {...props} />,
  pieChart: (props: IconProps) => <PieChart {...props} />,
  alignJustify: (props: IconProps) => <AlignJustify {...props} />,
};