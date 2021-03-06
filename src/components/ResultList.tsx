import React, { RefObject, createRef } from "react";
import styled from "styled-components";
import {
  AutoSizer,
  List,
  ListRowProps,
  CellMeasurerCache,
  CellMeasurer,
} from "react-virtualized";
import { ContextMenuTrigger } from "react-contextmenu";
import { ContextMenuId } from "../contextMenus/ContextMenuId";
import { ComputedGameItem } from "../interfaces/ComputedGameItem";
import { GameItemTriggerProps } from "../contextMenus/GameItemContextMenu";
import { ResultLayout } from "../interfaces/ResultLayout";
import * as path from "path";

const _ResultList = (props: ResultListProps) => {
  const {
    className,
    categoryName,
    results,
    itemId,
    setItemId,
    playHandler,
    layout,
  } = props;
  const listRef: RefObject<any> = createRef();

  const cellMeasurerCache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 22,
    minHeight: 22,
  });

  const onItemClick = (evt: any) => {
    const itemId = Number(evt.currentTarget.getAttribute("data-item-id"));
    setItemId(itemId);
  };

  const onDoubleClick = (evt: any) => {
    const itemId = Number(evt.currentTarget.getAttribute("data-item-id"));
    setItemId(itemId);
    playHandler();
  };

  const onRightClick = (evt: any) => {
    const itemId = Number(evt.currentTarget.getAttribute("data-item-id"));
    setItemId(itemId);
  };

  const renderRow = (props: ListRowProps) => {
    const { index, parent, style } = props;
    return (
      <CellMeasurer
        key={index}
        cache={cellMeasurerCache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        {renderItem(style, index)}
      </CellMeasurer>
    );
  };

  const renderItem = (style: any, index: number) => {
    let child: any;
    if (index < results.length) {
      const item = results[index];
      let className = "item";
      if (itemId == item.id) {
        className += " actived";
      }
      const collect = (): GameItemTriggerProps => {
        return {
          item,
        };
      };

      child = (
        <ContextMenuTrigger id={ContextMenuId.GAME_ITEM} collect={collect}>
          <div
            className={className}
            data-item-id={item.id}
            onClick={onItemClick}
            onDoubleClick={onDoubleClick}
            onContextMenu={onRightClick}
          >
            {renderFavour(item)}
            {renderText(item)}
          </div>
        </ContextMenuTrigger>
      );
    }
    return (
      <div className="row" style={style}>
        {child}
      </div>
    );
  };

  const renderFavour = (data: ComputedGameItem) => {
    if (data.isFavour) {
      return <span className="favour">⭐</span>;
    }
    return <span className="favour" />;
  };

  const renderText = (data: ComputedGameItem) => {
    if (layout == ResultLayout.GAME_TITLE) {
      return <span className="name">{data.gameName}</span>;
    } else if (layout == ResultLayout.FILE_NAME) {
      const basename = path.basename(data.romPath);
      return <span className="name">{basename}</span>;
    }
    return null;
  };

  return (
    <div className={className}>
      <AutoSizer>
        {({ width, height }: any) => (
          <List
            ref={listRef}
            key={categoryName}
            className="list"
            width={width}
            height={height}
            deferredMeasurementCache={cellMeasurerCache}
            rowCount={results.length}
            rowHeight={cellMeasurerCache.rowHeight}
            rowRenderer={renderRow}
            overscanRowCount={1}
          />
        )}
      </AutoSizer>
    </div>
  );
};

const ResultList = styled(_ResultList)`
  width: 100%;
  height: 100%;
  overflow: hidden;
  .row {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    &:nth-child(odd) {
      background-color: rgba(100, 100, 100, 0.2);
    }

    .react-contextmenu-wrapper {
      width: 100%;
      .item {
        padding: 5px;
        color: #888;
        user-select: none;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .favour {
          display: inline-block;
          width: 1.5em;
        }
        &:hover {
          color: #ccc;
        }
        &.actived {
          background-color: rgba(0, 0, 0, 0.5);
          color: #17bbaf;
        }
      }
    }
  }
`;

interface ResultListProps {
  className?: string;
  categoryName: string;
  results: Array<ComputedGameItem>;
  itemId: number;
  setItemId: (itemId: number) => void;
  playHandler: () => void;
  layout: ResultLayout;
}

export default ResultList;
