import {useContext, useEffect} from 'react';
import {useMutation} from '@apollo/react-hooks';
import {ADD_SESSION} from './gql';
import {context} from '../../context';

export default function AuthControl({onAuth}) {
  const [addSession, { data, error }] = useMutation(ADD_SESSION);
  const {state, setState} = useContext(context);

  useEffect(() => {
    addSession();
  }, []);

  useEffect(() => {
    if (error) console.error(error);
  }, [error])
  
  useEffect(() => {
    const { insert_nodes: { returning = [] } = {} } = data || {};
    const { sessionId } = returning.length && returning[0] || {};
    if (sessionId) {
      setState({...state, sessionId});
      onAuth();
    }
  }, [data]);

  return null;
}
