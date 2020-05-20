import React from 'react'
import Carousel from 'react-bootstrap/Carousel'

/** Renders an image banner that is either three images wide, or a carousel of three images
 * depending on the window width
 */
class WelcomeImages extends React.Component {
    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }
    handleResize = () => {
        this.forceUpdate();
    };

    /** TODO:
     * implement the changes mentioned in ticket #100 for the first case
     * work on performance and formatting for the second case
     */

    render() {
        var picture1 = this.props.data[0].url;
        var picture2 = this.props.data[1].url;
        var picture3 = this.props.data[2].url;


        if (window.innerWidth > 900) {
            var bannerstyle = {
                backgroundImage: `url(${picture1}), url(${picture2}), url(${picture3})`,
                backgroundSize: "33.333333%",
                backgroundPosition: "left top, center top, right top"
            }
            return (
                <div className="inner-banner text-center" style={bannerstyle}>
                    <div className="container">
                        <div className="box"></div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="inner-banner text-center">
                    <div className="container">
                        <div className="box">
                            <Carousel
                                interval={3000}
                                fade
                                indicators={false}
                                controls={false}
                                pauseOnHover={false}
                            >
                                <Carousel.Item>
                                    <div style={{ height: '250px' }} >
                                        <img src={picture1} alt="" />
                                    </div>
                                </Carousel.Item>
                                <Carousel.Item>
                                    <div style={{ height: '250px' }}>
                                        <img src={picture2} alt="" />
                                    </div>
                                </Carousel.Item>
                                <Carousel.Item>
                                    <div style={{ height: '250px' }}>
                                        <img src={picture3} alt="" />
                                    </div>
                                </Carousel.Item>
                            </Carousel>
                        </div>
                    </div>
                </div>
            );
        }

    }
}


export default WelcomeImages;