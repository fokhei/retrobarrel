import React from "react";
import styled from "styled-components";
import { ExplorerState } from "../states/explorerState";
import { GameItemState } from "../states/gameItemState";
import { getCategory } from "../libs/getCategory";
import { AppConfigState } from "../states/appConfigState";
import { getPlayers } from "../libs/getPlayers";
import { Player } from "../externalApps/Player";
import { play } from "../externalApps/play";
import { MappingState } from "../states/mappingState";

const _PlayerPicker = (props: PlayerPickerProps) => {
  const {
    className,
    hideHandler,
    appConfig,
    mapping,
    explorer,
    gameItem,
  } = props;
  const { explorerConfig } = explorer;
  const { selectedItemId } = explorerConfig;
  const item = gameItem.itemsMap[selectedItemId.toString()];
  const category = getCategory(appConfig, item.categoryName);
  const players = getPlayers(category, item);

  const onPlay = (player) => {
    play(appConfig, mapping, item, player);
  };
  const renderPlayers = () => {
    if (players.length) {
      return players.map((player, index) => renderPlayer(player, index));
    }
    return <div className="noPlayer">( No player for this game )</div>;
  };

  const renderPlayer = (player: Player, index: number) => {
    const onClick = () => {
      onPlay(player);
      hideHandler();
    };
    let name = player.name;
    if (player.hasOwnProperty("caption")) {
      name += " - " + player.caption
    }
    return (
      <a className="player" key={index} onClick={onClick}>
        {name}
      </a>
    );
  };

  return (
    <div className={className}>
      <div className="head">Play with ...</div>
      <div className="body">{renderPlayers()}</div>
      <div className="foot">
        <button onClick={hideHandler}>Close</button>
      </div>
    </div>
  );
};

const PlayerPicker = styled(_PlayerPicker)`
  width: 320px;
  height: 240px;
  padding: 20px;
  border-radius: 10px;
  background-color: #000;
  display: flex;
  flex-direction: column;
  .head {
    color: #666;
  }
  .body {
    flex: 1;
    border-top: 1px solid rgba(100, 100, 100, 0.1);
    padding-top: 10px;
    margin-top: 10px;
    overflow: auto;

    .noPlayer {
      color: #666;
    }

    a {
      user-select: none;
      cursor: pointer;
      color: #17bbaf;
      display: block;
      border-bottom: 1px solid rgba(100, 100, 100, 0.1);
      padding: 5px 0;
      font-size: 16px;
      &:hover {
        color: orange;
      }
    }
  }
`;

interface PlayerPickerProps {
  className?: string;
  hideHandler: () => void;
  appConfig: AppConfigState;
  explorer: ExplorerState;
  gameItem: GameItemState;
  mapping: MappingState;
}

export default PlayerPicker;
