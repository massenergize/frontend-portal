import React from 'react'

/**
 *  Div with height 100px to offset navbar loss if it's sticky
 */
class NavBarOffset extends React.Component {
    render() {
        if(this.props.sticky) {
            const style = {
                "height": "100px"
            };
            return <div style={style}></div>
        }
        return null;
    }
}
export default NavBarOffset;