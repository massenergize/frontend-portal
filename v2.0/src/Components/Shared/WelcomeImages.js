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

    render() {
        var picture1 = this.props.data[0].url;
        var picture2 = this.props.data[1].url;
        var picture3 = this.props.data[2].url;

        var imageStyle = {
            height: '100%',
            width: 'auto',
            objectFit: "cover"
        }

        if (window.innerWidth > 700) {

            var bannerStyle = {
                height: '300px',
                overflow: 'hidden',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gridTemplateRows: '1fr'
            }
            imageStyle["minWidth"] = window.innerWidth / 3 + 'px';

            return (
                <div className="inner-banner text-center" style={bannerStyle}>
                    <img src={picture1} alt="" style={imageStyle} />
                    <img src={picture2} alt="" style={imageStyle} />
                    <img src={picture3} alt="" style={imageStyle} />
                </div>
            );

        } else {

            let divStyle = {
                height: '300px',
                display: 'block',
            };
            imageStyle["minWidth"] = window.innerWidth + 'px';

            return (
                <div className="inner-banner text-center" >

                    <Carousel
                        interval={3000}
                        fade
                        indicators={false}
                        controls={false}
                        pauseOnHover={false}
                    >
                        <Carousel.Item>
                            <div style={divStyle}>
                                <img src={picture2} alt="" style={imageStyle} />
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div style={divStyle}>
                                <img src={picture1} alt="" style={imageStyle} />
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div style={divStyle}>
                                <img src={picture3} alt="" style={imageStyle} />
                            </div>
                        </Carousel.Item>
                    </Carousel>
                </div>

            );
        }

    }
}


export default WelcomeImages;