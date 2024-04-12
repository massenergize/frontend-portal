import React from "react";
import logo from "../../logo.png";
import Dropdown from "react-bootstrap/Dropdown";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { withFirebase } from "react-redux-firebase";
import { reduxLogout } from "../../redux/actions/userActions";
import createImagefromInitials from "../AutoGeneratedIcon.js";
import { signMeOut } from "../../redux/actions/authActions";
import { reduxToggleGuestAuthDialog } from "../../redux/actions/pageActions";
import { apiCall } from "../../api/functions";
function getHeight() {
  const navBar = document.getElementById("nav-bar");
  return navBar ? navBar.offsetHeight + 1 : 91;
}

class NavBarBurger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuBurgered: window.innerWidth < 992,
      menuOpen: false,
    };
    this.handleLinkClick = this.handleLinkClick.bind(this);
  }
  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
  handleResize = () => {
    this.setState({
      menuBurgered: window.innerWidth < 992,
    });
    this.forceUpdate();
  };
  handleMenuClick() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }
  handleLinkClick() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }
  render() {
    const { links, community, pageData} = this.props;
    var communitylogo = community?.logo?.url;
    var header = null;
    var communityName = pageData.community.name || "communities";

    const styles = {
      container: {
        position: "relative",
        width: "100%",
        height: "80px",
        zIndex: "99",
        display: "flex",
        background: "white",
        color: "#333",
        fontFamily: "Verdana",
      },
      body: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        filter: this.state.menuOpen ? "blur(2px)" : null,
        transition: "filter 0.5s ease",
      },
    };
    if (!links) return null;

    // Only for burgered
    const menuItems = this.props.navLinks.map((val, index) => {
      if (val.children) {
        return (
          <SubMenuItem
            key={index}
            communityName={communityName}
            navlink={val}
            links={links}
            index={index}
            clickHandler={this.handleLinkClick}
          ></SubMenuItem>
        );
      }
      return (
        <MenuItem
          key={index}
          delay={`${index * 0.1}s`}
          onClick={() => {
            this.handleLinkClick();
          }}
          href={val.link}
        >
          {val.name}
        </MenuItem>
      );
    });
    return (
      <div>
        <nav
          className={`theme_menu navbar p-0  z-depth-1 ${
            this.props.sticky ? "fixed-top border-bottom" : ""
          }`}
          style={{
            height: "auto",
            minHeight: "90px",
            position: "fixed",
            width: "100%",
            background: "white",
          }}
          id="nav-bar"
        >
          <div className="container">
            <div className="row no-gutter width-100">
              <div
                className="col-lg-4 col-md-8 col-sm-6 col-6 d-flex"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Link to={links.home}>
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <img
                      src={communitylogo ? communitylogo : logo}
                      alt=""
                      style={{ display: "inline-block" }}
                      className="header-logo"
                    />
                    {communitylogo ? null : (
                      <>&nbsp;{header ? header.title : null}</>
                    )}
                  </div>
                </Link>
              </div>
              {this.state.menuBurgered ? ( // BURGERED STATE
                <div
                  className="col-lg-8 col-md-4 col-sm-6 col-6 tour-nav-pointer"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div style={{ margin: "auto 0 auto auto" }}>
                    <div style={styles.container}>
                      <MenuButton
                        open={this.state.menuOpen}
                        onClick={() => this.handleMenuClick()}
                        color="#333"
                      />
                      {this.renderLogin()}
                    </div>
                    <Menu open={this.state.menuOpen}>{menuItems}</Menu>
                  </div>
                </div>
              ) : (
                <div className="col-lg-8 col-md-4 col-sm-6 col-6 menu-column tour-nav-pointer">
                  <div style={styles.container}>
                    <nav
                      className="padding-0 menuzord d-flex"
                      style={{
                        display: "inline-block",
                        padding: "30px 0px",
                        flexGrow: 1,
                      }}
                      id="main_menu"
                    >
                      <ul
                        className="cool-font menuzord-menu height-100 d-flex flex-row"
                        style={{ marginLeft: "auto" }}
                      >
                        {this.renderNavLinks(this.props.navLinks)}
                      </ul>
                    </nav>
                    {this.renderLogin()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
        <div style={{ height: getHeight() }}></div>
      </div>
    );
  }

  renderNavLinks(navLinks) {
    if (!navLinks) {
      return <li key="noLinks">No PageLinks to Display</li>;
    }
    const style = {
      borderTop: "5px solid #8dc63f",
      borderRadius: "0",
      padding: "0",
      minwidth: "100px",
    };

    return Object.keys(navLinks).map((key) => {
      var navLink = navLinks[key];

      const name = navLink?.name?.toLowerCase()?.replace(" ", "-");
      const linkId = `menu-${name}-id`;
      if (navLink.children) {
        const CustomNavLink = React.forwardRef((props, ref) => (
          <Link
            ref={ref}
            className="cool-font"
            to=""
            onClick={(e) => {
              e.preventDefault();
              props.onClick(e);
            }}
            {...(navLink?.navItemId ? { id: navLink.navItemId } : {})}
          >
            {" "}
            {props.navLink.name}{" "}
            <span className="font-normal fa fa-angle-down"></span>
          </Link>
        ));

        return (
          <li
            className={`d-flex flex-column justify-content-center test-me-nav-menu-item-with-drop`}
            id={linkId}
            key={navLink.name}
          >
            <Dropdown onSelect={() => null}>
              <Dropdown.Toggle
                as={CustomNavLink}
                navLink={navLink}
                id="dropdown-custom-components"
              ></Dropdown.Toggle>
              <Dropdown.Menu
                style={style}
                className="me-dropdown-theme me-anime-show-up-from-top z-depth-1"
              >
                {this.renderDropdownItems(navLink.children)}
              </Dropdown.Menu>
            </Dropdown>
          </li>
        );
      }
      return (
        <li
          className="d-flex flex-column justify-content-center test-me-nav-menu-item"
          key={navLink.name}
          {...(navLink?.navItemId ? { id: navLink.navItemId } : {})}
          id={linkId}
        >
          <Link className="cool-font" to={`${navLink.link}`}>
            {navLink.name}
          </Link>
        </li>
      );
    });
  }
  //----------- AREA TO PLAY WITH WEIRD MENU ITEMS --------
  renderDropdownItems(children) {
    if (!this.props.links) return;
    const comm = this.props.pageData
      ? this.props.pageData.community
      : { name: "My Community" };
    return children.map((child, key) => {
      const id = child?.navItemId ? { id: child.navItemId } : {};
      const name = child?.name?.toLowerCase()?.replace(" ", "-");
      const linkId = `menu-${name}-id`;
      if (child.special) {
        return (
          <Link
            {...id}
            key={key}
            className="cool-font p-3 small dropdown-item me-dropdown-theme-item test-me-nav-drop-item"
            onClick={() => {
              window.location = child.link;
            }}
            id={linkId}
          >
            {child.name}
          </Link>
        );
      } else {
        return (
          <Link
            {...id}
            key={key}
            id={linkId}
            to={`${child.link}`}
            className="cool-font  p-3 small dropdown-item me-dropdown-theme-item test-me-nav-drop-item"
            onClick={(e) => {
              if (e.target.id === "take-the-tour") {
                e.preventDefault();
                window.location = this.props.links.home + "?tour=true";
                return;
              }
              document.dispatchEvent(new MouseEvent("click"));
            }}
          >
            {child.name === "current-home" ? comm.name : child.name}
          </Link>
        );
      }
    });
  }
  renderLogin() {
    const { user, links, toggleGuestAuthDialog } = this.props;

    const btnColor =
      user.preferences && user.preferences.color
        ? user.preferences.color
        : "#fd7e14";
    if (user.info?.full_name) {
      return (
        <Dropdown onSelect={() => null} className="d-flex h-auto">
          <Dropdown.Toggle
            id="test-auth-user-dropdown"
            style={{ backgroundColor: "white", borderColor: "white" }}
            className="remove-toggle-outline"
          >
            {user.info.profile_picture ? (
              <img
                src={user.info.profile_picture.url}
                alt="profile media"
                className="me-nav-profile-pic z-depth-1"
                style={{
                  "--user-pref-color": btnColor,
                }}
              ></img>
            ) : (
              <img
                src={createImagefromInitials(btnColor, user.info.full_name, 35)}
                alt="profile media"
                className="me-nav-profile-pic z-depth-1`"
                style={{
                  "--user-pref-color": btnColor,
                }}
              ></img>
            )}
          </Dropdown.Toggle>
          <Dropdown.Menu className="z-depth-1 me-dropdown-theme me-anime-show-up-from-top">
            <Link
              to={links.profile}
              className="dropdown-item p-3 small font-weight-bold cool-font me-dropdown-theme-item"
              onClick={() => document.dispatchEvent(new MouseEvent("click"))}
            >
              My Profile
            </Link>

            <Link
              to={`${links.profile}/changes`}
              className="dropdown-item p-3 small font-weight-bold cool-font me-dropdown-theme-item"
              onClick={() => document.dispatchEvent(new MouseEvent("click"))}
            >
              Preferences
            </Link>
            {/* ------------------------------------------------------------------------------ */}
            <button
              className="dropdown-item p-3 small font-weight-bold cool-font me-dropdown-theme-item"
              onClick={() => {
                apiCall("auth.logout", {}).then((res) => {
                  if (res?.success) {
                    const url = new URL(window.location.href);
                    const isProfilePage = url?.pathname?.includes("profile");
                    const homepage = links.home;
                    if (isProfilePage) this.props.history.push(homepage);
                    document.dispatchEvent(new MouseEvent("click"));
                    this.props.signOut();
                  }
                });
              }}
            >
              Sign Out
              {/* <SignOutLink>Sign Out</SignOutLink> */}
            </button>
          </Dropdown.Menu>
        </Dropdown>
      );
    } else {
      return (
        <Link
          id="test-nav-auth-trigger"
          className="cool-font new-sign-in float-right round-me z-depth-float"
          to={links.signin}
          onClick={(e) => {
            e.preventDefault();
            toggleGuestAuthDialog(true);
          }}
        >
          <b> Sign In | Join</b>
        </Link>
      );
    }
  }
}
const mapStoreToProps = (store) => {
  return {
    user: store.user,
    pageData: store.page.homePage,
    links: store.links,
    firebaseAuthSettings: store.firebaseAuthSettings,
    fireAuth: store.fireAuth,
    community: store.page.community,
  };
};
export default connect(mapStoreToProps, {
  reduxLogout,
  signOut: signMeOut,
  toggleGuestAuthDialog: reduxToggleGuestAuthDialog,
})(withRouter(withFirebase(NavBarBurger)));
// export default NavBarBurger;

// ======================== BURGERED vvv =========================== //

/**
 * Renders one navlink and its menu underneath in Burgered menu
 * @props navlink: The navlink object and its children to render
 */
class SubMenuItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ open: !this.state.open });
  }

  //---------WHERE TO SETUP WEIRD SPECIAL MENU ITEMS IN BURGERED MENU ---------
  renderSubmenuItems(items) {
    //const comm = this.props.pageData ? this.props.pageData.community : { name: "My Community 1" }
    return items.map((item, key) => {
      if (item.special) {
        return (
          <MenuItem
            key={key}
            onClick={(e) => {
              e.preventDefault();
              window.location = item.link;
            }}
            href="#"
          >
            {item.name}
          </MenuItem>
        );
      } else {
        const name = this.props.communityName
          ? this.props.communityName
          : "My Community 2";
        return (
          <MenuItem
            key={key}
            href={item.link}
            onClick={this.props.clickHandler}
          >
            {item.name === "current-home" ? name : item.name}
          </MenuItem>
        );
      }
    });
  }

  render() {
    return (
      <>
        <MenuItem
          key={this.props.index}
          delay={`${this.props.index * 0.1}s`}
          onClick={this.handleClick}
          href="#"
        >
          {this.props.navlink.name}
        </MenuItem>
        <div style={{ marginLeft: "1em" }}>
          <Menu open={this.state.open} submenu={true}>
            {this.renderSubmenuItems(this.props.navlink.children)}
          </Menu>
        </div>
      </>
    );
  }
}

/**
 * Renders just one navlink in Burgered menu
 */
class MenuItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
    };
  }
  handleHover() {
    this.setState({ hover: !this.state.hover });
  }
  render() {
    const styles = {
      container: {
        animation: "1s appear backwards",
        animationDelay: this.props.delay,
      },
      menuItem: {
        color: this.state.hover ? "#8ec449" : "#303030",
        fontWeight: "400",
        fontFamily: "Google Sans",
        fontSize: "1rem",
        padding: ".5rem 0",
        margin: "0 5%",
        cursor: "pointer",
        transition: "color 0.2s ease-in-out",
        animation: "0.5s slideIn forwards",
        animationDelay: this.props.delay,
      },
      line: {
        width: "90%",
        height: "1px",
        background: "gray",
        margin: "0 auto",
        animation: "0.5s shrink forwards",
        animationDelay: this.props.delay,
      },
    };
    return (
      <div style={styles.container}>
        <Link
          className="width-100"
          style={styles.menuItem}
          onMouseEnter={() => {
            this.handleHover();
          }}
          onMouseLeave={() => {
            this.handleHover();
          }}
          onClick={this.props.onClick}
          to={this.props.href}
        >
          {this.props.children}
        </Link>
        <div style={styles.line} />
      </div>
    );
  }
}

/* Menu.jsx */
class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open ? this.props.open : false,
    };
  }

  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.open !== state.open) {
      return {
        open: nextProps.open,
      };
    }
    return null;
  }

  render() {
    const styles = {
      container: {
        right: -20,
        marginTop: 8,
        position: !this.props.submenu ? "absolute" : "relative",
        width: "37vh",
        height: this.state.open
          ? !this.props.submenu
            ? "calc(150vh - " + getHeight() + "px)"
            : "100%"
          : 0,
        display: "flex",
        flexDirection: "column",
        background: "white",
        color: "black",
        transition: "height 0.3s ease",
        zIndex: 2,
      },
      menuList: {
        paddingTop: !this.props.submenu ? "3rem" : "0",
      },
    };

    if (!this.props.submenu) {
      // this is the main parent menu
      document.body.className = this.state.open ? "burger-menu-open" : "";
    }

    return (
      <div style={styles.container} className="z-depth-2">
        {this.state.open ? (
          <div style={styles.menuList}>{this.props.children}</div>
        ) : null}
      </div>
    );
  }
}

/* MenuButton.jsx */
class MenuButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open ? this.props.open : false,
      color: this.props.color ? this.props.color : "black",
    };
  }

  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.open !== state.open) {
      return {
        open: nextProps.open,
      };
    }
    return null;
  }

  handleClick() {
    this.setState({ open: !this.state.open });
  }
  render() {
    const styles = {
      container: {
        justifyContent: "flex-end",
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: "auto",
        height: "32px",
        width: "32px",
        // justifyContent: 'center',
        cursor: "pointer",
        padding: "4px",
      },
      line: {
        height: "2px",
        width: "29px",
        background: this.state.color,
        transition: "all 0.2s ease",
      },
      lineTop: {
        transform: this.state.open ? "rotate(45deg)" : "none",
        transformOrigin: "top left",
        marginBottom: "8px",
      },
      lineMiddle: {
        opacity: this.state.open ? 0 : 1,
        transform: this.state.open ? "translateX(-16px)" : "none",
      },
      lineBottom: {
        transform: this.state.open ? "translateX(-1px) rotate(-45deg)" : "none",
        transformOrigin: "top left",
        marginTop: "8px",
      },
    };
    return (
      <div
        style={styles.container}
        onClick={
          this.props.onClick
            ? this.props.onClick
            : () => {
                this.handleClick();
              }
        }
      >
        <div style={{ ...styles.line, ...styles.lineTop }} />
        <div style={{ ...styles.line, ...styles.lineMiddle }} />
        <div style={{ ...styles.line, ...styles.lineBottom }} />
      </div>
    );
  }
}
