import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { getLogin } from '../../utils/utils-context';

export default function Home() {
  
  const { id } = useParams();
  const history = useHistory();
  const [login] = useState(getLogin());

  useEffect(() => {
      if (login == null) history.push({ pathname: `/entrar/${id}` });
      else history.push({ pathname: `/menu/${id}` });
    },[]);

  return '';

}
