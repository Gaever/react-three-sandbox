import gql from 'graphql-tag';

export const ADD_SESSION = gql`
  mutation {
    insert_nodes(objects: {passport_passwords: {data: {username: "anonymus", password: "1"}}}) {
      returning {
        sessionId: id
      }
    }
  }
`;
