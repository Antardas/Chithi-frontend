import { Location, NavigateFunction, useLocation, useNavigate } from 'react-router-dom';
interface IHistory {
  navigate: NavigateFunction | null;
  location: Location<unknown> | null;
}
export const history: IHistory = {
  navigate: null,
  location: null
};

const TestHelpers = () => {
  history.navigate = useNavigate();
  history.location = useLocation();
  return <div>TestHelpers</div>;
};

export default TestHelpers;
