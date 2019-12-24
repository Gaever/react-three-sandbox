import {gql} from '../../use-gql';

export const FETCH_BOXES = gql`
  rawBoxes: nodes_props_boxes {
    id
    position
    quaternion,
    capturedBySessionId: captured_by_id,
  }
`;
