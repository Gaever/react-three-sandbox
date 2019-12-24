import React from 'react';
import { useState } from 'react';

import _ from 'lodash';
import ReactResizeDetector from 'react-resize-detector';


let ForceGraph2D;
if (process.browser) {
  ForceGraph2D = require('react-force-graph-2d').default;
}

const parseLink = (input, links, _road, nodes) => {
  for (let i = 0; i < input.length; i++) {
    const link = input[i];
    if (!_road[`l${link.id}`]) {
      _road[`l${link.id}`] = true;
      nodes.push({
        id: `l${link.id}`,
        group: link.__typename,
        color: '#3f51b5',
        __data: link,
      });
      links.push({
        id: `l${link.id}-source`,
        source: `n${link.sourceId}`,
        target: `l${link.id}`,
        group: `${link.__typename}-source`,
        color: '#3f51b5',
        __data: link,
      });
      links.push({
        id: `l${link.id}-target`,
        source: `l${link.id}`,
        target: `n${link.targetId}`,
        group: `${link.__typename}-target`,
        color: '#3f51b5',
        __data: link,
      });
    }
  }
};

const parseProp = (node, rel, links, _road, nodes) => {
  for (let p = 0; p < node[rel].length; p++) {
    const pr = node[rel][p];
    nodes.push({
      id: `${rel}${pr.id}`,
      group: pr.__typename,
      color: '#20ec3d',
      __data: pr,
    });
    links.push({
      id: `pr${pr.id}`,
      source: `${rel}${pr.id}`,
      target: `n${node.id}`,
      group: pr.__typename,
      color: '#20ec3d',
      __data: pr,
    });
  }
};

export default ({ data, onNodeClick }) => {
  const nodes: { id: string, group: string, color: string, __data: any }[] = [];
  const _road: { [id: string]: boolean } = {};
  const links: { id: string, group: string, source: string, target: string, color: string, __data: any }[] = [];

  const ns = _.get(data, 'nodes');
  if (ns) {
    for (let n = 0; n < ns.length; n++) {
      const node = ns[n];
      nodes.push({
        id: `n${node.id}`,
        group: node.__typename,
        color: '#000',
        __data: node,
      });
      parseLink(node.links_by_source, links, _road, nodes);
      parseLink(node.links_by_target, links, _road, nodes);
      parseProp(node, 'passport_passwords', links, _road, nodes);
      parseProp(node, 'sessions', links, _road, nodes);
      parseProp(node, 'types', links, _road, nodes);
      for (let l = 0; l < node.links_lists.length; l++) {
        const list = node.links_lists[l];
        if (!_road[`li${list.id}`]) {
          _road[`li${list.id}`] = true;
          nodes.push({
            id: `li${list.id}`,
            group: list.__typename,
            color: '#2196f3',
            __data: list,
          });
          links.push({
            id: `li${list.id}-l`,
            source: `li${list.id}`,
            target: `n${list.nodeId}`,
            group: `${list.__typename}`,
            color: '#2196f3',
            __data: list,
          });
          if (list.linkId) {
            links.push({
              id: `li${list.id}-l`,
              source: `li${list.id}`,
              target: `l${list.linkId}`,
              group: `${list.__typename}`,
              color: '#2196f3',
              __data: list,
            });
          }
        }
      }
      for (let it = 0; it < node.links_lists_items.length; it++) {
        const item = node.links_lists_items[it];
        if (!_road[`i${item.id}`]) {
          _road[`i${item.id}`] = true;
          nodes.push({
            id: `i${item.id}`,
            group: item.__typename,
            color: '#a1a1a1',
            __data: item,
          });
          links.push({
            id: `in${item.id}`,
            source: `i${item.id}`,
            target: `li${item.listId}`,
            group: `${item.__typename}`,
            color: '#a1a1a1',
            __data: item,
          });
        }
      }
    }
  }

  const [{ width, height }, setSize] = useState({ width: 100, height: 100 });

  return <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}>
    <ReactResizeDetector handleWidth handleHeight onResize={(width, height) => {
      setSize({ width, height });
    }}/>
    {process.browser && <ForceGraph2D
      width={width}
      height={height}
      graphData={{
        nodes,
        links,
      }}
      nodeAutoColorBy="group"
      linkDirectionalArrowLength={3.5}
      linkDirectionalArrowRelPos={1}
      linkColor={d => d.color}
      onNodeClick={onNodeClick}
      nodeCanvasObject={(node, ctx, globalScale) => {
        const label = node.id;
        const fontSize = 12/globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        const textWidth = ctx.measureText(label).width;
        const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
        ctx.fillStyle = '#fff';
        ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = node.color;

        ctx.fillText(label, node.x, node.y);
      }}
    />}
  </div>;
};
