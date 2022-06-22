import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import "./TabView.css";

function TabView({
  tabs,
  defaultTab,
  render,
  onMount,
  containerStyle,
  containerClassName,
  onChange,
}) {
  const [activeTab, setActiveTab] = useState(null);

  const renderHeader = (tab) => {
    if (!tab) return;
    const isSelected = activeTab === tab?.key;
    if (render) return render(tab, isSelected);
    return (
      <div
        key={tab?.key?.toString()}
        className={`me-tab-header ${isSelected && "me-tab-is-selected"}`}
        onClick={() => setActiveTab(tab?.key)}
      >
        {tab?.icon && (
          <span style={{ marginRight: 6 }}>
            <i className={`fa ${tab.icon}`} />
          </span>
        )}
        <span>{tab?.name || "Tab Name.."}</span>
      </div>
    );
  };

  useEffect(() => {
    onChange && onChange(activeTab); // In case you need to make the tabview a controlled component
  }, [activeTab, onChange]);

  useEffect(() => {
    const tab = defaultTab || (tabs && tabs[0]?.key);
    tab && setActiveTab(tab);
    onMount && onMount(setActiveTab);
  }, [onMount, defaultTab, tabs, setActiveTab]);

  const TabComponent = tabs?.find((tab) => tab?.key === activeTab)?.component;

  return (
    <div className="me-tab-container">
      <div
        className={`me-tab-header-area ${containerClassName || ""}`}
        style={containerStyle || {}}
      >
        {tabs?.map(renderHeader)}
      </div>
      <div>{TabComponent}</div>
    </div>
  );
}

TabView.propTypes = {
  /**
   * Array of tab obj items to display. Tab items should have "name", "key", and "component"
   */
  tabs: PropTypes.arrayOf(PropTypes.object),
  /**
   * Key of the tab item that should be preselected
   */
  defaultTab: PropTypes.string,
  /**
   * Just incase you are not a fun of the tab design, use this to render your own view
   */
  render: PropTypes.func,
  /**
   * Exports a function that is used to change tab outsie the tab view component
   * @param tabChanger
   */
  onMount: PropTypes.func,
  /**
   * Inline css used to style the container of the tab headers
   */
  containerStyle: PropTypes.object,
  /**
   * ClassNames that you can give to the header container
   */
  containerClassName: PropTypes.string,
};
export default TabView;
