import React from 'react'

class Video extends React.Component {
    render() {
        return (
            <video controls>
                <source src={this.props.link} type="video/mp4" />
            </video>
        );
    }
}
export default Video;