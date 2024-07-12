import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" className=" flex-row items-center justify-center ">
      <h1 className=" flex justify-center items-center">Oops!</h1>
      <p className=" flex justify-center items-center ">Sorry, an unexpected error has occurred.</p>
      <p className=" flex justify-center items-center">
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
