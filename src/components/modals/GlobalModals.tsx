import AlbumModal from "./AlbumModal";
import DeleteModal from "./DeleteModal";
import FolderModal from "./FolderModal";
import NestlingModal from "./NestlingModal";
import RenameImageModal from "./RenameImageModal";
import SearchModal from "./SearchModal";
import SettingsModal from "./SettingsModal";

export default function GlobalModals() {
  return (
    <>
      <NestlingModal />
      <FolderModal />
      <SearchModal />
      <SettingsModal />
      <DeleteModal />
      <AlbumModal />
      <RenameImageModal />
    </>
  );
}
