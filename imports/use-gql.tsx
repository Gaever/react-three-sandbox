import Gql from 'graphql-tag';
import { useQuery, useSubscription, useMutation as _useMutation } from '@apollo/react-hooks';

export { useQuery, useSubscription };

export function useGql(query, options = {}): { error: any; data: any; loading: boolean; } {
  const qr = useQuery(Gql`{ ${query} }`, { ssr: true, ...options });
  const sr = useSubscription(Gql`subscription { ${query} }`, options);
  if (sr && sr.loading) return { data: qr.data, loading: qr.loading, error: qr.error };
  return { data: sr.data, loading: sr.loading, error: sr.error };
}

export function gql(strings) {
  return strings[0];
}
