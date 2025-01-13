import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type Element = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};
type Props = {
  elements: Element[];
};

export const Breadcrumb = (props: Props) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {props.elements.map((element) => {
          return (
            <Link
              key={element.label}
              href={element.href}
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
            >
              <p className="me-2.5 h-3 w-3">
                {element.icon ?? <ChevronRightIcon />}
              </p>
              <p>{element.label}</p>
            </Link>
          );
        })}
      </ol>
    </nav>
  );
};
