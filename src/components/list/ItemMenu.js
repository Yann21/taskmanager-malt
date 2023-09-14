import * as React from "react";
import { StatefulMenu, NestedMenus } from "baseui/menu";
import { useEffect, useRef } from "react";
import { fetchProjectsDB, fetchContextsDB } from "../../apiService";

const MOVE = "Move ->";
const menuItems = [{ label: "Rename" }, { label: MOVE }];

/**
 * Hook that alerts clicks outside of the passed ref
 */
const useItemMenu = (setMenuPosition) => {
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuPosition(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setMenuPosition]);

  return { menuRef };
};

/**
 * Hook that fetches data for the move menu (projects and contexts)
 */
const useMenuData = () => {
  const [destinations, setDestinations] = React.useState([]);

  useEffect(() => {
    const fetchMenuData = async () => {
      const projects = await fetchProjectsDB();
      const contexts = await fetchContextsDB();
      setDestinations(
        projects.map((k) => ({ label: k.name })),
        contexts.map((k) => ({ label: k.name }))
      );
    };

    fetchMenuData();
  }, []);

  return destinations;
};

const MoveSubMenu = ({ moveItem }) => (
  <StatefulMenu
    items={useMenuData()}
    overrides={{
      List: { style: { width: "200px" } },
      Option: {
        props: {
          onClick: (event, item) => {
            const targetProject = event.target.firstChild.data;
            moveItem(targetProject);
          },
        },
      },
    }}
  />
);

export default function ItemMenu({ moveItem, menuPosition, setMenuPosition }) {
  const { menuRef } = useItemMenu(setMenuPosition);

  const menuStyle = menuPosition
    ? {
        position: "absolute",
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`,
        zIndex: 1000,
      }
    : {};

  return (
    <>
      {menuPosition && (
        <div ref={menuRef} style={menuStyle}>
          <NestedMenus>
            <StatefulMenu
              items={menuItems}
              overrides={{
                List: { style: { width: "200px", overflow: "auto" } },
                Option: {
                  props: {
                    getChildMenu: (item) => {
                      if (item.label === MOVE) {
                        return <MoveSubMenu moveItem={moveItem} />;
                      }
                      return null;
                    },
                  },
                },
              }}
            />
          </NestedMenus>
        </div>
      )}
    </>
  );
}
