import React, { useEffect, useState } from 'react'
import "./seach-menu.scss"
import { menuContent  } from './menu_content';


const menu = menuContent as any


interface SearchProps {
  // handleChange: () => void;
  handleEnterKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  position: { x: number, y: number };
  getInfo: (name: string, type: string | null) => void
}

const SearchMenu: React.FC<SearchProps> = ({ handleEnterKeyPress, position, getInfo }) => {
  // const [hoverStates, setHoverStates] = useState<{ [key: string]: boolean }>({});
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<boolean>(false);
  // const menu = useRef(menuContent) as any
  const menuRefs = {} as any; // Create an object to store refs for each menu item

  const handleMouseEnter = (key: string) => {
    // console.log(key)
    setActiveKey(key);
    if (!openSub) {

      setOpenSub(true)
    }
  };



  const handleClick = (id: string) => {
    getInfo(id, activeKey)
    console.log(id, activeKey)
  }

  useEffect(() => {
    // Add event listeners to each menu item using the refs
    Object.keys(menuContent).forEach((key) => {
      if (menuRefs[key]) {
        menuRefs[key].addEventListener('mouseenter', () => handleMouseEnter(key));
      }
    });

    // Cleanup the event listeners when the component unmounts
    return () => {
      Object.keys(menuContent).forEach((key) => {
        if (menuRefs[key]) {
          menuRefs[key].removeEventListener('mouseenter', () => handleMouseEnter(key));
        }
      });
    };
  }, []); // Run this effect only once when the component mounts

  return (
    <div
      className='search-wrapper'
      style={{ left: position.x, top: position.y }}
    >
      <div className='search-nodes'>
        <input
          className={`search-box`}
          type="search"
          placeholder={"search"}
          // onChange={handleChange}
          onKeyDown={handleEnterKeyPress}
          id="search"
        />
        {Object.keys(menuContent).map((key) => (
          <div
            key={key}
            className={`node-menu ${key === activeKey ? activeKey.toLocaleLowerCase() : ''}`}
            id={key.toLowerCase()}
            ref={(ref) => (menuRefs[key] = ref)} // Store the ref in the menuRefs object

          >
            {key}
          </div>
        ))}

        {openSub && activeKey && (
          <div
            className="submenu"
            style={{ position: "absolute", left: "110px", top: "0", width: "160px", zIndex: "100" }}
          >
            <ul>
              {menu[activeKey].map((item: any) => (
                <div
                  key={item}
                  className={`node-menu ${item ? item.toLowerCase() : ""}`}
                  id={item.toLowerCase()}
                  onClick={() => handleClick(item)}

                >
                  {item}
                </div>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchMenu;
