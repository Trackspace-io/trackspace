import { useParams as Params } from 'react-router-dom';

interface RouteParams {
  id: string;
}

export const useParams = () => {
  // Retrieve id
  const { id } = Params<RouteParams>();

  return id;
};
