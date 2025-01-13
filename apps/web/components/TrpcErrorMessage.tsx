type Props = {
  error: any;
};

export const TrpcErrorMessage = (props: Props) => {
  return (
    <div
      className="border-l-4 border-orange-500 bg-orange-100 p-4 text-orange-700"
      role="alert"
    >
      <p className="font-bold">Error</p>
      <p>{props.error.message}</p>
    </div>
  );
};
