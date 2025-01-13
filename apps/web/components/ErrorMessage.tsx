type ErrorMessageProps = {
  message: any;
  title?: any;
};

export const ErrorMessage = (props: ErrorMessageProps) => {
  return (
    <div
      className="border-l-4 border-orange-500 bg-orange-100 p-4 text-orange-700"
      role="alert"
    >
      <p className="font-bold">{props.title ?? 'Error'}</p>
      <p>{props.message}</p>
    </div>
  );
};
