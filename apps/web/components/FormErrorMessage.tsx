import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { FieldErrors } from 'react-hook-form';

type Props = {
  errors: FieldErrors;
};

export const FormErrorMessage = (props: Props) => {
  // No-op.
  if (Object.keys(props.errors).length === 0) {
    return null;
  }

  return (
    <div className="mb-2 text-sm text-red-600">
      Errors:
      {Object.keys(props.errors).map((key, index) => (
        <div key={index}>
          <ChevronRightIcon className="inline h-4 w-4" />
          <span>
            {key}:{' '}
            {props.errors[key] ? props.errors[key]?.message?.toString() : 'n/a'}
          </span>
        </div>
      ))}
    </div>
  );
};
