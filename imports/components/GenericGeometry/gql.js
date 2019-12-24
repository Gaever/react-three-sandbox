import gql from 'graphql-tag';

export const UPDATE_BOX_LOCATION = gql`
  mutation update_box_location($position: json, $quaternion: json, $id: Int) {
    update_nodes_props_boxes(where: {id: {_eq: $id}}, _set: {position: $position, quaternion: $quaternion}) {
      returning {
        id
      }
    }
  }
`;

export const ON_UPDATE_BOX_LOCATION = gql`
  subscription onLocationUpdate($id: Int) {
    node: nodes(where: {nodes_props_boxes: {id: {_eq: $id}}}) {
      rawBox: nodes_props_boxes {
        position
        quaternion
        id
      }
      id
    }
  }
`;
